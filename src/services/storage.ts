// Cross-browser storage service with Safari compatibility
// Handles localStorage issues in Safari, especially private browsing mode
import { t } from "../i18n";

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
    if (typeof window === "undefined") return false;

    try {
      const testKey = "__storage_test__";
      window.localStorage.setItem(testKey, "test");
      window.localStorage.removeItem(testKey);
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
      return window.localStorage.getItem(key);
    } catch (e) {
      console.warn("localStorage.getItem failed:", e);
      return null;
    }
  }

  setItem(key: string, value: string): boolean {
    if (!this.isAvailable()) return false;
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn("localStorage.setItem failed:", e);
      return false;
    }
  }

  removeItem(key: string): boolean {
    if (!this.isAvailable()) return false;
    try {
      window.localStorage.removeItem(key);
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
    if (typeof document === "undefined") return false;

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
      const prefix = `${encodeURIComponent(key)}=`;
      const cookie = document.cookie
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(prefix));
      return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
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
      document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(
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
      document.cookie = `${encodeURIComponent(key)}=; path=/; max-age=0`;
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
    return this.storage.get(key) ?? null;
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
  private storageType: "localStorage" | "cookie" | "memory" = "memory";

  constructor() {
    this.primaryStorage = new LocalStorageService();

    // Determine best available storage
    if (this.primaryStorage.isAvailable()) {
      this.storageType = "localStorage";
    } else {
      const cookieStorage = new CookieStorageService();
      if (cookieStorage.isAvailable()) {
        this.storageType = "cookie";
        this.primaryStorage = cookieStorage;
      } else {
        this.storageType = "memory";
        this.primaryStorage = new MemoryStorageService();
      }
    }
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
        return t("storageWarningMemory");
      case "cookie":
        return t("storageWarningCookie");
      default:
        return null;
    }
  }
}

// Export singleton instance
export const storage = new CrossBrowserStorage();
