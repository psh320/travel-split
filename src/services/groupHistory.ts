// Service for managing user's group history with Safari compatibility
import { storage } from "./storage";

export interface GroupHistoryItem {
  id: string;
  name: string;
  roomCode: string;
  role: "creator" | "participant";
  lastAccessed: Date;
  userIdInGroup: string;
  userNameInGroup: string;
}

interface StoredGroupHistoryItem {
  id: string;
  name: string;
  roomCode: string;
  role: "creator" | "participant";
  lastAccessed: string; // Stored as ISO string
  userIdInGroup: string;
  userNameInGroup: string;
}

const STORAGE_KEY = "travel_split_group_history";

export class GroupHistoryService {
  // Get all groups from history
  static getGroupHistory(): GroupHistoryItem[] {
    try {
      const stored = storage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const parsed: StoredGroupHistoryItem[] = JSON.parse(stored);
      return parsed.map((item) => ({
        ...item,
        lastAccessed: new Date(item.lastAccessed),
      }));
    } catch (error) {
      console.error("Error reading group history:", error);
      return [];
    }
  }

  // Add a group to history
  static addGroupToHistory(
    groupId: string,
    groupName: string,
    roomCode: string,
    role: "creator" | "participant",
    userIdInGroup: string,
    userNameInGroup: string
  ): void {
    try {
      const history = this.getGroupHistory();

      // Remove existing entry if it exists
      const filteredHistory = history.filter((item) => item.id !== groupId);

      // Add new entry at the beginning
      const newItem: GroupHistoryItem = {
        id: groupId,
        name: groupName,
        roomCode,
        role,
        lastAccessed: new Date(),
        userIdInGroup,
        userNameInGroup,
      };

      // Keep only the most recent 20 groups to avoid storage bloat
      const updatedHistory = [newItem, ...filteredHistory].slice(0, 20);

      const success = storage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedHistory)
      );
      if (!success) {
        console.warn(
          "Failed to save group to history - storage may be full or unavailable"
        );
      }
    } catch (error) {
      console.error("Error saving group to history:", error);
    }
  }

  // Update last accessed time for a group
  static updateLastAccessed(groupId: string): void {
    try {
      const history = this.getGroupHistory();
      const updated = history.map((item) =>
        item.id === groupId ? { ...item, lastAccessed: new Date() } : item
      );

      // Sort by last accessed (most recent first)
      updated.sort(
        (a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime()
      );

      storage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Error updating group access time:", error);
    }
  }

  // Remove a group from history
  static removeGroupFromHistory(groupId: string): void {
    try {
      const history = this.getGroupHistory();
      const filtered = history.filter((item) => item.id !== groupId);
      storage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Error removing group from history:", error);
    }
  }

  // Get recently accessed groups (limit to most recent)
  static getRecentGroups(limit: number = 5): GroupHistoryItem[] {
    return this.getGroupHistory().slice(0, limit);
  }

  // Check if user has any groups in history
  static hasGroupHistory(): boolean {
    return this.getGroupHistory().length > 0;
  }

  // Clear all history (for privacy/reset purposes)
  static clearHistory(): void {
    try {
      storage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing group history:", error);
    }
  }

  // Get storage information for user feedback
  static getStorageInfo(): {
    type: "localStorage" | "cookie" | "memory";
    isPersistent: boolean;
    warning: string | null;
  } {
    return {
      type: storage.getStorageType(),
      isPersistent: storage.isPersistent(),
      warning: storage.getStorageWarning(),
    };
  }
}
