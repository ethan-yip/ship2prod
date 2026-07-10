import { useEffect, useMemo, useState } from "react";
import Lenis from "lenis";
import { Marquee } from "./Marquee";
import guestsData from "../data/guests.json";

type GuestFlag =
  | "founder"
  | "investor"
  | "vc-backed"
  | "yc"
  | "big-ai-lab"
  | "traction"
  | "research"
  | "competition";

type PublicGuest = {
  id: string;
  name: string;
  photoUrl: string | null;
  company: string | null;
  title: string | null;
  headline: string | null;
  bio: string | null;
  location: string | null;
  githubUrl: string | null;
  twitterUrl: string | null;
  websiteUrl: string | null;
  context: string | null;
  flags: GuestFlag[];
};

const GUESTS = guestsData as PublicGuest[];

const FILTER_CHIPS: { flag: GuestFlag; label: string }[] = [
  { flag: "founder", label: "Founders" },
  { flag: "investor", label: "Investors" },
  { flag: "vc-backed", label: "VC-backed" },
  { flag: "yc", label: "YC" },
  { flag: "big-ai-lab", label: "AI Labs" },
  { flag: "traction", label: "Revenue / Exit" },
  { flag: "research", label: "Research" },
  { flag: "competition", label: "Olympiad" },
];

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] md:text-xs font-sans tracking-[0.6em] uppercase text-[#666666] font-medium mb-6">
    {children}
  </p>
);

const Divider = () => (
  <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#1A1A1A] to-transparent opacity-30 mx-auto" />
);

// Deterministic warm tint per name for the initial-avatar fallback. Kept
// muted so the roster reads as one cohesive palette, not a rainbow.
const AVATAR_TINTS = [
  "bg-[#EFE7D6] text-[#7A6338]",
  "bg-[#E7E1D3] text-[#5C5237]",
  "bg-[#EFE3DA] text-[#7A4C36]",
  "bg-[#E1E4E0] text-[#3F4D3F]",
  "bg-[#E9E4E9] text-[#5A4A5C]",
  "bg-[#E4DFD6] text-[#4A4234]",
];
function tintFor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_TINTS[h % AVATAR_TINTS.length];
}
function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

// Company field from Luma often bundles the role in after " - " or " / ".
// For the primary line we strip the tail so cards stay readable.
function cleanCompany(c: string | null): string | null {
  if (!c) return null;
  const trimmed = c.split(/\s+-\s+|\s+\/\s+|\s+·\s+/)[0].trim();
  return trimmed || null;
}

