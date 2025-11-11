import { v4 as uuidv4 } from './uuid';
import { AuditLog, AksiAudit, EntitasAudit } from '@/types/models';
import { StorageService } from './storage';

export class AuditService {
  private static STORAGE_KEY = 'audit';

  static log(
    userId: string,
    aksi: AksiAudit,
    entitas: EntitasAudit,
    entitasId?: string,
    meta?: Record<string, any>
  ): void {
    const logs = StorageService.get<AuditLog[]>(this.STORAGE_KEY) || [];
    const newLog: AuditLog = {
      id: uuidv4(),
      userId,
      aksi,
      entitas,
      entitasId,
      timestamp: new Date().toISOString(),
      meta,
    };
    logs.push(newLog);
    StorageService.set(this.STORAGE_KEY, logs);
  }

  static getLogs(): AuditLog[] {
    return StorageService.get<AuditLog[]>(this.STORAGE_KEY) || [];
  }

  static clearLogs(): void {
    StorageService.set(this.STORAGE_KEY, []);
  }
}
