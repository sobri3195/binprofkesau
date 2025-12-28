import { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Fasilitas, JenisFasilitas } from '@/types/models';
import { Repository } from '@/services/repository';
import { createCustomIcon } from '@/utils/mapIcons';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const fasilitasRepo = new Repository<Fasilitas>('fasilitas', 'Fasilitas');

function MapController({
  fasilitas,
  selectedFacilityId,
  recenterKey,
}: {
  fasilitas: Fasilitas[];
  selectedFacilityId: string | null;
  recenterKey: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!fasilitas.length) return;
    const bounds = L.latLngBounds(
      fasilitas.map((f) => [f.koordinat.lat, f.koordinat.lng])
    );
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
  }, [fasilitas, map, recenterKey]);

  useEffect(() => {
    if (!selectedFacilityId) return;
    const facility = fasilitas.find((f) => f.id === selectedFacilityId);
    if (facility) {
      map.flyTo([facility.koordinat.lat, facility.koordinat.lng], 11, {
        duration: 0.6,
      });
    }
  }, [selectedFacilityId, fasilitas, map]);

  return null;
}

export function PetaPage() {
  const [fasilitas] = useState<Fasilitas[]>(fasilitasRepo.getAll());
  const [filterJenis, setFilterJenis] = useState<JenisFasilitas | ''>('');
  const [search, setSearch] = useState('');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [recenterKey, setRecenterKey] = useState(0);

  const filteredFasilitas = useMemo(() => {
    const searchLower = search.toLowerCase();
    return fasilitas.filter(f => {
      const matchesJenis = !filterJenis || f.jenis === filterJenis;
      const matchesSearch =
        f.nama.toLowerCase().includes(searchLower) ||
        f.komando.toLowerCase().includes(searchLower);
      return matchesJenis && matchesSearch;
    });
  }, [fasilitas, filterJenis, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Peta Sebaran Fasilitas</h1>
        <p className="text-muted-foreground">
          Visualisasi distribusi fasilitas kesehatan TNI AU
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
        <Input
          placeholder="Cari fasilitas atau komando..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filterJenis}
          onChange={(e) => setFilterJenis(e.target.value as JenisFasilitas | '')}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm w-full lg:w-auto"
        >
          <option value="">Semua Jenis</option>
          <option value="Lanud">Lanud</option>
          <option value="RSAU">RSAU</option>
          <option value="Kodau">Kodau</option>
          <option value="Koopsau">Koopsau</option>
          <option value="Satrad">Satrad</option>
        </select>
        <Button
          variant="outline"
          onClick={() => {
            setSelectedFacilityId(null);
            setRecenterKey((prev) => prev + 1);
          }}
        >
          Reset Tampilan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Peta Interaktif</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-[420px] sm:h-[520px] lg:h-[600px] rounded-lg overflow-hidden">
            <MapContainer
              center={[-2.5, 118]}
              zoom={5}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapController
                fasilitas={filteredFasilitas}
                selectedFacilityId={selectedFacilityId}
                recenterKey={recenterKey}
              />
              {filteredFasilitas.map((f) => (
                <Marker
                  key={f.id}
                  position={[f.koordinat.lat, f.koordinat.lng]}
                  icon={createCustomIcon(f.jenis, f.id === selectedFacilityId)}
                  eventHandlers={{
                    click: () => setSelectedFacilityId(f.id),
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-lg mb-2">{f.nama}</h3>
                      <div className="space-y-1">
                        <div className="flex gap-2">
                          <Badge>{f.jenis}</Badge>
                          <Badge variant="secondary">{f.komando}</Badge>
                        </div>
                        <div className="mt-3 space-y-1 text-sm">
                          <p><strong>Total Personel:</strong> {f.ringkasan.total}</p>
                          <p><strong>Dokter:</strong> {f.ringkasan.dokter}</p>
                          <p><strong>Dokter Gigi:</strong> {f.ringkasan.dokterGigi}</p>
                          <p><strong>Perawat:</strong> {f.ringkasan.perawat}</p>
                          <p><strong>Spesialis:</strong> {f.ringkasan.spesialis}</p>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            <div className="absolute bottom-4 right-4 z-[400] rounded-md bg-white/90 shadow-sm border px-3 py-2 text-xs">
              {filteredFasilitas.length} fasilitas ditampilkan
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredFasilitas.map((f) => (
          <Card
            key={f.id}
            className={selectedFacilityId === f.id ? 'border-primary shadow-sm' : undefined}
          >
            <CardHeader>
              <CardTitle className="text-base">{f.nama}</CardTitle>
              <div className="flex gap-2">
                <Badge>{f.jenis}</Badge>
                <Badge variant="secondary">{f.komando}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Personel:</span>
                  <span className="font-medium">{f.ringkasan.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dokter:</span>
                  <span className="font-medium">{f.ringkasan.dokter}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dokter Gigi:</span>
                  <span className="font-medium">{f.ringkasan.dokterGigi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Perawat:</span>
                  <span className="font-medium">{f.ringkasan.perawat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Spesialis:</span>
                  <span className="font-medium">{f.ringkasan.spesialis}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => setSelectedFacilityId(f.id)}
                >
                  Fokus ke Peta
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
