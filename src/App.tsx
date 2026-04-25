import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Skyline } from "./components/Skyline";
import { Bridge } from "./components/Bridge";
import { Water } from "./components/Water";
import { Hero } from "./components/Hero";

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const skylineRef = useRef<SVGSVGElement>(null);
  const bridgeRef = useRef<SVGSVGElement>(null);
  const waveRef1 = useRef<SVGSVGElement>(null);
  const waveRef2 = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

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

      // intro anim
      gsap.from(textRef.current?.querySelectorAll("h1, div, p") || [], {
        y: 30,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power4.out",
      });

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

        gsap.to(textRef.current, {
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
      <div className="noise-overlay" />
      <div className="absolute top-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        {/* atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F0F0F0] via-[#FDFDFD] to-[#FDFDFD]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#D4AF37] opacity-[0.05] blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[1200px] h-[600px] bg-black opacity-[0.06] blur-[100px] rounded-[100%] pointer-events-none animate-pulse-slow" />

        <Skyline skylineRef={skylineRef} />
        <Bridge bridgeRef={bridgeRef} />
        <Water waveRef1={waveRef1} waveRef2={waveRef2} />
      </div>

      <Hero textRef={textRef} />
    </div>
  );
}
