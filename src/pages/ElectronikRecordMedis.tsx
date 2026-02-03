import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Repository } from '@/services/repository';
import { Personel } from '@/types/models';
import { useAuthStore } from '@/store/authStore';
import { Search, FileText, Download, Crosshair, History, Shield, AlertCircle } from 'lucide-react';
import { ermService } from '@/services/erm';
import { TimelineEvent } from '@/types/models';
import { ERMViewerModal } from '@/components/erm/ERMViewerModal';
import { CrossFacilityAccessModal } from '@/components/erm/CrossFacilityAccessModal';
import { ContinuityOfCareExportModal } from '@/components/erm/ContinuityOfCareExportModal';
import { RikkesModal } from '@/components/erm/RikkesModal';
import { fasilitasAccessService } from '@/services/fasilitasAccess';
import { continuityOfCareService } from '@/services/continuityOfCare';

const personelRepo = new Repository<Personel>('personel', 'Personel');

export function ElektronikRecordMedisPage() {
  const { user } = useAuthStore();
  const [personel] = useState<Personel[]>(personelRepo.getAll());
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState<'nama' | 'nrp'>('nrp');
  const [selectedPersonel, setSelectedPersonel] = useState<Personel | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [ermViewerOpen, setErmViewerOpen] = useState(false);
  const [crossAccessOpen, setCrossAccessOpen] = useState(false);
  const [cocExportOpen, setCocExportOpen] = useState(false);
  const [rikkesModalOpen, setRikkesModalOpen] = useState(false);
  const isPuskesau = user?.role === 'Puskesau';

  const filteredPersonel = useMemo(() => {
    return personel.filter(p => {
      if (searchType === 'nama') {
        return p.nama.toLowerCase().includes(search.toLowerCase());
      } else {
        return p.nrp.includes(search);
      }
    });
  }, [personel, search, searchType]);

  const handleViewERM = (p: Personel) => {
    setSelectedPersonel(p);
    const records = ermService.getTimeline(p.id);
    setTimeline(records);
    setErmViewerOpen(true);
  };

  const handleCrossFacilityAccess = (p: Personel) => {
    setSelectedPersonel(p);
    setCrossAccessOpen(true);
  };

  const handleExportCOC = (p: Personel) => {
    setSelectedPersonel(p);
    setCocExportOpen(true);
  };

  const handleRikkesMode = (p: Personel) => {
    setSelectedPersonel(p);
    setRikkesModalOpen(true);
  };

  const handleCrossAccess = (alasan: string, keterangan: string) => {
    if (!user || !selectedPersonel) return;

    const fasilitasAsal = user.satuan || 'Fasilitas Tidak Diketahui';
    const fasilitasTujuan = selectedPersonel.satuan;

    fasilitasAccessService.create({
      userId: user.id,
      personelId: selectedPersonel.id,
      fasilitasAsal,
      fasilitasTujuan,
      alasanAkses: alasan as any,
      keteranganAlasan: keterangan,
      dataDiakses: { timeline: true, hasilPenunjang: true, resumeMedis: true },
    }, user.id);

    setCrossAccessOpen(false);
    handleViewERM(selectedPersonel);
  };

  const handleExportCOCConfirm = (fasilitasTujuan: string, catatan: string) => {
    if (!user || !selectedPersonel) return;

    const fasilitasAsal = user.satuan || selectedPersonel.satuan;

    continuityOfCareService.createForTransfer(
      selectedPersonel.id,
      fasilitasAsal,
      fasilitasTujuan,
      user.id,
      catatan
    );

    setCocExportOpen(false);
    alert('Continuity of Care Summary berhasil diexport!');
  };

  const getPersonelStats = (p: Personel) => {
    const records = ermService.getByPersonelIdAcrossFacilities(p.id);
    return {
      totalKunjungan: records.length,
      fasilitasBerbeda: new Set(records.map(r => r.satuan)).size,
      terakhirKunjungan: records.length > 0 ? records[0].createdAt : null,
    };
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {isPuskesau ? 'Portal Faskes TNI AU' : 'Rekam Medis Elektronik'}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {isPuskesau
              ? 'Akses lintas RSAU untuk Puskesau (Rikkes/Dikbangum/Lanjutan)'
              : 'Akses riwayat medis lintas satuan dengan portabilitas tinggi'
            }
          </p>
        </div>
        {isPuskesau && (
          <Badge variant="outline" className="w-fit">
            <Shield className="w-4 h-4 mr-1" />
            Mode Puskesau - Akses Terkontrol
          </Badge>
        )}
      </div>

      <Card className="border-sky-200/80 bg-sky-50/70 dark:bg-sky-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sky-900 dark:text-sky-100">
            <History className="h-5 w-5 text-sky-600" />
            Ringkasan Portabilitas Saat Mutasi Pindah Tugas
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-sky-900/90 dark:text-sky-100/90">
          <ul className="list-disc space-y-2 pl-5">
            <li>Akses E-RM tetap aktif walau pindah satuan (berbasis identitas pasien, bukan lokasi).</li>
            <li>Riwayat lintas fasilitas RSAU (single longitudinal record).</li>
            <li>Export ringkasan medis (Continuity of Care Summary) untuk dibawa ke fasilitas lain.</li>
            <li>Portal Faskes TNI AU (Puskesau &amp; RSAU) – akses lintas RS.</li>
            <li>Role-based access untuk Puskesau (melihat E-RM saat rikkes/dikbangum/lanjutan).</li>
            <li>Pencarian pasien terkontrol (berdasarkan NRP/NIK + alasan akses).</li>
            <li>Viewer E-RM lintas RSAU (timeline, hasil penunjang, resume medis).</li>
            <li>
              Fitur “Rikkes Mode”:
              <ul className="list-disc space-y-1 pl-5 pt-2">
                <li>Template pemeriksaan rikkes.</li>
                <li>Lampiran hasil penunjang.</li>
                <li>Auto-generate resume rikkes.</li>
              </ul>
            </li>
            <li>Audit trail &amp; justifikasi akses (wajib pilih alasan: rikkes/dikbangum/rujukan/lanjutan, dsb.).</li>
          </ul>
        </CardContent>
      </Card>

      {isPuskesau && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  Audit Trail & Justifikasi Akses Wajib
                </p>
                <p className="text-amber-700 dark:text-amber-300 mt-1">
                  Setiap akses ke data pasien dari fasilitas lain harus mencantumkan alasan yang jelas:
                  <span className="font-semibold mx-1">Rikkes</span>,
                  <span className="font-semibold mx-1">Dikbangum</span>,
                  <span className="font-semibold mx-1">Rujukan</span>,
                  <span className="font-semibold mx-1">Lanjutan</span>, atau
                  <span className="font-semibold mx-1">Lainnya</span>.
                  Semua aktivitas tercatat dalam audit log.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {isPuskesau ? 'Pencarian Pasien' : 'Cari Personel untuk Akses E-RM'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={
                      searchType === 'nama'
                        ? 'Cari berdasarkan nama personel...'
                        : 'Cari berdasarkan NRP personel...'
                    }
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as 'nama' | 'nrp')}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm w-full sm:w-auto"
              >
                <option value="nrp">Berdasarkan NRP</option>
                <option value="nama">Berdasarkan Nama</option>
              </select>
            </div>
          </div>

          <div className="hidden md:block rounded-md border">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">NRP</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Nama</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Pangkat</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Satuan</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Total Kunjungan</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Fasilitas</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPersonel.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      Tidak ada data personel ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredPersonel.map((p) => {
                    const stats = getPersonelStats(p);
                    return (
                      <tr key={p.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm font-medium">{p.nrp}</td>
                        <td className="px-4 py-3 text-sm">{p.nama}</td>
                        <td className="px-4 py-3 text-sm">
                          <Badge variant={p.pangkat === 'Perwira' ? 'default' : 'outline'}>
                            {p.pangkat}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">{p.satuan}</td>
                        <td className="px-4 py-3 text-sm">{stats.totalKunjungan}</td>
                        <td className="px-4 py-3 text-sm">
                          {stats.fasilitasBerbeda > 1 ? (
                            <Badge variant="secondary">
                              {stats.fasilitasBerbeda} Fasilitas
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">1 Fasilitas</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            {isPuskesau ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCrossFacilityAccess(p)}
                                  title="Akses dengan Justifikasi"
                                >
                                  <Shield className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRikkesMode(p)}
                                  title="Mode Rikkes"
                                >
                                  <Crosshair className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewERM(p)}
                                  title="Lihat Riwayat Medis"
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleExportCOC(p)}
                                  title="Export Continuity of Care"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {filteredPersonel.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Tidak ada data personel ditemukan
              </div>
            ) : (
              filteredPersonel.map((p) => {
                const stats = getPersonelStats(p);
                return (
                  <Card key={p.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900">{p.nama}</h3>
                            <p className="text-sm text-gray-500">NRP: {p.nrp}</p>
                          </div>
                          <Badge variant={p.pangkat === 'Perwira' ? 'default' : 'outline'} className="shrink-0">
                            {p.pangkat}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Satuan:</span>
                            <p className="font-medium text-gray-900 mt-1">{p.satuan}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Total Kunjungan:</span>
                            <p className="font-medium text-gray-900 mt-1">{stats.totalKunjungan}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2 border-t">
                          {isPuskesau ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => handleCrossFacilityAccess(p)}
                              >
                                <Shield className="h-4 w-4 mr-1" />
                                Akses
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => handleRikkesMode(p)}
                              >
                                <Crosshair className="h-4 w-4 mr-1" />
                                Rikkes
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => handleViewERM(p)}
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                Riwayat
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => handleExportCOC(p)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Export
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <ERMViewerModal
        isOpen={ermViewerOpen}
        onClose={() => setErmViewerOpen(false)}
        personel={selectedPersonel}
        timeline={timeline}
      />

      <CrossFacilityAccessModal
        isOpen={crossAccessOpen}
        onClose={() => setCrossAccessOpen(false)}
        onConfirm={handleCrossAccess}
        personel={selectedPersonel}
      />

      <ContinuityOfCareExportModal
        isOpen={cocExportOpen}
        onClose={() => setCocExportOpen(false)}
        onConfirm={handleExportCOCConfirm}
        personel={selectedPersonel}
      />

      <RikkesModal
        isOpen={rikkesModalOpen}
        onClose={() => setRikkesModalOpen(false)}
        personel={selectedPersonel}
      />
    </div>
  );
}
