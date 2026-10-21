import React from 'react';

export interface AviationIconProps {
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

/**
 * 1. Commercial Airliner Silhouette (Twin-engine swept wing jet)
 */
export const CommercialAircraftIcon: React.FC<AviationIconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* Fuselage */}
    <path
      d="M12 2C11.4 2 11 2.6 11 3.5V10L3 13.5V15.5L11 13V18.5L8.5 20.5V22L12 21L15.5 22V20.5L13 18.5V13L21 15.5V13.5L13 10V3.5C13 2.6 12.6 2 12 2Z"
      fill={color}
      stroke={color}
      strokeWidth={strokeWidth * 0.5}
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 2. Light / General Aviation Aircraft Silhouette (Single-engine prop)
 */
export const LightAircraftIcon: React.FC<AviationIconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* Propeller disc */}
    <line x1="9" y1="2.5" x2="15" y2="2.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* High-wing monoplane fuselage */}
    <path
      d="M12 2.5C11.6 2.5 11.2 3.2 11.2 4V7L2 7V9L11.2 9V17L9 19.5V21L12 20.2L15 21V19.5L12.8 17V9L22 9V7L12.8 7V4C12.8 3.2 12.4 2.5 12 2.5Z"
      fill={color}
      stroke={color}
      strokeWidth={strokeWidth * 0.5}
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 3. Airport Terminal & Control Tower
 */
export const AirportTerminalIcon: React.FC<AviationIconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* Tower cab */}
    <path
      d="M10 3L8 6H16L14 3H10Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    {/* Tower stem */}
    <path d="M10 6V15M14 6V15" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <path d="M12 1.5V3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Terminal building */}
    <path
      d="M3 15H21V21H3V15Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    {/* Gate glass panes */}
    <path d="M6 18H8M11 18H13M16 18H18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

/**
 * 4. Runway Threshold & Markings [27L]
 */
export const RunwayIcon: React.FC<AviationIconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* Runway outer boundaries */}
    <rect x="5" y="2" width="14" height="20" rx="1" stroke={color} strokeWidth={strokeWidth} />
    {/* Threshold piano keys */}
    <line x1="7.5" y1="5" x2="9.5" y2="5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <line x1="11" y1="5" x2="13" y2="5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <line x1="14.5" y1="5" x2="16.5" y2="5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Centerline dashes */}
    <line x1="12" y1="8" x2="12" y2="10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <line x1="12" y1="12" x2="12" y2="14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <line x1="12" y1="16" x2="12" y2="18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

/**
 * 5. Departure Takeoff Vector (Climb)
 */
export const DepartureIcon: React.FC<AviationIconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* Ground / runway line */}
    <line x1="3" y1="20" x2="21" y2="20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Climbing aircraft vector */}
    <path
      d="M4.5 16.5L8.5 13.5L15.5 10L14 4.5L16 4L19.5 9L22 7.5L20.5 11.5L16 13.5L13 18L11.5 18L12.5 14L8.5 15.5L6.5 18L5 18L5.5 16.2"
      fill={color}
      stroke={color}
      strokeWidth={strokeWidth * 0.4}
      strokeLinejoin="round"
    />
    <path d="M4 17L12 9" stroke={color} strokeWidth={strokeWidth} strokeDasharray="2 2" strokeLinecap="round" />
  </svg>
);

/**
 * 6. Arrival Touchdown Vector (Descent)
 */
export const ArrivalIcon: React.FC<AviationIconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* Ground / runway line */}
    <line x1="3" y1="20" x2="21" y2="20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Descending trajectory */}
    <path d="M3 5L13 15" stroke={color} strokeWidth={strokeWidth} strokeDasharray="2 2" strokeLinecap="round" />
    {/* Aircraft pitched slightly nose-up on flare */}
    <path
      d="M13 13.5L15.5 13L18 8L20 8.5L19 13.5L22.5 14.5L21.5 16.5L17.5 15.5L14 18.5L12.5 18L13 15.5L10 15L9 16.5L7.5 16L9.5 14"
      fill={color}
      stroke={color}
      strokeWidth={strokeWidth * 0.4}
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 7. Flight Route (Waypoint-to-waypoint arc)
 */
