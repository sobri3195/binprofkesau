import { Personel } from '@/types/models';
import { X, Stethoscope, CheckCircle, AlertCircle, FileText, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { rikkesService } from '@/services/rikkes';
import { useAuthStore } from '@/store/authStore';

interface RikkesModalProps {
  isOpen: boolean;
  onClose: () => void;
  personel: Personel | null;
}

export function RikkesModal({ isOpen, onClose, personel }: RikkesModalProps) {
  const { user } = useAuthStore();
  const [jenisRikkes, setJenisRikkes] = useState<'Periodik' | 'Dinas Luar' | 'Lainnya'>('Periodik');
  const [tahunRikkes, setTahunRikkes] = useState(new Date().getFullYear().toString());

  const [hasilPenunjang, setHasilPenunjang] = useState({
    labDarah: '',
    labUrine: '',
    rontgen: '',
    ekg: '',
    audiometri: '',
    tesNarkoba: '',
  });

  const [kesehatan, setKesehatan] = useState({
    umum: 'Sehat',
    mata: 'Sehat',
    gigi: 'Sehat',
    tht: 'Sehat',
    jiwa: 'Sehat',
  });

  const [kesimpulan, setKesimpulan] = useState<'Layak' | 'Tidak Layak' | 'Perlu Observasi'>('Layak');
  const [rekomendasi, setRekomendasi] = useState('');

  if (!isOpen || !personel) return null;

  const handleSubmit = () => {
    if (!user) return;

    rikkesService.create(
      {
        personelId: personel.id,
        satuan: user.satuan || personel.satuan,
        tahunRikkes,
        jenisRikkes,
        hasilPenunjang: {
          labDarah: hasilPenunjang.labDarah || undefined,
          labUrine: hasilPenunjang.labUrine || undefined,
          rontgen: hasilPenunjang.rontgen || undefined,
          ekg: hasilPenunjang.ekg || undefined,
          audiometri: hasilPenunjang.audiometri || undefined,
          tesNarkoba: hasilPenunjang.tesNarkoba || undefined,
        },
        kesehatanUmum: kesehatan.umum as any,
        kesehatanMata: kesehatan.mata as any,
        kesehatanGigi: kesehatan.gigi as any,
        kesehatanTHT: kesehatan.tht as any,
        kesehatanJiwa: kesehatan.jiwa as any,
        kesimpulan: kesimpulan as any,
        rekomendasi: rekomendasi || undefined,
        dokterId: user.id,
        status: 'Selesai',
      },
      user.id
    );

    alert('Data Rikkes berhasil disimpan!');
    onClose();
  };

  const handleAutoGenerateResume = () => {
    const resume = rikkesService.generateResumeMedis({
      personelId: personel.id,
      satuan: user?.satuan || personel.satuan,
      tahunRikkes,
      jenisRikkes,
      hasilPenunjang: {
        labDarah: hasilPenunjang.labDarah || undefined,
        labUrine: hasilPenunjang.labUrine || undefined,
        rontgen: hasilPenunjang.rontgen || undefined,
        ekg: hasilPenunjang.ekg || undefined,
        audiometri: hasilPenunjang.audiometri || undefined,
        tesNarkoba: hasilPenunjang.tesNarkoba || undefined,
      },
      kesehatanUmum: kesehatan.umum as any,
      kesehatanMata: kesehatan.mata as any,
      kesehatanGigi: kesehatan.gigi as any,
      kesehatanTHT: kesehatan.tht as any,
      kesehatanJiwa: kesehatan.jiwa as any,
      kesimpulan: kesimpulan as any,
      rekomendasi: rekomendasi || undefined,
      dokterId: user?.id,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    alert('Resume Medis Rikkes:\n\n' + resume);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold">Mode Rikkes</h2>
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
            <div className="flex items-start gap-2">
              <Stethoscope className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">Pemeriksaan Kesehatan Berkala</p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  {personel.nama} ({personel.nrp}) - {personel.pangkat}
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Jenis Rikkes</label>
              <select
                value={jenisRikkes}
                onChange={(e) => setJenisRikkes(e.target.value as any)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="Periodik">Periodik (Tahunan)</option>
                <option value="Dinas Luar">Dinas Luar</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tahun Rikkes</label>
              <Input
                type="number"
                value={tahunRikkes}
                onChange={(e) => setTahunRikkes(e.target.value)}
              />
            </div>
          </div>

          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Hasil Pemeriksaan Penunjang
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Lab Darah</label>
                <Input
                  placeholder="Hasil pemeriksaan lab darah..."
                  value={hasilPenunjang.labDarah}
                  onChange={(e) => setHasilPenunjang({ ...hasilPenunjang, labDarah: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Lab Urine</label>
                <Input
                  placeholder="Hasil pemeriksaan lab urine..."
                  value={hasilPenunjang.labUrine}
                  onChange={(e) => setHasilPenunjang({ ...hasilPenunjang, labUrine: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rontgen</label>
                <Input
                  placeholder="Hasil pemeriksaan rontgen..."
                  value={hasilPenunjang.rontgen}
                  onChange={(e) => setHasilPenunjang({ ...hasilPenunjang, rontgen: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">EKG</label>
                <Input
                  placeholder="Hasil pemeriksaan EKG..."
                  value={hasilPenunjang.ekg}
                  onChange={(e) => setHasilPenunjang({ ...hasilPenunjang, ekg: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Audiometri</label>
                <Input
                  placeholder="Hasil pemeriksaan audiometri..."
                  value={hasilPenunjang.audiometri}
                  onChange={(e) => setHasilPenunjang({ ...hasilPenunjang, audiometri: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tes Narkoba</label>
                <Input
                  placeholder="Hasil tes narkoba..."
                  value={hasilPenunjang.tesNarkoba}
                  onChange={(e) => setHasilPenunjang({ ...hasilPenunjang, tesNarkoba: e.target.value })}
                />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Status Kesehatan
            </h3>
            <div className="space-y-3">
              {[
                { key: 'umum', label: 'Kesehatan Umum' },
                { key: 'mata', label: 'Kesehatan Mata' },
                { key: 'gigi', label: 'Kesehatan Gigi' },
                { key: 'tht', label: 'Kesehatan THT' },
                { key: 'jiwa', label: 'Kesehatan Jiwa' },
              ].map((field) => (
                <div key={field.key} className="flex items-center gap-3">
                  <label className="text-sm font-medium w-32">{field.label}</label>
                  <select
                    value={kesehatan[field.key as keyof typeof kesehatan]}
                    onChange={(e) => setKesehatan({ ...kesehatan, [field.key]: e.target.value })}
                    className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                  >
                    <option value="Sehat">Sehat</option>
                    <option value="Tidak Sehat">Tidak Sehat</option>
                    <option value="Sehat dengan Catatan">Sehat dengan Catatan</option>
                  </select>
                  {kesehatan[field.key as keyof typeof kesehatan] !== 'Sehat' && (
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">Kesimpulan & Rekomendasi</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Kesimpulan</label>
                <select
                  value={kesimpulan}
                  onChange={(e) => setKesimpulan(e.target.value as any)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Layak">Layak</option>
                  <option value="Tidak Layak">Tidak Layak</option>
                  <option value="Perlu Observasi">Perlu Observasi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rekomendasi</label>
                <textarea
                  placeholder="Masukkan rekomendasi perawatan atau tindak lanjut..."
                  value={rekomendasi}
                  onChange={(e) => setRekomendasi(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="p-4 border-t bg-gray-50 dark:bg-gray-800 flex gap-2">
          <Button variant="outline" onClick={handleAutoGenerateResume} className="flex-1">
            <Printer className="h-4 w-4 mr-2" />
            Generate Resume
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Batal
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            <CheckCircle className="h-4 w-4 mr-2" />
            Simpan Rikkes
          </Button>
        </div>
      </div>
    </div>
  );
}
