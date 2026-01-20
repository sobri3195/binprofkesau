import { useState } from 'react';
import { RiwayatKedinasan, RiwayatPenghargaan, RiwayatKarya } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Edit2, Save, X } from 'lucide-react';
import { 
  RiwayatKedinasanService, 
  RiwayatPenghargaanService, 
  RiwayatKaryaService 
} from '@/services/historyServices';
import { useAuthStore } from '@/store/authStore';

interface HistoryFormsProps {
  personelId: string;
  kedinasan: RiwayatKedinasan[];
  penghargaan: RiwayatPenghargaan[];
  karya: RiwayatKarya[];
  onUpdate: () => void;
}

export function HistoryForms({ personelId, kedinasan, penghargaan, karya, onUpdate }: HistoryFormsProps) {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'kedinasan' | 'penghargaan' | 'karya'>('kedinasan');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    // Kedinasan
    periode: '',
    satuanKedinasan: '',
    jabatanKedinasan: '',
    ketKedinasan: '',
    
    // Penghargaan
    jenisPenghargaan: '',
    tanggalPemberian: '',
    pejabatPemberi: '',
    ketPenghargaan: '',
    
    // Karya
    jenisKarya: '',
    judulKarya: '',
    tanggalKarya: '',
    mediaPublikasi: '',
    ketKarya: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let response;
      
      if (activeTab === 'kedinasan') {
        response = await fetch('/api/riwayat-kedinasan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personelId,
            periode: formData.periode,
            satuan: formData.satuanKedinasan,
            jabatan: formData.jabatanKedinasan,
            ket: formData.ketKedinasan,
          }),
        });
      } else if (activeTab === 'penghargaan') {
        response = await fetch('/api/riwayat-penghargaan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personelId,
            jenis: formData.jenisPenghargaan,
            tanggalPemberian: formData.tanggalPemberian,
            pejabatPemberi: formData.pejabatPemberi,
            ket: formData.ketPenghargaan,
          }),
        });
      } else {
        response = await fetch('/api/riwayat-karya', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personelId,
            jenis: formData.jenisKarya,
            judul: formData.judulKarya,
            tanggal: formData.tanggalKarya,
            mediaPublikasi: formData.mediaPublikasi,
            ket: formData.ketKarya,
          }),
        });
      }

      if (response.ok) {
        setFormData({
          periode: '', satuanKedinasan: '', jabatanKedinasan: '', ketKedinasan: '',
          jenisPenghargaan: '', tanggalPemberian: '', pejabatPemberi: '', ketPenghargaan: '',
          jenisKarya: '', judulKarya: '', tanggalKarya: '', mediaPublikasi: '', ketKarya: ''
        });
        onUpdate();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (id: string, type: 'kedinasan' | 'penghargaan' | 'karya') => {
    setEditingId(id);
    // Implementation would depend on data fetching for edit
  };

  const handleDelete = async (id: string, type: 'kedinasan' | 'penghargaan' | 'karya') => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    try {
      const response = await fetch(`/api/riwayat-${type}/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const TabButton = ({ type, label }: { type: 'kedinasan' | 'penghargaan' | 'karya', label: string }) => (
    <button
      onClick={() => setActiveTab(type)}
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
        activeTab === type
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex flex-wrap">
          <TabButton type="kedinasan" label="Riwayat Kedinasan" />
          <TabButton type="penghargaan" label="Riwayat Penghargaan" />
          <TabButton type="karya" label="Riwayat Karya" />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Kedinasan Form */}
        {activeTab === 'kedinasan' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Periode</label>
              <Input
                type="text"
                placeholder="ex: 2020-01 s.d 2022-12"
                value={formData.periode}
                onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
              <Input
                type="text"
                value={formData.satuanKedinasan}
                onChange={(e) => setFormData({ ...formData, satuanKedinasan: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
              <Input
                type="text"
                value={formData.jabatanKedinasan}
                onChange={(e) => setFormData({ ...formData, jabatanKedinasan: e.target.value })}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
              <Input
                type="text"
                value={formData.ketKedinasan}
                onChange={(e) => setFormData({ ...formData, ketKedinasan: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Penghargaan Form */}
        {activeTab === 'penghargaan' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Penghargaan</label>
              <Input
                type="text"
                placeholder="ex: Satyalencana, Tanda Kehormatan"
                value={formData.jenisPenghargaan}
                onChange={(e) => setFormData({ ...formData, jenisPenghargaan: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pemberian</label>
              <Input
                type="date"
                value={formData.tanggalPemberian}
                onChange={(e) => setFormData({ ...formData, tanggalPemberian: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pejabat Pemberi</label>
              <Input
                type="text"
                value={formData.pejabatPemberi}
                onChange={(e) => setFormData({ ...formData, pejabatPemberi: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
              <Input
                type="text"
                value={formData.ketPenghargaan}
                onChange={(e) => setFormData({ ...formData, ketPenghargaan: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Karya Form */}
        {activeTab === 'karya' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Karya</label>
              <Input
                type="text"
                placeholder="ex: Artikel, Penelitian, Buku"
                value={formData.jenisKarya}
                onChange={(e) => setFormData({ ...formData, jenisKarya: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Karya</label>
              <Input
                type="text"
                value={formData.judulKarya}
                onChange={(e) => setFormData({ ...formData, judulKarya: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
              <Input
                type="date"
                value={formData.tanggalKarya}
                onChange={(e) => setFormData({ ...formData, tanggalKarya: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Media Publikasi</label>
              <Input
                type="text"
                placeholder="ex: Jurnal, Seminar, Website"
                value={formData.mediaPublikasi}
                onChange={(e) => setFormData({ ...formData, mediaPublikasi: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
              <Input
                type="text"
                value={formData.ketKarya}
                onChange={(e) => setFormData({ ...formData, ketKarya: e.target.value })}
              />
            </div>
          </div>
        )}

        <Button type="submit" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Data
        </Button>
      </form>

      {/* Data List */}
      <div className="mt-6">
        {activeTab === 'kedinasan' && (
          <div className="space-y-3">
            {kedinasan.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Belum ada riwayat kedinasan</p>
            ) : (
              kedinasan.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.periode}</h4>
                      <p className="text-sm text-gray-600">{item.satuan} - {item.jabatan}</p>
                      {item.ket && <p className="text-sm text-gray-500 mt-1">{item.ket}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item.id, 'kedinasan')}
                        className="p-1 text-gray-500 hover:text-blue-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, 'kedinasan')}
                        className="p-1 text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'penghargaan' && (
          <div className="space-y-3">
            {penghargaan.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Belum ada riwayat penghargaan</p>
            ) : (
              penghargaan.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.jenis}</h4>
                      <p className="text-sm text-gray-600">
                        {item.tanggalPemberian && new Date(item.tanggalPemberian).toLocaleDateString('id-ID')}
                      </p>
                      {item.pejabatPemberi && (
                        <p className="text-sm text-gray-500">Pejabat: {item.pejabatPemberi}</p>
                      )}
                      {item.ket && <p className="text-sm text-gray-500 mt-1">{item.ket}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item.id, 'penghargaan')}
                        className="p-1 text-gray-500 hover:text-blue-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, 'penghargaan')}
                        className="p-1 text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'karya' && (
          <div className="space-y-3">
            {karya.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Belum ada riwayat karya</p>
            ) : (
              karya.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.judul}</h4>
                      <p className="text-sm text-gray-600">
                        {item.jenis}
                        {item.mediaPublikasi && ` • ${item.mediaPublikasi}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.tanggal && new Date(item.tanggal).toLocaleDateString('id-ID')}
                      </p>
                      {item.ket && <p className="text-sm text-gray-500 mt-1">{item.ket}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item.id, 'karya')}
                        className="p-1 text-gray-500 hover:text-blue-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, 'karya')}
                        className="p-1 text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}