import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Skyline } from "./components/Skyline";
import { Bridge } from "./components/Bridge";
import { Water } from "./components/Water";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";

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
    const ctx = gsap.context(() => {
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

      tl.set([contentRef.current, subtitleRef.current], { opacity: 0 });
      tl.set(bgTextRef.current, { opacity: 0, y: 100 });
      
      tl.set(titleRef.current, {
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
        clipPath: "inset(0 100% 0 0)" // Hidden by clip
      });

      tl.set(revealBoxRef.current, {
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
        opacity: 1
      });

      tl.to(revealBoxRef.current, {
        scaleX: 1,
        duration: 1.2,
        ease: "expo.inOut"
      });

      tl.to(revealBoxRef.current, {
        xPercent: 50,
        scaleX: 0,
        transformOrigin: "right",
        duration: 1.2,
        ease: "expo.out"
      }, "+=0.1");

      tl.to(titleRef.current, {
        clipPath: "inset(0 0% 0 0)",
        duration: 1.2,
        ease: "expo.out"
      }, "<");

      tl.to(titleRef.current, {
        y: 0,
        scale: 1,
        duration: 2.5,
        ease: "expo.out"
      }, "+=0.5");

      tl.to(contentRef.current, {
        opacity: 1,
        duration: 3,
        ease: "expo.inOut"
      }, "-=2");

      tl.to(bgTextRef.current, {
        opacity: 1,
        y: 0,
        duration: 2.5,
        ease: "power3.out"
      }, "-=1.8");

      tl.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 2,
        ease: "power4.out"
      }, "-=1.2");

      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth - 0.5) * 2;
        const y = (clientY / window.innerHeight - 0.5) * 2;

        // parallax
        gsap.to(skylineRef.current, {
          x: x * 20,
          y: y * 8,
          duration: 1.2,
          ease: "power2.out"
        });

        gsap.to(bridgeRef.current, {
          x: x * 50,
          y: y * 15,
          duration: 1,
          ease: "power2.out"
        });

        gsap.to(waveRef1.current, {
          y: y * 15,
          duration: 1,
          ease: "power2.out"
        });

        gsap.to(heroRef.current, {
          x: x * -10,
          y: y * -5,
          duration: 1,
          ease: "power2.out"
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
      className="relative w-full h-screen bg-[#FDFDFD] overflow-hidden text-[#1A1A1A]"
    >
      <div 
        ref={contentRef} 
        className="relative w-full h-screen"
      >
        <Marquee />
        <div className="noise-overlay" />
        <div className="absolute top-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          {/* atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#F0F0F0] via-[#FDFDFD] to-[#FDFDFD]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#D4AF37] opacity-[0.05] blur-[120px] rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[1200px] h-[600px] bg-black opacity-[0.06] blur-[100px] rounded-[100%] pointer-events-none animate-pulse-slow" />

        {/* Big Background Text */}
        <div 
          ref={bgTextRef}
          className="absolute top-[2%] flex items-center justify-center pointer-events-none select-none overflow-hidden"
        >
          <h1 className="text-[20vw] font-black text-black opacity-[0.03] whitespace-nowrap tracking-tighter uppercase">
            ycombinator
          </h1>
        </div>

          <Skyline skylineRef={skylineRef} />
          <Bridge bridgeRef={bridgeRef} />
          <Water waveRef1={waveRef1} waveRef2={waveRef2} />
        </div>
      </div>

      <Hero heroRef={heroRef} titleRef={titleRef} subtitleRef={subtitleRef} />
      
      {/* Intro Reveal Box */}
      <div ref={revealBoxRef} className="pointer-events-none" />
    </div>
  );
}
