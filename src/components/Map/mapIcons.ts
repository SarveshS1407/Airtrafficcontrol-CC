import L from 'leaflet';
import { Aircraft } from '../../types/opensky';

/**
 * Gets color based on aircraft flight level / state using refined aviation palette
 */
export function getAircraftColor(aircraft: Aircraft, isSelected: boolean): string {
  if (aircraft.squawk === '7700' || aircraft.squawk === '7600' || aircraft.squawk === '7500') {
    return '#C94C4C'; // Alert Red for emergency squawk
  }
  if (isSelected) return '#17324D'; // Deep aviation navy for selected
  if (aircraft.isStale) return '#94A3B8'; // Muted grey for stale radar contact
  if (aircraft.onGround) return '#D99A32'; // Warm amber for ground vehicles / taxi
  if (aircraft.verticalState === 'CLIMBING') return '#258568'; // Aviation green
  if (aircraft.verticalState === 'DESCENDING') return '#D99A32'; // Warm amber

  return '#2563EB'; // Confident aviation blue for airborne transit
}

/**
 * Creates custom Leaflet DivIcon for aircraft with rotated SVG silhouette and clean label
 */
export function createAircraftDivIcon(aircraft: Aircraft, isSelected: boolean): L.DivIcon {
  const isEmergency = aircraft.squawk === '7700' || aircraft.squawk === '7600' || aircraft.squawk === '7500';
  const color = getAircraftColor(aircraft, isSelected);
  const heading = aircraft.heading ?? 0;
  const isGround = aircraft.onGround;

  const size = isSelected || isEmergency ? 32 : 24;
  const halfSize = size / 2;

  // Clean, crisp aviation airplane marker with fine white outline for contrast over any map tile
  const svgContent = isGround
    ? `<svg viewBox="0 0 24 24" width="${size}" height="${size}" style="transform: rotate(${heading}deg); transition: transform 0.3s ease; filter: drop-shadow(0 1px 3px rgba(16, 38, 60, 0.25));">
         <circle cx="12" cy="12" r="5" fill="${color}" stroke="#FFFFFF" stroke-width="1.5"/>
         <path d="M12 4 L16 16 L12 13 L8 16 Z" fill="${color}"/>
       </svg>`
    : `<svg viewBox="0 0 24 24" width="${size}" height="${size}" style="transform: rotate(${heading}deg); transition: transform 0.3s ease; filter: drop-shadow(0 1px 3px rgba(16, 38, 60, 0.25));">
         <path d="M12 2 L14 9 L22 13 L22 15 L14 13 L14 19 L17 21 L17 22 L12 21 L7 22 L7 21 L10 19 L10 13 L2 15 L2 13 L10 9 Z" fill="${color}" stroke="#FFFFFF" stroke-width="1.2" stroke-linejoin="round"/>
       </svg>`;

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer group" style="width: ${size}px; height: ${size}px;">
      ${
        isEmergency
          ? `<div class="absolute -inset-1.5 rounded-full border-2 border-red-500 animate-ping pointer-events-none opacity-75"></div>`
          : isSelected
          ? `<div class="absolute -inset-1.5 rounded-full border-2 border-aviation-navy pointer-events-none opacity-80"></div>`
          : ''
      }
      ${svgContent}
      <div class="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 rounded-md bg-white border ${
        isEmergency
          ? 'border-red-400 text-red-600 font-bold'
          : isSelected
          ? 'border-aviation-navy text-aviation-navy font-bold shadow-md'
          : 'border-slate-200 text-slate-700 opacity-85 group-hover:opacity-100 shadow-sm'
      } text-[10px] font-sans font-medium whitespace-nowrap pointer-events-none transition-opacity">
        <span>${aircraft.callsign}</span>
        <span class="block text-[9px] font-normal ${isEmergency ? 'text-red-500' : 'text-slate-500'}">
          ${isEmergency ? `EMERG ${aircraft.squawk}` : aircraft.onGround ? 'On Ground' : `${aircraft.baroAltitudeFeet ? aircraft.baroAltitudeFeet.toLocaleString() + ' ft' : 'Alt --'}`}
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
