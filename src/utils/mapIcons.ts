import L from 'leaflet';
import { JenisFasilitas } from '@/types/models';

// Define colors for each facility type
const FACILITY_COLORS: Record<JenisFasilitas, string> = {
  Lanud: '#3b82f6', // blue
  RSAU: '#ef4444', // red
  Kodau: '#8b5cf6', // purple
  Koopsau: '#10b981', // green
  Satrad: '#f59e0b', // amber
};

// Create custom marker icon with color
export function createCustomIcon(jenis: JenisFasilitas, highlighted: boolean = false): L.Icon {
  const color = FACILITY_COLORS[jenis];
  const strokeWidth = highlighted ? 4 : 2;
  const strokeColor = highlighted ? '#fbbf24' : '#fff'; // yellow when highlighted
  
  const svgIcon = `
    <svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 11 16 26 16 26s16-15 16-26C32 7.163 24.837 0 16 0z" 
        fill="${color}" 
        stroke="${strokeColor}" 
        stroke-width="${strokeWidth}"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>
  `;

  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
}

// Create cluster icon
export function createClusterIcon(count: number): L.DivIcon {
  const size = count < 10 ? 40 : count < 100 ? 50 : 60;
  
  return L.divIcon({
    html: `
      <div style="
        background-color: #3b82f6;
        color: white;
        border: 3px solid white;
        border-radius: 50%;
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: ${count < 10 ? '16px' : count < 100 ? '18px' : '20px'};
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        ${count}
      </div>
    `,
    className: 'custom-cluster-icon',
    iconSize: L.point(size, size),
  });
}
