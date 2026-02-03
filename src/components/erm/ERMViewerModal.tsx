import { Personel, TimelineEvent } from '@/types/models';
import { X, Clock, Activity, Building2, Calendar, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

interface ERMViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  personel: Personel | null;
  timeline: TimelineEvent[];
}

export function ERMViewerModal({ isOpen, onClose, personel, timeline }: ERMViewerModalProps) {
  const [filterJenis, setFilterJenis] = useState<string>('');

  if (!isOpen || !personel) return null;

  const filteredTimeline = filterJenis
    ? timeline.filter(t => t.jenis === filterJenis)
    : timeline;

  const uniqueJenis = Array.from(new Set(timeline.map(t => t.jenis)));
  const uniqueFasilitas = Array.from(new Set(timeline.map(t => t.fasilitas)));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex-1">
            <h2 className="text-xl font-bold">Riwayat Medis Lintas Fasilitas</h2>
            <p className="text-sm text-muted-foreground">
              {personel.nama} ({personel.nrp}) - {personel.pangkat}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Ringkasan</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-blue-700 dark:text-blue-300">Total Kunjungan</p>
                <p className="font-bold text-lg">{timeline.length}</p>
              </div>
              <div>
                <p className="text-blue-700 dark:text-blue-300">Fasilitas Terdaftar</p>
                <p className="font-bold text-lg">{uniqueFasilitas.length}</p>
              </div>
              <div>
                <p className="text-blue-700 dark:text-blue-300">Jenis Pemeriksaan</p>
                <p className="font-bold text-lg">{uniqueJenis.length}</p>
              </div>
              <div>
                <p className="text-blue-700 dark:text-blue-300">Fasilitas Utama</p>
                <p className="font-bold text-lg">{personel.satuan}</p>
              </div>
            </div>
          </Card>

          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter:</span>
            <select
              value={filterJenis}
              onChange={(e) => setFilterJenis(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-1 text-sm"
            >
              <option value="">Semua Jenis</option>
              {uniqueJenis.map(j => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
            <div className="flex flex-wrap gap-1">
              {uniqueFasilitas.map(f => (
                <Badge key={f} variant="outline" className="text-xs">
                  {f}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredTimeline.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Tidak ada riwayat pemeriksaan ditemukan
              </div>
            ) : (
              filteredTimeline.map((event, index) => (
                <div key={event.id} className="relative">
                  {index !== filteredTimeline.length - 1 && (
                    <div className="absolute left-4 top-8 w-0.5 h-full bg-gray-200 dark:bg-gray-700" />
                  )}

                  <Card className="ml-8 relative">
                    <div className="absolute -left-8 top-4 h-4 w-4 rounded-full bg-blue-500 border-4 border-white dark:border-gray-900" />

                    <div className="p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(event.tanggal).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <Badge variant="outline">{event.jenis}</Badge>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{event.fasilitas}</span>
                      </div>

                      <p className="text-sm mb-2">{event.deskripsi}</p>

                      {event.diagnosa && (
                        <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-950 rounded border border-amber-200 dark:border-amber-800">
                          <p className="text-xs font-medium text-amber-800 dark:text-amber-200 mb-1">
                            Diagnosa:
                          </p>
                          <p className="text-sm">{event.diagnosa}</p>
                        </div>
                      )}

                      {event.tindakan && (
                        <div className="mt-2 p-2 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800">
                          <p className="text-xs font-medium text-green-800 dark:text-green-200 mb-1">
                            Tindakan:
                          </p>
                          <p className="text-sm">{event.tindakan}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              Data ini menggabungkan semua riwayat medis dari seluruh fasilitas RSAU/Puskesau yang pernah
              dikunjungi oleh pasien (Single Longitudinal Record)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
