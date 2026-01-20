import React, { useEffect, useMemo, useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type {
  Pangkat,
  Personel,
  RiwayatKaryaItem,
  RiwayatKedinasanItem,
  RiwayatPenghargaanItem,
  User,
} from '@/types/models';

interface PersonelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Personel, 'id' | 'createdAt' | 'updatedAt'>) => void;
  personel: Personel | null;
  existingPersonel: Personel[];
  currentUser: User | null;
}

type PersonelFormState = {
  nrp: string;
  nama: string;
  pangkat: Pangkat;
  korps: string;
  satuan: string;
  status: string;
  jabatan: string;
  pekerjaan: string;
  nomorHape: string;
  riwayatKedinasan: RiwayatKedinasanItem[];
  riwayatPenghargaan: RiwayatPenghargaanItem[];
  riwayatKarya: RiwayatKaryaItem[];
};

const emptyKedinasan = (): RiwayatKedinasanItem => ({
  satuan: '',
  jabatan: '',
  tahunMulai: '',
  tahunSelesai: '',
  keterangan: '',
});

const emptyPenghargaan = (): RiwayatPenghargaanItem => ({
  nama: '',
  tahun: '',
  keterangan: '',
});

const emptyKarya = (): RiwayatKaryaItem => ({
  judul: '',
  tahun: '',
  keterangan: '',
});

