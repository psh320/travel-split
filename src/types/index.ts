// Data models for the travel expense splitting app

export interface User {
  id: string;
  name: string;
  email?: string;
  createdAt: Date;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  paidBy: string; // User ID who paid
  participants: string[]; // Array of User IDs who should split this expense
  date: Date;
  createdAt: Date;
  tripId: string;
}

export interface Trip {
  id: string;
  name: string;
  description?: string;
  roomCode: string; // 6-character unique code for joining
  createdBy: string; // User ID of trip creator
  participants: User[];
  expenses: Expense[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Balance {
  userId: string;
  userName: string;
  totalPaid: number;
  totalOwed: number;
  netBalance: number; // positive means they are owed money, negative means they owe
}

export interface Settlement {
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  amount: number;
}

export interface BalanceSummary {
  balances: Balance[];
  settlements: Settlement[];
}

// Form types
export interface CreateTripForm {
  name: string;
  description?: string;
  creatorName: string;
}

export interface JoinTripForm {
  roomCode: string;
  userName: string;
}

export interface AddExpenseForm {
  description: string;
  amount: string; // Keep as string for form handling
  paidBy: string;
  participants: string[];
}

// Firestore-specific types (with Timestamp objects instead of Date objects)
export interface FirestoreUser {
  id: string;
  name: string;
  email?: string;
  createdAt: {
    toDate(): Date;
  };
}

export interface FirestoreExpense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  paidBy: string;
  participants: string[];
  date: {
    toDate(): Date;
  };
  createdAt: {
    toDate(): Date;
  };
  tripId: string;
}

export interface FirestoreTripData {
  name: string;
  description?: string;
  roomCode: string;
  createdBy: string;
  participants: FirestoreUser[];
  expenses: FirestoreExpense[];
  createdAt: {
    toDate(): Date;
  };
  updatedAt: {
    toDate(): Date;
  };
}
