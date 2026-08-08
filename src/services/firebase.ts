// Firebase database service for trip management
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  Timestamp,
  deleteField,
  runTransaction,
} from "firebase/firestore";
import { db } from "../config/firebase";
import type {
  Trip,
  User,
  Expense,
  FirestoreUser,
  FirestoreExpense,
  FirestoreTripData,
  AvatarConfig,
  ExpenseCategory,
  ExpenseSplitMode,
} from "../types";
import { DEFAULT_AVATAR_CONFIG } from "../utils/avatars";
import { generateRoomCode, generateId } from "../utils";
import {
  getAvailableMemberColorIndex,
  MAX_TRIP_PARTICIPANTS,
  normalizeMemberColorIndex,
  TripParticipantLimitError,
} from "../config/trip";
import {
  assertValidExpenseInput,
  removeParticipantFromExpenses,
} from "../utils/tripMutations";

type TripCacheEntry = {
  trip: Trip;
  cachedAt: number;
};

export class FirebaseService {
  private static readonly tripCacheTtl = 30_000;
  private static readonly tripCache = new Map<string, TripCacheEntry>();
  private static readonly tripRequests = new Map<string, Promise<Trip | null>>();

  private static cacheTrip(trip: Trip): Trip {
    this.tripCache.set(trip.id, { trip, cachedAt: Date.now() });
    return trip;
  }

  private static invalidateTripCache(tripId: string): void {
    this.tripCache.delete(tripId);
  }

  static getCachedTripById(tripId: string): Trip | null {
    return this.tripCache.get(tripId)?.trip ?? null;
  }

  private static toExpense(expense: FirestoreExpense): Expense {
    return {
      ...expense,
      date: expense.date.toDate(),
      createdAt: expense.createdAt.toDate(),
    };
  }

  private static toTrip(id: string, data: FirestoreTripData): Trip {
    return {
      ...data,
      id,
      perPersonBudget:
        typeof data.perPersonBudget === "number" && data.perPersonBudget > 0
          ? data.perPersonBudget
          : undefined,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      participants: data.participants.map((participant: FirestoreUser, index) => ({
        ...participant,
        colorIndex: normalizeMemberColorIndex(participant.colorIndex, index),
        createdAt: participant.createdAt.toDate(),
      })),
      expenses: data.expenses.map((expense) => this.toExpense(expense)),
    };
  }

  // Trip operations
  static async createTrip(
    name: string,
    description: string,
    creatorName: string,
    perPersonBudget?: number,
    avatarConfig: AvatarConfig = DEFAULT_AVATAR_CONFIG
  ): Promise<{ trip: Trip; roomCode: string }> {
    const roomCode = generateRoomCode();
    const creatorId = generateId();

    const creator: User = {
      id: creatorId,
      name: creatorName,
      colorIndex: 0,
      avatarConfig,
      createdAt: new Date(),
    };

    const trip: Trip = {
      id: generateId(),
      name,
      description,
      roomCode,
      ...(perPersonBudget ? { perPersonBudget } : {}),
      createdBy: creatorId,
      participants: [creator],
      expenses: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const docRef = await addDoc(collection(db, "trips"), {
        ...trip,
        createdAt: Timestamp.fromDate(trip.createdAt),
        updatedAt: Timestamp.fromDate(trip.updatedAt),
        participants: trip.participants.map((p) => ({
          ...p,
          createdAt: Timestamp.fromDate(p.createdAt),
        })),
      });

      const createdTrip = this.cacheTrip({ ...trip, id: docRef.id });
      return { trip: createdTrip, roomCode };
    } catch (error) {
      console.error("Error creating trip:", error);
      throw new Error("Failed to create trip");
    }
  }

