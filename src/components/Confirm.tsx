import { useEffect, useState } from "react";
import Lenis from "lenis";
import { Marquee } from "./Marquee";

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] md:text-xs font-sans tracking-[0.6em] uppercase text-[#666666] font-medium mb-6">
    {children}
  </p>
);

const Divider = () => (
  <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#1A1A1A] to-transparent opacity-30 mx-auto" />
);

const FieldLabel = ({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <label className="block text-[10px] md:text-[11px] font-sans tracking-[0.35em] uppercase text-[#555555] font-medium mb-3">
    {children}
    {required && <span className="ml-1 text-[#9C7A2C]">*</span>}
  </label>
);

const TextField = ({
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
  autoComplete,
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  autoComplete?: string;
  required?: boolean;
}) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    maxLength={maxLength}
    autoComplete={autoComplete}
    required={required}
    className="w-full bg-transparent border-b border-[#1A1A1A]/25 focus:border-[#1A1A1A] outline-none py-3 text-base md:text-lg font-sans font-normal text-[#1A1A1A] placeholder:text-[#AAAAAA] tracking-wide transition-colors duration-300"
  />
);

type Response = "attending" | "declined";

export const Confirm = () => {
  const [response, setResponse] = useState<Response>("attending");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // null = server couldn't verify; true = matched a Luma-admitted address;
  // false = not on the list (likely a typo).
  const [onLumaList, setOnLumaList] = useState<boolean | null>(null);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || done) return;
    setError(null);
    setSubmitting(true);
    try {
      const r = await fetch("/api/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response, name, email }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setOnLumaList(typeof data.onLumaList === "boolean" ? data.onLumaList : null);
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't reach the server. Please check your connection and try again — or email ethan@rsnc.ai.",
      );
    } finally {
      setSubmitting(false);
    }
  }

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
        <div className="relative max-w-3xl mx-auto text-center">
          <SectionLabel>The Manifest</SectionLabel>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light tracking-[0.1em] uppercase leading-none mb-8">
            Confirm Attendance
          </h1>
          <p className="text-[11px] md:text-xs font-sans font-light tracking-[0.25em] uppercase text-[#888888] mb-10">
            Pier 40 &nbsp;·&nbsp; Boarding by 6:45 PM
          </p>
          <Divider />
          <p className="mt-10 text-base md:text-lg font-sans font-normal text-[#2A2A2A] leading-relaxed tracking-wide max-w-xl mx-auto">
            A brief note before the sail. Confirm you'll be aboard so we can
            finalise the manifest, seating, and boarding logistics.
          </p>
        </div>
      </section>

      {/* Luma prerequisite notice */}
      <section className="relative px-6 md:px-12 pb-4">
        <div className="max-w-2xl mx-auto">
          <div className="border border-[#1A1A1A]/20 bg-[#F6F1E4]/40 px-6 md:px-8 py-6 md:py-7 text-left">
            <p className="text-[10px] md:text-[11px] font-sans tracking-[0.35em] uppercase text-[#5A4028] font-medium mb-3">
              Required · Luma Approval
            </p>
            <p className="text-sm md:text-base font-sans font-normal text-[#2A2A2A] leading-relaxed tracking-wide">
              You must already be admitted on{" "}
              <a
                href="https://luma.com/ojidqyj8"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1A1A1A] underline underline-offset-4 hover:text-[#9C7A2C] transition-colors"
              >
                Luma
              </a>{" "}
              for this confirmation to be honored. If you have not applied and
              been admitted, please do so before submitting — walk-ons cannot
              board. Your name can be written however you like, but the email
              must match the one you used to RSVP on Luma.
            </p>
          </div>
        </div>
      </section>

      {/* form / success */}
      <section className="relative px-6 md:px-12 pt-8 md:pt-10 pb-24 md:pb-40">
        <div className="max-w-2xl mx-auto">
          {done ? (
            <SuccessState
              name={name}
              email={email}
              response={response}
              onLumaList={onLumaList}
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10 md:space-y-12">
              <div>
                <FieldLabel required>Your Response</FieldLabel>
                <ResponseToggle value={response} onChange={setResponse} />
              </div>

              <div>
                <FieldLabel required>Full Name</FieldLabel>
                <TextField
                  value={name}
                  onChange={setName}
                  placeholder="How we should address you"
                  autoComplete="name"
                  maxLength={200}
                  required
                />
              </div>

              <div>
                <FieldLabel required>Email</FieldLabel>
                <TextField
                  value={email}
                  onChange={setEmail}
                  placeholder="The same email tied to your Luma acceptance"
                  type="email"
                  autoComplete="email"
                  maxLength={200}
                  required
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="border border-[#8A2A2A]/40 bg-[#FBEDED] px-6 md:px-8 py-5"
                >
                  <p className="text-[10px] md:text-[11px] font-sans tracking-[0.35em] uppercase text-[#8A2A2A] font-medium mb-2">
                    Not Recorded
                  </p>
                  <p className="text-sm md:text-base font-sans font-normal text-[#2A2A2A] leading-relaxed tracking-wide">
                    {error}
                    {" "}
                    If this keeps happening, email{" "}
                    <a
                      href={`mailto:ethan@rsnc.ai?subject=Yacht%20Gala%20RSVP%20failed%20for%20${encodeURIComponent(name || "guest")}`}
                      className="text-[#1A1A1A] underline underline-offset-4 hover:text-[#9C7A2C] transition-colors"
                    >
                      ethan@rsnc.ai
                    </a>
                    {" "}
                    and we'll add you by hand.
                  </p>
                </div>
              )}

              <div className="pt-4 flex flex-col items-center gap-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="group inline-block px-14 md:px-16 py-5 border border-[#1A1A1A] text-[11px] md:text-xs font-sans tracking-[0.5em] uppercase font-medium text-[#1A1A1A] transition-colors duration-500 hover:bg-[#1A1A1A] hover:text-[#FDFDFD] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? "Recording…"
                    : response === "attending"
                      ? "Confirm Attendance"
                      : "Send Regrets"}
                </button>
                <p className="text-[10px] md:text-[11px] font-sans tracking-[0.35em] uppercase text-[#888888]">
                  We reply within 48 hours if anything is amiss.
                </p>
              </div>
            </form>
          )}

          <div className="mt-24 md:mt-32">
            <Divider />
          </div>

          <div className="mt-16 text-center">
            <a
              href="/event-details"
              className="inline-block text-[10px] md:text-xs font-sans tracking-[0.5em] uppercase text-[#666666] hover:text-[#1A1A1A] transition-colors duration-500"
            >
              Event Details →
            </a>
            <p className="text-[10px] font-sans tracking-[0.5em] uppercase text-[#666666] opacity-70 mt-16">
              San Francisco &nbsp;•&nbsp; 2026
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

