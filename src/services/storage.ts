const STORAGE_PREFIX = 'binprofkes:';

export class StorageService {
  private static getKey(key: string): string {
    return `${STORAGE_PREFIX}${key}`;
  }

  static get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key));
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
    }
  }

  static clear(): void {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(STORAGE_PREFIX))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}
