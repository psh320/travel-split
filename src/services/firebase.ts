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

export class FirebaseService {
  // Trip operations
  static async createTrip(
    name: string,
    description: string,
    creatorName: string
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

      return { trip: { ...trip, id: docRef.id }, roomCode };
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

      return {
        ...data,
        id: doc.id,
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
      } as Trip;
    } catch (error) {
      console.error("Error getting trip by room code:", error);
      throw new Error("Failed to find trip");
    }
  }

  static async getTripById(tripId: string): Promise<Trip | null> {
    try {
      const docRef = doc(db, "trips", tripId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data() as FirestoreTripData;
      return {
        ...data,
        id: docSnap.id,
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
      } as Trip;
    } catch (error) {
      console.error("Error getting trip:", error);
      throw new Error("Failed to get trip");
    }
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
        currency: "USD", // Default currency
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

      return newExpense;
    } catch (error) {
      console.error("Error adding expense:", error);
      throw new Error("Failed to add expense");
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
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw new Error("Failed to delete expense");
    }
  }
}
