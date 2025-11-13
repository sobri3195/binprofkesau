import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Repository } from '@/services/repository';
import { Pelatihan, Personel } from '@/types/models';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import { 
  Plus, 
  Search, 
  Download, 
  Edit, 
  Trash2, 
  Filter,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { PelatihanFormModal } from '@/components/pelatihan/PelatihanFormModal';
import { DeleteConfirmDialog } from '@/components/pelatihan/DeleteConfirmDialog';

const pelatihanRepo = new Repository<Pelatihan>('pelatihan', 'Pelatihan');
const personelRepo = new Repository<Personel>('personel', 'Personel');

const jenisPelatihanOptions = [
  'KIBI',
  'SUSDOKBANG',
  'SUSPAKES',
  'SUSKESBANGAN',
  'SEKKAU',
  'SESKO',
  'SES KOAU'
];

export function PendidikanPelatihanPage() {
  const { user } = useAuthStore();
  const [pelatihan, setPelatihan] = useState<Pelatihan[]>(pelatihanRepo.getAll());
  const [personel] = useState<Personel[]>(personelRepo.getAll());
  
  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJenis, setFilterJenis] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPelatihan, setEditingPelatihan] = useState<Pelatihan | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Role-based permissions
  const canCreate = user?.role === 'SuperAdmin' || user?.role === 'AdminSatuan' || user?.role === 'Operator';
  const canEdit = user?.role === 'SuperAdmin' || user?.role === 'AdminSatuan';
  const canDelete = user?.role === 'SuperAdmin' || user?.role === 'AdminSatuan';
  const canExport = user?.role === 'SuperAdmin' || user?.role === 'AdminSatuan';

  // Filter personel based on user role
  const filteredPersonel = useMemo(() => {
    if (user?.role === 'SuperAdmin') {
      return personel;
    }
    if (user?.role === 'AdminSatuan' && user?.satuan) {
      return personel.filter(p => p.satuan === user.satuan);
    }
    return personel;
  }, [personel, user]);

  // Combine pelatihan with personel data
  const pelatihanWithPersonel = useMemo(() => {
    return pelatihan.map(p => {
      const person = personel.find(per => per.id === p.personelId);
      return {
        ...p,
        personelNama: person?.nama || 'Unknown',
        personelNRP: person?.nrp || '-',
        personelSatuan: person?.satuan || '-',
      };
    });
  }, [pelatihan, personel]);

  // Apply filters and search
  const filteredData = useMemo(() => {
    let result = pelatihanWithPersonel;

    // Filter by user's satuan if AdminSatuan
    if (user?.role === 'AdminSatuan' && user?.satuan) {
      result = result.filter(p => p.personelSatuan === user.satuan);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.personelNama.toLowerCase().includes(query) ||
        p.personelNRP.toLowerCase().includes(query) ||
        p.jenis.toLowerCase().includes(query)
      );
    }

    // Jenis filter
    if (filterJenis) {
      result = result.filter(p => p.jenis === filterJenis);
    }

    // Status filter
    if (filterStatus) {
      result = result.filter(p => p.statusPelaksanaan === filterStatus);
    }

    return result;
  }, [pelatihanWithPersonel, searchQuery, filterJenis, filterStatus, user]);

  // Statistics
  const stats = useMemo(() => {
    const total = filteredData.length;
    const sudah = filteredData.filter(p => p.statusPelaksanaan === 'Sudah Melaksanakan').length;
    const belum = filteredData.filter(p => p.statusPelaksanaan === 'Belum Melaksanakan').length;
    return { total, sudah, belum };
  }, [filteredData]);

  // Handlers
  const handleAdd = () => {
    setEditingPelatihan(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (item: Pelatihan) => {
    setEditingPelatihan(item);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingId && user) {
      pelatihanRepo.delete(deletingId, user.id);
      setPelatihan(pelatihanRepo.getAll());
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const handleFormSubmit = (data: Omit<Pelatihan, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    if (editingPelatihan) {
      pelatihanRepo.update(editingPelatihan.id, data, user.id);
    } else {
      pelatihanRepo.create(data, user.id);
    }
    
    setPelatihan(pelatihanRepo.getAll());
    setIsFormModalOpen(false);
    setEditingPelatihan(null);
  };

  // Export functions
  const exportToCSV = () => {
    const csvData = filteredData.map(p => ({
      'Personel': p.personelNama,
      'NRP': p.personelNRP,
      'Jenis Pelatihan': p.jenis,
      'Tanggal Mulai': p.tanggalMulai ? format(new Date(p.tanggalMulai), 'dd/MM/yyyy') : '-',
      'Tanggal Selesai': p.tanggalSelesai ? format(new Date(p.tanggalSelesai), 'dd/MM/yyyy') : '-',
      'Berlaku Hingga': p.sertifikatBerlakuHingga ? format(new Date(p.sertifikatBerlakuHingga), 'dd/MM/yyyy') : '-',
      'Status': p.statusPelaksanaan,
    }));

    const headers = Object.keys(csvData[0] || {});
    const csv = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pelatihan_${format(new Date(), 'yyyyMMdd')}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Data Pendidikan & Pelatihan', 14, 15);
    doc.setFontSize(10);
    doc.text(`BINPROFKES TNI AU - ${format(new Date(), 'dd MMMM yyyy')}`, 14, 22);

    const tableData = filteredData.map(p => [
      p.personelNama,
      p.jenis,
      p.tanggalMulai ? format(new Date(p.tanggalMulai), 'dd/MM/yyyy') : '-',
      p.tanggalSelesai ? format(new Date(p.tanggalSelesai), 'dd/MM/yyyy') : '-',
      p.sertifikatBerlakuHingga ? format(new Date(p.sertifikatBerlakuHingga), 'dd/MM/yyyy') : '-',
      p.statusPelaksanaan,
    ]);

    autoTable(doc, {
      head: [['Personel', 'Jenis Pelatihan', 'Tgl Mulai', 'Tgl Selesai', 'Berlaku Hingga', 'Status']],
      body: tableData,
      startY: 28,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [60, 141, 188] },
    });

    doc.save(`pelatihan_${format(new Date(), 'yyyyMMdd')}.pdf`);
  };

  const exportToExcel = () => {
    const excelData = filteredData.map(p => ({
      'Personel': p.personelNama,
      'NRP': p.personelNRP,
      'Satuan': p.personelSatuan,
      'Jenis Pelatihan': p.jenis,
      'Tanggal Mulai': p.tanggalMulai ? format(new Date(p.tanggalMulai), 'dd/MM/yyyy') : '-',
      'Tanggal Selesai': p.tanggalSelesai ? format(new Date(p.tanggalSelesai), 'dd/MM/yyyy') : '-',
      'Berlaku Hingga': p.sertifikatBerlakuHingga ? format(new Date(p.sertifikatBerlakuHingga), 'dd/MM/yyyy') : '-',
      'Status Pelaksanaan': p.statusPelaksanaan,
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pelatihan');
    XLSX.writeFile(wb, `pelatihan_${format(new Date(), 'yyyyMMdd')}.xlsx`);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Pendidikan & Pelatihan</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Kelola data pelatihan tenaga kesehatan TNI AU
          </p>
        </div>
        {canCreate && (
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            <span className="sm:inline">Tambah Pelatihan</span>
          </Button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Pelatihan</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Sudah Melaksanakan</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">{stats.sudah}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Belum Melaksanakan</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-600 mt-1">{stats.belum}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Data Card */}
      <Card>
        <CardHeader>
          <CardTitle>Data Pelatihan</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Bar */}
          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            <div className="flex flex-col gap-2 sm:gap-3">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Cari personel, NRP, atau jenis pelatihan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="shrink-0"
                >
                  <Filter className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
              </div>
              {canExport && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  <Button
                    variant="outline"
                    onClick={exportToCSV}
                    title="Export ke CSV"
                    size="sm"
                    className="shrink-0"
                  >
                    <Download className="w-4 h-4 mr-1 sm:mr-2" />
                    CSV
                  </Button>
                  <Button
                    variant="outline"
                    onClick={exportToExcel}
                    title="Export ke Excel"
                    size="sm"
                    className="shrink-0"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-1 sm:mr-2" />
                    Excel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={exportToPDF}
                    title="Export ke PDF"
                    size="sm"
                    className="shrink-0"
                  >
                    <FileText className="w-4 h-4 mr-1 sm:mr-2" />
                    PDF
                  </Button>
                </div>
              )}
            </div>

            {/* Filter Controls */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Pelatihan
                  </label>
                  <select
                    value={filterJenis}
                    onChange={(e) => setFilterJenis(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Semua Jenis</option>
                    {jenisPelatihanOptions.map(jenis => (
                      <option key={jenis} value={jenis}>{jenis}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Pelaksanaan
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Semua Status</option>
                    <option value="Sudah Melaksanakan">Sudah Melaksanakan</option>
                    <option value="Belum Melaksanakan">Belum Melaksanakan</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Data Table - Desktop */}
          <div className="hidden md:block rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Personel
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jenis Pelatihan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal Mulai
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal Selesai
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Berlaku Hingga
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    {(canEdit || canDelete) && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={canEdit || canDelete ? 7 : 6} className="px-4 py-8 text-center text-gray-500">
                        Tidak ada data pelatihan
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{p.personelNama}</div>
                            <div className="text-xs text-gray-500">{p.personelNRP}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{p.jenis}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {p.tanggalMulai ? format(new Date(p.tanggalMulai), 'dd MMM yyyy') : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {p.tanggalSelesai ? format(new Date(p.tanggalSelesai), 'dd MMM yyyy') : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {p.sertifikatBerlakuHingga ? format(new Date(p.sertifikatBerlakuHingga), 'dd MMM yyyy') : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Badge
                            variant={p.statusPelaksanaan === 'Sudah Melaksanakan' ? 'success' : 'secondary'}
                          >
                            {p.statusPelaksanaan === 'Sudah Melaksanakan' ? '✅' : '⚪'} {p.statusPelaksanaan}
                          </Badge>
                        </td>
                        {(canEdit || canDelete) && (
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {canEdit && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEdit(p)}
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              )}
                              {canDelete && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteClick(p.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-4 h-4" />
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

          {/* Data Cards - Mobile */}
          <div className="md:hidden space-y-3">
            {filteredData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Tidak ada data pelatihan
              </div>
            ) : (
              filteredData.map((p) => (
                <Card key={p.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{p.personelNama}</h3>
                          <p className="text-sm text-gray-500">{p.personelNRP}</p>
                        </div>
                        <Badge
                          variant={p.statusPelaksanaan === 'Sudah Melaksanakan' ? 'success' : 'secondary'}
                          className="ml-2 shrink-0"
                        >
                          {p.statusPelaksanaan === 'Sudah Melaksanakan' ? '✅' : '⚪'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Jenis:</span>
                          <span className="font-medium text-gray-900">{p.jenis}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Mulai:</span>
                          <span className="text-gray-900">
                            {p.tanggalMulai ? format(new Date(p.tanggalMulai), 'dd MMM yyyy') : '-'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Selesai:</span>
                          <span className="text-gray-900">
                            {p.tanggalSelesai ? format(new Date(p.tanggalSelesai), 'dd MMM yyyy') : '-'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Berlaku:</span>
                          <span className="text-gray-900">
                            {p.sertifikatBerlakuHingga ? format(new Date(p.sertifikatBerlakuHingga), 'dd MMM yyyy') : '-'}
                          </span>
                        </div>
                      </div>

                      {(canEdit || canDelete) && (
                        <div className="flex items-center gap-2 pt-2 border-t">
                          {canEdit && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(p)}
                              className="flex-1"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteClick(p.id)}
                              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
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

          {/* Results info */}
          {filteredData.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Menampilkan {filteredData.length} data pelatihan
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Modal */}
      <PelatihanFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingPelatihan(null);
        }}
        onSubmit={handleFormSubmit}
        pelatihan={editingPelatihan}
        personelList={filteredPersonel}
        jenisPelatihanOptions={jenisPelatihanOptions}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingId(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