export const FlightRouteIcon: React.FC<AviationIconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* Origin fix circle */}
    <circle cx="4" cy="18" r="2.5" stroke={color} strokeWidth={strokeWidth} />
    {/* Waypoint triangle fix */}
    <path d="M12 6L14.5 10H9.5L12 6Z" stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinejoin="round" />
    {/* Destination fix circle */}
    <circle cx="20" cy="18" r="2.5" stroke={color} strokeWidth={strokeWidth} />
    {/* Great circle curved route */}
    <path
      d="M6.5 18C10 13 14 13 17.5 18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray="3 2"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * 8. Compass & True Heading Indicator (Accepts heading prop to rotate needle!)
 */
export interface CompassHeadingIconProps extends AviationIconProps {
  heading?: number;
}

export const CompassHeadingIcon: React.FC<CompassHeadingIconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  heading = 0,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* Outer compass rose ring */}
    <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth={strokeWidth} />
    {/* Cardinal tick marks */}
    <line x1="12" y1="2.5" x2="12" y2="4.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <line x1="12" y1="19.5" x2="12" y2="21.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <line x1="2.5" y1="12" x2="4.5" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <line x1="19.5" y1="12" x2="21.5" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Rotating needle */}
    <g
      style={{
        transform: `rotate(${heading}deg)`,
        transformOrigin: '12px 12px',
        transition: 'transform 0.3s cubic-bezier(0.2, 0, 0, 1)',
      }}
    >
      {/* North pointer (filled arrow) */}
      <polygon points="12,5 14.5,12 12,10.5 9.5,12" fill={color} />
      {/* South pointer (hollow arrow) */}
      <polygon points="12,19 9.5,12 12,13.5 14.5,12" stroke={color} strokeWidth={strokeWidth * 0.8} fill="none" />
      <circle cx="12" cy="12" r="1.5" fill={color} />
    </g>
  </svg>
);

/**
 * 9. Altimeter / Barometric Flight Level
 */
export const AltimeterIcon: React.FC<AviationIconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* Altimeter dial gauge */}
    <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth={strokeWidth} />
    {/* Vertical altitude ladder / tick ring */}
    <path d="M12 4.5V6.5M17.5 7.5L16 9M19.5 12H17.5M17.5 16.5L16 15M12 17.5V19.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Pressure window & center indicator */}
    <rect x="7" y="10.5" width="4.5" height="3" rx="0.5" stroke={color} strokeWidth={strokeWidth * 0.8} />
    <line x1="12" y1="12" x2="16.5" y2="7.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <circle cx="12" cy="12" r="1.5" fill={color} />
  </svg>
);

/**
 * 10. Airspeed Gauge / Knots Indicator
 */
export const AirspeedIcon: React.FC<AviationIconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* Speedometer dial */}
    <path
      d="M4.5 16.5C3.5 14.5 3.5 12 4.5 9.5C6.5 5 11 3 15.5 4.5C18.5 5.5 20.5 8.5 21 11.5C21.5 14.5 20 17 18 18.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    {/* Speed calibration arc */}
    <path d="M7 14L8.5 13M7.5 9.5L9 10.5M11 7L12 8.5M15 7.5L14.5 9M18 10L16.5 11" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Speed needle pointing to high cruise */}
    <line x1="12" y1="12" x2="16" y2="8" stroke={color} strokeWidth={strokeWidth * 1.2} strokeLinecap="round" />
    <circle cx="12" cy="12" r="2" fill={color} />
  </svg>
);

/**
 * 11. Geographic Coordinates / Reticle
 */
