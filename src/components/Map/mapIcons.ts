import L from 'leaflet';
import { Aircraft } from '../../types/opensky';

/**
 * Gets color based on aircraft flight level / state using editorial aviation palette
 */
export function getAircraftColor(aircraft: Aircraft, isSelected: boolean): string {
  if (aircraft.squawk === '7700' || aircraft.squawk === '7600' || aircraft.squawk === '7500') {
    return '#C94C4C'; // Alert Red for emergency squawk
  }
  if (isSelected) return '#D87C43'; // Flight-path orange for selected target
  if (aircraft.isStale) return '#82909B'; // Muted steel for stale radar contact
  if (aircraft.onGround) return '#82909B'; // Muted steel for taxi/parked
  if (aircraft.verticalState === 'CLIMBING') return '#467A67'; // Runway green
  if (aircraft.verticalState === 'DESCENDING') return '#C99B45'; // Warning amber

  return '#20394D'; // Deep cockpit navy for cruising transit
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

  // Clean, crisp aeronautical airplane marker with fine white outline for contrast
  const svgContent = isGround
    ? `<svg viewBox="0 0 24 24" width="${size}" height="${size}" style="transform: rotate(${heading}deg); transition: transform 0.3s ease; filter: drop-shadow(0 1px 3px rgba(23, 45, 64, 0.25));">
         <circle cx="12" cy="12" r="5" fill="${color}" stroke="#FFFFFF" stroke-width="1.5"/>
         <path d="M12 4 L16 16 L12 13 L8 16 Z" fill="${color}"/>
       </svg>`
    : `<svg viewBox="0 0 24 24" width="${size}" height="${size}" style="transform: rotate(${heading}deg); transition: transform 0.3s ease; filter: drop-shadow(0 1px 3px rgba(23, 45, 64, 0.25));">
         <path d="M12 2 L14 9 L22 13 L22 15 L14 13 L14 19 L17 21 L17 22 L12 21 L7 22 L7 21 L10 19 L10 13 L2 15 L2 13 L10 9 Z" fill="${color}" stroke="#FFFFFF" stroke-width="1.2" stroke-linejoin="round"/>
       </svg>`;

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer group" style="width: ${size}px; height: ${size}px;">
      ${
        isEmergency
          ? `<div class="absolute -inset-1.5 rounded-full border-2 border-red-500 animate-ping pointer-events-none opacity-75"></div>`
          : isSelected
          ? `<div class="absolute -inset-2 rounded-full border-2 border-[#D87C43] pointer-events-none opacity-90 shadow-sm animate-pulse"></div>`
          : ''
      }
      ${svgContent}
      <div class="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded-md bg-[#FCFAF5] border ${
        isEmergency
          ? 'border-red-400 text-red-600 font-bold'
          : isSelected
          ? 'border-[#D87C43] text-[#172D40] font-bold shadow-md ring-1 ring-[#D87C43]/30'
          : 'border-[#D6E0E7] text-[#172D40] opacity-85 group-hover:opacity-100 shadow-2xs'
      } text-[10px] font-sans font-medium whitespace-nowrap pointer-events-none transition-opacity">
        <span class="tracking-tight">${aircraft.callsign}</span>
        <span class="block text-[9px] font-normal ${isEmergency ? 'text-red-500' : 'text-[#82909B]'}">
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
