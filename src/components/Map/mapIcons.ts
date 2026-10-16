import L from 'leaflet';
import { Aircraft } from '../../types/opensky';

/**
 * Gets color based on aircraft flight level / state
 */
export function getAircraftColor(aircraft: Aircraft, isSelected: boolean): string {
  if (isSelected) return '#00e5ff'; // Bright cyan halo for selected
  if (aircraft.isStale) return '#64748b'; // Muted grey for stale radar contact
  if (aircraft.onGround) return '#f59e0b'; // Amber for ground vehicles / taxi

  const alt = aircraft.baroAltitudeFeet ?? 0;
  if (alt < 10000) return '#10b981'; // Emerald for approach / low sector
  if (alt < 25000) return '#06b6d4'; // Cyan for mid transit
  if (alt < 36000) return '#3b82f6'; // Blue for cruising
  return '#818cf8'; // Violet for high cruising
}

/**
 * Creates custom Leaflet DivIcon for aircraft with rotated SVG silhouette and callsign label
 */
export function createAircraftDivIcon(aircraft: Aircraft, isSelected: boolean): L.DivIcon {
  const color = getAircraftColor(aircraft, isSelected);
  const heading = aircraft.heading ?? 0;
  const isGround = aircraft.onGround;

  const size = isSelected ? 34 : 26;
  const halfSize = size / 2;

  // Modern aviation radar aircraft symbol (rotated to true track)
  const svgContent = isGround
    ? `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}" style="transform: rotate(${heading}deg); transition: transform 0.4s ease;">
         <circle cx="12" cy="12" r="5" fill="${color}" fill-opacity="0.3" stroke="${color}" stroke-width="2"/>
         <path d="M12 4 L16 16 L12 13 L8 16 Z" fill="${color}"/>
       </svg>`
    : `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}" style="transform: rotate(${heading}deg); transition: transform 0.4s ease; filter: drop-shadow(0 0 ${isSelected ? '6px' : '2px'} ${color});">
         <path d="M12 2 L14 9 L22 13 L22 15 L14 13 L14 19 L17 21 L17 22 L12 21 L7 22 L7 21 L10 19 L10 13 L2 15 L2 13 L10 9 Z"/>
       </svg>`;

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer group" style="width: ${size}px; height: ${size}px;">
      ${
        isSelected
          ? `<div class="absolute -inset-1.5 rounded-full border border-cyan-400/80 animate-ping pointer-events-none"></div>
             <div class="absolute -inset-1 rounded-full border border-cyan-400/60 pointer-events-none"></div>`
          : ''
      }
      ${svgContent}
      <div class="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 rounded bg-atc-950/90 border border-atc-700/80 text-[10px] font-mono font-bold text-slate-100 whitespace-nowrap shadow-md pointer-events-none transition-opacity ${
        isSelected ? 'opacity-100 border-cyan-500 text-cyan-300' : 'opacity-80 group-hover:opacity-100'
      }">
        ${aircraft.callsign}
        <span class="block text-[9px] font-normal text-slate-400">
          ${aircraft.onGround ? 'GND' : `${Math.round((aircraft.baroAltitudeFeet ?? 0) / 100)}FL`}
        </span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'atc-aircraft-icon',
    iconSize: [size, size],
    iconAnchor: [halfSize, halfSize],
  });
}
