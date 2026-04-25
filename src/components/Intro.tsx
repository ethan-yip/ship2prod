import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";

export const Intro = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<SVGTextElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: onComplete
      });

      // Initial state: transparent background, stroke visible
      tl.set(textRef.current, {
        strokeDasharray: 1000,
        strokeDashoffset: 1000,
        fill: "transparent",
        stroke: "#1A1A1A",
        strokeWidth: 1,
        opacity: 1
      });

      // Stroke animation
      tl.to(textRef.current, {
        strokeDashoffset: 0,
        duration: 2.5,
        ease: "power2.inOut"
      });

      // Fill and fade out stroke
      tl.to(textRef.current, {
        fill: "#1A1A1A",
        stroke: "transparent",
        duration: 1,
        ease: "power2.inOut"
      }, "-=0.5");

      // Move and scale to final position (bottom center)
      // We'll actually just fade out the intro and let App handle the main content fade in
      // but to make it "move", we'll animate the container
      tl.to(containerRef.current, {
        y: "35vh", // Move down towards hero position
        opacity: 0,
        scale: 0.8,
        duration: 2,
        ease: "power3.inOut"
      }, "+=0.3");

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FDFDFD]"
    >
      <svg 
        ref={svgRef}
        viewBox="0 0 800 200" 
        className="w-[80%] max-w-4xl h-auto"
      >
        <text
          ref={textRef}
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-7xl font-serif uppercase tracking-[0.2em] font-light"
          style={{ fontVariantCaps: "all-small-caps" }}
        >
          Ship 2 Prod
        </text>
      </svg>
    </div>
  );
};
