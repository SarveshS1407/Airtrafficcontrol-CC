import React from 'react';

/**
 * 1. Puffy Editorial Cloud with Blueprint Shading
 */
export const EditorialCloud: React.FC<{
  className?: string;
  width?: number;
  height?: number;
  color?: string;
}> = ({ className = '', width = 120, height = 64, color = '#456D8B' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 120 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-2xs ${className}`}
  >
    {/* Cloud Body */}
    <path
      d="M24 50H96C105 50 112 43 112 34C112 25.5 105.5 18.5 97 18C95 10 87 4 78 4C71.5 4 65.5 7.5 62 13C58.5 10 53.5 8 48 8C38.5 8 30.5 15 29.5 24.5C22 25.5 16 32 16 40C16 45.5 20.5 50 24 50Z"
      fill="#FCFAF5"
      stroke={color}
      strokeWidth="1.75"
      strokeLinejoin="round"
      className="dark:fill-[#172D40]"
    />
    {/* Blueprint hatching underbelly */}
    <path
      d="M32 44C36 44 40 46 44 46M56 46C60 46 64 45 68 45M80 44C84 44 88 43 92 42"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeOpacity="0.4"
    />
  </svg>
);

/**
 * 2. Tiny Aircraft Travelling Along a Curved Dotted Route
 */
export const RouteFlightIllustration: React.FC<{
  className?: string;
  width?: number;
  height?: number;
  flightPathColor?: string;
  planeColor?: string;
}> = ({
  className = '',
  width = 240,
  height = 90,
  flightPathColor = '#8DB7D5',
  planeColor = '#D87C43',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 240 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Origin Waypoint Dot */}
    <circle cx="16" cy="70" r="3.5" fill="#20394D" className="dark:fill-[#E3ECF3]" />
    <circle cx="16" cy="70" r="8" stroke="#D6E0E7" strokeWidth="1" strokeDasharray="2 2" />

    {/* Waypoint Fix Diamond */}
    <polygon points="120,25 125,30 120,35 115,30" fill="none" stroke="#456D8B" strokeWidth="1.5" />

    {/* Destination Airport Reticle */}
    <circle cx="224" cy="65" r="3.5" fill="#467A67" />
    <circle cx="224" cy="65" r="7" stroke="#467A67" strokeWidth="1.2" strokeDasharray="3 2" />

    {/* Great-Circle Flight Path Arc */}
    <path
      d="M16 70 C 60 15, 160 10, 224 65"
      stroke={flightPathColor}
      strokeWidth="2"
      strokeDasharray="4 4"
      strokeLinecap="round"
    />

    {/* Tiny Aircraft positioned along arc (around x=165, y=28, heading tangent) */}
    <g transform="translate(162, 27) rotate(22)">
      {/* Jet silhouette */}
      <path
        d="M0 -10 C-0.6 -10 -1 -9 -1 -7.5 V-1 L-9 3 V4.5 L-1 2.5 V7.5 L-4 9.5 V10.8 L0 9.8 L4 10.8 V9.5 L1 7.5 V2.5 L9 4.5 V3 L1 -1 V-7.5 C1 -9 0.6 -10 0 -10 Z"
        fill={planeColor}
        stroke="#FCFAF5"
        strokeWidth="0.8"
      />
      {/* Subtle contrail */}
      <line x1="0" y1="12" x2="0" y2="24" stroke={planeColor} strokeWidth="1.5" strokeDasharray="2 2" strokeOpacity="0.4" />
    </g>
  </svg>
);

/**
 * 3. Miniature Aeronautical Compass Rose
 */
export const MiniatureCompassRose: React.FC<{
  className?: string;
  size?: number;
  color?: string;
  accentColor?: string;
}> = ({ className = '', size = 80, color = '#20394D', accentColor = '#D87C43' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Outer Azimuth Degrees Dial */}
    <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />
    <circle cx="50" cy="50" r="42" stroke={color} strokeWidth="0.75" strokeDasharray="2 2" strokeOpacity="0.5" />

    {/* Cardinal Degree Labels */}
    <text x="50" y="14" fill={accentColor} fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
      N 000°
    </text>
    <text x="86" y="53" fill={color} fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
      090°
    </text>
    <text x="50" y="93" fill={color} fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
      180°
    </text>
    <text x="14" y="53" fill={color} fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
      270°
    </text>

    {/* North Star Point */}
    <polygon points="50,18 54,46 50,44" fill={accentColor} />
    <polygon points="50,18 46,46 50,44" fill={accentColor} fillOpacity="0.6" />

    {/* South Star Point */}
    <polygon points="50,82 54,54 50,56" fill={color} fillOpacity="0.4" />
    <polygon points="50,82 46,54 50,56" fill={color} fillOpacity="0.8" />

    {/* East Star Point */}
    <polygon points="82,50 54,46 56,50" fill={color} fillOpacity="0.7" />
    <polygon points="82,50 54,54 56,50" fill={color} fillOpacity="0.4" />

    {/* West Star Point */}
    <polygon points="18,50 46,46 44,50" fill={color} fillOpacity="0.4" />
    <polygon points="18,50 46,54 44,50" fill={color} fillOpacity="0.7" />

    {/* Center Pivot Ring */}
    <circle cx="50" cy="50" r="3.5" fill="#FCFAF5" stroke={color} strokeWidth="1.5" />
    <circle cx="50" cy="50" r="1.5" fill={accentColor} />
  </svg>
);

/**
 * 4. Paper Flight Plan Illustration (NAVLOG Document)
 */
export const PaperFlightPlanIllustration: React.FC<{
  className?: string;
  width?: number;
  height?: number;
}> = ({ className = '', width = 96, height = 96 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 96 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Shadow / Base Layer */}
    <rect x="18" y="14" width="62" height="74" rx="3" fill="#D6E0E7" className="dark:fill-[#101E2B]" />

    {/* Paper Sheet (Technical Ivory) */}
    <rect
      x="14"
      y="10"
      width="62"
      height="74"
      rx="3"
      fill="#FCFAF5"
      stroke="#172D40"
      strokeWidth="1.75"
      className="dark:fill-[#172D40] dark:stroke-[#D6E0E7]"
    />

    {/* Top Binder Clip */}
    <rect x="36" y="6" width="18" height="8" rx="1.5" fill="#20394D" stroke="#172D40" strokeWidth="1" />
    <path d="M41 6V3H49V6" stroke="#FCFAF5" strokeWidth="1" strokeLinecap="round" />

    {/* Header Line */}
    <line x1="22" y1="24" x2="68" y2="24" stroke="#D87C43" strokeWidth="2" strokeLinecap="round" />

    {/* Flight Plan Text Lines */}
    <line x1="22" y1="32" x2="52" y2="32" stroke="#456D8B" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="22" y1="39" x2="66" y2="39" stroke="#82909B" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 2" />
    <line x1="22" y1="46" x2="58" y2="46" stroke="#82909B" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 2" />
    <line x1="22" y1="53" x2="64" y2="53" stroke="#82909B" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 2" />

    {/* Route Coordinates Grid Table */}
    <rect x="22" y="60" width="46" height="16" rx="1" stroke="#D6E0E7" strokeWidth="1" fill="#F4F0E7" className="dark:fill-[#20394D]" />
    <line x1="37" y1="60" x2="37" y2="76" stroke="#D6E0E7" strokeWidth="1" />
    <line x1="52" y1="60" x2="52" y2="76" stroke="#D6E0E7" strokeWidth="1" />

    {/* Mini Clearance Stamp (Circular) */}
    <circle cx="62" cy="70" r="7" stroke="#467A67" strokeWidth="1.2" strokeDasharray="2 1" />
    <text x="62" y="72" fill="#467A67" fontSize="5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
      OK
    </text>
  </svg>
);

/**
 * 5. Airport ATC Control Tower Illustration
 */
export const AirportControlTowerIllustration: React.FC<{
  className?: string;
  width?: number;
  height?: number;
  color?: string;
}> = ({ className = '', width = 80, height = 100, color = '#20394D' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 80 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Ground base */}
    <line x1="10" y1="94" x2="70" y2="94" stroke={color} strokeWidth="2" strokeLinecap="round" />

    {/* Tower Concrete Column (Tapered) */}
    <polygon points="32,94 48,94 44,40 36,40" fill="#FCFAF5" stroke={color} strokeWidth="1.75" className="dark:fill-[#172D40]" />
    {/* Column Expansion joints */}
    <line x1="33.5" y1="74" x2="46.5" y2="74" stroke={color} strokeWidth="1" strokeOpacity="0.4" />
    <line x1="35" y1="56" x2="45" y2="56" stroke={color} strokeWidth="1" strokeOpacity="0.4" />

    {/* Walkway Balcony */}
    <line x1="24" y1="40" x2="56" y2="40" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="26" y1="36" x2="54" y2="36" stroke={color} strokeWidth="1" strokeDasharray="3 2" />

    {/* Glass Cab (Observation room) */}
    <polygon points="28,40 52,40 56,22 24,22" fill="#8DB7D5" fillOpacity="0.35" stroke={color} strokeWidth="1.75" />
    {/* Glass mullions */}
    <line x1="35" y1="40" x2="33" y2="22" stroke={color} strokeWidth="1.2" />
    <line x1="45" y1="40" x2="47" y2="22" stroke={color} strokeWidth="1.2" />

    {/* Tower Roof */}
    <polygon points="22,22 58,22 52,14 28,14" fill="#20394D" stroke={color} strokeWidth="1.75" />

    {/* Radar Radome Dome */}
    <ellipse cx="40" cy="14" rx="8" ry="6" fill="#D87C43" stroke={color} strokeWidth="1.5" />

    {/* Antenna Mast */}
    <line x1="40" y1="8" x2="40" y2="2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="40" cy="2" r="1.5" fill="#C94C4C" className="animate-pulse" />
  </svg>
);

/**
 * 6. Boarding Pass / Luggage Tag Flight Identifier Label
 */
export const BoardingPassTag: React.FC<{
  callsign: string;
  origin?: string;
  destination?: string;
  className?: string;
}> = ({ callsign, origin = 'ORIG', destination = 'DEST', className = '' }) => (
  <div
    className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#FCFAF5] dark:bg-[#172D40] border border-[#D6E0E7] dark:border-[#2D4B63] shadow-2xs font-mono text-xs ${className}`}
  >
    {/* Luggage Tag Eyelet */}
    <div className="w-2.5 h-2.5 rounded-full border-2 border-[#D87C43] bg-white dark:bg-[#101E2B] shrink-0" />
    {/* Route arc */}
    <div className="flex items-center gap-1.5 font-bold text-[#172D40] dark:text-[#E3ECF3]">
      <span className="text-[#D87C43]">{callsign}</span>
      <span className="text-[#82909B] text-[10px] font-normal">
        [{origin} → {destination}]
      </span>
    </div>
    {/* Mini Barcode aesthetic */}
    <div className="hidden sm:flex items-center gap-[2px] h-3 ml-1 opacity-50">
      <div className="w-[1.5px] h-full bg-[#172D40] dark:bg-[#E3ECF3]" />
      <div className="w-[1px] h-full bg-[#172D40] dark:bg-[#E3ECF3]" />
      <div className="w-[2px] h-full bg-[#172D40] dark:bg-[#E3ECF3]" />
      <div className="w-[1px] h-full bg-[#172D40] dark:bg-[#E3ECF3]" />
      <div className="w-[2.5px] h-full bg-[#172D40] dark:bg-[#E3ECF3]" />
    </div>
  </div>
);