export const CoordinatesIcon: React.FC<AviationIconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* Target reticle crosshairs */}
    <circle cx="12" cy="12" r="8" stroke={color} strokeWidth={strokeWidth} strokeDasharray="3 2" />
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} />
    <line x1="12" y1="2" x2="12" y2="6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <line x1="12" y1="18" x2="12" y2="22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <line x1="2" y1="12" x2="6" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <line x1="18" y1="12" x2="22" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

/**
 * 12. Globe & Continental Navigation
 */
export const GlobeNavigationIcon: React.FC<AviationIconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth={strokeWidth} />
    {/* Equator & Parallels */}
    <path d="M2.5 12H21.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <path d="M4.5 7H19.5" stroke={color} strokeWidth={strokeWidth * 0.8} strokeDasharray="2 2" strokeLinecap="round" />
    <path d="M4.5 17H19.5" stroke={color} strokeWidth={strokeWidth * 0.8} strokeDasharray="2 2" strokeLinecap="round" />
    {/* Meridian Ellipse */}
    <ellipse cx="12" cy="12" rx="4.5" ry="9.5" stroke={color} strokeWidth={strokeWidth} />
  </svg>
);

/**
 * 13. Airport Pin Marker (Aerodrome location)
 */
export const AirportPinIcon: React.FC<AviationIconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M12 2C8.1 2 5 5.1 5 9C5 14.2 12 22 12 22C12 22 19 14.2 19 9C19 5.1 15.9 2 12 2Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    {/* Mini aircraft inside pin */}
    <path
      d="M12 6.5C11.7 6.5 11.5 6.8 11.5 7.2V9L8 10V10.8L11.5 9.8V11.8L10.5 12.6V13.2L12 12.8L13.5 13.2V12.6L12.5 11.8V9.8L16 10.8V10L12.5 9V7.2C12.5 6.8 12.3 6.5 12 6.5Z"
      fill={color}
    />
  </svg>
);

/**
 * 14. Flight Radar Search
 */
export const RadarSearchIcon: React.FC<AviationIconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* Radar sweep dish circle */}
    <circle cx="10.5" cy="10.5" r="7.5" stroke={color} strokeWidth={strokeWidth} />
    <circle cx="10.5" cy="10.5" r="4" stroke={color} strokeWidth={strokeWidth * 0.8} strokeDasharray="2 2" />
    <path d="M10.5 10.5L16 7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Search handle */}
    <line x1="16" y1="16" x2="21" y2="21" stroke={color} strokeWidth={strokeWidth * 1.3} strokeLinecap="round" />
  </svg>
);

/**
 * 15. Flight History / Breadcrumbs Trail
 */
export const FlightHistoryIcon: React.FC<AviationIconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* Breadcrumb points */}
    <circle cx="5" cy="18" r="1.5" fill={color} />
    <circle cx="9" cy="14" r="1.75" fill={color} />
    <circle cx="14" cy="11" r="2" fill={color} />
    {/* Dotted path */}
    <path d="M5 18C7 16 11 13 18 8" stroke={color} strokeWidth={strokeWidth} strokeDasharray="2 2" strokeLinecap="round" />
    {/* Current position aircraft */}
    <path
      d="M18.5 7.5L20 4.5L21.5 7L20 8.5L18.5 7.5Z"
      fill={color}
    />
  </svg>
);

/**
 * 16. Radar Beacon & Live Data Freshness
 */
export const RadarBeaconIcon: React.FC<AviationIconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* Antenna base */}
    <path d="M8 21L12 11L16 21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <line x1="9.5" y1="17" x2="14.5" y2="17" stroke={color} strokeWidth={strokeWidth} />
    {/* Transmitting beacon head */}
    <circle cx="12" cy="11" r="2" fill={color} />
    {/* Radiating wave arcs */}
    <path d="M7.5 7.5C10 5 14 5 16.5 7.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <path d="M5 5C9 1.5 15 1.5 19 5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray="2 2" />
  </svg>
);

/**
 * 17. Aviation Settings & Instrument Filters
 */
