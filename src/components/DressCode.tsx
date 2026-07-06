import { useEffect } from "react";
import Lenis from "lenis";
import { Marquee } from "./Marquee";

const GENTLEMEN = [
  "Black Tuxedo, Notch or Peak Lapel",
  "Formal White Dress Shirt",
  "Black Silk Bow Tie",
  "Cummerbund or Waistcoat",
  "Patent Leather Oxfords",
  "Black Dress Socks",
];

const LADIES = [
  "Floor-Length Evening Gown",
  "Formal Cocktail Dress",
  "Full-Length Evening Jumpsuit",
  "Understated Fine Jewelry",
  "Block Heels or Flats (Deck Advised)",
  "Wrap or Shawl for Evening Air",
];

const NOTES: { title: string; body: string }[] = [
  {
    title: "On Footwear",
    body: "The vessel's teak decks are unforgiving of stiletto heels. Block heels, formal flats, and patent oxfords are strongly encouraged.",
  },
  {
    title: "On Palette",
    body: "Black, midnight navy, ivory, and deep jewel tones are preferred. Refined metallics such as champagne, gold, and pewter are welcome and appropriate.",
  },
  {
    title: "On the Evening Air",
    body: "The Bay cools sharply after sundown. A tailored overcoat, formal wrap, or elegant shawl is recommended for the outer decks.",
  },
  {
    title: "Kindly Avoid",
    body: "Casual wear is strictly prohibited. Denim, sneakers, graphic prints, and streetwear will not be admitted. A dark business suit is permitted where a tuxedo is not possible, though guests are gently encouraged to observe the black-tie standard.",
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

export const DressCode = () => {
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
          <SectionLabel>The Attire</SectionLabel>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light tracking-[0.1em] uppercase leading-none mb-8">
            Dress Code
          </h1>
          <p className="text-[11px] md:text-xs font-sans font-light tracking-[0.25em] uppercase text-[#888888] mb-12">
            Black Tie Preferred &nbsp;·&nbsp; Formal Evening
          </p>
          <Divider />
          <p className="mt-12 text-base md:text-lg font-sans font-light text-[#333333] leading-relaxed tracking-wide max-w-2xl mx-auto">
            We ask each guest to arrive in a manner commensurate with the
            occasion, an act of care for the one hundred people they are
            about to meet.
          </p>
          <div className="mt-16 md:mt-20">
            <Divider />
          </div>
        </div>
      </section>

      {/* two columns */}
      <section className="relative px-6 md:px-12 pt-16 md:pt-20 pb-16 md:pb-24">
        <div className="relative max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <div className="text-center">
              <SectionLabel>For Gentlemen</SectionLabel>
              <h3 className="text-2xl md:text-4xl font-serif font-light tracking-[0.06em] mb-2">
                Black Tie
              </h3>
              <p className="text-[10px] md:text-xs font-sans font-light tracking-[0.4em] uppercase text-[#888888] mb-10">
                Suggested
              </p>
              <ul className="space-y-4">
                {GENTLEMEN.map((item) => (
                  <li
                    key={item}
                    className="text-[11px] md:text-sm font-sans tracking-[0.25em] uppercase font-light text-[#1A1A1A]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-10 text-[11px] md:text-xs font-sans font-light italic text-[#888888] tracking-wide leading-relaxed max-w-xs mx-auto">
                A dark, well-tailored business suit is permitted, though gently discouraged in favor of black tie.
              </p>
            </div>
            <div className="text-center">
              <SectionLabel>For Ladies</SectionLabel>
              <h3 className="text-2xl md:text-4xl font-serif font-light tracking-[0.06em] mb-2">
                Evening Formal
              </h3>
              <p className="text-[10px] md:text-xs font-sans font-light tracking-[0.4em] uppercase text-[#888888] mb-10">
                Suggested
              </p>
              <ul className="space-y-4">
                {LADIES.map((item) => (
                  <li
                    key={item}
                    className="text-[11px] md:text-sm font-sans tracking-[0.25em] uppercase font-light text-[#1A1A1A]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-10 text-[11px] md:text-xs font-sans font-light italic text-[#888888] tracking-wide leading-relaxed max-w-xs mx-auto">
                A refined midi dress or tailored suit is permitted, though a full evening gown remains preferred.
              </p>
            </div>
          </div>

          <div className="mt-24 md:mt-32">
            <Divider />
          </div>
        </div>
      </section>

      {/* considerations */}
      <section className="relative px-6 md:px-12 pt-16 md:pt-20 pb-24 md:pb-40 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#D4AF37] opacity-[0.05] blur-[120px] rounded-full" />
        </div>
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
            <p className="text-[10px] font-sans tracking-[0.5em] uppercase text-[#666666] opacity-60 mt-16">
              San Francisco &nbsp;•&nbsp; 2026
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
