import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Lenis from "lenis";
import { Skyline } from "./components/Skyline";
import { Bridge } from "./components/Bridge";
import { Water } from "./components/Water";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Details } from "./components/Details";

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const skylineRef = useRef<SVGSVGElement>(null);
  const bridgeRef = useRef<SVGSVGElement>(null);
  const waveRef1 = useRef<SVGSVGElement>(null);
  const waveRef2 = useRef<SVGSVGElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const revealBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
    });
    lenis.scrollTo(0, { immediate: true });
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

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Immediate sets run synchronously before first paint so the reveal
      // box doesn't flash in its default position before the sweep begins.
      gsap.set([contentRef.current, subtitleRef.current], { opacity: 0 });
      gsap.set(bgTextRef.current, { opacity: 0, y: 100 });
      gsap.set(titleRef.current, {
        y: () => {
          const titleBounds = titleRef.current?.getBoundingClientRect();
          if (!titleBounds) return 0;
          const centerY = window.innerHeight / 2;
          const currentY = titleBounds.top + titleBounds.height / 2;
          return centerY - currentY;
        },
        scale: 1.1,
        opacity: 1,
        color: "#1A1A1A",
        clipPath: "inset(0 100% 0 0)",
      });
      gsap.set(revealBoxRef.current, {
        position: "fixed",
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        width: "60vw",
        height: "15vh",
        backgroundColor: "#1A1A1A",
        scaleX: 0,
        transformOrigin: "left",
        zIndex: 150,
        opacity: 1,
      });

      gsap.to(waveRef1.current, {
        x: "-50%",
        duration: 25,
        repeat: -1,
        ease: "sine.inOut",
      });
      gsap.to(waveRef2.current, {
        x: "50%",
        duration: 18,
        repeat: -1,
        ease: "sine.inOut",
      });

      const tl = gsap.timeline();

      tl.to(revealBoxRef.current, {
        scaleX: 1,
        duration: 0.7,
        ease: "expo.inOut"
      });

      tl.to(revealBoxRef.current, {
        xPercent: 50,
        scaleX: 0,
        transformOrigin: "right",
        duration: 0.7,
        ease: "expo.out"
      }, "+=0.05");

      tl.to(titleRef.current, {
        clipPath: "inset(0 0% 0 0)",
        duration: 0.7,
        ease: "expo.out"
      }, "<");

      tl.to(titleRef.current, {
        y: 0,
        scale: 1,
        duration: 1.4,
        ease: "expo.out"
      }, "+=0.2");

      tl.to(contentRef.current, {
        opacity: 1,
        duration: 1.6,
        ease: "expo.inOut"
      }, "-=1.2");

      tl.to(bgTextRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.4,
        ease: "power3.out"
      }, "-=1.0");

      tl.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power4.out"
      }, "-=0.7");

      const skyX = gsap.quickTo(skylineRef.current, "x", { duration: 1.2, ease: "power2.out" });
      const skyY = gsap.quickTo(skylineRef.current, "y", { duration: 1.2, ease: "power2.out" });
      const brX = gsap.quickTo(bridgeRef.current, "x", { duration: 1, ease: "power2.out" });
      const brY = gsap.quickTo(bridgeRef.current, "y", { duration: 1, ease: "power2.out" });
      const wvY = gsap.quickTo(waveRef1.current, "y", { duration: 1, ease: "power2.out" });
      const hrX = gsap.quickTo(heroRef.current, "x", { duration: 1, ease: "power2.out" });
      const hrY = gsap.quickTo(heroRef.current, "y", { duration: 1, ease: "power2.out" });

      let ticking = false;
      let lastX = 0, lastY = 0;

      const handleMouseMove = (e: MouseEvent) => {
        lastX = e.clientX;
        lastY = e.clientY;
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const x = (lastX / window.innerWidth - 0.5) * 2;
          const y = (lastY / window.innerHeight - 0.5) * 2;
          skyX(x * 20); skyY(y * 8);
          brX(x * 50); brY(y * 15);
          wvY(y * 15);
          hrX(x * -10); hrY(y * -5);
          ticking = false;
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#FDFDFD] overflow-x-hidden text-[#1A1A1A]"
    >
      <section className="relative w-full h-screen overflow-hidden">
      <div
        ref={contentRef}
        className="relative w-full h-screen"
      >
        <Marquee />
        <div className="absolute top-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          {/* atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#F0F0F0] via-[#FDFDFD] to-[#FDFDFD]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#D4AF37] opacity-[0.05] blur-[120px] rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[1200px] h-[600px] bg-black opacity-[0.06] blur-[100px] rounded-[100%] pointer-events-none animate-pulse-slow" />

        {/* Big Background Text */}
        <div 
          ref={bgTextRef}
          className="absolute top-[2%] w-full flex items-center pointer-events-none select-none overflow-hidden"
        >
          <div className="flex whitespace-nowrap animate-marquee-reverse">
            {[...Array(4)].map((_, i) => (
              <h1 key={i} className="text-[20vw] font-black text-black opacity-[0.05] tracking-tighter uppercase px-20">
                ycombinator
              </h1>
            ))}
          </div>
        </div>

          <Skyline skylineRef={skylineRef} />
          <Bridge bridgeRef={bridgeRef} />
          <Water waveRef1={waveRef1} waveRef2={waveRef2} />
        </div>
      </div>

      <Hero heroRef={heroRef} titleRef={titleRef} subtitleRef={subtitleRef} />

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-3 pointer-events-none">
        <span className="text-[9px] tracking-[0.5em] uppercase font-sans font-light text-[#666666]">
          Scroll
        </span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-[#1A1A1A]/40 to-transparent" />
      </div>
      </section>

      <Details />

      {/* Intro Reveal Box */}
      <div ref={revealBoxRef} className="pointer-events-none" />
    </div>
  );
}
