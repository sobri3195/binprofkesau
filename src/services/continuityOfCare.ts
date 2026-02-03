import { v4 as uuidv4 } from './uuid';
import { StorageService } from './storage';
import { AuditService } from './audit';
import { ContinuityOfCare, Personel } from '@/types/models';
import { ermService } from './erm';
import { rikkesService } from './rikkes';

class ContinuityOfCareService {
  private readonly CONTINUITY_OF_CARE_KEY = 'continuity_of_care';

  getAll(): ContinuityOfCare[] {
    return StorageService.get<ContinuityOfCare[]>(this.CONTINUITY_OF_CARE_KEY) || [];
  }

  getById(id: string): ContinuityOfCare | undefined {
    const records = this.getAll();
    return records.find(r => r.id === id);
  }

  getByPersonelId(personelId: string): ContinuityOfCare[] {
    const records = this.getAll();
    return records.filter(r => r.personelId === personelId);
  }

  create(
    data: Omit<ContinuityOfCare, 'id' | 'createdAt' | 'tanggalEkspor' | 'ringkasanMedis'>,
    userId: string
  ): ContinuityOfCare {
    const records = this.getAll();
    const now = new Date().toISOString();

    const ringkasanMedis = this.generateSummary(data.personelId, data.fasilitasAsal);

    const newRecord: ContinuityOfCare = {
      ...data,
      id: uuidv4(),
      tanggalEkspor: now,
      ringkasanMedis,
      createdAt: now,
    };

    records.push(newRecord);
    StorageService.set(this.CONTINUITY_OF_CARE_KEY, records);
    AuditService.log(userId, 'create', 'RekamMedis', newRecord.id, {
      personelId: data.personelId,
      fasilitasAsal: data.fasilitasAsal,
      fasilitasTujuan: data.fasilitasTujuan,
    });

    return newRecord;
  }

  generateSummary(personelId: string, fasilitasAsal: string): string {
    const ermRecords = ermService.getByPersonelIdAcrossFacilities(personelId);
    const latestRikkes = rikkesService.getLatestRikkes(personelId);

    const parts: string[] = [];

    parts.push('RINGKASAN MEDIS (CONTINUITY OF CARE SUMMARY)');
    parts.push(`Fasilitas Asal: ${fasilitasAsal}`);
    parts.push(`Tanggal Ekspor: ${new Date().toLocaleDateString('id-ID')}`);
    parts.push('');

    if (latestRikkes) {
      parts.push('RIKKES TERAKHIR:');
      parts.push(`  Tahun: ${latestRikkes.tahunRikkes}`);
      parts.push(`  Jenis: ${latestRikkes.jenisRikkes}`);
      parts.push(`  Kesimpulan: ${latestRikkes.kesimpulan}`);
      parts.push(`  Rekomendasi: ${latestRikkes.rekomendasi}`);
      parts.push('');
    }

    if (ermRecords.length > 0) {
      parts.push('RIWAYAT PERIKSA:');
      parts.push(`  Total Kunjungan: ${ermRecords.length}`);
      ermRecords.slice(0, 5).forEach((r, i) => {
        parts.push(`  ${i + 1}. ${new Date(r.createdAt).toLocaleDateString('id-ID')} - ${r.jenisPemeriksaan} (${r.satuan})`);
        if (r.diagnosa) parts.push(`     Diagnosa: ${r.diagnosa}`);
        if (r.tindakan) parts.push(`     Tindakan: ${r.tindakan}`);
      });
      if (ermRecords.length > 5) {
        parts.push(`  ... dan ${ermRecords.length - 5} kunjungan lainnya`);
      }
    }

    return parts.join('\n');
  }

