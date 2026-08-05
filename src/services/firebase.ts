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
} from "firebase/firestore";
import { db } from "../config/firebase";
import type {
  Trip,
  User,
  Expense,
  FirestoreUser,
  FirestoreExpense,
  FirestoreTripData,
} from "../types";
import { generateRoomCode, generateId } from "../utils";

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

  private static updateCachedTrip(
    tripId: string,
    update: (trip: Trip) => Trip
  ): void {
    const cached = this.tripCache.get(tripId);
    if (!cached) return;
    this.cacheTrip(update(cached.trip));
  }

  static getCachedTripById(tripId: string): Trip | null {
    return this.tripCache.get(tripId)?.trip ?? null;
  }

  // Trip operations
  static async createTrip(
    name: string,
    description: string,
    creatorName: string,
    currency: string = "USD"
  ): Promise<{ trip: Trip; roomCode: string }> {
    const roomCode = generateRoomCode();
    const creatorId = generateId();

    const creator: User = {
      id: creatorId,
      name: creatorName,
      createdAt: new Date(),
    };

    const trip: Trip = {
      id: generateId(),
      name,
      description,
      roomCode,
      currency,
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

      return this.cacheTrip({
        ...data,
        id: doc.id,
        currency: data.currency ?? "USD",
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        participants: data.participants.map((p: FirestoreUser) => ({
          ...p,
          createdAt: p.createdAt.toDate(),
        })),
        expenses: data.expenses.map((e: FirestoreExpense) => ({
          ...e,
          date: e.date.toDate(),
          createdAt: e.createdAt.toDate(),
        })),
      } as Trip);
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
        return this.cacheTrip({
          ...data,
          id: docSnap.id,
          currency: data.currency ?? "USD",
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          participants: data.participants.map((p: FirestoreUser) => ({
            ...p,
            createdAt: p.createdAt.toDate(),
          })),
          expenses: data.expenses.map((e: FirestoreExpense) => ({
            ...e,
            date: e.date.toDate(),
            createdAt: e.createdAt.toDate(),
          })),
        } as Trip);
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

  // User operations
  static async addUserToTrip(tripId: string, userName: string): Promise<User> {
    try {
      const tripRef = doc(db, "trips", tripId);
      const tripSnap = await getDoc(tripRef);

      if (!tripSnap.exists()) {
        throw new Error("Trip not found");
      }

      const tripData = tripSnap.data() as FirestoreTripData;
      const newUser: User = {
        id: generateId(),
        name: userName,
        createdAt: new Date(),
      };

      const updatedParticipants = [
        ...tripData.participants,
        {
          ...newUser,
          createdAt: Timestamp.fromDate(newUser.createdAt),
        },
      ];

      await updateDoc(tripRef, {
        participants: updatedParticipants,
        updatedAt: Timestamp.fromDate(new Date()),
      });

      this.updateCachedTrip(tripId, (trip) => ({
        ...trip,
        participants: [...trip.participants, newUser],
        updatedAt: new Date(),
      }));

      return newUser;
    } catch (error) {
      console.error("Error adding user to trip:", error);
      throw new Error("Failed to add user to trip");
    }
  }

  static async removeUserFromTrip(
    tripId: string,
    userId: string
  ): Promise<void> {
    try {
      const tripRef = doc(db, "trips", tripId);
      const tripSnap = await getDoc(tripRef);

      if (!tripSnap.exists()) {
        throw new Error("Trip not found");
      }

      const tripData = tripSnap.data() as FirestoreTripData;

      // Remove user from participants array
      const updatedParticipants = tripData.participants.filter(
        (participant) => participant.id !== userId
      );

      // Remove user from all expense participants arrays
      const updatedExpenses = tripData.expenses
        .map((expense) => ({
          ...expense,
          participants: expense.participants.filter(
            (participantId) => participantId !== userId
          ),
        }))
        .filter(
          (expense) =>
            // Remove expenses where this user was the only participant or the payer with no other participants
            expense.participants.length > 0 || expense.paidBy !== userId
        );

      await updateDoc(tripRef, {
        participants: updatedParticipants,
        expenses: updatedExpenses,
        updatedAt: Timestamp.fromDate(new Date()),
      });

      this.updateCachedTrip(tripId, (trip) => ({
        ...trip,
        participants: trip.participants.filter((user) => user.id !== userId),
        expenses: trip.expenses
          .map((expense) => ({
            ...expense,
            participants: expense.participants.filter((id) => id !== userId),
          }))
          .filter(
            (expense) =>
              expense.participants.length > 0 || expense.paidBy !== userId
          ),
        updatedAt: new Date(),
      }));
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
    participants: string[]
  ): Promise<Expense> {
    try {
      const tripRef = doc(db, "trips", tripId);
      const tripSnap = await getDoc(tripRef);

      if (!tripSnap.exists()) {
        throw new Error("Trip not found");
      }

      const tripData = tripSnap.data() as FirestoreTripData;
      const newExpense: Expense = {
        id: generateId(),
        description,
        amount,
        currency: tripData.currency ?? "USD",
        paidBy,
        participants,
        date: new Date(),
        createdAt: new Date(),
        tripId,
      };

      const updatedExpenses = [
        ...tripData.expenses,
        {
          ...newExpense,
          date: Timestamp.fromDate(newExpense.date),
          createdAt: Timestamp.fromDate(newExpense.createdAt),
        },
      ];

      await updateDoc(tripRef, {
        expenses: updatedExpenses,
        updatedAt: Timestamp.fromDate(new Date()),
      });

      this.updateCachedTrip(tripId, (trip) => ({
        ...trip,
        expenses: [...trip.expenses, newExpense],
        updatedAt: new Date(),
      }));

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
    participants: string[]
  ): Promise<Expense> {
    try {
      const tripRef = doc(db, "trips", tripId);
      const tripSnap = await getDoc(tripRef);

      if (!tripSnap.exists()) {
        throw new Error("Trip not found");
      }

      const tripData = tripSnap.data() as FirestoreTripData;
      const existingExpense = tripData.expenses.find(
        (expense) => expense.id === expenseId
      );

      if (!existingExpense) {
        throw new Error("Expense not found");
      }

      const updatedExpense = {
        ...existingExpense,
        description,
        amount,
        currency: tripData.currency ?? "USD",
        paidBy,
        participants,
      };
      const updatedExpenses = tripData.expenses.map((expense) =>
        expense.id === expenseId ? updatedExpense : expense
      );

      await updateDoc(tripRef, {
        expenses: updatedExpenses,
        updatedAt: Timestamp.fromDate(new Date()),
      });

      const expense: Expense = {
        ...updatedExpense,
        date: existingExpense.date.toDate(),
        createdAt: existingExpense.createdAt.toDate(),
      };

      this.updateCachedTrip(tripId, (trip) => ({
        ...trip,
        expenses: trip.expenses.map((currentExpense) =>
          currentExpense.id === expenseId ? expense : currentExpense
        ),
        updatedAt: new Date(),
      }));

      return expense;
    } catch (error) {
      console.error("Error updating expense:", error);
      throw new Error("Failed to update expense");
    }
  }

  static async deleteExpense(tripId: string, expenseId: string): Promise<void> {
    try {
      const tripRef = doc(db, "trips", tripId);
      const tripSnap = await getDoc(tripRef);

      if (!tripSnap.exists()) {
        throw new Error("Trip not found");
      }

      const tripData = tripSnap.data() as FirestoreTripData;
      const updatedExpenses = tripData.expenses.filter(
        (e: FirestoreExpense) => e.id !== expenseId
      );

      await updateDoc(tripRef, {
        expenses: updatedExpenses,
        updatedAt: Timestamp.fromDate(new Date()),
      });

      this.updateCachedTrip(tripId, (trip) => ({
        ...trip,
        expenses: trip.expenses.filter((expense) => expense.id !== expenseId),
        updatedAt: new Date(),
      }));
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw new Error("Failed to delete expense");
    }
  }
}
