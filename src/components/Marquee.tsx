export const Marquee = () => {
  const details = [
    "100 curated Top VCs, Founders, Researchers in AI",
    "Invitation-only Yacht Gala",
    "San Francisco Bay • Black Tie",
    "Live Product Demonstrations • No Slides",
    "YC AI Startup School 2026",
    "High-density interaction among active builders",
  ];

  return (
    <div className="absolute top-0 left-0 w-full z-[100] py-6 overflow-hidden select-none">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center">
            {details.map((detail, index) => (
              <span key={index} className="mx-8 text-[10px] md:text-xs font-sans tracking-[0.3em] uppercase text-black/60 font-medium">
                {detail}
                <span className="ml-8 opacity-20">/</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
