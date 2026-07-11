// Public RSVP endpoint. Receives POSTs from the /confirm page and commits
// each confirmation into the private S2P-CRM repo as a row in
// data/confirmations.json, so the CRM picks them up on its next build.
//
// Env vars (set on Vercel):
//   GITHUB_TOKENS           — fine-grained PAT with Contents: Read/Write on
//                             The-Resonance-Lab/S2P-CRM. (GITHUB_TOKEN also
//                             accepted as a fallback name.)
//   CONFIRMATIONS_REPO      — defaults to "The-Resonance-Lab/S2P-CRM".
//   CONFIRMATIONS_PATH      — defaults to "data/confirmations.json".
//   CONFIRMATIONS_BRANCH    — defaults to "main".

import type { VercelRequest, VercelResponse } from "@vercel/node";

const REPO = process.env.CONFIRMATIONS_REPO || "The-Resonance-Lab/S2P-CRM";
const PATH = process.env.CONFIRMATIONS_PATH || "data/confirmations.json";
const ADMITTED_PATH = process.env.ADMITTED_EMAILS_PATH || "data/admitted-emails.json";
const BRANCH = process.env.CONFIRMATIONS_BRANCH || "main";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Confirmation = {
  id: string;
  submittedAt: string;
  response: "attending" | "declined";
  name: string;
  email: string;
  userAgent: string | null;
};

function nid() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8) +
    Math.random().toString(36).slice(2, 6)
  );
}

function ghHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    Accept: "application/vnd.github+json",
    "User-Agent": "ship2prod-rsvp",
  } as Record<string, string>;
}

async function readList(token: string): Promise<{ list: Confirmation[]; sha?: string }> {
  const url = `https://api.github.com/repos/${REPO}/contents/${encodeURIComponent(PATH)}?ref=${encodeURIComponent(BRANCH)}`;
  const r = await fetch(url, { headers: ghHeaders(token) });
  if (r.status === 404) return { list: [] };
  if (!r.ok) throw new Error(`GitHub read failed: ${r.status} ${await r.text()}`);
  const meta = (await r.json()) as { content: string; sha: string; encoding?: string };
  try {
    const decoded = Buffer.from(meta.content, "base64").toString("utf8");
    const parsed = JSON.parse(decoded);
    return { list: Array.isArray(parsed) ? parsed : [], sha: meta.sha };
  } catch {
    return { list: [], sha: meta.sha };
  }
}

// Returns null if the admitted-emails file is missing or unreadable — we treat
// that as "can't verify" rather than "not admitted" so a stale/misconfigured
// state never blocks a real guest from getting a success response.
async function readAdmittedEmails(token: string): Promise<Set<string> | null> {
  try {
    const url = `https://api.github.com/repos/${REPO}/contents/${encodeURIComponent(ADMITTED_PATH)}?ref=${encodeURIComponent(BRANCH)}`;
    const r = await fetch(url, { headers: ghHeaders(token) });
    if (!r.ok) return null;
    const meta = (await r.json()) as { content: string; encoding?: string };
    const decoded = Buffer.from(meta.content, "base64").toString("utf8");
    const parsed = JSON.parse(decoded);
    if (!Array.isArray(parsed)) return null;
    return new Set(parsed.map((s: string) => String(s).toLowerCase()));
  } catch {
    return null;
  }
}

async function writeList(
  token: string,
  list: Confirmation[],
  sha: string | undefined,
  message: string,
): Promise<Response> {
  const url = `https://api.github.com/repos/${REPO}/contents/${encodeURIComponent(PATH)}`;
  return fetch(url, {
    method: "PUT",
    headers: { ...ghHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(JSON.stringify(list, null, 2)).toString("base64"),
      branch: BRANCH,
      sha,
    }),
  });
}

function trim(s: unknown, max = 500): string | null {
  const v = typeof s === "string" ? s.trim() : "";
  if (!v) return null;
  return v.slice(0, max);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Basic CORS — we serve the form from the same origin, but this keeps
  // preflights sane if the page ever moves to a subdomain.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  // Vercel env var is named GITHUB_TOKENS in the ship2prod project — accept
  // either name so this keeps working if the var is ever renamed.
  const token = process.env.GITHUB_TOKENS || process.env.GITHUB_TOKEN;
  if (!token) {
    return res.status(503).json({
      error: "RSVP backend not configured yet. GitHub token missing on the server.",
    });
  }

  let body: Record<string, unknown> = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  } catch {
    return res.status(400).json({ error: "Invalid JSON body." });
  }

  const responseRaw = typeof body.response === "string" ? body.response : "attending";
  const response: "attending" | "declined" =
    responseRaw === "declined" ? "declined" : "attending";
  const name = trim(body.name, 200);
  const emailRaw = trim(body.email, 200);
  const email = emailRaw ? emailRaw.toLowerCase() : null;

  if (!name) return res.status(400).json({ error: "Name is required." });
  if (!email || !EMAIL_RE.test(email))
    return res.status(400).json({ error: "A valid email is required." });

  const confirmation: Confirmation = {
    id: nid(),
    submittedAt: new Date().toISOString(),
    response,
    name,
    email,
    userAgent: (req.headers["user-agent"] as string | undefined) ?? null,
  };

  // Fetched in parallel with the first read; used to tell the client
  // whether their email actually matches a Luma-admitted address, so a
  // typo doesn't silently orphan the row.
  const admittedPromise = readAdmittedEmails(token);

  // Retry the read → write cycle a couple of times to survive concurrent
  // updates (GitHub returns 409 if the sha we sent no longer matches).
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const { list, sha } = await readList(token);
      const next = list.filter((c) => c.email !== email); // most-recent-wins per email
      next.push(confirmation);
      next.sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
      const verb = response === "declined" ? "regrets" : "rsvp";
      const putRes = await writeList(
        token,
        next,
        sha,
        `${verb}: ${name} <${email}>`,
      );
      if (putRes.ok) {
        const admitted = await admittedPromise;
        // null → verifier unavailable; treat as "unknown" (not a hard fail)
        const onLumaList = admitted ? admitted.has(email) : null;
        return res.status(200).json({
          ok: true,
          id: confirmation.id,
          onLumaList,
        });
      }
      if (putRes.status === 409) continue;
      const text = await putRes.text();
      return res.status(502).json({
        error: "Could not write confirmation to the CRM.",
        detail: text.slice(0, 400),
      });
    } catch (err) {
      if (attempt === 2)
        return res.status(502).json({
          error: "Confirmation could not be recorded.",
          detail: err instanceof Error ? err.message : String(err),
        });
    }
  }

  return res.status(503).json({ error: "Retry limit exceeded — please try again." });
}
