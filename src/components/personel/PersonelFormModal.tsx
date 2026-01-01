import { useEffect, useState } from 'react';
import { Personel, Pangkat } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface PersonelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Personel, 'id' | 'createdAt' | 'updatedAt'>) => void;
  personel: Personel | null;
}

const pangkatOptions: Pangkat[] = ['Tamtama', 'Bintara', 'Perwira'];
const statusOptions = ['Aktif', 'Dinas Belajar', 'Nonaktif'];

export function PersonelFormModal({
  isOpen,
  onClose,
  onSubmit,
  personel,
}: PersonelFormModalProps) {
  const [formData, setFormData] = useState({
    nrp: '',
    nama: '',
    pangkat: 'Tamtama' as Pangkat,
    korps: '',
    satuan: '',
    status: 'Aktif',
    jabatan: '',
    pekerjaan: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (personel) {
      setFormData({
        nrp: personel.nrp,
        nama: personel.nama,
        pangkat: personel.pangkat,
        korps: personel.korps,
        satuan: personel.satuan,
        status: personel.status,
        jabatan: personel.jabatan,
        pekerjaan: personel.pekerjaan,
      });
    } else {
      setFormData({
        nrp: '',
        nama: '',
        pangkat: 'Tamtama',
        korps: '',
        satuan: '',
        status: 'Aktif',
        jabatan: '',
        pekerjaan: '',
      });
    }
    setErrors({});
  }, [personel, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nrp.trim()) newErrors.nrp = 'NRP wajib diisi';
    if (!formData.nama.trim()) newErrors.nama = 'Nama wajib diisi';
    if (!formData.korps.trim()) newErrors.korps = 'Korps wajib diisi';
    if (!formData.satuan.trim()) newErrors.satuan = 'Satuan wajib diisi';
    if (!formData.jabatan.trim()) newErrors.jabatan = 'Jabatan wajib diisi';
    if (!formData.pekerjaan.trim()) newErrors.pekerjaan = 'Pekerjaan wajib diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) return;

    onSubmit({
      nrp: formData.nrp.trim(),
      nama: formData.nama.trim(),
      pangkat: formData.pangkat,
      korps: formData.korps.trim(),
      satuan: formData.satuan.trim(),
      status: formData.status.trim(),
      jabatan: formData.jabatan.trim(),
      pekerjaan: formData.pekerjaan.trim(),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {personel ? 'Edit Data Personel' : 'Tambah Data Personel'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NRP <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.nrp}
                onChange={(e) => setFormData({ ...formData, nrp: e.target.value })}
                className={errors.nrp ? 'border-red-500' : ''}
              />
              {errors.nrp && <p className="mt-1 text-sm text-red-500">{errors.nrp}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className={errors.nama ? 'border-red-500' : ''}
              />
              {errors.nama && <p className="mt-1 text-sm text-red-500">{errors.nama}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pangkat <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.pangkat}
                onChange={(e) =>
                  setFormData({ ...formData, pangkat: e.target.value as Pangkat })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {pangkatOptions.map((pangkat) => (
                  <option key={pangkat} value={pangkat}>
                    {pangkat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Korps <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.korps}
                onChange={(e) => setFormData({ ...formData, korps: e.target.value })}
                className={errors.korps ? 'border-red-500' : ''}
              />
              {errors.korps && <p className="mt-1 text-sm text-red-500">{errors.korps}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Satuan <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.satuan}
                onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                className={errors.satuan ? 'border-red-500' : ''}
              />
              {errors.satuan && <p className="mt-1 text-sm text-red-500">{errors.satuan}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jabatan <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.jabatan}
                onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                className={errors.jabatan ? 'border-red-500' : ''}
              />
              {errors.jabatan && <p className="mt-1 text-sm text-red-500">{errors.jabatan}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pekerjaan <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.pekerjaan}
                onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                className={errors.pekerjaan ? 'border-red-500' : ''}
              />
              {errors.pekerjaan && (
                <p className="mt-1 text-sm text-red-500">{errors.pekerjaan}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {personel ? 'Simpan Perubahan' : 'Tambah Personel'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
