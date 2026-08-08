import type { Expense, ExpenseSplitMode } from "../types";
import { hasAtMostTwoDecimalPlaces, toMinorUnits } from "./currency";

type SplittableExpense = Pick<
  Expense,
  "paidBy" | "participants" | "splitMode" | "shares"
>;

export interface ExpenseInput {
  description: string;
  amount: number;
  paidBy: string;
  participants: string[];
  splitMode: ExpenseSplitMode;
  shares?: Record<string, number>;
  date: Date;
}

export const assertValidExpenseInput = (
  input: ExpenseInput,
  tripParticipantIds: string[]
): void => {
  const participantIds = new Set(tripParticipantIds);
  const uniqueExpenseParticipants = new Set(input.participants);

  if (!input.description.trim()) {
    throw new Error("Expense description is required");
  }
  if (
    !Number.isFinite(input.amount) ||
    input.amount <= 0 ||
    !hasAtMostTwoDecimalPlaces(input.amount)
  ) {
    throw new Error("Expense amount must be a positive currency value");
  }
  if (Number.isNaN(input.date.getTime())) {
    throw new Error("Expense date is invalid");
  }
  if (!participantIds.has(input.paidBy)) {
    throw new Error("Expense payer is invalid");
  }
  if (
    input.participants.length === 0 ||
    uniqueExpenseParticipants.size !== input.participants.length ||
    input.participants.some((id) => !participantIds.has(id))
  ) {
    throw new Error("Expense participants are invalid");
  }

  if (input.splitMode !== "custom") return;
  if (!input.shares) throw new Error("Custom expense shares are required");

  const shares = input.participants.map((id) => input.shares?.[id]);
  if (
    shares.some(
      (share) =>
        typeof share !== "number" ||
        !Number.isFinite(share) ||
        share < 0 ||
        !hasAtMostTwoDecimalPlaces(share)
    ) ||
    shares.reduce<number>(
      (sum, share) => sum + toMinorUnits(share ?? 0),
      0
    ) !==
      toMinorUnits(input.amount)
  ) {
    throw new Error("Custom expense shares must match the expense amount");
  }
};

export const removeParticipantFromExpenses = <T extends SplittableExpense>(
  expenses: readonly T[],
  userId: string
): T[] =>
  expenses
    .filter((expense) => expense.paidBy !== userId)
    .map((expense) => {
      const participantWasRemoved = expense.participants.includes(userId);
      const updatedExpense = {
        ...expense,
        participants: expense.participants.filter((id) => id !== userId),
      } as T;

      if (participantWasRemoved && expense.splitMode === "custom") {
        updatedExpense.splitMode = "equal";
        delete updatedExpense.shares;
      }

      return updatedExpense;
    })
    .filter((expense) => expense.participants.length > 0);
