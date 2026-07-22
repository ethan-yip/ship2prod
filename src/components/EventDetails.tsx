import { useEffect } from "react";
import Lenis from "lenis";
import { Marquee } from "./Marquee";

const SCHEDULE: { time: string; event: string }[] = [
  { time: "6:30 PM", event: "Guests Arrive — Pier 40" },
  { time: "6:45 PM", event: "Boarding Begins" },
  { time: "7:00 PM", event: "Vessel Departs" },
  { time: "9:45 PM", event: "Return to Pier 40" },
];

const DIRECTIONS: { from: string; body: string; transit: string }[] = [
  {
    from: "From Chase Center",
    body: "A five-minute walk northeast along The Embarcadero. Cross the pedestrian bridge over King Street and follow signage to Pier 40.",
    transit: "Rideshare drop-off at pier entrance",
  },
  {
    from: "From Downtown Hotels",
    body: "Ten minutes by car along The Embarcadero from Union Square or SoMa. Muni Metro T-Third to 4th & King, then walk five minutes south along the waterfront.",
    transit: "Rideshare · Muni T-Third",
  },
  {
    from: "From Golden Gate Park",
    body: "Twenty minutes by car via Fell Street and Market. Alternately, board the N-Judah to 4th & King and walk south along The Embarcadero.",
    transit: "Rideshare · Muni N-Judah",
  },
];

const NOTES: { title: string; body: string }[] = [
  {
    title: "On Arrival",
    body: "Please arrive at Pier 40 by 6:30 PM. Boarding begins at 6:45, and the vessel departs promptly at seven — it cannot return for late guests.",
  },
  {
    title: "On Identification",
    body: "Please arrive with your Luma acceptance QR code and a form of identification — a government ID is not required, though any photo ID will do. Security may also ask to see the acceptance email tied to your RSVP.",
  },
  {
    title: "On Belongings",
    body: "We ask guests to travel light. Large bags cannot be accommodated onboard.",
  },
  {
    title: "On Return",
    body: "The vessel returns to Pier 40 at 9:45 PM. Marked rideshare and taxi zones will be waiting at disembarkation.",
  },
];

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] md:text-xs font-sans tracking-[0.6em] uppercase text-[#666666] font-medium mb-6">
    {children}
  </p>
);

const Divider = () => (
  <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#1A1A1A] to-transparent opacity-30 mx-auto" />
);

