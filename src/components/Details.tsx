const ATTENDING = [
  "Anthropic",
  "OpenAI",
  "xAI",
  "NVIDIA",
  "Meta",
  "Google",
  "Cohere",
  "Inflection AI",
  "Databricks",
  "Anyscale",
  "Amazon Robotics",
  "Mercor",
  "Razorpay",
  "Arc Institute",
  "Stanford",
  "MIT",
  "Harvard",
  "UC Berkeley",
  "Andreessen Horowitz",
  "Afore Capital",
  "Entrepreneurs First",
  "Dorm Room Fund",
];

type Sponsor = { name: string; src: string; href: string; size?: string; wrap?: string };

const DEFAULT_SIZE = "h-8 md:h-10";

const SPONSORS: Sponsor[] = [
  { name: "Resonance", src: "/sponsors/resonance.svg", href: "https://rsnc.ai" },
  { name: "Scale by GMI Cloud", src: "/sponsors/gmi.png", href: "https://www.gmicloud.ai" },
  { name: "Clean", src: "/sponsors/clean.png", href: "https://www.tryclean.ai" },
  { name: "Photon Framework", src: "/sponsors/photon.png", href: "https://photon.codes" },
  { name: "Soma Capital", src: "/sponsors/soma.png", href: "https://somacap.com" },
  { name: "Red Bull", src: "/sponsors/redbull.png", href: "https://redbull.com", size: "h-20 md:h-24", wrap: "-mx-6 md:-mx-8" },
  { name: "Databricks", src: "/sponsors/databricks.png", href: "https://databricks.com" },
];

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] md:text-xs font-sans tracking-[0.6em] uppercase text-[#666666] font-medium mb-6">
    {children}
  </p>
);

const Divider = () => (
  <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#1A1A1A] to-transparent opacity-30 mx-auto" />
);

