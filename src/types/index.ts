// Data models for the travel expense splitting app
import type { AvatarId } from "../utils/avatars";

export type AvatarSkinTone =
  | "porcelain"
  | "peach"
  | "golden"
  | "tan"
  | "brown"
  | "deep";
export type AvatarHairStyle =
  | "bob"
  | "crop"
  | "curls"
  | "waves"
  | "long"
  | "bun"
  | "pixie"
  | "ponytail"
  | "braids"
  | "afro"
  | "shag"
  | "locs";
export type AvatarHairColor = "ink" | "chestnut" | "auburn" | "honey" | "rose";
export type AvatarEyeStyle = "round" | "happy" | "sparkle" | "sleepy" | "almond" | "wink";
export type AvatarNoseStyle = "dot" | "button" | "soft" | "triangle" | "bridge" | "snub";
export type AvatarMouthStyle = "smile" | "grin" | "open" | "pout" | "laugh" | "smirk" | "tiny";
export type AvatarAccessory = "none" | "glasses" | "freckles" | "blush" | "earrings" | "star";
export type AvatarBackground = "butter" | "sky" | "mint" | "peach" | "lilac" | "rose";
export type AvatarOutfit = "coral" | "mint" | "blue" | "lilac" | "sunny" | "navy";

export interface AvatarConfig {
  version: 1;
  skinTone: AvatarSkinTone;
  hairStyle: AvatarHairStyle;
  hairColor: AvatarHairColor;
  eyeStyle: AvatarEyeStyle;
  noseStyle: AvatarNoseStyle;
  mouthStyle: AvatarMouthStyle;
  accessory: AvatarAccessory;
  background: AvatarBackground;
  outfit: AvatarOutfit;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  colorIndex?: number;
  avatarId?: AvatarId;
  avatarConfig?: AvatarConfig;
  createdAt: Date;
}

export type ExpenseCategory =
  | "food"
  | "transport"
  | "lodging"
  | "activities"
  | "shopping"
  | "other";

export type ExpenseSplitMode = "equal" | "custom";

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string; // User ID who paid
  participants: string[]; // Array of User IDs who should split this expense
  category?: ExpenseCategory;
  splitMode?: ExpenseSplitMode;
  shares?: Record<string, number>; // Exact amount owed by each participant
  date: Date;
  createdAt: Date;
  tripId: string;
}

export interface Trip {
  id: string;
  name: string;
  description?: string;
  roomCode: string; // 6-character unique code for joining
  perPersonBudget?: number; // Optional spending target for each participant
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
  combinationBalances?: CombinationBalance[];
}

// New types for balance breakdown by participant combinations
export interface CombinationBalance {
  participantIds: string[]; // Sorted array of participant IDs in this combination
  participantNames: string[]; // Corresponding names
  expenses: Expense[]; // Expenses that involve exactly these participants
  balances: Balance[]; // Individual balances for this combination only
  settlements: Settlement[]; // Settlements needed within this combination
  totalAmount: number; // Total amount of expenses in this combination
}

// Form types
export interface CreateTripForm {
  name: string;
  description?: string;
  creatorName: string;
  perPersonBudget: string;
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
  category: ExpenseCategory;
  date: string;
  splitMode: ExpenseSplitMode;
  shares: Record<string, string>;
}

// Firestore-specific types (with Timestamp objects instead of Date objects)
export interface FirestoreUser {
  id: string;
  name: string;
  email?: string;
  colorIndex?: number;
  avatarId?: AvatarId;
  avatarConfig?: AvatarConfig;
  createdAt: {
    toDate(): Date;
  };
}

export interface FirestoreExpense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  participants: string[];
  category?: ExpenseCategory;
  splitMode?: ExpenseSplitMode;
  shares?: Record<string, number>;
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
  perPersonBudget?: number;
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