export const AviationSettingsIcon: React.FC<AviationIconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* Cockpit instrument sliders / toggles */}
    <line x1="4" y1="7" x2="20" y2="7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <circle cx="9" cy="7" r="2.5" fill="none" stroke={color} strokeWidth={strokeWidth} />
    <line x1="4" y1="17" x2="20" y2="17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <circle cx="15" cy="17" r="2.5" fill="none" stroke={color} strokeWidth={strokeWidth} />
  </svg>
);

/**
 * 18. Sectional Chart / Map Layers
 */
export const AviationLayersIcon: React.FC<AviationIconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* Top sectional layer */}
    <path d="M12 3L21 7.5L12 12L3 7.5L12 3Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    {/* Middle layer */}
    <path d="M3 12L12 16.5L21 12" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    {/* Base layer */}
    <path d="M3 16.5L12 21L21 16.5" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
  </svg>
);

/**
 * 19. Radar Sweep Refresh / Reset
 */
export const AviationRefreshIcon: React.FC<AviationIconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M20 12C20 16.4 16.4 20 12 20C8.5 20 5.5 17.8 4.4 14.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <path
      d="M4 12C4 7.6 7.6 4 12 4C15.8 4 19 6.7 19.8 10.2"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    {/* Arrowheads */}
    <polyline points="16,10 20,10 20,6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="8,14 4,14 4,18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * 20. Pilot Wings / Air Traffic Controller Badge
 */
export const PilotWingsIcon: React.FC<AviationIconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* Center shield / medallion */}
    <path
      d="M12 5L15 8V13C15 15.5 12 17.5 12 17.5C12 17.5 9 15.5 9 13V8L12 5Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      fill="none"
    />
    {/* Center 5-point star */}
    <polygon
      points="12,8 12.8,9.8 14.8,10 13.3,11.3 13.7,13.2 12,12.2 10.3,13.2 10.7,11.3 9.2,10 11.2,9.8"
      fill={color}
    />
    {/* Left wings */}
    <path d="M9 9H3L5 12H9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.5 11.5H4L6 14.5H9" stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" strokeLinejoin="round" />
    {/* Right wings */}
    <path d="M15 9H21L19 12H15" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15.5 11.5H20L18 14.5H15" stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * 21. Theme Icons: Daylight Horizon Sun, Night Radar Moon, Auto Sensor
 */
export const ThemeDayIcon: React.FC<AviationIconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <circle cx="12" cy="12" r="4.5" stroke={color} strokeWidth={strokeWidth} />
    <line x1="12" y1="2" x2="12" y2="4.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <line x1="12" y1="19.5" x2="12" y2="22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <line x1="2" y1="12" x2="4.5" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <line x1="19.5" y1="12" x2="22" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <line x1="4.9" y1="4.9" x2="6.8" y2="6.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <line x1="17.2" y1="17.2" x2="19.1" y2="19.1" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <line x1="4.9" y1="19.1" x2="6.8" y2="17.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <line x1="17.2" y1="6.8" x2="19.1" y2="4.9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

export const ThemeNightIcon: React.FC<AviationIconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M21 12.79C20.84 15.61 19.38 18.17 17.06 19.74C14.74 21.31 11.83 21.7 9.17 20.79C6.51 19.88 4.38 17.78 3.44 15.13C2.5 12.48 2.87 9.56 4.43 7.23C5.98 4.9 8.53 3.42 11.35 3.23C10.74 4.54 10.55 6.01 10.8 7.45C11.14 9.4 12.28 11.11 13.95 12.18C15.62 13.25 17.68 13.59 19.63 13.11C20.1 13 20.56 12.83 21 12.6V12.79Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    {/* Subtle cockpit night star */}
    <polygon points="18,4 18.6,5.3 20,5.5 19,6.4 19.3,7.8 18,7.1 16.7,7.8 17,6.4 16,5.5 17.4,5.3" fill={color} />
  </svg>
);

export const ThemeAutoIcon: React.FC<AviationIconProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* Split Sun / Moon horizon */}
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
    <path d="M12 3V21C7 21 7 3 12 3Z" fill={color} />
  </svg>
);
