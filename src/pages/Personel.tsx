import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Repository } from '@/services/repository';
import { ExportService } from '@/services/export';
import { Personel, Pangkat } from '@/types/models';
import { useAuthStore } from '@/store/authStore';
import { PersonelFormModal } from '@/components/personel/PersonelFormModal';
import { Plus, Download, Search, Pencil, Trash2 } from 'lucide-react';

const personelRepo = new Repository<Personel>('personel', 'Personel');

export function PersonelPage() {
  const { user } = useAuthStore();
  const [personel, setPersonel] = useState<Personel[]>(personelRepo.getAll());
  const [search, setSearch] = useState('');
  const [filterPangkat, setFilterPangkat] = useState<Pangkat | ''>('');

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPersonel, setEditingPersonel] = useState<Personel | null>(null);

  const canCreate = user?.role === 'SuperAdmin' || user?.role === 'AdminSatuan' || user?.role === 'Operator';
  const canEdit = user?.role === 'SuperAdmin' || user?.role === 'AdminSatuan';
  const canDelete = user?.role === 'SuperAdmin' || user?.role === 'AdminSatuan';

  const handleAdd = () => {
    setEditingPersonel(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (p: Personel) => {
    setEditingPersonel(p);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (data: Omit<Personel, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    const normalizedData =
      user.role === 'AdminSatuan' && user.satuan ? { ...data, satuan: user.satuan } : data;

    if (editingPersonel) {
      personelRepo.update(editingPersonel.id, normalizedData, user.id);
    } else {
      personelRepo.create(normalizedData, user.id);
    }

    setPersonel(personelRepo.getAll());
    setIsFormModalOpen(false);
    setEditingPersonel(null);
  };

  const filteredPersonel = useMemo(() => {
    return personel.filter(p => {
      const matchesSearch = 
        p.nama.toLowerCase().includes(search.toLowerCase()) ||
        p.nrp.includes(search);
      const matchesPangkat = !filterPangkat || p.pangkat === filterPangkat;
      const matchesSatuan = user?.role === 'AdminSatuan' 
        ? p.satuan === user.satuan 
        : true;

      return matchesSearch && matchesPangkat && matchesSatuan;
    });
  }, [personel, search, filterPangkat, user]);

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data personel ini?')) {
      personelRepo.delete(id, user!.id);
      setPersonel(personelRepo.getAll());
    }
  };

  const handleExportCSV = () => {
    ExportService.exportToCSV(
      filteredPersonel,
      'personel-binprofkes',
      ['nrp', 'nama', 'nomorHape', 'pangkat', 'korps', 'satuan', 'jabatan', 'pekerjaan', 'status']
    );
  };

  const handleExportExcel = () => {
    ExportService.exportToExcel(
      filteredPersonel,
      'personel-binprofkes',
      ['nrp', 'nama', 'nomorHape', 'pangkat', 'korps', 'satuan', 'jabatan', 'pekerjaan', 'status']
    );
  };

  const handleExportPDF = () => {
    ExportService.exportToPDF(
      filteredPersonel,
      'Personel BINPROFKES',
      [
        { header: 'NRP', dataKey: 'nrp' },
        { header: 'Nama', dataKey: 'nama' },
        { header: 'No. HP', dataKey: 'nomorHape' },
        { header: 'Pangkat', dataKey: 'pangkat' },
        { header: 'Korps', dataKey: 'korps' },
        { header: 'Satuan', dataKey: 'satuan' },
        { header: 'Jabatan', dataKey: 'jabatan' },
        { header: 'Pekerjaan', dataKey: 'pekerjaan' },
        { header: 'Status', dataKey: 'status' },
      ]
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Personel</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Kelola data tenaga kesehatan TNI AU
          </p>
        </div>
        {canCreate && (
          <Button className="w-full sm:w-auto" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Personel
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Personel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari nama atau NRP..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <select
                value={filterPangkat}
                onChange={(e) => setFilterPangkat(e.target.value as Pangkat | '')}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm w-full sm:w-auto"
              >
                <option value="">Semua Pangkat</option>
                <option value="Tamtama">Tamtama</option>
                <option value="Bintara">Bintara</option>
                <option value="Perwira">Perwira</option>
              </select>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              <Button variant="outline" size="sm" onClick={handleExportCSV} className="shrink-0">
                <Download className="mr-1 sm:mr-2 h-4 w-4" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportExcel} className="shrink-0">
                <Download className="mr-1 sm:mr-2 h-4 w-4" />
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPDF} className="shrink-0">
                <Download className="mr-1 sm:mr-2 h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">NRP</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Nama</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">No. HP</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Pangkat</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Korps</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Satuan</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Jabatan</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Pekerjaan</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    {(canEdit || canDelete) && (
                      <th className="px-4 py-3 text-right text-sm font-medium">Aksi</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredPersonel.length === 0 ? (
                    <tr>
                      <td
                        colSpan={(canEdit || canDelete) ? 10 : 9}
                        className="px-4 py-8 text-center text-sm text-muted-foreground"
                      >
                        Tidak ada data personel
                      </td>
                    </tr>
                  ) : (
                    filteredPersonel.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm">{p.nrp}</td>
                        <td className="px-4 py-3 text-sm font-medium">{p.nama}</td>
                        <td className="px-4 py-3 text-sm">{p.nomorHape || '-'}</td>
                        <td className="px-4 py-3 text-sm">
                          <Badge variant={
                            p.pangkat === 'Perwira' ? 'default' :
                            p.pangkat === 'Bintara' ? 'secondary' :
                            'outline'
                          }>
                            {p.pangkat}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">{p.korps}</td>
                        <td className="px-4 py-3 text-sm">{p.satuan}</td>
                        <td className="px-4 py-3 text-sm">{p.jabatan}</td>
                        <td className="px-4 py-3 text-sm">{p.pekerjaan}</td>
                        <td className="px-4 py-3 text-sm">
                          <Badge variant={p.status === 'Aktif' ? 'success' : 'warning'}>
                            {p.status}
                          </Badge>
                        </td>
                        {(canEdit || canDelete) && (
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              {canEdit && (
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(p)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              )}
                              {canDelete && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(p.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredPersonel.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Tidak ada data personel
              </div>
            ) : (
              filteredPersonel.map((p) => (
                <Card key={p.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900">{p.nama}</h3>
                          <p className="text-sm text-gray-500">NRP: {p.nrp}</p>
                        </div>
                        <Badge variant={p.status === 'Aktif' ? 'success' : 'warning'} className="shrink-0">
                          {p.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Pangkat:</span>
                          <div className="mt-1">
                            <Badge variant={
                              p.pangkat === 'Perwira' ? 'default' :
                              p.pangkat === 'Bintara' ? 'secondary' :
                              'outline'
                            } className="text-xs">
                              {p.pangkat}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Korps:</span>
                          <p className="font-medium text-gray-900 mt-1">{p.korps}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">No. HP:</span>
                          <p className="font-medium text-gray-900 mt-1">{p.nomorHape || '-'}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Satuan:</span>
                          <p className="font-medium text-gray-900 mt-1">{p.satuan}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Jabatan:</span>
                          <p className="font-medium text-gray-900 mt-1">{p.jabatan}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Pekerjaan:</span>
                          <p className="font-medium text-gray-900 mt-1">{p.pekerjaan}</p>
                        </div>
                      </div>

                      {(canEdit || canDelete) && (
                        <div className="flex gap-2 pt-2 border-t">
                          {canEdit && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleEdit(p)}
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(p.id)}
                              className="flex-1 text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Hapus
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Menampilkan {filteredPersonel.length} dari {personel.length} personel
          </div>
        </CardContent>
      </Card>

      <PersonelFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingPersonel(null);
        }}
        onSubmit={handleFormSubmit}
        personel={editingPersonel}
        existingPersonel={personel}
        currentUser={user}
      />
    </div>
  );
}