/**
 * 7. Globe Route Illustration
 */
export const GlobeRouteIllustration: React.FC<{
  className?: string;
  size?: number;
}> = ({ className = '', size = 110 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Globe sphere */}
    <circle cx="60" cy="60" r="50" stroke="#456D8B" strokeWidth="2" fill="#FCFAF5" className="dark:fill-[#172D40]" />

    {/* Latitudes & Longitudes */}
    <ellipse cx="60" cy="60" rx="24" ry="50" stroke="#D6E0E7" strokeWidth="1.25" className="dark:stroke-[#2D4B63]" />
    <line x1="10" y1="60" x2="110" y2="60" stroke="#D6E0E7" strokeWidth="1.25" className="dark:stroke-[#2D4B63]" />
    <path d="M18 36 Q 60 48 102 36" stroke="#D6E0E7" strokeWidth="1" strokeDasharray="3 3" className="dark:stroke-[#2D4B63]" />
    <path d="M18 84 Q 60 72 102 84" stroke="#D6E0E7" strokeWidth="1" strokeDasharray="3 3" className="dark:stroke-[#2D4B63]" />

    {/* Trans-continental Route Arc */}
    <path
      d="M26 72 Q 60 16 94 66"
      stroke="#D87C43"
      strokeWidth="2.5"
      strokeDasharray="4 3"
      strokeLinecap="round"
    />

    {/* Aircraft in flight */}
    <g transform="translate(62, 34) rotate(18)">
      <path
        d="M0 -8 C-0.5 -8 -0.8 -7 -0.8 -6 V-1 L-7 2 V3.2 L-0.8 1.8 V6 L-3 7.6 V8.6 L0 7.8 L3 8.6 V7.6 L0.8 6 V1.8 L7 3.2 V2 L0.8 -1 V-6 C0.8 -7 0.5 -8 0 -8 Z"
        fill="#D87C43"
      />
    </g>

    {/* Fix dots */}
    <circle cx="26" cy="72" r="3.5" fill="#20394D" className="dark:fill-[#E3ECF3]" />
    <circle cx="94" cy="66" r="3.5" fill="#467A67" />
  </svg>
);