export function PersonelFormModal({
  isOpen,
  onClose,
  onSubmit,
  personel,
  existingPersonel,
  currentUser,
}: PersonelFormModalProps) {
  const isAdminSatuan = currentUser?.role === 'AdminSatuan' && !!currentUser.satuan;

  const defaultSatuan = useMemo(() => {
    if (isAdminSatuan) return currentUser?.satuan || '';
    return '';
  }, [currentUser?.satuan, isAdminSatuan]);

  const [formData, setFormData] = useState<PersonelFormState>({
    nrp: '',
    nama: '',
    pangkat: 'Tamtama',
    korps: 'Kesehatan',
    satuan: defaultSatuan,
    status: 'Aktif',
    jabatan: '',
    pekerjaan: '',
    nomorHape: '',
    riwayatKedinasan: [],
    riwayatPenghargaan: [],
    riwayatKarya: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;

    if (personel) {
      setFormData({
        nrp: personel.nrp,
        nama: personel.nama,
        pangkat: personel.pangkat,
        korps: personel.korps,
        satuan: isAdminSatuan ? currentUser?.satuan || personel.satuan : personel.satuan,
        status: personel.status,
        jabatan: personel.jabatan,
        pekerjaan: personel.pekerjaan,
        nomorHape: personel.nomorHape || '',
        riwayatKedinasan: personel.riwayatKedinasan || [],
        riwayatPenghargaan: personel.riwayatPenghargaan || [],
        riwayatKarya: personel.riwayatKarya || [],
      });
    } else {
      setFormData({
        nrp: '',
        nama: '',
        pangkat: 'Tamtama',
        korps: 'Kesehatan',
        satuan: defaultSatuan,
        status: 'Aktif',
        jabatan: '',
        pekerjaan: '',
        nomorHape: '',
        riwayatKedinasan: [],
        riwayatPenghargaan: [],
        riwayatKarya: [],
      });
    }

    setErrors({});
  }, [currentUser?.satuan, defaultSatuan, isAdminSatuan, isOpen, personel]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nrp.trim()) newErrors.nrp = 'NRP wajib diisi';
    if (!formData.nama.trim()) newErrors.nama = 'Nama wajib diisi';
    if (!formData.korps.trim()) newErrors.korps = 'Korps wajib diisi';
    if (!formData.satuan.trim()) newErrors.satuan = 'Satuan wajib diisi';
    if (!formData.status.trim()) newErrors.status = 'Status wajib diisi';
    if (!formData.jabatan.trim()) newErrors.jabatan = 'Jabatan wajib diisi';
    if (!formData.pekerjaan.trim()) newErrors.pekerjaan = 'Pekerjaan wajib diisi';

    const normalizedNrp = formData.nrp.trim();
    const isDuplicate = existingPersonel.some((p) => {
      if (personel && p.id === personel.id) return false;
      return p.nrp === normalizedNrp;
    });

    if (isDuplicate) {
      newErrors.nrp = 'NRP sudah digunakan oleh personel lain';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const compactRiwayatKedinasan = (items: RiwayatKedinasanItem[]) =>
    items.filter((i) =>
      [i.satuan, i.jabatan, i.tahunMulai, i.tahunSelesai, i.keterangan].some((v) =>
        (v || '').toString().trim()
      )
    );

  const compactRiwayatPenghargaan = (items: RiwayatPenghargaanItem[]) =>
    items.filter((i) => [i.nama, i.tahun, i.keterangan].some((v) => (v || '').toString().trim()));

  const compactRiwayatKarya = (items: RiwayatKaryaItem[]) =>
    items.filter((i) => [i.judul, i.tahun, i.keterangan].some((v) => (v || '').toString().trim()));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      nrp: formData.nrp.trim(),
      nama: formData.nama.trim(),
      pangkat: formData.pangkat,
      korps: formData.korps.trim(),
      satuan: (isAdminSatuan ? currentUser?.satuan : formData.satuan)?.trim() || '',
      status: formData.status.trim(),
      jabatan: formData.jabatan.trim(),
      pekerjaan: formData.pekerjaan.trim(),
      nomorHape: formData.nomorHape.trim() || undefined,
      riwayatKedinasan: compactRiwayatKedinasan(formData.riwayatKedinasan),
      riwayatPenghargaan: compactRiwayatPenghargaan(formData.riwayatPenghargaan),
      riwayatKarya: compactRiwayatKarya(formData.riwayatKarya),
      keluhanBulanan: personel?.keluhanBulanan || [],
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {personel ? 'Edit Data Personel' : 'Tambah Data Personel'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          {/* Data dasar */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Data Dasar</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NRP <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.nrp}
                  onChange={(e) => setFormData({ ...formData, nrp: e.target.value })}
                  placeholder="Contoh: 531234"
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
                  placeholder="Nama lengkap"
                />
                {errors.nama && <p className="mt-1 text-sm text-red-500">{errors.nama}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pangkat <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.pangkat}
                  onChange={(e) => setFormData({ ...formData, pangkat: e.target.value as Pangkat })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
                >
                  <option value="Tamtama">Tamtama</option>
                  <option value="Bintara">Bintara</option>
                  <option value="Perwira">Perwira</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Korps <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.korps}
                  onChange={(e) => setFormData({ ...formData, korps: e.target.value })}
                  placeholder="Contoh: Kesehatan"
                />
                {errors.korps && <p className="mt-1 text-sm text-red-500">{errors.korps}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Satuan <span className="text-red-500">*</span>
                </label>
                <Input
                  value={isAdminSatuan ? currentUser?.satuan || '' : formData.satuan}
                  onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                  disabled={isAdminSatuan}
                  placeholder="Nama satuan"
                />
                {errors.satuan && <p className="mt-1 text-sm text-red-500">{errors.satuan}</p>}
                {isAdminSatuan && (
                  <p className="mt-1 text-xs text-gray-500">Satuan dikunci sesuai akun Admin Satuan</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Dinas Belajar">Dinas Belajar</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
                {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jabatan <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.jabatan}
                  onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                  placeholder="Jabatan saat ini"
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
                  placeholder="Contoh: Dokter / Perawat"
                />
                {errors.pekerjaan && <p className="mt-1 text-sm text-red-500">{errors.pekerjaan}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor HP</label>
                <Input
                  value={formData.nomorHape}
                  onChange={(e) => setFormData({ ...formData, nomorHape: e.target.value })}
                  placeholder="Contoh: 0812xxxxxxx"
                />
              </div>
            </div>
          </div>

          {/* Riwayat Kedinasan */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-gray-900">Riwayat Kedinasan</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    riwayatKedinasan: [...prev.riwayatKedinasan, emptyKedinasan()],
                  }))
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                Tambah
              </Button>
            </div>

            {formData.riwayatKedinasan.length === 0 ? (
              <p className="text-sm text-gray-500">Belum ada riwayat kedinasan</p>
            ) : (
              <div className="space-y-3">
                {formData.riwayatKedinasan.map((item, idx) => (
                  <div key={idx} className="rounded-md border p-4 space-y-3">
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            riwayatKedinasan: prev.riwayatKedinasan.filter((_, i) => i !== idx),
                          }))
                        }
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Satuan</label>
                        <Input
                          value={item.satuan}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              riwayatKedinasan: prev.riwayatKedinasan.map((it, i) =>
                                i === idx ? { ...it, satuan: e.target.value } : it
                              ),
                            }))
                          }
                          placeholder="Nama satuan"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Jabatan</label>
                        <Input
                          value={item.jabatan}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              riwayatKedinasan: prev.riwayatKedinasan.map((it, i) =>
                                i === idx ? { ...it, jabatan: e.target.value } : it
                              ),
                            }))
                          }
                          placeholder="Jabatan"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tahun Mulai</label>
                        <Input
                          type="number"
                          value={item.tahunMulai || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              riwayatKedinasan: prev.riwayatKedinasan.map((it, i) =>
                                i === idx ? { ...it, tahunMulai: e.target.value } : it
                              ),
                            }))
                          }
                          placeholder="YYYY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tahun Selesai</label>
                        <Input
                          type="number"
                          value={item.tahunSelesai || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              riwayatKedinasan: prev.riwayatKedinasan.map((it, i) =>
                                i === idx ? { ...it, tahunSelesai: e.target.value } : it
                              ),
                            }))
                          }
                          placeholder="YYYY"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                        <Input
                          value={item.keterangan || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              riwayatKedinasan: prev.riwayatKedinasan.map((it, i) =>
                                i === idx ? { ...it, keterangan: e.target.value } : it
                              ),
                            }))
                          }
                          placeholder="Opsional"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Riwayat Penghargaan */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-gray-900">Riwayat Penghargaan</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    riwayatPenghargaan: [...prev.riwayatPenghargaan, emptyPenghargaan()],
                  }))
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                Tambah
              </Button>
            </div>

            {formData.riwayatPenghargaan.length === 0 ? (
              <p className="text-sm text-gray-500">Belum ada riwayat penghargaan</p>
            ) : (
              <div className="space-y-3">
                {formData.riwayatPenghargaan.map((item, idx) => (
                  <div key={idx} className="rounded-md border p-4 space-y-3">
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            riwayatPenghargaan: prev.riwayatPenghargaan.filter((_, i) => i !== idx),
                          }))
                        }
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama Penghargaan</label>
                        <Input
                          value={item.nama}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              riwayatPenghargaan: prev.riwayatPenghargaan.map((it, i) =>
                                i === idx ? { ...it, nama: e.target.value } : it
                              ),
                            }))
                          }
                          placeholder="Contoh: Satya Lencana"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
                        <Input
                          type="number"
                          value={item.tahun || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              riwayatPenghargaan: prev.riwayatPenghargaan.map((it, i) =>
                                i === idx ? { ...it, tahun: e.target.value } : it
                              ),
                            }))
                          }
                          placeholder="YYYY"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                        <Input
                          value={item.keterangan || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              riwayatPenghargaan: prev.riwayatPenghargaan.map((it, i) =>
                                i === idx ? { ...it, keterangan: e.target.value } : it
                              ),
                            }))
                          }
                          placeholder="Opsional"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Riwayat Karya */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-gray-900">Riwayat Karya</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    riwayatKarya: [...prev.riwayatKarya, emptyKarya()],
                  }))
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                Tambah
              </Button>
            </div>

            {formData.riwayatKarya.length === 0 ? (
              <p className="text-sm text-gray-500">Belum ada riwayat karya</p>
            ) : (
              <div className="space-y-3">
                {formData.riwayatKarya.map((item, idx) => (
                  <div key={idx} className="rounded-md border p-4 space-y-3">
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            riwayatKarya: prev.riwayatKarya.filter((_, i) => i !== idx),
                          }))
                        }
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Judul Karya</label>
                        <Input
                          value={item.judul}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              riwayatKarya: prev.riwayatKarya.map((it, i) =>
                                i === idx ? { ...it, judul: e.target.value } : it
                              ),
                            }))
                          }
                          placeholder="Contoh: Publikasi / Artikel / Penelitian"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
                        <Input
                          type="number"
                          value={item.tahun || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              riwayatKarya: prev.riwayatKarya.map((it, i) =>
                                i === idx ? { ...it, tahun: e.target.value } : it
                              ),
                            }))
                          }
                          placeholder="YYYY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                        <Input
                          value={item.keterangan || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              riwayatKarya: prev.riwayatKarya.map((it, i) =>
                                i === idx ? { ...it, keterangan: e.target.value } : it
                              ),
                            }))
                          }
                          placeholder="Opsional"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Batal
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              {personel ? 'Simpan Perubahan' : 'Tambah Personel'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
