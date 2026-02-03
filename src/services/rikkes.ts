import { v4 as uuidv4 } from './uuid';
import { StorageService } from './storage';
import { AuditService } from './audit';
import { RekamRikkes } from '@/types/models';

type ResumeMedisData = Omit<RekamRikkes, 'id' | 'createdAt' | 'updatedAt' | 'resumeMedis'> &
  Partial<Pick<RekamRikkes, 'id' | 'createdAt' | 'updatedAt' | 'resumeMedis'>>;

class RikkesService {
  private readonly REKAM_RIKKES_KEY = 'rekam_rikkes';

  getAll(): RekamRikkes[] {
    return StorageService.get<RekamRikkes[]>(this.REKAM_RIKKES_KEY) || [];
  }

  getByPersonelId(personelId: string): RekamRikkes[] {
    const records = this.getAll();
    return records.filter(r => r.personelId === personelId);
  }

  getById(id: string): RekamRikkes | undefined {
    const records = this.getAll();
    return records.find(r => r.id === id);
  }

  create(
    data: Omit<RekamRikkes, 'id' | 'createdAt' | 'updatedAt' | 'resumeMedis'>,
    userId: string
  ): RekamRikkes {
    const records = this.getAll();
    const now = new Date().toISOString();

    const resumeMedis = this.generateResumeMedis(data);

    const newRecord: RekamRikkes = {
      ...data,
      id: uuidv4(),
      resumeMedis,
      createdAt: now,
      updatedAt: now,
    };

    records.push(newRecord);
    StorageService.set(this.REKAM_RIKKES_KEY, records);
    AuditService.log(userId, 'create', 'RekamMedis', newRecord.id, {
      personelId: data.personelId,
      tahunRikkes: data.tahunRikkes,
      jenisRikkes: data.jenisRikkes,
    });

    return newRecord;
  }

  update(
    id: string,
    updates: Partial<Omit<RekamRikkes, 'id' | 'createdAt' | 'updatedAt'>>,
    userId: string
  ): RekamRikkes | undefined {
    const records = this.getAll();
    const index = records.findIndex(r => r.id === id);

    if (index === -1) return undefined;

    const updatedRecord: RekamRikkes = {
      ...records[index],
      ...updates,
    };

    if (updates.kesimpulan || updates.rekomendasi) {
      updatedRecord.resumeMedis = this.generateResumeMedis(updatedRecord);
    }

    updatedRecord.updatedAt = new Date().toISOString();

    records[index] = updatedRecord;
    StorageService.set(this.REKAM_RIKKES_KEY, records);
    AuditService.log(userId, 'update', 'RekamMedis', id, updates);

    return updatedRecord;
  }

  delete(id: string, userId: string): boolean {
    const records = this.getAll();
    const filtered = records.filter(r => r.id !== id);

    if (filtered.length === records.length) return false;

    StorageService.set(this.REKAM_RIKKES_KEY, filtered);
    AuditService.log(userId, 'delete', 'RekamMedis', id);

    return true;
  }

  generateResumeMedis(data: ResumeMedisData): string {
    const parts: string[] = [];

    parts.push(`RIKKES - ${data.jenisRikkes} Tahun ${data.tahunRikkes}`);

    if (data.kesehatanUmum) {
      parts.push(`Kesehatan Umum: ${data.kesehatanUmum}`);
    }
    if (data.kesehatanMata) {
      parts.push(`Kesehatan Mata: ${data.kesehatanMata}`);
    }
    if (data.kesehatanGigi) {
      parts.push(`Kesehatan Gigi: ${data.kesehatanGigi}`);
    }
    if (data.kesehatanTHT) {
      parts.push(`Kesehatan THT: ${data.kesehatanTHT}`);
    }
    if (data.kesehatanJiwa) {
      parts.push(`Kesehatan Jiwa: ${data.kesehatanJiwa}`);
    }

    if (data.hasilPenunjang) {
      const penunjang: string[] = [];
      if (data.hasilPenunjang.labDarah) penunjang.push(`Lab Darah: ${data.hasilPenunjang.labDarah}`);
      if (data.hasilPenunjang.labUrine) penunjang.push(`Lab Urine: ${data.hasilPenunjang.labUrine}`);
      if (data.hasilPenunjang.rontgen) penunjang.push(`Rontgen: ${data.hasilPenunjang.rontgen}`);
      if (data.hasilPenunjang.ekg) penunjang.push(`EKG: ${data.hasilPenunjang.ekg}`);
      if (data.hasilPenunjang.audiometri) penunjang.push(`Audiometri: ${data.hasilPenunjang.audiometri}`);
      if (data.hasilPenunjang.tesNarkoba) penunjang.push(`Tes Narkoba: ${data.hasilPenunjang.tesNarkoba}`);
      if (data.hasilPenunjang.lainnya) {
        data.hasilPenunjang.lainnya.forEach(l => penunjang.push(`${l.jenis}: ${l.hasil}`));
      }
      if (penunjang.length > 0) {
        parts.push(`Hasil Penunjang:\n  - ${penunjang.join('\n  - ')}`);
      }
    }

    if (data.kesimpulan) {
      parts.push(`Kesimpulan: ${data.kesimpulan}`);
    }
    if (data.rekomendasi) {
      parts.push(`Rekomendasi: ${data.rekomendasi}`);
    }

    return parts.join('\n');
  }

  getLatestRikkes(personelId: string): RekamRikkes | undefined {
    const records = this.getByPersonelId(personelId);
    return records.sort((a, b) => new Date(b.tahunRikkes).getTime() - new Date(a.tahunRikkes).getTime())[0];
  }

  getRikkesByYear(personelId: string, year: string): RekamRikkes | undefined {
    const records = this.getByPersonelId(personelId);
    return records.find(r => r.tahunRikkes === year);
  }

  getAllRikkesHistory(personelId: string): RekamRikkes[] {
    const records = this.getByPersonelId(personelId);
    return records.sort((a, b) => new Date(b.tahunRikkes).getTime() - new Date(a.tahunRikkes).getTime());
  }
}

export const rikkesService = new RikkesService();
