import { describe, expect, it } from "vitest";
import {
  createCurrentTripSessionService,
  type CurrentTripSession,
} from "./currentTripSession";
import type { StorageService } from "./storage";

const createMemoryStorage = (failedKey?: string): StorageService => {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      if (key === failedKey) return false;
      values.set(key, value);
      return true;
    },
    removeItem: (key) => values.delete(key),
    isAvailable: () => true,
  };
};

const session: CurrentTripSession = {
  tripId: "trip-1",
  userId: "user-1",
  userName: "Momo",
  roomCode: "ABC123",
};

describe("current trip session", () => {
  it("stores and restores the active trip context as one unit", () => {
    const service = createCurrentTripSessionService(createMemoryStorage());

    expect(service.set(session)).toBe(true);
    expect(service.get()).toEqual(session);
  });

  it("clears every active trip field", () => {
    const service = createCurrentTripSessionService(createMemoryStorage());
    service.set(session);

    service.clear();

    expect(service.get()).toEqual({});
  });

  it("clears partial data when the active trip cannot be fully stored", () => {
    const service = createCurrentTripSessionService(
      createMemoryStorage("currentUserName")
    );

    expect(service.set(session)).toBe(false);
    expect(service.get()).toEqual({});
  });
});
