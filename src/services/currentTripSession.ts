import { storage, type StorageService } from "./storage";

export interface CurrentTripSession {
  tripId: string;
  userId: string;
  userName: string;
  roomCode: string;
}

const SESSION_KEYS = {
  tripId: "currentTripId",
  userId: "currentUserId",
  userName: "currentUserName",
  roomCode: "roomCode",
} as const satisfies Record<keyof CurrentTripSession, string>;

export const createCurrentTripSessionService = (
  storageService: StorageService
) => ({
  get(): Partial<CurrentTripSession> {
    return Object.fromEntries(
      Object.entries(SESSION_KEYS).flatMap(([field, key]) => {
        const value = storageService.getItem(key);
        return value ? [[field, value]] : [];
      })
    ) as Partial<CurrentTripSession>;
  },

  set(session: CurrentTripSession): boolean {
    const saved = Object.entries(SESSION_KEYS).map(([field, key]) =>
      storageService.setItem(key, session[field as keyof CurrentTripSession])
    );
    if (saved.every(Boolean)) return true;

    Object.values(SESSION_KEYS).forEach((key) => storageService.removeItem(key));
    return false;
  },

  clear(): void {
    Object.values(SESSION_KEYS).forEach((key) => storageService.removeItem(key));
  },
});

export const currentTripSession = createCurrentTripSessionService(storage);
