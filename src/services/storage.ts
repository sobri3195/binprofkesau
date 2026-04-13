const STORAGE_PREFIX = 'binprofkes:';
const REMOTE_SYNC_DEBOUNCE_MS = 1200;

interface GoogleAppsScriptResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export class StorageService {
  private static remoteSyncTimer: number | null = null;
  private static isHydrating = false;

  private static get remoteUrl(): string {
    return (import.meta.env.VITE_GAS_WEB_APP_URL || '').trim();
  }

  private static getKey(key: string): string {
    return `${STORAGE_PREFIX}${key}`;
  }

  private static getStoragePayload(): Record<string, unknown> {
    const payload: Record<string, unknown> = {};

    Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => {
        const shortKey = key.replace(STORAGE_PREFIX, '');
        const value = localStorage.getItem(key);
        if (!value) return;

        try {
          payload[shortKey] = JSON.parse(value);
        } catch {
          payload[shortKey] = value;
        }
      });

    return payload;
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
      this.scheduleRemoteSync();
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key));
      this.scheduleRemoteSync();
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
    }
  }

  static clear(): void {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(STORAGE_PREFIX))
        .forEach(key => localStorage.removeItem(key));
      this.scheduleRemoteSync();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  static async hydrateFromRemote(): Promise<boolean> {
    if (!this.remoteUrl) {
      return false;
    }

    try {
      this.isHydrating = true;
      const response = await fetch(`${this.remoteUrl}?action=getAll`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Gagal mengambil data: ${response.status}`);
      }

      const result = await response.json() as GoogleAppsScriptResponse<Record<string, unknown>>;

      if (!result.success || !result.data) {
        return false;
      }

      Object.entries(result.data).forEach(([key, value]) => {
        localStorage.setItem(this.getKey(key), JSON.stringify(value));
      });

      return true;
    } catch (error) {
      console.warn('Gagal sinkronisasi awal dari Google Apps Script:', error);
      return false;
    } finally {
      this.isHydrating = false;
    }
  }

  private static scheduleRemoteSync(): void {
    if (!this.remoteUrl || this.isHydrating) {
      return;
    }

    if (this.remoteSyncTimer !== null) {
      window.clearTimeout(this.remoteSyncTimer);
    }

    this.remoteSyncTimer = window.setTimeout(() => {
      void this.pushToRemote();
    }, REMOTE_SYNC_DEBOUNCE_MS);
  }

  static async pushToRemote(): Promise<void> {
    if (!this.remoteUrl || this.isHydrating) {
      return;
    }

    try {
      const payload = this.getStoragePayload();
      const response = await fetch(this.remoteUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'replaceAll',
          payload,
        }),
      });

      if (!response.ok) {
        throw new Error(`Gagal mengirim data: ${response.status}`);
      }
    } catch (error) {
      console.warn('Gagal sinkronisasi ke Google Apps Script:', error);
    }
  }
}
