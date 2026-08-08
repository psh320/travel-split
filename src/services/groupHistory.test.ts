import { afterEach, describe, expect, it } from "vitest";
import { GroupHistoryService } from "./groupHistory";
import { storage } from "./storage";

const STORAGE_KEY = "travel_split_group_history";

afterEach(() => {
  storage.removeItem(STORAGE_KEY);
});

describe("group history persistence", () => {
  it("ignores corrupt entries instead of leaking invalid data into the UI", () => {
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: "trip",
          name: "Summer trip",
          roomCode: "ABC123",
          role: "creator",
          lastAccessed: "2026-08-08T12:00:00.000Z",
          userIdInGroup: "user",
          userNameInGroup: "Momo",
        },
        { id: 42, lastAccessed: "not-a-date" },
      ])
    );

    expect(GroupHistoryService.getGroupHistory()).toEqual([
      {
        id: "trip",
        name: "Summer trip",
        roomCode: "ABC123",
        role: "creator",
        lastAccessed: new Date("2026-08-08T12:00:00.000Z"),
        userIdInGroup: "user",
        userNameInGroup: "Momo",
      },
    ]);
  });

  it("returns an empty history for malformed JSON", () => {
    storage.setItem(STORAGE_KEY, "not json");

    expect(GroupHistoryService.getGroupHistory()).toEqual([]);
  });
});
