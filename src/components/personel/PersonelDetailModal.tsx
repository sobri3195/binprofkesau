import { useState, useEffect } from 'react';
import { Personel, RiwayatKedinasan, RiwayatPenghargaan, RiwayatKarya } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Trash2, Phone, Award, Briefcase, FileText } from 'lucide-react';
import { v4 as uuidv4 } from '@/services/uuid';

type PersonelDetailUpdate = Pick<
  Personel,
  'noHP' | 'riwayatKedinasan' | 'riwayatPenghargaan' | 'riwayatKarya'
>;

interface PersonelDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PersonelDetailUpdate) => void;
  personel: Personel | null;
  mode: 'view' | 'edit';
  canEdit: boolean;
}

type TabType = 'info' | 'phone' | 'kedinasan' | 'penghargaan' | 'karya';

export function PersonelDetailModal({
  isOpen,
  onClose,
  onSave,
  personel,
  mode: initialMode,
  canEdit,
}: PersonelDetailModalProps) {
  const [mode, setMode] = useState<'view' | 'edit'>(initialMode);
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [formData, setFormData] = useState<Partial<Personel>>({});

  useEffect(() => {
    if (personel) {
      setFormData(personel);
    }
    setMode(canEdit ? initialMode : 'view');
    setActiveTab('info');
  }, [personel, initialMode, isOpen, canEdit]);

  if (!isOpen || !personel) return null;

  const handleSave = () => {
    onSave({
      noHP: formData.noHP,
      riwayatKedinasan: formData.riwayatKedinasan,
      riwayatPenghargaan: formData.riwayatPenghargaan,
      riwayatKarya: formData.riwayatKarya,
    });
    setMode('view');
  };

  const handleCancel = () => {
    setFormData(personel);
    setMode('view');
  };

  // Phone number handlers
  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, noHP: value });
  };

  // Riwayat Kedinasan handlers
  const addKedinasan = () => {
    const newItem: RiwayatKedinasan = {
      id: uuidv4(),
      jabatan: '',
      satuan: '',
      tanggalMulai: '',
    };
    setFormData({
      ...formData,
      riwayatKedinasan: [...(formData.riwayatKedinasan || []), newItem],
    });
  };

  const updateKedinasan = (id: string, updates: Partial<RiwayatKedinasan>) => {
    setFormData({
      ...formData,
      riwayatKedinasan: (formData.riwayatKedinasan || []).map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    });
  };

  const deleteKedinasan = (id: string) => {
    setFormData({
      ...formData,
      riwayatKedinasan: (formData.riwayatKedinasan || []).filter((item) => item.id !== id),
    });
  };

  // Riwayat Penghargaan handlers
  const addPenghargaan = () => {
    const newItem: RiwayatPenghargaan = {
      id: uuidv4(),
      nama: '',
      pemberi: '',
      tanggal: '',
    };
    setFormData({
      ...formData,
      riwayatPenghargaan: [...(formData.riwayatPenghargaan || []), newItem],
    });
  };

  const updatePenghargaan = (id: string, updates: Partial<RiwayatPenghargaan>) => {
    setFormData({
      ...formData,
      riwayatPenghargaan: (formData.riwayatPenghargaan || []).map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    });
  };

  const deletePenghargaan = (id: string) => {
    setFormData({
      ...formData,
      riwayatPenghargaan: (formData.riwayatPenghargaan || []).filter((item) => item.id !== id),
    });
  };

  // Riwayat Karya handlers
  const addKarya = () => {
    const newItem: RiwayatKarya = {
      id: uuidv4(),
      judul: '',
      jenis: '',
      tahun: '',
    };
    setFormData({
      ...formData,
      riwayatKarya: [...(formData.riwayatKarya || []), newItem],
    });
  };

  const updateKarya = (id: string, updates: Partial<RiwayatKarya>) => {
    setFormData({
      ...formData,
      riwayatKarya: (formData.riwayatKarya || []).map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    });
  };

  const deleteKarya = (id: string) => {
    setFormData({
      ...formData,
      riwayatKarya: (formData.riwayatKarya || []).filter((item) => item.id !== id),
    });
  };

  const tabs = [
    { id: 'info' as const, label: 'Info Dasar', icon: FileText },
    { id: 'phone' as const, label: 'Kontak', icon: Phone },
    { id: 'kedinasan' as const, label: 'Riwayat Kedinasan', icon: Briefcase },
    { id: 'penghargaan' as const, label: 'Penghargaan', icon: Award },
    { id: 'karya' as const, label: 'Karya', icon: FileText },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">
              {personel.nama}
            </h2>
            <p className="text-sm text-gray-500">NRP: {personel.nrp}</p>
          </div>
          <div className="flex items-center gap-2">
            {canEdit && (
              <>
                {mode === 'view' ? (
                  <Button onClick={() => setMode('edit')} className="w-full sm:w-auto">
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleCancel} variant="outline" className="flex-1 sm:flex-initial">
                      Batal
                    </Button>
                    <Button onClick={handleSave} className="flex-1 sm:flex-initial">
                      Simpan
                    </Button>
                  </>
                )}
              </>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b overflow-x-auto">
          <div className="flex min-w-max px-4 sm:px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NRP</label>
                  <Input value={personel.nrp} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                  <Input value={personel.nama} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pangkat</label>
                  <Input value={personel.pangkat} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Korps</label>
                  <Input value={personel.korps} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
                  <Input value={personel.satuan} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
                  <Input value={personel.jabatan} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pekerjaan</label>
                  <Input value={personel.pekerjaan} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <Input value={personel.status} disabled />
                </div>
              </div>
            </div>
          )}

          {/* Phone Tab */}
          {activeTab === 'phone' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Phone className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Informasi Kontak</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor HP/Telepon
                </label>
                <Input
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  value={formData.noHP || ''}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  disabled={mode === 'view'}
                  className="text-base"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Masukkan nomor telepon yang bisa dihubungi
                </p>
              </div>
            </div>
          )}

          {/* Riwayat Kedinasan Tab */}
          {activeTab === 'kedinasan' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Riwayat Kedinasan</h3>
                </div>
                {mode === 'edit' && (
                  <Button onClick={addKedinasan} size="sm" className="shrink-0">
                    <Plus className="w-4 h-4 mr-1" />
                    Tambah
                  </Button>
                )}
              </div>

              {(formData.riwayatKedinasan || []).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Belum ada riwayat kedinasan
                </div>
              ) : (
                <div className="space-y-4">
                  {(formData.riwayatKedinasan || []).map((item, index) => (
                    <div key={item.id} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-medium text-gray-500">
                          #{index + 1}
                        </span>
                        {mode === 'edit' && (
                          <Button
                            onClick={() => deleteKedinasan(item.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Jabatan
                          </label>
                          <Input
                            value={item.jabatan}
                            onChange={(e) =>
                              updateKedinasan(item.id, { jabatan: e.target.value })
                            }
                            disabled={mode === 'view'}
                            placeholder="Contoh: Kepala Puskesud"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Satuan
                          </label>
                          <Input
                            value={item.satuan}
                            onChange={(e) =>
                              updateKedinasan(item.id, { satuan: e.target.value })
                            }
                            disabled={mode === 'view'}
                            placeholder="Contoh: Lanud Sultan Hasanuddin"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tanggal Mulai
                          </label>
                          <Input
                            type="date"
                            value={item.tanggalMulai}
                            onChange={(e) =>
                              updateKedinasan(item.id, { tanggalMulai: e.target.value })
                            }
                            disabled={mode === 'view'}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tanggal Selesai
                          </label>
                          <Input
                            type="date"
                            value={item.tanggalSelesai || ''}
                            onChange={(e) =>
                              updateKedinasan(item.id, { tanggalSelesai: e.target.value })
                            }
                            disabled={mode === 'view'}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Riwayat Penghargaan Tab */}
          {activeTab === 'penghargaan' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <h3 className="text-lg font-semibold">Riwayat Penghargaan</h3>
                </div>
                {mode === 'edit' && (
                  <Button onClick={addPenghargaan} size="sm" className="shrink-0">
                    <Plus className="w-4 h-4 mr-1" />
                    Tambah
                  </Button>
                )}
              </div>

              {(formData.riwayatPenghargaan || []).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Belum ada riwayat penghargaan
                </div>
              ) : (
                <div className="space-y-4">
                  {(formData.riwayatPenghargaan || []).map((item, index) => (
                    <div key={item.id} className="p-4 border rounded-lg bg-yellow-50">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-medium text-gray-500">
                          #{index + 1}
                        </span>
                        {mode === 'edit' && (
                          <Button
                            onClick={() => deletePenghargaan(item.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Penghargaan
                          </label>
                          <Input
                            value={item.nama}
                            onChange={(e) =>
                              updatePenghargaan(item.id, { nama: e.target.value })
                            }
                            disabled={mode === 'view'}
                            placeholder="Contoh: Bintang Jalasena"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Pemberi
                            </label>
                            <Input
                              value={item.pemberi}
                              onChange={(e) =>
                                updatePenghargaan(item.id, { pemberi: e.target.value })
                              }
                              disabled={mode === 'view'}
                              placeholder="Contoh: TNI AU"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tanggal
                            </label>
                            <Input
                              type="date"
                              value={item.tanggal}
                              onChange={(e) =>
                                updatePenghargaan(item.id, { tanggal: e.target.value })
                              }
                              disabled={mode === 'view'}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Keterangan
                          </label>
                          <Input
                            value={item.keterangan || ''}
                            onChange={(e) =>
                              updatePenghargaan(item.id, { keterangan: e.target.value })
                            }
                            disabled={mode === 'view'}
                            placeholder="Keterangan tambahan (opsional)"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Riwayat Karya Tab */}
          {activeTab === 'karya' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold">Riwayat Karya</h3>
                </div>
                {mode === 'edit' && (
                  <Button onClick={addKarya} size="sm" className="shrink-0">
                    <Plus className="w-4 h-4 mr-1" />
                    Tambah
                  </Button>
                )}
              </div>

              {(formData.riwayatKarya || []).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Belum ada riwayat karya
                </div>
              ) : (
                <div className="space-y-4">
                  {(formData.riwayatKarya || []).map((item, index) => (
                    <div key={item.id} className="p-4 border rounded-lg bg-green-50">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-medium text-gray-500">
                          #{index + 1}
                        </span>
                        {mode === 'edit' && (
                          <Button
                            onClick={() => deleteKarya(item.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Judul Karya
                          </label>
                          <Input
                            value={item.judul}
                            onChange={(e) =>
                              updateKarya(item.id, { judul: e.target.value })
                            }
                            disabled={mode === 'view'}
                            placeholder="Contoh: Penelitian tentang..."
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Jenis Karya
                            </label>
                            <select
                              value={item.jenis}
                              onChange={(e) =>
                                updateKarya(item.id, { jenis: e.target.value })
                              }
                              disabled={mode === 'view'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                              <option value="">Pilih jenis</option>
                              <option value="Penelitian">Penelitian</option>
                              <option value="Publikasi">Publikasi</option>
                              <option value="Karya Tulis">Karya Tulis</option>
                              <option value="Buku">Buku</option>
                              <option value="Jurnal">Jurnal</option>
                              <option value="Lainnya">Lainnya</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tahun
                            </label>
                            <Input
                              type="number"
                              value={item.tahun}
                              onChange={(e) =>
                                updateKarya(item.id, { tahun: e.target.value })
                              }
                              disabled={mode === 'view'}
                              placeholder="Contoh: 2024"
                              min="1900"
                              max="2100"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Deskripsi
                          </label>
                          <textarea
                            value={item.deskripsi || ''}
                            onChange={(e) =>
                              updateKarya(item.id, { deskripsi: e.target.value })
                            }
                            disabled={mode === 'view'}
                            placeholder="Deskripsi singkat karya (opsional)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
