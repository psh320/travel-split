import { beforeEach, describe, expect, it, vi } from "vitest";

const firestore = vi.hoisted(() => ({
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  setDoc: vi.fn(),
}));

vi.mock("../config/firebase", () => ({ db: {} }));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn((_db, name) => ({ type: "collection", name })),
  deleteField: vi.fn(),
  doc: vi.fn((first, collectionName, id) =>
    collectionName === undefined
      ? { type: "document", collectionName: first.name, id: "new-document-id" }
      : { type: "document", collectionName, id }
  ),
  getDoc: firestore.getDoc,
  getDocs: firestore.getDocs,
  query: vi.fn((...constraints) => ({ type: "query", constraints })),
  setDoc: firestore.setDoc,
  Timestamp: { fromDate: vi.fn((date) => date) },
  updateDoc: vi.fn(),
  where: vi.fn((field, operator, value) => ({ field, operator, value })),
}));

import { FirebaseService } from "./firebase";

const timestamp = (date: string) => ({
  toDate: () => new Date(date),
});

describe("FirebaseService.getTripById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resolves a legacy UUID stored inside a Firestore document", async () => {
    const legacyId = "legacy-trip-id";
    const canonicalId = "firestore-document-id";
    const data = {
      id: legacyId,
      name: "Honeymoon",
      description: "",
      roomCode: "ABC123",
      createdBy: "creator-1",
      participants: [
        {
          id: "creator-1",
          name: "Creator",
          createdAt: timestamp("2026-01-01T00:00:00.000Z"),
        },
      ],
      expenses: [],
      createdAt: timestamp("2026-01-01T00:00:00.000Z"),
      updatedAt: timestamp("2026-01-02T00:00:00.000Z"),
    };

    firestore.getDoc.mockResolvedValue({ exists: () => false });
    firestore.getDocs.mockResolvedValue({
      empty: false,
      docs: [{ id: canonicalId, data: () => data }],
    });

    const trip = await FirebaseService.getTripById(legacyId);

    expect(trip).toMatchObject({
      id: canonicalId,
      name: "Honeymoon",
      roomCode: "ABC123",
    });
    expect(firestore.getDocs).toHaveBeenCalledOnce();
  });

  it("resolves a migrated trip through its legacy ID alias", async () => {
    const data = {
      id: "firestore-document-id",
      legacyId: "migrated-legacy-trip-id",
      name: "Honeymoon",
      description: "",
      roomCode: "ABC123",
      createdBy: "creator-1",
      participants: [],
      expenses: [],
      createdAt: timestamp("2026-01-01T00:00:00.000Z"),
      updatedAt: timestamp("2026-01-02T00:00:00.000Z"),
    };

    firestore.getDoc.mockResolvedValue({ exists: () => false });
    firestore.getDocs
      .mockResolvedValueOnce({ empty: true, docs: [] })
      .mockResolvedValueOnce({
        empty: false,
        docs: [{ id: "firestore-document-id", data: () => data }],
      });

    const trip = await FirebaseService.getTripById("migrated-legacy-trip-id");

    expect(trip?.id).toBe("firestore-document-id");
    expect(firestore.getDocs).toHaveBeenCalledTimes(2);
  });
});

describe("FirebaseService.createTrip", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses the Firestore document ID as the trip ID", async () => {
    const { trip } = await FirebaseService.createTrip(
      "New trip",
      "",
      "Creator"
    );

    expect(trip.id).toBe("new-document-id");
    expect(firestore.setDoc).toHaveBeenCalledWith(
      expect.objectContaining({ id: "new-document-id" }),
      expect.objectContaining({ id: "new-document-id" })
    );
  });
});