export const Guestlist = () => {
  const [q, setQ] = useState("");
  const [activeFlags, setActiveFlags] = useState<Set<GuestFlag>>(new Set());
  const query = q.trim().toLowerCase();

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
    });
    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  const flagCounts = useMemo(() => {
    const m = new Map<GuestFlag, number>();
    for (const g of GUESTS) for (const f of g.flags) m.set(f, (m.get(f) ?? 0) + 1);
    return m;
  }, []);

  const filtered = useMemo(() => {
    let out = GUESTS;
    if (activeFlags.size) {
      out = out.filter((g) => {
        for (const f of activeFlags) if (!g.flags.includes(f)) return false;
        return true;
      });
    }
    if (query) {
      out = out.filter((g) => {
        const hay = [g.name, g.company, g.title, g.context, g.headline, g.location]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(query);
      });
    }
    return out;
  }, [query, activeFlags]);

  const toggleFlag = (f: GuestFlag) =>
    setActiveFlags((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  const clearFilters = () => {
    setActiveFlags(new Set());
    setQ("");
  };
  const anyActive = activeFlags.size > 0 || query.length > 0;

  return (
    <div className="relative w-full min-h-screen bg-[#FDFDFD] overflow-x-hidden text-[#1A1A1A]">
      <Marquee />

      <header className="relative pt-24 md:pt-32 px-6 md:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <a
            href="/"
            className="inline-block text-[10px] md:text-xs font-sans tracking-[0.5em] uppercase text-[#666666] hover:text-[#1A1A1A] transition-colors duration-500"
          >
            ← Ship 2 Prod
          </a>
        </div>
      </header>

      {/* hero */}
      <section className="relative px-6 md:px-12 pt-16 md:pt-24 pb-12 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#D4AF37] opacity-[0.05] blur-[120px] rounded-full" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <SectionLabel>The Manifest</SectionLabel>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light tracking-[0.1em] uppercase leading-none mb-8">
            Guest List
          </h1>
          <p className="text-[11px] md:text-xs font-sans font-light tracking-[0.25em] uppercase text-[#888888] mb-10">
            {GUESTS.length} Aboard &nbsp;·&nbsp; Confirmed Only
          </p>
          <Divider />
          <p className="mt-10 text-base md:text-lg font-sans font-normal text-[#2A2A2A] leading-relaxed tracking-wide max-w-xl mx-auto">
            Founders, researchers, and investors joining us aboard the
            Black-Tie AI Yacht Gala. A single evening on the San Francisco Bay.
          </p>
        </div>
      </section>

      {/* search + filters */}
      <section className="relative px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 border-b border-[#1A1A1A]/15 py-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-4 w-4 text-[#666666] shrink-0">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, company, or affiliation…"
              className="flex-1 bg-transparent border-none outline-none text-[#1A1A1A] placeholder:text-[#888888] text-base md:text-lg font-sans font-normal tracking-wide"
            />
            <span className="text-[11px] md:text-xs font-sans tracking-[0.25em] uppercase text-[#666666] shrink-0 tabular-nums">
              {filtered.length}/{GUESTS.length}
            </span>
          </div>

          <div className="mt-6 mb-12 md:mb-16 flex items-center flex-wrap gap-x-6 gap-y-3">
            {FILTER_CHIPS.map(({ flag, label }) => {
              const count = flagCounts.get(flag) ?? 0;
              if (count === 0) return null;
              const active = activeFlags.has(flag);
              return (
                <button
                  key={flag}
                  type="button"
                  onClick={() => toggleFlag(flag)}
                  className={
                    "group inline-flex items-baseline gap-2 text-[11px] md:text-[13px] font-sans tracking-[0.25em] uppercase transition-colors duration-300 pb-1 border-b " +
                    (active
                      ? "text-[#1A1A1A] border-[#1A1A1A]"
                      : "text-[#555555] border-transparent hover:text-[#1A1A1A] hover:border-[#1A1A1A]/40")
                  }
                >
                  {label}
                  <span className="text-[10px] tracking-[0.2em] text-[#777777] tabular-nums">
                    {count}
                  </span>
                </button>
              );
            })}
            {anyActive && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-[11px] md:text-[13px] font-sans tracking-[0.25em] uppercase text-[#777777] hover:text-[#1A1A1A] transition-colors duration-300 pb-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* roster */}
      <section className="relative px-6 md:px-12 pb-24 md:pb-40">
        <div className="max-w-6xl mx-auto">
          {filtered.length === 0 ? (
            <div className="py-24 text-center text-[10px] md:text-xs font-sans tracking-[0.35em] uppercase text-[#888888]">
              No Guests Match Those Filters
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 md:gap-y-12">
              {filtered.map((g) => (
                <GuestCard key={g.id} guest={g} />
              ))}
            </ul>
          )}

          <div className="mt-24 md:mt-32">
            <Divider />
          </div>

          <div className="mt-16 text-center">
            <a
              href="/"
              className="group inline-block px-14 md:px-16 py-5 border border-[#1A1A1A] text-[11px] md:text-xs font-sans tracking-[0.5em] uppercase font-medium text-[#1A1A1A] transition-colors duration-500 hover:bg-[#1A1A1A] hover:text-[#FDFDFD]"
            >
              Return to Ship 2 Prod
            </a>
            <p className="text-[11px] md:text-xs font-sans tracking-[0.35em] uppercase text-[#555555] mt-16">
              See a mistake?{" "}
              <a
                href="mailto:ethan@rsnc.ai?subject=Yacht%20Gala%20guest%20list%20correction"
                className="hover:text-[#1A1A1A] transition-colors underline-offset-4 hover:underline"
              >
                ethan@rsnc.ai
              </a>
            </p>
            <p className="text-[10px] font-sans tracking-[0.5em] uppercase text-[#666666] opacity-70 mt-6">
              San Francisco &nbsp;•&nbsp; 2026
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

function GuestCard({ guest: g }: { guest: PublicGuest }) {
  const company = cleanCompany(g.company);
  const primaryLine =
    g.title && company
      ? `${g.title} · ${company}`
      : g.title || company || g.headline || "";

  return (
    <li className="group relative flex flex-col border-t border-[#1A1A1A]/15 pt-6">
      <div className="flex items-start gap-4">
        <Avatar name={g.name} src={g.photoUrl} size={52} />
        <div className="min-w-0 flex-1">
          <h2 className="font-serif font-light text-lg md:text-xl tracking-[0.02em] text-[#1A1A1A] leading-tight truncate">
            {g.name}
          </h2>
          {primaryLine && (
            <div className="mt-1.5 text-[13px] md:text-sm font-sans font-normal tracking-wide text-[#3A3A3A] line-clamp-2 leading-snug">
              {primaryLine}
            </div>
          )}
        </div>
      </div>

      {g.context && (
        <p className="mt-4 text-sm md:text-[15px] font-serif italic font-normal text-[#5A4028] leading-relaxed line-clamp-3">
          {g.context}
        </p>
      )}

      <div className="mt-5 pt-3 border-t border-[#1A1A1A]/10 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[#777777]">
          {g.githubUrl && <SocialIcon href={g.githubUrl} kind="github" />}
          {g.twitterUrl && <SocialIcon href={g.twitterUrl} kind="twitter" />}
          {g.websiteUrl && <SocialIcon href={g.websiteUrl} kind="website" />}
        </div>
        {g.location && (
          <span className="text-[10px] md:text-[11px] font-sans tracking-[0.2em] uppercase text-[#666666] truncate ml-2">
            {g.location}
          </span>
        )}
      </div>
    </li>
  );
}

function Avatar({
  name,
  src,
  size,
}: {
  name: string;
  src: string | null;
  size: number;
}) {
  const tint = tintFor(name || "?");
  return (
    <div
      className={
        "inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden font-sans font-medium " +
        (src ? "bg-[#EEEEEE]" : tint)
      }
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.34) }}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span className="tracking-[0.05em]">{initials(name)}</span>
      )}
    </div>
  );
}

function SocialIcon({
  href,
  kind,
}: {
  href: string;
  kind: "github" | "twitter" | "website";
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="hover:text-[#1A1A1A] transition-colors"
      title={kind}
    >
      {kind === "github" && (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <path d="M12 .5C5.7.5.7 5.5.7 11.9c0 5 3.3 9.3 7.8 10.8.6.1.8-.2.8-.6v-2c-3.2.7-3.8-1.4-3.8-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.5-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.1v3.1c0 .3.2.7.8.6 4.6-1.5 7.8-5.8 7.8-10.8C23.3 5.5 18.3.5 12 .5z" />
        </svg>
      )}
      {kind === "twitter" && (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <path d="M18.2 2H21l-6.5 7.4L22 22h-6.8l-4.4-6-5 6H3l7-8L2 2h7l4 5.3L18.2 2zm-1.2 18h1.7L7.1 4H5.3l11.7 16z" />
        </svg>
      )}
      {kind === "website" && (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" strokeLinecap="round" />
        </svg>
      )}
    </a>
  );
}
