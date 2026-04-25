import React from 'react';

interface BridgeProps {
  bridgeRef: React.RefObject<SVGSVGElement | null>;
}

export const Bridge = ({ bridgeRef }: BridgeProps) => {
  const [cablePoints, setCablePoints] = React.useState<{x: number, y: number}[]>([]);
  const pathRef = React.useRef<SVGPathElement>(null);

  React.useEffect(() => {
    if (pathRef.current) {
      const path = pathRef.current;
      const length = path.getTotalLength();
      const points = [];
      const numCables = 150;
      
      for (let i = 0; i <= numCables; i++) {
        const point = path.getPointAtLength((i / numCables) * length);
        points.push({ x: point.x, y: point.y });
      }
      setCablePoints(points);
    }
  }, []);

  return (
    <svg
      ref={bridgeRef}
      className="absolute bottom-[8%] left-0 w-full h-[85%] text-[#666666]"
      viewBox="0 0 1200 400"
      preserveAspectRatio="xMidYMid slice"
      fill="#a17f51"
    >
      <g transform="translate(200, 20)">
        <path d="M0,380 L22,380 L22,0 L0,0 Z M48,380 L70,380 L70,0 L48,0 Z" />
        <rect x="4" y="0" width="14" height="380" opacity="0.55" fill="#f2b25e" />
        <rect x="52" y="0" width="14" height="380" opacity="0.55" fill="#f2b25e" />
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
        <rect x="4" y="0" width="14" height="380" opacity="0.55" fill="#f2b25e" />
        <rect x="52" y="0" width="14" height="380" opacity="0.55" fill="#f2b25e" />
        {[50, 150, 250, 350].map((y, i) => (
           <rect key={`t2-t-${i}`} x="22" y={y} width="26" height="12" />
        ))}
      </g>

      {/* cables*/}
      <g stroke="#f2b25e" opacity="0.55">
        <path ref={pathRef} d="M0,180 C 100,280 220,280 220,20 C 500,320 850,300 945,85 L 965,85 C 1100,150 1200,80 1200,80" fill="none" strokeWidth="3" />
      </g>
      
      <g opacity="0.4">
        {cablePoints.map((p, i) => {
          if ((p.x >= 220 && p.x <= 270) || (p.x >= 930 && p.x <= 980)) return null;
          return <rect key={`s-${i}`} x={p.x} y={p.y} width="0.5" height={360 - p.y} fill="black" opacity={0.2} />;
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
