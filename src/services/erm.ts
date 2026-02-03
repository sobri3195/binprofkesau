import { v4 as uuidv4 } from './uuid';
import { StorageService } from './storage';
import { AuditService } from './audit';
import { RekamMedis, JenisPemeriksaan, TimelineEvent } from '@/types/models';

class ERMService {
  private readonly REKAM_MEDIS_KEY = 'rekam_medis';

  getAll(): RekamMedis[] {
    return StorageService.get<RekamMedis[]>(this.REKAM_MEDIS_KEY) || [];
  }

  getByPersonelId(personelId: string): RekamMedis[] {
    const records = this.getAll();
    return records.filter(r => r.personelId === personelId);
  }

  getById(id: string): RekamMedis | undefined {
    const records = this.getAll();
    return records.find(r => r.id === id);
  }

  create(
    data: Omit<RekamMedis, 'id' | 'createdAt' | 'updatedAt'>,
    userId: string
  ): RekamMedis {
    const records = this.getAll();
    const now = new Date().toISOString();
    const newRecord: RekamMedis = {
      ...data,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };

    records.push(newRecord);
    StorageService.set(this.REKAM_MEDIS_KEY, records);
    AuditService.log(userId, 'create', 'RekamMedis', newRecord.id, {
      personelId: data.personelId,
      jenisPemeriksaan: data.jenisPemeriksaan,
    });

    return newRecord;
  }

  update(
    id: string,
    updates: Partial<Omit<RekamMedis, 'id' | 'createdAt' | 'updatedAt'>>,
    userId: string
  ): RekamMedis | undefined {
    const records = this.getAll();
    const index = records.findIndex(r => r.id === id);

    if (index === -1) return undefined;

    const updatedRecord: RekamMedis = {
      ...records[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    records[index] = updatedRecord;
    StorageService.set(this.REKAM_MEDIS_KEY, records);
    AuditService.log(userId, 'update', 'RekamMedis', id, updates);

    return updatedRecord;
  }

  delete(id: string, userId: string): boolean {
    const records = this.getAll();
    const filtered = records.filter(r => r.id !== id);

    if (filtered.length === records.length) return false;

    StorageService.set(this.REKAM_MEDIS_KEY, filtered);
    AuditService.log(userId, 'delete', 'RekamMedis', id);

    return true;
  }

  getByPersonelIdAcrossFacilities(personelId: string): RekamMedis[] {
    const records = this.getAll();
    return records.filter(r => r.personelId === personelId);
  }

  getTimeline(personelId: string): TimelineEvent[] {
    const records = this.getByPersonelIdAcrossFacilities(personelId);
    return records
      .map(r => ({
        id: r.id,
        tanggal: r.createdAt,
        jenis: r.jenisPemeriksaan,
        fasilitas: r.satuan,
        deskripsi: r.keluhan || r.jenisPemeriksaan,
        diagnosa: r.diagnosa,
        tindakan: r.tindakan,
      }))
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }

  getLatestRecord(personelId: string, jenis?: JenisPemeriksaan): RekamMedis | undefined {
    const records = this.getByPersonelIdAcrossFacilities(personelId);
    const filtered = jenis ? records.filter(r => r.jenisPemeriksaan === jenis) : records;
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  }

  getDiagnosisHistory(personelId: string): Array<{ diagnosa: string; tanggal: string; fasilitas: string }> {
    const records = this.getByPersonelIdAcrossFacilities(personelId);
    const result: Array<{ diagnosa: string; tanggal: string; fasilitas: string }> = [];

    records.forEach(r => {
      if (r.diagnosa) {
        result.push({
          diagnosa: r.diagnosa,
          tanggal: r.createdAt,
          fasilitas: r.satuan,
        });
      }
    });

    return result.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }

  getProceduresHistory(personelId: string): Array<{ tindakan: string; tanggal: string; fasilitas: string }> {
    const records = this.getByPersonelIdAcrossFacilities(personelId);
    const result: Array<{ tindakan: string; tanggal: string; fasilitas: string }> = [];

    records.forEach(r => {
      if (r.tindakan) {
        result.push({
          tindakan: r.tindakan,
          tanggal: r.createdAt,
          fasilitas: r.satuan,
        });
      }
    });

    return result.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }

  getSupportingResults(personelId: string): Array<{ jenis: string; hasil: string; tanggal: string; fasilitas: string }> {
    const records = this.getByPersonelIdAcrossFacilities(personelId);
    const result: Array<{ jenis: string; hasil: string; tanggal: string; fasilitas: string }> = [];

    records.forEach(r => {
      if (r.hasilPenunjang) {
        r.hasilPenunjang.forEach(hp => {
          result.push({
            jenis: hp.jenis,
            hasil: hp.hasil,
            tanggal: hp.tanggal,
            fasilitas: r.satuan,
          });
        });
      }
    });

    return result.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }
}

export const ermService = new ERMService();