  static async getTripByRoomCode(roomCode: string): Promise<Trip | null> {
    try {
      const q = query(
        collection(db, "trips"),
        where("roomCode", "==", roomCode)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data() as FirestoreTripData;
      return this.cacheTrip(this.toTrip(doc.id, data));
    } catch (error) {
      console.error("Error getting trip by room code:", error);
      throw new Error("Failed to find trip");
    }
  }

  static async getTripById(
    tripId: string,
    options: { force?: boolean } = {}
  ): Promise<Trip | null> {
    const cached = this.tripCache.get(tripId);
    const cacheIsFresh =
      cached && Date.now() - cached.cachedAt < this.tripCacheTtl;

    if (!options.force && cacheIsFresh) {
      return cached.trip;
    }

    const pendingRequest = this.tripRequests.get(tripId);
    if (pendingRequest) return pendingRequest;

    const request = (async () => {
      try {
        const docRef = doc(db, "trips", tripId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          this.tripCache.delete(tripId);
          return null;
        }

        const data = docSnap.data() as FirestoreTripData;
        return this.cacheTrip(this.toTrip(docSnap.id, data));
      } catch (error) {
        console.error("Error getting trip:", error);
        throw new Error("Failed to get trip");
      } finally {
        this.tripRequests.delete(tripId);
      }
    })();

    this.tripRequests.set(tripId, request);
    return request;
  }

  static async updateTripBudget(
    tripId: string,
    perPersonBudget: number | null
  ): Promise<void> {
    try {
      const tripRef = doc(db, "trips", tripId);
      const updatedAt = new Date();

      await updateDoc(tripRef, {
        perPersonBudget: perPersonBudget ?? deleteField(),
        updatedAt: Timestamp.fromDate(updatedAt),
      });

      this.invalidateTripCache(tripId);
    } catch (error) {
      console.error("Error updating trip budget:", error);
      throw new Error("Failed to update trip budget");
    }
  }

  // User operations
  static async addUserToTrip(
    tripId: string,
    userName: string,
    avatarConfig: AvatarConfig = DEFAULT_AVATAR_CONFIG
  ): Promise<User> {
    try {
      const tripRef = doc(db, "trips", tripId);
      let newUser!: User;
      let updatedAt!: Date;

      await runTransaction(db, async (transaction) => {
        const tripSnap = await transaction.get(tripRef);

        if (!tripSnap.exists()) {
          throw new Error("Trip not found");
        }

        const tripData = tripSnap.data() as FirestoreTripData;
        if (tripData.participants.length >= MAX_TRIP_PARTICIPANTS) {
          throw new TripParticipantLimitError();
        }

        const existingParticipants = tripData.participants.map(
          (participant, index) => ({
            ...participant,
            colorIndex: normalizeMemberColorIndex(participant.colorIndex, index),
          })
        );
        newUser = {
          id: generateId(),
          name: userName,
          colorIndex: getAvailableMemberColorIndex(existingParticipants),
          avatarConfig,
          createdAt: new Date(),
        };
        updatedAt = new Date();

        transaction.update(tripRef, {
          participants: [
            ...existingParticipants,
            {
              ...newUser,
              createdAt: Timestamp.fromDate(newUser.createdAt),
            },
          ],
          updatedAt: Timestamp.fromDate(updatedAt),
        });
      });

      this.invalidateTripCache(tripId);

      return newUser;
    } catch (error) {
      console.error("Error adding user to trip:", error);
      if (error instanceof TripParticipantLimitError) throw error;
      throw new Error("Failed to add user to trip");
    }
  }

  static async updateUserAvatarConfig(
    tripId: string,
    userId: string,
    avatarConfig: AvatarConfig
  ): Promise<void> {
    try {
      const tripRef = doc(db, "trips", tripId);
      const updatedAt = new Date();

      await runTransaction(db, async (transaction) => {
        const tripSnap = await transaction.get(tripRef);
        if (!tripSnap.exists()) throw new Error("Trip not found");

        const tripData = tripSnap.data() as FirestoreTripData;
        if (
          !tripData.participants.some(
            (participant) => participant.id === userId
          )
        ) {
          throw new Error("Participant not found");
        }

        transaction.update(tripRef, {
          participants: tripData.participants.map((participant) =>
            participant.id === userId
              ? { ...participant, avatarConfig }
              : participant
          ),
          updatedAt: Timestamp.fromDate(updatedAt),
        });
      });

      this.invalidateTripCache(tripId);
    } catch (error) {
      console.error("Error updating user avatar config:", error);
      throw new Error("Failed to update user avatar config");
    }
  }

  static async removeUserFromTrip(
    tripId: string,
    userId: string
  ): Promise<void> {
    try {
      const tripRef = doc(db, "trips", tripId);
      const updatedAt = new Date();

      await runTransaction(db, async (transaction) => {
        const tripSnap = await transaction.get(tripRef);
        if (!tripSnap.exists()) throw new Error("Trip not found");

        const tripData = tripSnap.data() as FirestoreTripData;
        if (tripData.createdBy === userId) {
          throw new Error("The trip creator cannot be removed");
        }
        if (
          !tripData.participants.some(
            (participant) => participant.id === userId
          )
        ) {
          throw new Error("Participant not found");
        }

        transaction.update(tripRef, {
          participants: tripData.participants.filter(
            (participant) => participant.id !== userId
          ),
          expenses: removeParticipantFromExpenses(tripData.expenses, userId),
          updatedAt: Timestamp.fromDate(updatedAt),
        });
      });

      this.invalidateTripCache(tripId);
    } catch (error) {
      console.error("Error removing user from trip:", error);
      throw new Error("Failed to remove user from trip");
    }
  }

  // Expense operations
  static async addExpense(
    tripId: string,
    description: string,
    amount: number,
    paidBy: string,
    participants: string[],
    category: ExpenseCategory = "other",
    date: Date = new Date(),
    splitMode: ExpenseSplitMode = "equal",
    shares?: Record<string, number>
  ): Promise<Expense> {
    try {
      const tripRef = doc(db, "trips", tripId);
      const newExpense: Expense = {
        id: generateId(),
        description,
        amount,
        paidBy,
        participants,
        category,
        splitMode,
        ...(splitMode === "custom" && shares ? { shares } : {}),
        date,
        createdAt: new Date(),
        tripId,
      };
      const updatedAt = new Date();

      await runTransaction(db, async (transaction) => {
        const tripSnap = await transaction.get(tripRef);
        if (!tripSnap.exists()) throw new Error("Trip not found");

        const tripData = tripSnap.data() as FirestoreTripData;
        assertValidExpenseInput(
          {
            description,
            amount,
            paidBy,
            participants,
            splitMode,
            shares,
            date,
          },
          tripData.participants.map(({ id }) => id)
        );

        transaction.update(tripRef, {
          expenses: [
            ...tripData.expenses,
            {
              ...newExpense,
              date: Timestamp.fromDate(newExpense.date),
              createdAt: Timestamp.fromDate(newExpense.createdAt),
            },
          ],
          updatedAt: Timestamp.fromDate(updatedAt),
        });
      });

      this.invalidateTripCache(tripId);

      return newExpense;
    } catch (error) {
      console.error("Error adding expense:", error);
      throw new Error("Failed to add expense");
    }
  }

  static async updateExpense(
    tripId: string,
    expenseId: string,
    description: string,
    amount: number,
    paidBy: string,
    participants: string[],
    category: ExpenseCategory = "other",
    date?: Date,
    splitMode: ExpenseSplitMode = "equal",
    shares?: Record<string, number>
  ): Promise<Expense> {
    try {
      const tripRef = doc(db, "trips", tripId);
      let expense!: Expense;
      const updatedAt = new Date();

      await runTransaction(db, async (transaction) => {
        const tripSnap = await transaction.get(tripRef);
        if (!tripSnap.exists()) throw new Error("Trip not found");

        const tripData = tripSnap.data() as FirestoreTripData;
        const existingExpense = tripData.expenses.find(
          (currentExpense) => currentExpense.id === expenseId
        );
        if (!existingExpense) throw new Error("Expense not found");

        const nextDate = date ?? existingExpense.date.toDate();
        assertValidExpenseInput(
          {
            description,
            amount,
            paidBy,
            participants,
            splitMode,
            shares,
            date: nextDate,
          },
          tripData.participants.map(({ id }) => id)
        );

        const updatedExpense = { ...existingExpense };
        delete updatedExpense.shares;
        Object.assign(updatedExpense, {
          description,
          amount,
          paidBy,
          participants,
          category,
          splitMode,
          date: Timestamp.fromDate(nextDate),
          ...(splitMode === "custom" && shares ? { shares } : {}),
        });

        transaction.update(tripRef, {
          expenses: tripData.expenses.map((currentExpense) =>
            currentExpense.id === expenseId ? updatedExpense : currentExpense
          ),
          updatedAt: Timestamp.fromDate(updatedAt),
        });
        expense = this.toExpense(updatedExpense);
      });

      this.invalidateTripCache(tripId);

      return expense;
    } catch (error) {
      console.error("Error updating expense:", error);
      throw new Error("Failed to update expense");
    }
  }

  static async deleteExpense(tripId: string, expenseId: string): Promise<void> {
    try {
      const tripRef = doc(db, "trips", tripId);
      const updatedAt = new Date();

      await runTransaction(db, async (transaction) => {
        const tripSnap = await transaction.get(tripRef);
        if (!tripSnap.exists()) throw new Error("Trip not found");

        const tripData = tripSnap.data() as FirestoreTripData;
        if (!tripData.expenses.some((expense) => expense.id === expenseId)) {
          throw new Error("Expense not found");
        }

        transaction.update(tripRef, {
          expenses: tripData.expenses.filter(
            (expense) => expense.id !== expenseId
          ),
          updatedAt: Timestamp.fromDate(updatedAt),
        });
      });

      this.invalidateTripCache(tripId);
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw new Error("Failed to delete expense");
    }
  }
}
