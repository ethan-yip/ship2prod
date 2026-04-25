import React from 'react';

interface BridgeProps {
  bridgeRef: React.RefObject<SVGSVGElement | null>;
}

export const Bridge = ({ bridgeRef }: BridgeProps) => {
  const [cablePoints, setCablePoints] = React.useState<{x: number, y: number}[]>([]);
  const pathRef = React.useRef<SVGPathElement>(null);

  React.useEffect(() => {
    const updateCablePoints = () => {
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
    };

    updateCablePoints();
  }, [bridgeRef]);

  return (
    <svg
      ref={bridgeRef}
      className="absolute bottom-[8%] left-0 w-full h-[85%] text-[#666666]"
      viewBox="0 0 1200 400"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {/* tower 1 */}
      <g transform="translate(200, 20)">
        <rect x="0" y="0" width="55" height="380" stroke="currentColor" strokeWidth="4" />
        {[0, 63, 126, 189, 252, 315].map((y, i) => (
          <g key={`t1-x-${i}`}>
            <line x1="0" y1={y} x2="55" y2={y + 63} stroke="currentColor" strokeWidth="4" opacity="0.4" />
            <line x1="55" y1={y} x2="0" y2={y + 63} stroke="currentColor" strokeWidth="4" opacity="0.4" />
            <line x1="0" y1={y + 63} x2="55" y2={y + 63} stroke="currentColor" strokeWidth="4" opacity="0.2" />
          </g>
        ))}
      </g>

      {/* tower 2*/}
      <g transform="translate(930, 94) scale(0.7)">
        <rect x="0" y="0" width="55" height="440" stroke="currentColor" strokeWidth="4" />
        {[0, 73, 146, 219, 292, 365].map((y, i) => (
          <g key={`t2-x-${i}`}>
            <line x1="0" y1={y} x2="55" y2={y + 73} stroke="currentColor" strokeWidth="4" opacity="0.4" />
            <line x1="55" y1={y} x2="0" y2={y + 73} stroke="currentColor" strokeWidth="4" opacity="0.4" />
            <line x1="0" y1={y + 73} x2="55" y2={y + 73} stroke="currentColor" strokeWidth="4" opacity="0.2" />
          </g>
        ))}
      </g>

      {/* cables*/}
      <g stroke="currentColor" opacity="0.2">
        <path ref={pathRef} d="M0,180 C 100,280 200,20 200,20 L 255,20 C 500,320 850,300 930,94 L 968.5,94 C 1080,180 1200,120 1200,120" strokeWidth="2" />
      </g>
      
      <g opacity="0.4">
        {cablePoints.map((p, i) => {
          if ((p.x >= 200 && p.x <= 255) || (p.x >= 930 && p.x <= 968.5)) return null;
          return <line key={`s-${i}`} x1={p.x} y1={p.y} x2={p.x} y2={360} stroke="currentColor" strokeWidth="2" opacity="0.3" />;
        })}
      </g>

      {/* Road */}
      <line x1="0" y1="360" x2="1200" y2="360" stroke="currentColor" strokeWidth="4" />
      <g opacity="0.15" stroke="currentColor">
        {[...Array(150)].map((_, i) => (
          <line key={`road-${i}`} x1={i * 8} y1="360" x2={i * 8} y2="370" strokeWidth="4" />
        ))}
      </g>
    </svg>
  );
};
