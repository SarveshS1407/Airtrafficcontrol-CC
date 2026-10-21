import React from 'react';

/**
 * 1. Runway Centerline Divider with Mini Aircraft Motif
 */
export const RunwayFlightDivider: React.FC<{
  className?: string;
  showAircraft?: boolean;
}> = ({ className = '', showAircraft = true }) => (
  <div className={`relative flex items-center justify-center my-8 ${className}`}>
    {/* Dashed runway centerline line */}
    <div className="w-full border-t border-dashed border-[#82909B]/40 dark:border-[#8DB7D5]/30" />

    {/* Center aircraft badge */}
    {showAircraft && (
      <div className="absolute px-3 bg-[#F4F0E7] dark:bg-[#101E2B] text-[#456D8B] dark:text-[#8DB7D5] flex items-center gap-2 text-xs font-mono">
        <span className="text-[10px] tracking-widest text-[#82909B] opacity-60">27L</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transform rotate-90 text-[#D87C43]">
          <path
            d="M12 2C11.4 2 11 2.6 11 3.5V10L3 13.5V15.5L11 13V18.5L8.5 20.5V22L12 21L15.5 22V20.5L13 18.5V13L21 15.5V13.5L13 10V3.5C13 2.6 12.6 2 12 2Z"
            fill="currentColor"
          />
        </svg>
        <span className="text-[10px] tracking-widest text-[#82909B] opacity-60">09R</span>
      </div>
    )}
  </div>
);

/**
 * 2. Curved Dotted Flight Path Divider
 */
export const FlightPathDivider: React.FC<{
  className?: string;
}> = ({ className = '' }) => (
  <div className={`w-full overflow-hidden flex items-center justify-center py-2 ${className}`}>
    <svg width="100%" height="24" viewBox="0 0 400 24" fill="none" preserveAspectRatio="none">
      <path
        d="M0 12 Q 100 4 200 12 T 400 12"
        stroke="#D6E0E7"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        className="dark:stroke-[#2D4B63]"
      />
      <circle cx="200" cy="12" r="3" fill="#D87C43" />
      <polygon points="200,6 204,12 200,18 196,12" stroke="#456D8B" strokeWidth="1" fill="none" />
    </svg>
  </div>
);

/**
 * 3. Editorial Rubber-Stamp Badge
 */
export const AirportStampBadge: React.FC<{
  code: string;
  name?: string;
  variant?: 'green' | 'amber' | 'blue' | 'orange';
  className?: string;
}> = ({ code, name, variant = 'blue', className = '' }) => {
  const colorStyles = {
    blue: 'border-[#456D8B] text-[#20394D] bg-[#FCFAF5] dark:border-[#8DB7D5] dark:text-[#E3ECF3] dark:bg-[#172D40]',
    green: 'border-[#467A67] text-[#467A67] bg-[#FCFAF5] dark:bg-[#172D40]',
    amber: 'border-[#C99B45] text-[#C99B45] bg-[#FCFAF5] dark:bg-[#172D40]',
    orange: 'border-[#D87C43] text-[#D87C43] bg-[#FCFAF5] dark:bg-[#172D40]',
  }[variant];

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border-2 border-dashed font-mono text-[11px] font-bold tracking-wider uppercase shadow-2xs ${colorStyles} ${className}`}
    >
      <span>[ {code} ]</span>
      {name && <span className="text-[9px] font-normal opacity-80">{name}</span>}
    </div>
  );
};
