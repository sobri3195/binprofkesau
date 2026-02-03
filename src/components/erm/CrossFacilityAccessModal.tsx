import { Personel } from '@/types/models';
import { X, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface CrossFacilityAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (alasan: string, keterangan: string) => void;
  personel: Personel | null;
}

export function CrossFacilityAccessModal({
  isOpen,
  onClose,
  onConfirm,
  personel,
}: CrossFacilityAccessModalProps) {
  const [alasanAkses, setAlasanAkses] = useState<string>('');
  const [keterangan, setKeterangan] = useState<string>('');

  if (!isOpen || !personel) return null;

  const handleSubmit = () => {
    if (!alasanAkses) {
      alert('Silakan pilih alasan akses');
      return;
    }
    onConfirm(alasanAkses, keterangan);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold">Akses Lintas Fasilitas</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  Audit Trail Wajib
                </p>
                <p className="text-amber-700 dark:text-amber-300 mt-1">
                  Setiap akses ke data pasien dari fasilitas lain akan dicatat lengkap dengan alasan dan
                  waktu akses untuk keperluan audit.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Personel</label>
              <Input value={personel.nama} readOnly className="bg-gray-100 dark:bg-gray-800" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">NRP</label>
              <Input value={personel.nrp} readOnly className="bg-gray-100 dark:bg-gray-800" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Satuan/Unit saat ini
              </label>
              <Input value={personel.satuan} readOnly className="bg-gray-100 dark:bg-gray-800" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Alasan Akses <span className="text-red-500">*</span>
              </label>
              <select
                value={alasanAkses}
                onChange={(e) => setAlasanAkses(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">-- Pilih Alasan --</option>
                <option value="Rikkes">Pemeriksaan Kesehatan Berkala (Rikkes)</option>
                <option value="Dikbangum">Pendidikan dan Pengembangan Umum (Dikbangum)</option>
                <option value="Rujukan">Rujukan dari Fasilitas Lain</option>
                <option value="Lanjutan">Perawatan/Pengobatan Lanjutan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {alasanAkses === 'Lainnya' && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Keterangan Alasan
                </label>
                <Input
                  placeholder="Jelaskan alasan akses..."
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                />
              </div>
            )}

            <div className="text-xs text-muted-foreground pt-2">
              <p className="font-medium">Data yang akan diakses:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Timeline riwayat pemeriksaan lengkap</li>
                <li>Hasil penunjang (Lab, Radiologi, dll)</li>
                <li>Resume medis dan diagnosa</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 dark:bg-gray-800 flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Batal
          </Button>
          <Button onClick={handleSubmit} className="flex-1" disabled={!alasanAkses}>
            <Shield className="h-4 w-4 mr-2" />
            Akses Data
          </Button>
        </div>
      </div>
    </div>
  );
}
