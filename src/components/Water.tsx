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

        <div className="absolute inset-0 opacity-10">
          <svg
            ref={waveRef1}
            className="absolute top-0 w-[200%] h-16 text-black"
            viewBox="0 0 2000 40"
            preserveAspectRatio="none"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          >
            {[...Array(6)].map((_, i) => (
              <path 
                key={`r-${i}`}
                d={`M0,${8 + i * 6} Q250,${18 + i * 6} 500,${8 + i * 6} T1000,${8 + i * 6} T1500,${8 + i * 6} T2000,${8 + i * 6}`} 
                opacity={1 - i * 0.15}
              />
            ))}
          </svg>
        </div>

        <div className="absolute top-0 w-full h-full backdrop-blur-[1.5px]" />
        <div className="absolute bottom-0 w-full h-[15vh] bg-gradient-to-t from-[#D4AF37]/5 to-transparent" />
      </div>

      {/* waves */}
      <div className="absolute bottom-0 w-full h-[10vh] z-30 opacity-5 text-[#1A1A1A]">
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
    </>
  );
};
