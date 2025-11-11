import { useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { Fasilitas, Dokter } from '@/types/models';
import { createCustomIcon, createClusterIcon } from '@/utils/mapIcons';

interface MapViewProps {
  fasilitas: Fasilitas[];
  highlightedIds: string[];
  selectedFacilityId: string | null;
  onFacilitySelect: (id: string) => void;
  searchQuery?: string;
}

// Component to handle map bounds and marker clusters
function MapController({ 
  fasilitas, 
  highlightedIds,
  selectedFacilityId,
  onFacilitySelect,
  searchQuery 
}: { 
  fasilitas: Fasilitas[];
  highlightedIds: string[];
  selectedFacilityId: string | null;
  onFacilitySelect: (id: string) => void;
  searchQuery?: string;
}) {
  const map = useMap();
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

  // Find matched doctors based on search query
  const getMatchedDoctors = (facility: Fasilitas): Dokter[] => {
    if (!searchQuery || !facility.dokterList) return [];
    const searchLower = searchQuery.toLowerCase();
    return facility.dokterList.filter(
      (d) =>
        d.nama.toLowerCase().includes(searchLower) ||
        (d.spesialisasi && d.spesialisasi.toLowerCase().includes(searchLower))
    );
  };

  useEffect(() => {
    // Initialize cluster group
    if (!clusterGroupRef.current) {
      clusterGroupRef.current = L.markerClusterGroup({
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount();
          return createClusterIcon(count);
        },
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        maxClusterRadius: 60,
      });
      map.addLayer(clusterGroupRef.current);
    }

    return () => {
      if (clusterGroupRef.current) {
        map.removeLayer(clusterGroupRef.current);
        clusterGroupRef.current = null;
      }
    };
  }, [map]);

  useEffect(() => {
    // Update cluster markers when fasilitas changes
    if (clusterGroupRef.current) {
      clusterGroupRef.current.clearLayers();

      fasilitas.forEach((f) => {
        const isHighlighted = highlightedIds.includes(f.id);
        const matchedDoctors = getMatchedDoctors(f);
        
        const marker = L.marker([f.koordinat.lat, f.koordinat.lng], {
          icon: createCustomIcon(f.jenis, isHighlighted),
        });

        // Create popup content
        const popupDiv = document.createElement('div');
        popupDiv.innerHTML = `
          <div class="min-w-[280px] max-w-[350px]">
            <div class="border-b pb-2 mb-3">
              <h3 class="font-bold text-lg mb-2">${f.nama}</h3>
              <div class="flex gap-2 flex-wrap">
                <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">${f.jenis}</span>
                <span class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">${f.komando}</span>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2 mb-3 text-sm">
              <div><span class="text-gray-500">Total:</span> <span class="font-semibold">${f.ringkasan.total}</span></div>
              <div><span class="text-gray-500">Dokter:</span> <span class="font-semibold">${f.ringkasan.dokter}</span></div>
              <div><span class="text-gray-500">Dokter Gigi:</span> <span class="font-semibold">${f.ringkasan.dokterGigi}</span></div>
              <div><span class="text-gray-500">Perawat:</span> <span class="font-semibold">${f.ringkasan.perawat}</span></div>
              <div class="col-span-2"><span class="text-gray-500">Spesialis:</span> <span class="font-semibold">${f.ringkasan.spesialis}</span></div>
            </div>
            ${f.dokterList && f.dokterList.length > 0 ? `
              <div class="border-t pt-3">
                <h4 class="font-semibold text-sm mb-2">Daftar Dokter:</h4>
                <div class="max-h-[200px] overflow-y-auto space-y-2">
                  ${f.dokterList.map((dokter) => `
                    <div class="text-sm p-2 rounded ${matchedDoctors.some(d => d.id === dokter.id) ? 'bg-yellow-50 border border-yellow-300' : 'bg-gray-50'}">
                      <div class="font-semibold">${dokter.nama}</div>
                      ${dokter.spesialisasi ? `<div class="text-xs text-gray-500">${dokter.spesialisasi}</div>` : ''}
                      ${dokter.aktif ? '<span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 mt-1">Aktif</span>' : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            ${matchedDoctors.length > 0 ? `
              <div class="mt-3 p-2 bg-yellow-50 border border-yellow-300 rounded text-xs">
                <strong>Cocok:</strong> ${matchedDoctors.map(d => d.nama).join(', ')}
              </div>
            ` : ''}
          </div>
        `;

        marker.bindPopup(popupDiv, { maxWidth: 400, minWidth: 280 });
        
        marker.on('click', () => {
          onFacilitySelect(f.id);
        });

        clusterGroupRef.current!.addLayer(marker);
      });
    }

    // Fit bounds to all markers
    if (fasilitas.length > 0) {
      const bounds = L.latLngBounds(
        fasilitas.map((f) => [f.koordinat.lat, f.koordinat.lng])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [fasilitas, highlightedIds, map, onFacilitySelect, searchQuery]);

  useEffect(() => {
    // Pan to selected facility and open popup
    if (selectedFacilityId && clusterGroupRef.current) {
      const facility = fasilitas.find((f) => f.id === selectedFacilityId);
      if (facility) {
        map.setView([facility.koordinat.lat, facility.koordinat.lng], 13, {
          animate: true,
        });
        
        // Find and open the marker's popup
        clusterGroupRef.current.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            const latLng = layer.getLatLng();
            if (latLng.lat === facility.koordinat.lat && latLng.lng === facility.koordinat.lng) {
              layer.openPopup();
            }
          }
        });
      }
    }
  }, [selectedFacilityId, fasilitas, map]);

  return null;
}

export function MapView({ 
  fasilitas, 
  highlightedIds, 
  selectedFacilityId, 
  onFacilitySelect,
  searchQuery 
}: MapViewProps) {
  const center = useMemo(() => {
    if (fasilitas.length === 0) return { lat: -2.5, lng: 118 };
    const avgLat = fasilitas.reduce((sum, f) => sum + f.koordinat.lat, 0) / fasilitas.length;
    const avgLng = fasilitas.reduce((sum, f) => sum + f.koordinat.lng, 0) / fasilitas.length;
    return { lat: avgLat, lng: avgLng };
  }, [fasilitas]);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController 
          fasilitas={fasilitas}
          highlightedIds={highlightedIds}
          selectedFacilityId={selectedFacilityId}
          onFacilitySelect={onFacilitySelect}
          searchQuery={searchQuery}
        />
      </MapContainer>
    </div>
  );
}
