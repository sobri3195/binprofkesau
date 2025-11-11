import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Fasilitas, JenisFasilitas } from '@/types/models';
import { Repository } from '@/services/repository';
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

export function PetaPage() {
  const [fasilitas] = useState<Fasilitas[]>(fasilitasRepo.getAll());
  const [filterJenis, setFilterJenis] = useState<JenisFasilitas | ''>('');

  const filteredFasilitas = useMemo(() => {
    return fasilitas.filter(f => !filterJenis || f.jenis === filterJenis);
  }, [fasilitas, filterJenis]);

  const center = useMemo(() => {
    if (filteredFasilitas.length === 0) return { lat: -2.5, lng: 118 };
    const avgLat = filteredFasilitas.reduce((sum, f) => sum + f.koordinat.lat, 0) / filteredFasilitas.length;
    const avgLng = filteredFasilitas.reduce((sum, f) => sum + f.koordinat.lng, 0) / filteredFasilitas.length;
    return { lat: avgLat, lng: avgLng };
  }, [filteredFasilitas]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Peta Sebaran Fasilitas</h1>
        <p className="text-muted-foreground">
          Visualisasi distribusi fasilitas kesehatan TNI AU
        </p>
      </div>

      <div className="flex gap-4">
        <select
          value={filterJenis}
          onChange={(e) => setFilterJenis(e.target.value as JenisFasilitas | '')}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Semua Jenis</option>
          <option value="Lanud">Lanud</option>
          <option value="RSAU">RSAU</option>
          <option value="Kodau">Kodau</option>
          <option value="Koopsau">Koopsau</option>
          <option value="Satrad">Satrad</option>
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Peta Interaktif</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] rounded-lg overflow-hidden">
            <MapContainer
              center={[center.lat, center.lng]}
              zoom={5}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredFasilitas.map((f) => (
                <Marker
                  key={f.id}
                  position={[f.koordinat.lat, f.koordinat.lng]}
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
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredFasilitas.map((f) => (
          <Card key={f.id}>
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
