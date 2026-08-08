import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AvatarConfig, FirestoreTripData } from "../types";

type TransactionSnapshot = {
  data: () => FirestoreTripData;
  exists: () => boolean;
  id: string;
};

type TransactionCallback = (transaction: {
  get: (reference: unknown) => Promise<TransactionSnapshot>;
  update: (reference: unknown, data: unknown) => void;
}) => Promise<unknown>;

const firestoreMocks = vi.hoisted(() => ({
  getDoc: vi.fn<(reference: unknown) => Promise<TransactionSnapshot>>(),
  runTransaction:
    vi.fn<
      (database: unknown, callback: TransactionCallback) => Promise<unknown>
    >(),
  updateDoc: vi.fn<(...args: unknown[]) => Promise<void>>(),
}));

vi.mock("firebase/firestore", () => ({
  addDoc: vi.fn(),
  collection: vi.fn(),
  deleteField: vi.fn(),
  doc: vi.fn((_db: unknown, _collection: string, id: string) => ({ id })),
  getDoc: firestoreMocks.getDoc,
  getDocs: vi.fn(),
  query: vi.fn(),
  runTransaction: firestoreMocks.runTransaction,
  Timestamp: {
    fromDate: (date: Date) => ({ toDate: () => date }),
  },
  updateDoc: firestoreMocks.updateDoc,
  where: vi.fn(),
}));

vi.mock("../config/firebase", () => ({ db: {} }));

import { FirebaseService } from "./firebase";

const timestamp = (date: string) => ({
  toDate: () => new Date(date),
});

const createTripData = (tripId: string): FirestoreTripData => ({
  name: "Summer trip",
  roomCode: "ABC123",
  createdBy: "user-1",
  participants: [
    {
      id: "user-1",
      name: "Momo",
      createdAt: timestamp("2026-08-01T00:00:00.000Z"),
    },
  ],
  expenses: [
    {
      id: "expense-1",
      description: "Dinner",
      amount: 42,
      paidBy: "user-1",
      participants: ["user-1"],
      category: "other",
      splitMode: "equal",
      date: timestamp("2026-08-08T00:00:00.000Z"),
      createdAt: timestamp("2026-08-08T00:00:00.000Z"),
      tripId,
    },
  ],
  createdAt: timestamp("2026-08-01T00:00:00.000Z"),
  updatedAt: timestamp("2026-08-08T00:00:00.000Z"),
});

const avatarConfig: AvatarConfig = {
  version: 1,
  skinTone: "tan",
  hairStyle: "crop",
  hairColor: "ink",
  eyeStyle: "happy",
  noseStyle: "soft",
  mouthStyle: "smile",
  accessory: "glasses",
  background: "mint",
  outfit: "navy",
};

const primeTrip = async (
  tripId: string,
  tripData = createTripData(tripId)
) => {
  const snapshot: TransactionSnapshot = {
    data: () => tripData,
    exists: () => true,
    id: tripId,
  };

  firestoreMocks.getDoc.mockResolvedValue(snapshot);
  firestoreMocks.runTransaction.mockImplementation((_db, callback) =>
    callback({
      get: vi.fn().mockResolvedValue(snapshot),
      update: vi.fn(),
    })
  );
  await FirebaseService.getTripById(tripId, { force: true });
};

describe("FirebaseService trip mutation cache", () => {
  beforeEach(() => {
    firestoreMocks.getDoc.mockReset();
    firestoreMocks.runTransaction.mockReset();
    firestoreMocks.updateDoc.mockReset();
    firestoreMocks.updateDoc.mockResolvedValue();
  });

  it("keeps the updated trip available for the destination screen", async () => {
    const tripId = "trip-cache-update";
    await primeTrip(tripId);
    await FirebaseService.updateExpense(
      tripId,
      "expense-1",
      "Dinner",
      42,
      "user-1",
      ["user-1"],
      "food",
      new Date("2026-08-08T00:00:00.000Z")
    );

    expect(
      FirebaseService.getCachedTripById(tripId)?.expenses[0].category
    ).toBe("food");
  });

  it("keeps the newly added expense in the trip cache", async () => {
    const tripId = "trip-cache-add-expense";
    await primeTrip(tripId);

    const expense = await FirebaseService.addExpense(
      tripId,
      "Taxi",
      12,
      "user-1",
      ["user-1"],
      "transport",
      new Date("2026-08-09T00:00:00.000Z")
    );

    expect(
      FirebaseService.getCachedTripById(tripId)?.expenses.some(
        (cachedExpense) => cachedExpense.id === expense.id
      )
    ).toBe(true);
  });

  it("keeps the newly added participant in the trip cache", async () => {
    const tripId = "trip-cache-add-user";
    await primeTrip(tripId);

    const user = await FirebaseService.addUserToTrip(
      tripId,
      "Bori",
      avatarConfig
    );

    expect(
      FirebaseService.getCachedTripById(tripId)?.participants.some(
        (participant) => participant.id === user.id
      )
    ).toBe(true);
  });

  it("keeps avatar changes in the trip cache", async () => {
    const tripId = "trip-cache-avatar";
    await primeTrip(tripId);

    const updatedTrip = await FirebaseService.updateUserAvatarConfig(
      tripId,
      "user-1",
      avatarConfig
    );

    expect(updatedTrip.participants[0].avatarConfig).toEqual(avatarConfig);
    expect(FirebaseService.getCachedTripById(tripId)).toBe(updatedTrip);
  });

  it("keeps participant removal in the trip cache", async () => {
    const tripId = "trip-cache-remove-user";
    const tripData = createTripData(tripId);
    tripData.participants.push({
      id: "user-2",
      name: "Bori",
      createdAt: timestamp("2026-08-02T00:00:00.000Z"),
    });
    tripData.expenses[0].participants.push("user-2");
    await primeTrip(tripId, tripData);

    const updatedTrip = await FirebaseService.removeUserFromTrip(
      tripId,
      "user-2"
    );

    expect(
      updatedTrip.participants.some((participant) => participant.id === "user-2")
    ).toBe(false);
    expect(updatedTrip.expenses[0].participants).not.toContain("user-2");
    expect(FirebaseService.getCachedTripById(tripId)).toBe(updatedTrip);
  });

  it("keeps expense deletion in the trip cache", async () => {
    const tripId = "trip-cache-delete-expense";
    await primeTrip(tripId);

    const updatedTrip = await FirebaseService.deleteExpense(
      tripId,
      "expense-1"
    );

    expect(updatedTrip.expenses).toHaveLength(0);
    expect(FirebaseService.getCachedTripById(tripId)).toBe(updatedTrip);
  });

  it("keeps budget changes in the trip cache", async () => {
    const tripId = "trip-cache-budget";
    await primeTrip(tripId);

    await FirebaseService.updateTripBudget(tripId, 150);

    expect(FirebaseService.getCachedTripById(tripId)?.perPersonBudget).toBe(
      150
    );

    await FirebaseService.updateTripBudget(tripId, null);

    expect(
      FirebaseService.getCachedTripById(tripId)?.perPersonBudget
    ).toBeUndefined();
  });
});