function ResponseToggle({
  value,
  onChange,
}: {
  value: Response;
  onChange: (v: Response) => void;
}) {
  const options: { value: Response; label: string }[] = [
    { value: "attending", label: "I'll Be There" },
    { value: "declined", label: "I Can't Make It" },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={
              "px-6 py-5 border text-[11px] md:text-xs font-sans tracking-[0.35em] uppercase font-medium transition-colors duration-300 " +
              (active
                ? "border-[#1A1A1A] bg-[#1A1A1A] text-[#FDFDFD]"
                : "border-[#1A1A1A]/25 text-[#555555] hover:border-[#1A1A1A] hover:text-[#1A1A1A]")
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function SuccessState({
  name,
  email,
  response,
  onLumaList,
}: {
  name: string;
  email: string;
  response: Response;
  onLumaList: boolean | null;
}) {
  const firstName = name.split(/\s+/)[0] || "You";
  const declined = response === "declined";
  return (
    <div className="text-center py-12 md:py-16">
      <p className="text-[10px] md:text-xs font-sans tracking-[0.6em] uppercase text-[#5A4028] font-medium mb-6">
        {declined ? "Regrets Noted" : "Recorded"}
      </p>
      <h2 className="text-3xl md:text-5xl font-serif font-light tracking-[0.06em] leading-[1.15] mb-8">
        {declined ? `Until next time, ${firstName}.` : `Aboard, ${firstName}.`}
      </h2>
      <p className="text-base md:text-lg font-sans font-normal text-[#2A2A2A] leading-relaxed tracking-wide max-w-lg mx-auto">
        {declined
          ? "Thank you for letting us know. Your seat will be released so another builder can join. We hope to see you at the next sail."
          : "Your confirmation is in. We'll be in touch with final boarding details as the sail date approaches. Please arrive at Pier 40 no later than 6:45 PM — the vessel departs promptly at seven."}
      </p>

      {onLumaList === false && (
        <div
          role="alert"
          className="max-w-lg mx-auto mt-12 border border-[#9C7A2C]/40 bg-[#FBF4E4] px-6 md:px-8 py-5 text-left"
        >
          <p className="text-[10px] md:text-[11px] font-sans tracking-[0.35em] uppercase text-[#7A5A1A] font-medium mb-2">
            Email Not on Luma List
          </p>
          <p className="text-sm md:text-base font-sans font-normal text-[#2A2A2A] leading-relaxed tracking-wide">
            We recorded your response, but the address{" "}
            <span className="font-mono text-[#1A1A1A]">{email}</span>{" "}
            doesn't match anyone we admitted on Luma. Please double-check that
            you used the exact same email as your Luma acceptance —{" "}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="underline underline-offset-4 text-[#1A1A1A] hover:text-[#9C7A2C] transition-colors bg-transparent border-0 p-0 font-inherit cursor-pointer"
            >
              re-submit here
            </button>{" "}
            with the correct one, or email{" "}
            <a
              href={`mailto:ethan@rsnc.ai?subject=Yacht%20Gala%20RSVP%20email%20mismatch%20—%20${encodeURIComponent(name || "guest")}`}
              className="underline underline-offset-4 text-[#1A1A1A] hover:text-[#9C7A2C] transition-colors"
            >
              ethan@rsnc.ai
            </a>{" "}
            for help.
          </p>
        </div>
      )}

      <div className="mt-12">
        <a
          href={declined ? "/" : "/event-details"}
          className="group inline-block px-14 md:px-16 py-5 border border-[#1A1A1A] text-[11px] md:text-xs font-sans tracking-[0.5em] uppercase font-medium text-[#1A1A1A] transition-colors duration-500 hover:bg-[#1A1A1A] hover:text-[#FDFDFD]"
        >
          {declined ? "Return to Ship 2 Prod" : "Event Details"}
        </a>
      </div>
    </div>
  );
}
