interface BridgeProps {
  bridgeRef: React.RefObject<SVGSVGElement | null>;
}

export const Bridge = ({ bridgeRef }: BridgeProps) => {
  return (
    <svg
      ref={bridgeRef}
      className="absolute bottom-[8%] left-0 w-full h-[85%] text-[#666666]"
      viewBox="0 0 1200 400"
      preserveAspectRatio="xMidYMid slice"
      fill="currentColor"
    >
      <g transform="translate(200, 20)">
        <path d="M0,380 L22,380 L22,0 L0,0 Z M48,380 L70,380 L70,0 L48,0 Z" />
        <rect x="4" y="0" width="14" height="380" opacity="0.15" fill="black" />
        <rect x="52" y="0" width="14" height="380" opacity="0.15" fill="black" />
        {[45, 105, 165, 225, 285, 345].map((y, i) => (
          <g key={`t1-truss-${i}`}>
            <rect x="22" y={y} width="26" height="8" />
            <path d={`M22,${y+8} L48,${y+30} L48,${y+38} L22,${y+16} Z`} opacity="0.4" />
            <path d={`M48,${y+8} L22,${y+30} L22,${y+38} L48,${y+16} Z`} opacity="0.4" />
          </g>
        ))}
      </g>

      <g transform="translate(930, 80) scale(0.7)">
        <path d="M0,380 L22,380 L22,0 L0,0 Z M48,380 L70,380 L70,0 L48,0 Z" />
        <rect x="4" y="0" width="14" height="380" opacity="0.15" fill="black" />
        <rect x="52" y="0" width="14" height="380" opacity="0.15" fill="black" />
        {[50, 150, 250, 350].map((y, i) => (
           <rect key={`t2-t-${i}`} x="22" y={y} width="26" height="12" />
        ))}
      </g>

      {/* cables*/}
      <g stroke="black" opacity="0.15">
        <path d="M0,180 C 100,280 220,280 220,20" fill="none" strokeWidth="3" />
        <path d="M220,20 C 500,320 850,300 945,85" fill="none" strokeWidth="3" />
        <path d="M965,85 C 1100,150 1200,80 1200,80" fill="none" strokeWidth="2" />
      </g>
      
      <g opacity="0.4">
        {[...Array(120)].map((_, i) => {
          const x = 220 + i * 6.04;
          if (x > 945) return null;
          const relX = (x - 220) / 725;
          const t = relX;
          const yStart = 
            Math.pow(1 - t, 3) * 20 + 
            3 * Math.pow(1 - t, 2) * t * 320 + 
            3 * (1 - t) * Math.pow(t, 2) * 300 + 
            Math.pow(t, 3) * 85;
          return <rect key={`s-${i}`} x={x} y={yStart} width="0.5" height={400} fill="black" opacity={0.25} />;
        })}
      </g>

      <rect x="0" y="360" width="1200" height="4" />
      <g opacity="0.1" fill="black">
        {[...Array(150)].map((_, i) => (
          <rect key={`road-${i}`} x={i * 8} y="364" width="1" height="10" />
        ))}
      </g>
    </svg>
  );
};