export const EventDetails = () => {
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
      <section className="relative px-6 md:px-12 pt-16 md:pt-24 pb-16 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#D4AF37] opacity-[0.05] blur-[120px] rounded-full" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <SectionLabel>The Evening</SectionLabel>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light tracking-[0.1em] uppercase leading-none mb-8">
            Event Details
          </h1>
          <p className="text-[11px] md:text-xs font-sans font-light tracking-[0.25em] uppercase text-[#888888] mb-12">
            Pier 40 &nbsp;·&nbsp; Arrive by 6:30 PM
          </p>
          <Divider />
          <p className="mt-12 text-base md:text-lg font-sans font-light text-[#333333] leading-relaxed tracking-wide max-w-2xl mx-auto">
            The vessel departs promptly at seven. We ask each guest to arrive
            at Pier 40 by 6:30 PM — boarding begins at 6:45, allowing for a
            graceful embarkation and a timely sail.
          </p>
          <div className="mt-16 md:mt-20">
            <Divider />
          </div>
        </div>
      </section>

      {/* schedule */}
      <section className="relative px-6 md:px-12 pt-16 md:pt-20 pb-16 md:pb-24">
        <div className="relative max-w-3xl mx-auto text-center">
          <SectionLabel>Timeline</SectionLabel>
          <h3 className="text-3xl md:text-5xl font-serif font-light tracking-[0.06em] mb-16">
            The Sail
          </h3>

          <ul className="flex flex-col divide-y divide-[#1A1A1A]/10 border-y border-[#1A1A1A]/10">
            {SCHEDULE.map(({ time, event }) => (
              <li
                key={time}
                className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 md:gap-10 py-6 md:py-7"
              >
                <span className="justify-self-end text-lg md:text-2xl font-serif font-light tracking-[0.06em] text-[#1A1A1A]">
                  {time}
                </span>
                <span className="w-6 md:w-10 h-[1px] bg-[#1A1A1A]/30" />
                <span className="justify-self-start text-[10px] md:text-xs font-sans tracking-[0.35em] uppercase font-light text-[#1A1A1A]">
                  {event}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-24 md:mt-32">
            <Divider />
          </div>
        </div>
      </section>

      {/* location + directions */}
      <section className="relative px-6 md:px-12 pt-16 md:pt-20 pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#D4AF37] opacity-[0.05] blur-[120px] rounded-full" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <SectionLabel>The Departure Point</SectionLabel>
          <h3 className="text-3xl md:text-5xl font-serif font-light tracking-[0.06em] mb-4">
            Pier 40
          </h3>
          <p className="text-[11px] md:text-xs font-sans font-light tracking-[0.25em] uppercase text-[#888888] mb-16">
            South Beach Harbor &nbsp;·&nbsp; San Francisco
          </p>

          <SectionLabel>Directions</SectionLabel>
          <h3 className="text-2xl md:text-4xl font-serif font-light tracking-[0.06em] mb-16">
            Arriving at the Pier
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-14 text-left">
            {DIRECTIONS.map((d) => (
              <div key={d.from} className="flex flex-col">
                <p className="text-[10px] md:text-xs font-sans tracking-[0.5em] uppercase text-[#666666] font-medium mb-5">
                  {d.from}
                </p>
                <p className="text-sm md:text-base font-sans font-light text-[#333333] leading-relaxed tracking-wide mb-6">
                  {d.body}
                </p>
                <p className="mt-auto text-[10px] md:text-[11px] font-sans font-light tracking-[0.35em] uppercase text-[#888888]">
                  {d.transit}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 md:mt-20">
            <a
              href="https://maps.google.com/?q=Pier+40+San+Francisco"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[10px] md:text-xs font-sans tracking-[0.5em] uppercase text-[#666666] hover:text-[#1A1A1A] transition-colors duration-500"
            >
              Open in Maps →
            </a>
          </div>

          <div className="mt-24 md:mt-32">
            <Divider />
          </div>
        </div>
      </section>

      {/* considerations */}
      <section className="relative px-6 md:px-12 pt-16 md:pt-20 pb-24 md:pb-40">
        <div className="relative max-w-4xl mx-auto text-center">
          <SectionLabel>Considerations</SectionLabel>
          <h3 className="text-3xl md:text-5xl font-serif font-light tracking-[0.06em] mb-16">
            A Few Notes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14 text-left">
            {NOTES.map((note) => (
              <div key={note.title}>
                <p className="text-[10px] md:text-xs font-sans tracking-[0.5em] uppercase text-[#666666] font-medium mb-4">
                  {note.title}
                </p>
                <p className="text-sm md:text-base font-sans font-light text-[#444444] leading-relaxed tracking-wide">
                  {note.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-24 md:mt-32">
            <Divider />
          </div>

          <div className="mt-16 md:mt-20">
            <a
              href="/"
              className="group inline-block px-14 md:px-16 py-5 border border-[#1A1A1A] text-[11px] md:text-xs font-sans tracking-[0.5em] uppercase font-medium text-[#1A1A1A] transition-colors duration-500 hover:bg-[#1A1A1A] hover:text-[#FDFDFD]"
            >
              Return to Ship 2 Prod
            </a>
            <div className="mt-10">
              <a
                href="/dress-code"
                className="inline-block text-[10px] md:text-xs font-sans tracking-[0.5em] uppercase text-[#666666] hover:text-[#1A1A1A] transition-colors duration-500"
              >
                View Dress Code →
              </a>
            </div>
            <p className="text-[10px] font-sans tracking-[0.5em] uppercase text-[#666666] opacity-60 mt-16">
              San Francisco &nbsp;•&nbsp; 2026
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
