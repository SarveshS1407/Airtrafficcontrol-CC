import React from 'react';

export interface AviationEmblemProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'mark' | 'badge' | 'full';
  color?: string;
  accentColor?: string;
}

const SIZE_MAP = {
  sm: 24,
  md: 36,
  lg: 48,
  xl: 64,
};

export const AviationEmblem: React.FC<AviationEmblemProps> = ({
  className = '',
  size = 'md',
  variant = 'mark',
  color = '#20394D',
  accentColor = '#D87C43',
}) => {
  const pixelSize = SIZE_MAP[size];

  const svgMark = (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      {/* 1. Compass / Radar Ring */}
      <circle
        cx="32"
        cy="32"
        r="28"
        stroke={color}
        strokeWidth="2.5"
        strokeOpacity="0.85"
      />

      {/* 2. Cardinal Compass Ticks */}
      <line x1="32" y1="4" x2="32" y2="8" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="32" y1="56" x2="32" y2="60" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="4" y1="32" x2="8" y2="32" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="56" y1="32" x2="60" y2="32" stroke={color} strokeWidth="2.5" strokeLinecap="round" />

      {/* 3. Subtle Latitude/Longitude Grid Arc */}
      <ellipse
        cx="32"
        cy="32"
        rx="16"
        ry="28"
        stroke={color}
        strokeWidth="1.25"
        strokeDasharray="3 3"
        strokeOpacity="0.45"
      />

      {/* 4. Orbital Great-Circle Flight Path Arc */}
      <path
        d="M10 44C16 20 40 12 54 28"
        stroke={accentColor}
        strokeWidth="2.5"
        strokeDasharray="4 3"
        strokeLinecap="round"
      />

      {/* 5. Supersonic / Commercial Aircraft Silhouette in Flight */}
      <g transform="translate(32, 32) rotate(-35) translate(-32, -32)">
        <path
          d="M32 10C31.2 10 30.5 11.2 30.5 12.8V26L14 33V37.5L30.5 32.5V44L25 48.5V51.5L32 49.5L39 51.5V48.5L33.5 44V32.5L50 37.5V33L33.5 26V12.8C33.5 11.2 32.8 10 32 10Z"
          fill={accentColor}
          stroke="#FCFAF5"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Radar ping node on nose */}
        <circle cx="32" cy="11.5" r="1.5" fill="#FCFAF5" />
      </g>
    </svg>
  );

  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-xl bg-[#20394D] dark:bg-[#101E2B] p-2 border border-[#172D40] dark:border-[#2D4B63] shadow-xs ${className}`}
      >
        {svgMark}
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <div className="rounded-xl bg-[#20394D] dark:bg-[#101E2B] p-1.5 border border-[#172D40] dark:border-[#2D4B63] shadow-xs">
          {svgMark}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold tracking-tight text-[#172D40] dark:text-[#E3ECF3] text-base leading-none">
              AirTrafficControl
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#E3ECF3] dark:bg-[#20394D] border border-[#D6E0E7] dark:border-[#2D4B63] text-[#20394D] dark:text-[#8DB7D5]">
              CC
            </span>
          </div>
          <p className="text-[10px] font-mono tracking-wider text-[#82909B] dark:text-[#8DB7D5] uppercase mt-0.5">
            Aviation Field Journal
          </p>
        </div>
      </div>
    );
  }

  return <div className={`inline-flex items-center justify-center ${className}`}>{svgMark}</div>;
};
