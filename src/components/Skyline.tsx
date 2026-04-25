import { useMemo } from "react";
import { BUILDINGS } from "../constants";

export const Building = ({ data, index }: { data: typeof BUILDINGS[0]; index: number }) => {
  const { x, w, h, color, windows, type } = data;
  const cols = Math.floor(w / 6);
  const rows = Math.floor(windows / cols);
  
  const pseudoRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const windowElements = useMemo(() => {
    const wins = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const seed = index * 1000 + r * 100 + c;
        const rand = pseudoRandom(seed);
        if (rand > 0.3) {
          wins.push({
            r, c,
            opacity: 0.2 + pseudoRandom(seed + 1) * 0.5,
            glow: pseudoRandom(seed + 2) > 0.8
          });
        }
      }
    }
    return wins;
  }, [rows, cols, index]);

  const salesforcePath = `
    M ${x},400 
    L ${x + w * 0.1},${400 - h * 0.8} 
    Q ${x + w * 0.2},${400 - h} ${x + w * 0.5},${400 - h} 
    Q ${x + w * 0.8},${400 - h} ${x + w * 0.9},${400 - h * 0.8} 
    L ${x + w},400 
    Z
  `;

  const renderShape = () => {
    switch (type) {
      case "stepped":
        return (
          <>
            <rect x={x} y={400 - h} width={w} height={h} fill={color} />
            <rect x={x + w * 0.15} y={400 - h - 20} width={w * 0.7} height={20} fill={color} />
            <rect x={x + w * 0.3} y={400 - h - 40} width={w * 0.4} height={20} fill={color} />
          </>
        );
      case "pointed":
        return (
          <>
            <rect x={x} y={400 - h} width={w} height={h} fill={color} />
            <path d={`M${x},${400 - h} L${x + w / 2},${400 - h - 40} L${x + w},${400 - h} Z`} fill={color} />
          </>
        );
      case "rounded":
        return (
          <path d={`M${x},400 L${x},${400 - h + 30} Q${x + w / 2},${400 - h - 20} ${x + w},${400 - h + 30} L${x + w},400 Z`} fill={color} />
        );
      case "salesforce":
        return <path d={salesforcePath} fill={color} />;
      default:
        return <rect x={x} y={400 - h} width={w} height={h} fill={color} />;
    }
  };

  return (
    <g className="building-group">
      {/* <rect x={x + w} y={400 - h} width={w * 0.15} height={h} fill="black" opacity="0.05" transform={`skewY(-5) translate(0, ${x * 0.01})`} /> */}
      
      {/* building */}
      {renderShape()}
      
      {/* windows */}
      <g transform={`translate(${x + 4}, ${400 - h + 10})`}>
        {type === "salesforce" && (
          <defs>
            <clipPath id={`clip-salesforce-${index}`}>
              <path d={salesforcePath} transform={`translate(${-x - 4}, ${-(400 - h + 10)})`} />
            </clipPath>
          </defs>
        )}
        <g clipPath={type === "salesforce" ? `url(#clip-salesforce-${index})` : undefined}>
          {windowElements.map((win, i) => (
            <rect
              key={i}
              x={win.c * 6}
              y={win.r * 8}
              width="2.5"
              height="3.5"
              fill={win.glow ? "#B8860B" : "#888888"}
              opacity={win.opacity * 0.6}
              filter={win.glow ? "url(#windowGlow)" : undefined}
            />
          ))}
        </g>
      </g>
      
      <circle cx={x + w / 2} cy={400 - h - 2} r="1.5" fill="#FF4D4D" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
      </circle>
    </g>
  );
};

interface SkylineProps {
  skylineRef: React.RefObject<SVGSVGElement | null>;
}

export const Skyline = ({ skylineRef }: SkylineProps) => {
  return (
    <svg
      ref={skylineRef}
      className="absolute bottom-[22%] left-0 w-full h-[65%]"
      viewBox="0 0 1200 400"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="windowGlow">
          <feGaussianBlur stdDeviation="1" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="buildingGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(212,175,55,0.05)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
      </defs>
      
      <g transform="translate(0, 0)">
        <path 
          d="M0,400 L0,300 L50,300 L80,250 L120,320 L180,280 L250,350 L300,220 L380,310 L450,260 L550,360 L650,240 L750,330 L850,270 L950,350 L1050,220 L1150,340 L1200,300 L1200,400 Z" 
          fill="#E0E0E0" 
          opacity="0.3" 
        />

        {BUILDINGS.map((b, i) => (
          <Building key={i} data={b} index={i} />
        ))}
        
        <rect x="0" y="350" width="1200" height="50" fill="url(#buildingGrad)" />
      </g>
    </svg>
  );
};
