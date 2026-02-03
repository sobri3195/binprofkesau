import { v4 as uuidv4 } from './uuid';
import { StorageService } from './storage';
import { AuditService } from './audit';
import { AksesFasilitas, AlasanAkses } from '@/types/models';

class FasilitasAccessService {
  private readonly AKSES_FASILITAS_KEY = 'akses_fasilitas';

  getAll(): AksesFasilitas[] {
    return StorageService.get<AksesFasilitas[]>(this.AKSES_FASILITAS_KEY) || [];
  }

  getByPersonelId(personelId: string): AksesFasilitas[] {
    const accessLogs = this.getAll();
    return accessLogs.filter(a => a.personelId === personelId);
  }

  create(
    data: Omit<AksesFasilitas, 'id' | 'createdAt' | 'tanggalAkses'>,
    userId: string
  ): AksesFasilitas {
    const accessLogs = this.getAll();
    const now = new Date().toISOString();
    const newAccess: AksesFasilitas = {
      ...data,
      id: uuidv4(),
      tanggalAkses: now,
      createdAt: now,
    };

    accessLogs.push(newAccess);
    StorageService.set(this.AKSES_FASILITAS_KEY, accessLogs);
    AuditService.log(userId, 'create', 'AksesFasilitas', newAccess.id, {
      personelId: data.personelId,
      fasilitasAsal: data.fasilitasAsal,
      fasilitasTujuan: data.fasilitasTujuan,
      alasanAkses: data.alasanAkses,
    });

    return newAccess;
  }

  getAccessHistoryByUser(userId: string): AksesFasilitas[] {
    const accessLogs = this.getAll();
    return accessLogs.filter(a => a.userId === userId);
  }

  getRecentAccessByPersonel(personelId: string, limit: number = 10): AksesFasilitas[] {
    const accessLogs = this.getByPersonelId(personelId);
    return accessLogs
      .sort((a, b) => new Date(b.tanggalAkses).getTime() - new Date(a.tanggalAkses).getTime())
      .slice(0, limit);
  }

  getAccessStats(personelId: string) {
    const accessLogs = this.getByPersonelId(personelId);
    const stats = {
      totalAkses: accessLogs.length,
      byAlasan: {} as Record<AlasanAkses, number>,
      byFasilitas: {} as Record<string, number>,
      aksesTerakhir: accessLogs.length > 0 ? accessLogs[accessLogs.length - 1] : null,
    };

    accessLogs.forEach(a => {
      stats.byAlasan[a.alasanAkses] = (stats.byAlasan[a.alasanAkses] || 0) + 1;
      stats.byFasilitas[a.fasilitasTujuan] = (stats.byFasilitas[a.fasilitasTujuan] || 0) + 1;
    });

    return stats;
  }
}

export const fasilitasAccessService = new FasilitasAccessService();
