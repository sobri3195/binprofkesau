import React, { useEffect, useState } from 'react';
import { Pelatihan, Personel, StatusPelaksanaan } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface PelatihanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Pelatihan, 'id' | 'createdAt' | 'updatedAt'>) => void;
  pelatihan: Pelatihan | null;
  personelList: Personel[];
  jenisPelatihanOptions: string[];
}

export function PelatihanFormModal({
  isOpen,
  onClose,
  onSubmit,
  pelatihan,
  personelList,
  jenisPelatihanOptions,
}: PelatihanFormModalProps) {
  const [formData, setFormData] = useState({
    personelId: '',
    jenis: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    sertifikatBerlakuHingga: '',
    statusPelaksanaan: 'Belum Melaksanakan' as StatusPelaksanaan,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (pelatihan) {
      setFormData({
        personelId: pelatihan.personelId,
        jenis: pelatihan.jenis,
        tanggalMulai: pelatihan.tanggalMulai || '',
        tanggalSelesai: pelatihan.tanggalSelesai || '',
        sertifikatBerlakuHingga: pelatihan.sertifikatBerlakuHingga || '',
        statusPelaksanaan: pelatihan.statusPelaksanaan,
      });
    } else {
      setFormData({
        personelId: '',
        jenis: '',
        tanggalMulai: '',
        tanggalSelesai: '',
        sertifikatBerlakuHingga: '',
        statusPelaksanaan: 'Belum Melaksanakan',
      });
    }
    setErrors({});
  }, [pelatihan, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.personelId) {
      newErrors.personelId = 'Personel harus dipilih';
    }
    if (!formData.jenis) {
      newErrors.jenis = 'Jenis pelatihan harus dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      personelId: formData.personelId,
      jenis: formData.jenis as any,
      tanggalMulai: formData.tanggalMulai || undefined,
      tanggalSelesai: formData.tanggalSelesai || undefined,
      sertifikatBerlakuHingga: formData.sertifikatBerlakuHingga || undefined,
      statusPelaksanaan: formData.statusPelaksanaan,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {pelatihan ? 'Edit Data Pelatihan' : 'Tambah Data Pelatihan'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Personel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Personel <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.personelId}
              onChange={(e) => setFormData({ ...formData, personelId: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.personelId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Pilih Personel</option>
              {personelList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama} - {p.nrp} ({p.satuan})
                </option>
              ))}
            </select>
            {errors.personelId && (
              <p className="mt-1 text-sm text-red-500">{errors.personelId}</p>
            )}
          </div>

          {/* Jenis Pelatihan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Pelatihan <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.jenis}
              onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.jenis ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Pilih Jenis Pelatihan</option>
              {jenisPelatihanOptions.map((jenis) => (
                <option key={jenis} value={jenis}>
                  {jenis}
                </option>
              ))}
            </select>
            {errors.jenis && (
              <p className="mt-1 text-sm text-red-500">{errors.jenis}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Mulai
              </label>
              <Input
                type="date"
                value={formData.tanggalMulai}
                onChange={(e) => setFormData({ ...formData, tanggalMulai: e.target.value })}
              />
              <p className="mt-1 text-xs text-gray-500">Opsional</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Selesai
              </label>
              <Input
                type="date"
                value={formData.tanggalSelesai}
                onChange={(e) => setFormData({ ...formData, tanggalSelesai: e.target.value })}
              />
              <p className="mt-1 text-xs text-gray-500">Opsional</p>
            </div>
          </div>

          {/* Berlaku Hingga */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Masa Berlaku Sertifikat
            </label>
            <Input
              type="date"
              value={formData.sertifikatBerlakuHingga}
              onChange={(e) =>
                setFormData({ ...formData, sertifikatBerlakuHingga: e.target.value })
              }
            />
            <p className="mt-1 text-xs text-gray-500">Opsional - Tanggal berakhirnya sertifikat</p>
          </div>

          {/* Status Pelaksanaan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Pelaksanaan <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="statusPelaksanaan"
                  value="Sudah Melaksanakan"
                  checked={formData.statusPelaksanaan === 'Sudah Melaksanakan'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      statusPelaksanaan: e.target.value as StatusPelaksanaan,
                    })
                  }
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">
                  ✅ Sudah Melaksanakan
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="statusPelaksanaan"
                  value="Belum Melaksanakan"
                  checked={formData.statusPelaksanaan === 'Belum Melaksanakan'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      statusPelaksanaan: e.target.value as StatusPelaksanaan,
                    })
                  }
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">
                  ⚪ Belum Melaksanakan
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {pelatihan ? 'Simpan Perubahan' : 'Tambah Pelatihan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
