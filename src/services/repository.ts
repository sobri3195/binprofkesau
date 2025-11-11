import { v4 as uuidv4 } from './uuid';
import { StorageService } from './storage';
import { AuditService } from './audit';
import { EntitasAudit } from '@/types/models';

interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export class Repository<T extends BaseEntity> {
  constructor(
    private key: string,
    private entitas: EntitasAudit
  ) {}

  getAll(): T[] {
    return StorageService.get<T[]>(this.key) || [];
  }

  getById(id: string): T | undefined {
    const items = this.getAll();
    return items.find(item => item.id === id);
  }

  create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>, userId: string): T {
    const items = this.getAll();
    const now = new Date().toISOString();
    const newItem = {
      ...item,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    } as T;
    
    items.push(newItem);
    StorageService.set(this.key, items);
    AuditService.log(userId, 'create', this.entitas, newItem.id);
    
    return newItem;
  }

  update(id: string, updates: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>, userId: string): T | undefined {
    const items = this.getAll();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return undefined;
    
    const updatedItem = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    items[index] = updatedItem;
    StorageService.set(this.key, items);
    AuditService.log(userId, 'update', this.entitas, id, updates);
    
    return updatedItem;
  }

  delete(id: string, userId: string): boolean {
    const items = this.getAll();
    const filtered = items.filter(item => item.id !== id);
    
    if (filtered.length === items.length) return false;
    
    StorageService.set(this.key, filtered);
    AuditService.log(userId, 'delete', this.entitas, id);
    
    return true;
  }

  deleteAll(): void {
    StorageService.set(this.key, []);
  }
}
