import { Repository } from './repository';
import { RiwayatKedinasan, RiwayatPenghargaan, RiwayatKarya } from '@/types/models';

export class RiwayatKedinasanService {
  private static repository = new Repository<RiwayatKedinasan>('riwayat_kedinasan', 'RiwayatKedinasan');

  static getAll(personelId?: string): RiwayatKedinasan[] {
    const all = this.repository.getAll();
    return personelId ? all.filter(item => item.personelId === personelId) : all;
  }

  static getById(id: string): RiwayatKedinasan | undefined {
    return this.repository.getById(id);
  }

  static create(data: Omit<RiwayatKedinasan, 'id' | 'createdAt' | 'updatedAt'>, userId: string): RiwayatKedinasan {
    return this.repository.create(data, userId);
  }

  static update(id: string, updates: Partial<Omit<RiwayatKedinasan, 'id' | 'createdAt' | 'updatedAt'>>, userId: string): RiwayatKedinasan | undefined {
    return this.repository.update(id, updates, userId);
  }

  static delete(id: string, userId: string): boolean {
    return this.repository.delete(id, userId);
  }
}

export class RiwayatPenghargaanService {
  private static repository = new Repository<RiwayatPenghargaan>('riwayat_penghargaan', 'RiwayatPenghargaan');

  static getAll(personelId?: string): RiwayatPenghargaan[] {
    const all = this.repository.getAll();
    return personelId ? all.filter(item => item.personelId === personelId) : all;
  }

  static getById(id: string): RiwayatPenghargaan | undefined {
    return this.repository.getById(id);
  }

  static create(data: Omit<RiwayatPenghargaan, 'id' | 'createdAt' | 'updatedAt'>, userId: string): RiwayatPenghargaan {
    return this.repository.create(data, userId);
  }

  static update(id: string, updates: Partial<Omit<RiwayatPenghargaan, 'id' | 'createdAt' | 'updatedAt'>>, userId: string): RiwayatPenghargaan | undefined {
    return this.repository.update(id, updates, userId);
  }

  static delete(id: string, userId: string): boolean {
    return this.repository.delete(id, userId);
  }
}

export class RiwayatKaryaService {
  private static repository = new Repository<RiwayatKarya>('riwayat_karya', 'RiwayatKarya');

  static getAll(personelId?: string): RiwayatKarya[] {
    const all = this.repository.getAll();
    return personelId ? all.filter(item => item.personelId === personelId) : all;
  }

  static getById(id: string): RiwayatKarya | undefined {
    return this.repository.getById(id);
  }

  static create(data: Omit<RiwayatKarya, 'id' | 'createdAt' | 'updatedAt'>, userId: string): RiwayatKarya {
    return this.repository.create(data, userId);
  }

  static update(id: string, updates: Partial<Omit<RiwayatKarya, 'id' | 'createdAt' | 'updatedAt'>>, userId: string): RiwayatKarya | undefined {
    return this.repository.update(id, updates, userId);
  }

  static delete(id: string, userId: string): boolean {
    return this.repository.delete(id, userId);
  }
}