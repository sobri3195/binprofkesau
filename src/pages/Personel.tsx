import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Repository } from '@/services/repository';
import { ExportService } from '@/services/export';
import { Personel, Pangkat } from '@/types/models';
import { useAuthStore } from '@/store/authStore';
import { Plus, Download, Search, Pencil, Trash2 } from 'lucide-react';

const personelRepo = new Repository<Personel>('personel', 'Personel');

export function PersonelPage() {
  const { user } = useAuthStore();
  const [personel, setPersonel] = useState<Personel[]>(personelRepo.getAll());
  const [search, setSearch] = useState('');
  const [filterPangkat, setFilterPangkat] = useState<Pangkat | ''>('');

  const canCreate = user?.role === 'SuperAdmin' || user?.role === 'AdminSatuan' || user?.role === 'Operator';
  const canEdit = user?.role === 'SuperAdmin' || user?.role === 'AdminSatuan';
  const canDelete = user?.role === 'SuperAdmin' || user?.role === 'AdminSatuan';

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
      ['nrp', 'nama', 'pangkat', 'korps', 'satuan', 'jabatan', 'pekerjaan', 'status']
    );
  };

  const handleExportExcel = () => {
    ExportService.exportToExcel(
      filteredPersonel,
      'personel-binprofkes',
      ['nrp', 'nama', 'pangkat', 'korps', 'satuan', 'jabatan', 'pekerjaan', 'status']
    );
  };

  const handleExportPDF = () => {
    ExportService.exportToPDF(
      filteredPersonel,
      'Personel BINPROFKES',
      [
        { header: 'NRP', dataKey: 'nrp' },
        { header: 'Nama', dataKey: 'nama' },
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Personel</h1>
          <p className="text-muted-foreground">
            Kelola data tenaga kesehatan TNI AU
          </p>
        </div>
        {canCreate && (
          <Button>
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
          <div className="mb-4 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
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
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Semua Pangkat</option>
              <option value="Tamtama">Tamtama</option>
              <option value="Bintara">Bintara</option>
              <option value="Perwira">Perwira</option>
            </select>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportExcel}>
                <Download className="mr-2 h-4 w-4" />
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">NRP</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Nama</th>
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
                      <td colSpan={9} className="px-4 py-8 text-center text-sm text-muted-foreground">
                        Tidak ada data personel
                      </td>
                    </tr>
                  ) : (
                    filteredPersonel.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm">{p.nrp}</td>
                        <td className="px-4 py-3 text-sm font-medium">{p.nama}</td>
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
                                <Button variant="ghost" size="sm">
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

          <div className="mt-4 text-sm text-muted-foreground">
            Menampilkan {filteredPersonel.length} dari {personel.length} personel
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
