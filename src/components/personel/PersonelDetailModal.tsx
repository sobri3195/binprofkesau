import { useState, useEffect } from 'react';
import { Personel } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Save, Phone } from 'lucide-react';
import { HistoryForms } from './HistoryForms';
import { RiwayatKedinasan, RiwayatPenghargaan, RiwayatKarya } from '@/types/models';

interface PersonelDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  personel: Personel | null;
  onUpdate: () => void;
}

export function PersonelDetailModal({ isOpen, onClose, personel, onUpdate }: PersonelDetailModalProps) {
  const [formData, setFormData] = useState({
    nomorHp: '',
  });
  
  const [historyData, setHistoryData] = useState<{
    kedinasan: RiwayatKedinasan[];
    penghargaan: RiwayatPenghargaan[];
    karya: RiwayatKarya[];
  }>({
    kedinasan: [],
    penghargaan: [],
    karya: [],
  });

  useEffect(() => {
    if (personel) {
      setFormData({
        nomorHp: personel.nomorHp || '',
      });
      fetchHistoryData();
    }
  }, [personel]);

  const fetchHistoryData = async () => {
    if (!personel) return;
    
    try {
      const [kedinasanRes, penghargaanRes, karyaRes] = await Promise.all([
        fetch(`/api/riwayat-kedinasan?personelId=${personel.id}`),
        fetch(`/api/riwayat-penghargaan?personelId=${personel.id}`),
        fetch(`/api/riwayat-karya?personelId=${personel.id}`),
      ]);
      
      const kedinasan = kedinasanRes.ok ? await kedinasanRes.json() : [];
      const penghargaan = penghargaanRes.ok ? await penghargaanRes.json() : [];
      const karya = karyaRes.ok ? await karyaRes.json() : [];
      
      setHistoryData({ kedinasan, penghargaan, karya });
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!personel) return;
    
    try {
      const response = await fetch(`/api/personel/${personel.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomorHp: formData.nomorHp,
        }),
      });
      
      if (response.ok) {
        onUpdate();
        alert('Data berhasil disimpan!');
      }
    } catch (error) {
      console.error('Error updating personel:', error);
      alert('Terjadi kesalahan!');
    }
  };

  if (!isOpen || !personel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gray-50">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {personel.nama} - {personel.nrp}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs or Content Area */}
        <div className="overflow-y-auto">
          {/* Personel Info - Always visible */}
          <div className="p-4 sm:p-6 border-b bg-blue-50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-600" />
              Informasi Kontak
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Handphone
                </label>
                <Input
                  type="tel"
                  placeholder="ex: 081234567890"
                  value={formData.nomorHp}
                  onChange={(e) => setFormData({ ...formData, nomorHp: e.target.value })}
                  className="max-w-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Format: 08xxxxxxxxxx (tanpa spasi atau tanda baca)</p>
              </div>
              
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Simpan Nomor HP
              </Button>
            </form>
          </div>

          {/* History Tabs */}
          <div className="p-4 sm:p-6">
            <HistoryForms
              personelId={personel.id}
              kedinasan={historyData.kedinasan}
              penghargaan={historyData.penghargaan}
              karya={historyData.karya}
              onUpdate={() => {
                onUpdate();
                fetchHistoryData();
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 sm:p-6 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="text-sm text-gray-500">
              Terakhir diperbarui: {new Date(personel.updatedAt).toLocaleString('id-ID')}
            </div>
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}