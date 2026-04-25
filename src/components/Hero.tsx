interface HeroProps {
  heroRef: React.RefObject<HTMLDivElement | null>;
  titleRef: React.RefObject<HTMLHeadingElement | null>;
  subtitleRef: React.RefObject<HTMLDivElement | null>;
}

export const Hero = ({ heroRef, titleRef, subtitleRef }: HeroProps) => {
  return (
    <div 
      ref={heroRef}
      className="absolute bottom-0 left-0 w-full h-[40vh] flex flex-col items-center justify-center pb-20 z-50 pointer-events-none px-6"
    >
      <div className="text-center flex flex-col items-center">
        <h1 
          ref={titleRef}
          className="text-6xl md:text-8xl lg:text-9xl mb-6 font-serif text-[#1A1A1A] font-light tracking-[0.1em] uppercase leading-none"
        >
          Ship 2 Prod
        </h1>
        <div ref={subtitleRef} className="flex flex-col items-center">
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#1A1A1A] to-transparent mb-10 opacity-20" />
          <p className="text-sm md:text-base text-[#444444] font-sans max-w-xl leading-relaxed tracking-[0.4em] uppercase font-light text-center">
            A curated, exclusive black tie gala
            <br />
            <span className="opacity-60 text-xs mt-4 block font-sans tracking-[0.6em]">San Francisco • 2026</span>
          </p>
        </div>
      </div>
    </div>
  );
};
