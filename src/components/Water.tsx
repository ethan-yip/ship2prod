interface WaterProps {
  waveRef1: React.RefObject<SVGSVGElement | null>;
  waveRef2: React.RefObject<SVGSVGElement | null>;
}

export const Water = ({ waveRef1, waveRef2 }: WaterProps) => {
  return (
    <>
      {/* reflection */}
      <div className="absolute bottom-0 w-full h-[45vh] z-20">
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFDFD] via-[#FDFDFD]/90 to-transparent" />
        <div className="noise-overlay" />

        <div className="absolute inset-0 opacity-[0.12]">
          <svg
            ref={waveRef1}
            className="absolute top-0 w-[200%] h-56 text-black"
            viewBox="0 0 2000 140"
            preserveAspectRatio="none"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          >
            {[...Array(14)].map((_, i) => {
              const y = 6 + i * 9.5;
              const amp = 8 + i * 0.5;
              const pathOpacity = Math.max(0.15, 1 - i * 0.075);
              return (
                <path
                  key={`r-${i}`}
                  d={`M0,${y} Q250,${y + amp} 500,${y} T1000,${y} T1500,${y} T2000,${y}`}
                  opacity={pathOpacity}
                />
              );
            })}
          </svg>
        </div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, transparent 55%, rgba(253,253,253,0.35) 85%, rgba(253,253,253,0.6) 100%)",
          }}
        />

        <div className="absolute top-0 w-full h-full bg-gradient-to-b from-[#FDFDFD]/20 via-transparent to-[#FDFDFD]/30" />
        {/* Warm gold band lifted off the seam so its color doesn't
            mismatch the pure #FDFDFD of the Details section below. */}
        <div className="absolute bottom-[6vh] w-full h-[18vh] bg-gradient-to-t from-transparent via-[#D4AF37]/5 to-transparent" />
      </div>

      {/* waves */}
      <div
        className="absolute bottom-0 w-full h-[10vh] z-30 opacity-5 text-[#1A1A1A]"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 35%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 35%, transparent 100%)",
        }}
      >
        <svg
          ref={waveRef2}
          className="absolute bottom-0 left-[-100%] w-[200%] h-full"
          viewBox="0 0 2000 100"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,60 C250,20 250,100 500,60 C750,20 750,100 1000,60 C1250,20 1250,100 1500,60 C1750,20 1750,100 2000,60 L2000,100 L0,100 Z" />
        </svg>
      </div>

      {/* Seam bridge: soft wash that reduces (but does not eliminate)
          residual tint at the boundary, so the wave-line continuation
          in the Details section chains visually across the seam
          instead of restarting from a hard edge. */}
      <div
        className="absolute bottom-0 w-full h-[12vh] z-40 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(253,253,253,0.35) 60%, rgba(253,253,253,0.7) 100%)",
        }}
      />
    </>
  );
};
