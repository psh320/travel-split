// Cross-browser storage service with Safari compatibility
// Handles localStorage issues in Safari, especially private browsing mode

export interface StorageService {
  getItem(key: string): string | null;
  setItem(key: string, value: string): boolean;
  removeItem(key: string): boolean;
  isAvailable(): boolean;
}

class LocalStorageService implements StorageService {
  private available: boolean | null = null;

  isAvailable(): boolean {
    if (this.available !== null) return this.available;

    try {
      const testKey = "__storage_test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      this.available = true;
      return true;
    } catch {
      this.available = false;
      return false;
    }
  }

  getItem(key: string): string | null {
    if (!this.isAvailable()) return null;
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("localStorage.getItem failed:", e);
      return null;
    }
  }

  setItem(key: string, value: string): boolean {
    if (!this.isAvailable()) return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn("localStorage.setItem failed:", e);
      return false;
    }
  }

  removeItem(key: string): boolean {
    if (!this.isAvailable()) return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn("localStorage.removeItem failed:", e);
      return false;
    }
  }
}

class CookieStorageService implements StorageService {
  private available: boolean | null = null;

  isAvailable(): boolean {
    if (this.available !== null) return this.available;

    try {
      document.cookie = "__cookie_test__=test; path=/; max-age=1";
      const hasCookie = document.cookie.includes("__cookie_test__");
      if (hasCookie) {
        document.cookie = "__cookie_test__=; path=/; max-age=0"; // Clean up
      }
      this.available = hasCookie;
      return hasCookie;
    } catch {
      this.available = false;
      return false;
    }
  }

  getItem(key: string): string | null {
    if (!this.isAvailable()) return null;
    try {
      const match = document.cookie.match(
        new RegExp("(^| )" + key + "=([^;]+)")
      );
      return match ? decodeURIComponent(match[2]) : null;
    } catch (e) {
      console.warn("Cookie getItem failed:", e);
      return null;
    }
  }

  setItem(key: string, value: string): boolean {
    if (!this.isAvailable()) return false;
    try {
      // Set cookie with 30 days expiration
      const expires = new Date();
      expires.setDate(expires.getDate() + 30);
      document.cookie = `${key}=${encodeURIComponent(
        value
      )}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
      return true;
    } catch (e) {
      console.warn("Cookie setItem failed:", e);
      return false;
    }
  }

  removeItem(key: string): boolean {
    if (!this.isAvailable()) return false;
    try {
      document.cookie = `${key}=; path=/; max-age=0`;
      return true;
    } catch (e) {
      console.warn("Cookie removeItem failed:", e);
      return false;
    }
  }
}

class MemoryStorageService implements StorageService {
  private storage: Map<string, string> = new Map();

  isAvailable(): boolean {
    return true; // Memory storage is always available
  }

  getItem(key: string): string | null {
    return this.storage.get(key) || null;
  }

  setItem(key: string, value: string): boolean {
    this.storage.set(key, value);
    return true;
  }

  removeItem(key: string): boolean {
    return this.storage.delete(key);
  }
}

// Storage service with automatic fallback
class CrossBrowserStorage implements StorageService {
  private primaryStorage: StorageService;
  private fallbackStorage: StorageService | null = null;
  private memoryStorage: StorageService;
  private storageType: "localStorage" | "cookie" | "memory" = "memory";

  constructor() {
    this.primaryStorage = new LocalStorageService();
    this.memoryStorage = new MemoryStorageService();

    // Determine best available storage
    if (this.primaryStorage.isAvailable()) {
      this.storageType = "localStorage";
    } else {
      this.fallbackStorage = new CookieStorageService();
      if (this.fallbackStorage.isAvailable()) {
        this.storageType = "cookie";
        this.primaryStorage = this.fallbackStorage;
      } else {
        this.storageType = "memory";
        this.primaryStorage = this.memoryStorage;
      }
    }

    console.log(`Using storage type: ${this.storageType}`);
  }

  isAvailable(): boolean {
    return this.primaryStorage.isAvailable();
  }

  getStorageType(): "localStorage" | "cookie" | "memory" {
    return this.storageType;
  }

  getItem(key: string): string | null {
    return this.primaryStorage.getItem(key);
  }

  setItem(key: string, value: string): boolean {
    return this.primaryStorage.setItem(key, value);
  }

  removeItem(key: string): boolean {
    return this.primaryStorage.removeItem(key);
  }

  // Check if storage is persistent (survives browser restart)
  isPersistent(): boolean {
    return this.storageType !== "memory";
  }

  // Show storage warning for non-persistent storage
  getStorageWarning(): string | null {
    switch (this.storageType) {
      case "memory":
        return "Your group history will not be saved when you close the browser. For persistent history, please enable cookies or disable private browsing mode.";
      case "cookie":
        return "Group history is saved using cookies. For better performance, consider enabling localStorage by disabling private browsing mode.";
      default:
        return null;
    }
  }
}

// Export singleton instance
export const storage = new CrossBrowserStorage();