export const Details = () => {
  return (
    <main className="relative w-full bg-[#FDFDFD] text-[#1A1A1A] z-40">
      {/* Seam bridge from the hero: faint wave lines continuing the
          water pattern downward + a soft warm glow. Continuity across
          the section boundary, no color gradient (which itself creates
          an edge). */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-48 md:h-64 overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-[#D4AF37] opacity-[0.04] blur-[120px] rounded-full" />
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 2000 200"
          preserveAspectRatio="none"
          fill="none"
          stroke="#1A1A1A"
          strokeWidth="0.5"
        >
          {[...Array(8)].map((_, i) => {
            const y = 4 + i * 14;
            const amp = 6 + i * 0.6;
            const pathOpacity = Math.max(0.015, 0.09 - i * 0.012);
            return (
              <path
                key={`d-${i}`}
                d={`M0,${y} Q250,${y + amp} 500,${y} T1000,${y} T1500,${y} T2000,${y}`}
                opacity={pathOpacity}
              />
            );
          })}
        </svg>
      </div>

      {/* about */}
      <section className="relative px-6 md:px-12 pt-32 md:pt-48 pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <SectionLabel>An Invitation</SectionLabel>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-light tracking-[0.06em] leading-[1.2] mb-6">
            The most consequential gala
            <br />
            of YC Startup School.
          </h2>
          <p className="text-[11px] md:text-xs font-sans font-light tracking-[0.25em] uppercase text-[#888888] mb-12">
            Cohosted by{" "}
            <a
              href="https://www.linkedin.com/in/xj1/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1A1A1A] transition-colors underline-offset-4 hover:underline"
            >
              Jason Xu
            </a>
            ,{" "}
            <a
              href="https://www.linkedin.com/in/yip-ethan/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1A1A1A] transition-colors underline-offset-4 hover:underline"
            >
              Ethan Yip
            </a>
            ,{" "}
            <a
              href="https://www.linkedin.com/company/resonance-ai-labs/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1A1A1A] transition-colors underline-offset-4 hover:underline"
            >
              Resonance
            </a>{" "}
            &amp;{" "}
            <a
              href="https://www.linkedin.com/company/scale-at-gmi/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1A1A1A] transition-colors underline-offset-4 hover:underline"
            >
              Scale by GMI Cloud
            </a>
            <span className="block mt-2 opacity-70">
              Powered by GMI Cloud and NVIDIA
            </span>
          </p>
          <Divider />
          <p className="mt-12 text-base md:text-lg font-sans font-light text-[#333333] leading-relaxed tracking-wide max-w-2xl mx-auto">
            Ship 2 Prod is a curated black-tie yacht gala for the most active
            builders, researchers, and investors in artificial intelligence.
            One hundred people. One evening on the San Francisco Bay. A
            density rare enough that a single conversation could shape
            what you build next.
          </p>

          {/* sponsors */}
          {SPONSORS.length > 0 && (
            <div className="mt-12 md:mt-14">
              <p className="text-[10px] md:text-xs font-sans tracking-[0.6em] uppercase text-[#666666] font-medium mb-6">
                Sponsors
              </p>
              <div className="flex flex-col items-center gap-y-0">
                <div className="flex flex-wrap justify-center items-center gap-x-6 md:gap-x-10">
                  {SPONSORS.slice(0, 2).map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.name}
                      className={`inline-flex items-center justify-center h-20 md:h-24 ${s.wrap ?? ""}`}
                    >
                      <img
                        src={s.src}
                        alt={s.name}
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                        className={`${s.size ?? DEFAULT_SIZE} w-auto object-contain opacity-80 hover:opacity-100 transition-opacity select-none pointer-events-none [-webkit-user-drag:none]`}
                      />
                    </a>
                  ))}
                </div>
                <div className="flex flex-wrap justify-center items-center gap-x-10 md:gap-x-16 gap-y-0">
                  {SPONSORS.slice(2).map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.name}
                      className={`inline-flex items-center justify-center h-16 md:h-20 ${s.wrap ?? ""}`}
                    >
                      <img
                        src={s.src}
                        alt={s.name}
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                        className={`${s.size ?? DEFAULT_SIZE} w-auto object-contain opacity-80 hover:opacity-100 transition-opacity select-none pointer-events-none [-webkit-user-drag:none]`}
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-16 md:mt-20">
            <Divider />
          </div>
        </div>
      </section>

      {/* attending + apply */}
      <section className="relative px-6 md:px-12 pt-16 md:pt-20 pb-24 md:pb-40 overflow-hidden">
        {/* atmosphere */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#D4AF37] opacity-[0.05] blur-[120px] rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <SectionLabel>Represented at the Table</SectionLabel>
          <h3 className="text-3xl md:text-5xl font-serif font-light tracking-[0.06em] mb-4">
            Attending
          </h3>
          <p className="text-[10px] font-sans tracking-[0.4em] uppercase text-[#666666] opacity-60 mb-16">
            A Partial List
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-8 mb-24 md:mb-32">
            {ATTENDING.map((org) => (
              <div
                key={org}
                className="text-[11px] md:text-sm font-sans tracking-[0.25em] uppercase font-light text-[#1A1A1A]"
              >
                {org}
              </div>
            ))}
          </div>

          <Divider />

          <div className="mt-16 md:mt-20 max-w-3xl mx-auto">
            <SectionLabel>By Invitation</SectionLabel>
            <h3 className="text-3xl md:text-5xl lg:text-6xl font-serif font-light tracking-[0.06em] leading-[1.15] mb-8">
              Join the Table
            </h3>
            <p className="text-sm md:text-base font-sans font-light text-[#444444] tracking-wide leading-relaxed max-w-lg mx-auto mb-14">
              Every guest is personally reviewed. Apply below and our team will
              be in touch before the sail date.
            </p>
            <a
              href="https://luma.com/ojidqyj8"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-block px-14 md:px-16 py-5 border border-[#1A1A1A] text-[11px] md:text-xs font-sans tracking-[0.5em] uppercase font-medium text-[#1A1A1A] transition-colors duration-500 hover:bg-[#1A1A1A] hover:text-[#FDFDFD]"
            >
              Apply on Luma
            </a>
            <div className="mt-10 flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
              <a
                href="/event-details"
                className="inline-block text-[10px] md:text-xs font-sans tracking-[0.5em] uppercase text-[#666666] hover:text-[#1A1A1A] transition-colors duration-500"
              >
                Event Details →
              </a>
              <span className="text-[#666666]/30 text-xs">·</span>
              <a
                href="/dress-code"
                className="inline-block text-[10px] md:text-xs font-sans tracking-[0.5em] uppercase text-[#666666] hover:text-[#1A1A1A] transition-colors duration-500"
              >
                Dress Code →
              </a>
            </div>
            <p className="text-[10px] font-sans tracking-[0.5em] uppercase text-[#666666] opacity-60 mt-16">
              San Francisco &nbsp;•&nbsp; 2026
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};