  exportToText(record: ContinuityOfCare): string {
    const lines: string[] = [];

    lines.push('═'.repeat(80));
    lines.push('                    CONTINUITY OF CARE SUMMARY');
    lines.push('              (Ringkasan Medis untuk Pemindahan)');
    lines.push('═'.repeat(80));
    lines.push('');
    lines.push('INFORMASI PASIEN');
    lines.push('-'.repeat(80));
    lines.push(`ID Personel: ${record.personelId}`);
    lines.push(`Fasilitas Asal: ${record.fasilitasAsal}`);
    lines.push(`Fasilitas Tujuan: ${record.fasilitasTujuan}`);
    lines.push(`Tanggal Ekspor: ${new Date(record.tanggalEkspor).toLocaleString('id-ID')}`);
    lines.push('');

    lines.push('RINGKASAN MEDIS');
    lines.push('-'.repeat(80));
    lines.push(record.ringkasanMedis);
    lines.push('');

    if (record.riwayatDiagnosa && record.riwayatDiagnosa.length > 0) {
      lines.push('RIWAYAT DIAGNOSA');
      lines.push('-'.repeat(80));
      record.riwayatDiagnosa.forEach((rd, i) => {
        lines.push(`${i + 1}. ${rd.diagnosa}`);
        lines.push(`   Tanggal: ${new Date(rd.tanggal).toLocaleDateString('id-ID')}`);
        lines.push(`   Fasilitas: ${rd.fasilitas}`);
      });
      lines.push('');
    }

    if (record.riwayatTindakan && record.riwayatTindakan.length > 0) {
      lines.push('RIWAYAT TINDAKAN');
      lines.push('-'.repeat(80));
      record.riwayatTindakan.forEach((rt, i) => {
        lines.push(`${i + 1}. ${rt.tindakan}`);
        lines.push(`   Tanggal: ${new Date(rt.tanggal).toLocaleDateString('id-ID')}`);
        lines.push(`   Fasilitas: ${rt.fasilitas}`);
      });
      lines.push('');
    }

    if (record.riwayatObat && record.riwayatObat.length > 0) {
      lines.push('RIWAYAT OBAT');
      lines.push('-'.repeat(80));
      record.riwayatObat.forEach((ro, i) => {
        lines.push(`${i + 1}. ${ro.nama} - ${ro.dosis}`);
        lines.push(`   Periode: ${ro.periode}`);
      });
      lines.push('');
    }

    if (record.alergi) {
      lines.push('ALERGI');
      lines.push('-'.repeat(80));
      lines.push(record.alergi);
      lines.push('');
    }

    if (record.hasilRikkesTerakhir) {
      lines.push('HASIL RIKKES TERAKHIR');
      lines.push('-'.repeat(80));
      lines.push(`Tahun: ${record.hasilRikkesTerakhir.tahun}`);
      lines.push(`Kesimpulan: ${record.hasilRikkesTerakhir.kesimpulan}`);
      lines.push(`Rekomendasi: ${record.hasilRikkesTerakhir.rekomendasi}`);
      lines.push('');
    }

    if (record.catatanPemindahan) {
      lines.push('CATATAN PEMINDAHAN');
      lines.push('-'.repeat(80));
      lines.push(record.catatanPemindahan);
      lines.push('');
    }

    lines.push('═'.repeat(80));
    lines.push('Dokumen ini digenerate secara otomatis oleh sistem BINPROFKES');
    lines.push('═'.repeat(80));

    return lines.join('\n');
  }

  createForTransfer(
    personelId: string,
    fasilitasAsal: string,
    fasilitasTujuan: string,
    userId: string,
    catatanPemindahan?: string
  ): ContinuityOfCare {
    const ermRecords = ermService.getByPersonelIdAcrossFacilities(personelId);
    const latestRikkes = rikkesService.getLatestRikkes(personelId);

    const riwayatDiagnosa = ermService.getDiagnosisHistory(personelId);
    const riwayatTindakan = ermService.getProceduresHistory(personelId);
    const hasilRikkesTerakhir = latestRikkes
      ? {
          tahun: latestRikkes.tahunRikkes,
          kesimpulan: latestRikkes.kesimpulan || '-',
          rekomendasi: latestRikkes.rekomendasi || '-',
        }
      : undefined;

    const data: Omit<ContinuityOfCare, 'id' | 'createdAt' | 'tanggalEkspor' | 'ringkasanMedis'> = {
      personelId,
      fasilitasAsal,
      fasilitasTujuan,
      riwayatDiagnosa: riwayatDiagnosa.length > 0 ? riwayatDiagnosa.slice(0, 20) : undefined,
      riwayatTindakan: riwayatTindakan.length > 0 ? riwayatTindakan.slice(0, 20) : undefined,
      hasilRikkesTerakhir,
      catatanPemindahan,
      userId,
    };

    return this.create(data, userId);
  }
}

export const continuityOfCareService = new ContinuityOfCareService();
