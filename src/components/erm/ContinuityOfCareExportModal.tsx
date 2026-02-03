import { Personel } from '@/types/models';
import { X, Download, FileText, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface ContinuityOfCareExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (fasilitasTujuan: string, catatan: string) => void;
  personel: Personel | null;
}

export function ContinuityOfCareExportModal({
  isOpen,
  onClose,
  onConfirm,
  personel,
}: ContinuityOfCareExportModalProps) {
  const [fasilitasTujuan, setFasilitasTujuan] = useState<string>('');
  const [catatan, setCatatan] = useState<string>('');

  if (!isOpen || !personel) return null;

  const handleSubmit = () => {
    if (!fasilitasTujuan) {
      alert('Silakan isi fasilitas tujuan');
      return;
    }
    onConfirm(fasilitasTujuan, catatan);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold">Export Continuity of Care</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 dark:text-blue-200">
                  Ringkasan Medis Portabel
                </p>
                <p className="text-blue-700 dark:text-blue-300 mt-1">
                  Export ringkasan medis lengkap untuk dibawa ke fasilitas lain. Termasuk riwayat
                  diagnosa, tindakan, obat, dan hasil Rikkes terakhir.
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
              <label className="block text-sm font-medium mb-1">Satuan Saat Ini</label>
              <Input value={personel.satuan} readOnly className="bg-gray-100 dark:bg-gray-800" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Fasilitas Tujuan <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Mis: RSAU Dr. M. Salamun"
                value={fasilitasTujuan}
                onChange={(e) => setFasilitasTujuan(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Fasilitas kesehatan yang dituju setelah pemindahan
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Catatan Pemindahan (Opsional)
              </label>
              <textarea
                placeholder="Tambahkan catatan khusus untuk fasilitas tujuan..."
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
              />
            </div>

            <div className="text-xs text-muted-foreground pt-2">
              <p className="font-medium">Ringkasan akan mencakup:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Ringkasan kesehatan umum</li>
                <li>Riwayat diagnosa (maks 20 terbaru)</li>
                <li>Riwayat tindakan medis</li>
                <li>Riwayat obat yang pernah diberikan</li>
                <li>Hasil Rikkes terakhir</li>
                <li>Informasi alergi (jika ada)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 dark:bg-gray-800 flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Batal
          </Button>
          <Button onClick={handleSubmit} className="flex-1" disabled={!fasilitasTujuan}>
            <FileText className="h-4 w-4 mr-2" />
            Export Ringkasan
          </Button>
        </div>
      </div>
    </div>
  );
}
