import type { Expense, ExpenseCategory } from "../types";
import { fromMinorUnits, toMinorUnits } from "./currency";

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "food",
  "transport",
  "lodging",
  "activities",
  "shopping",
  "other",
];

export const createEqualShares = (
  amount: number,
  participantIds: string[]
): Record<string, number> => {
  if (!Number.isFinite(amount) || amount <= 0 || participantIds.length === 0) {
    return {};
  }

  const amountInMinorUnits = toMinorUnits(amount);
  const baseShare = Math.floor(amountInMinorUnits / participantIds.length);
  let assigned = 0;

  return participantIds.reduce<Record<string, number>>((shares, id, index) => {
    const share =
      index === participantIds.length - 1
        ? amountInMinorUnits - assigned
        : baseShare;
    shares[id] = fromMinorUnits(share);
    assigned += share;
    return shares;
  }, {});
};

export const getExpenseShares = (expense: Expense): Record<string, number> => {
  if (expense.participants.length === 0) return {};

  if (expense.splitMode !== "custom" || !expense.shares) {
    return createEqualShares(expense.amount, expense.participants);
  }

  const selectedShares = expense.participants.reduce<Record<string, number>>(
    (shares, participantId) => {
      const value = expense.shares?.[participantId];
      shares[participantId] =
        typeof value === "number" && Number.isFinite(value) && value >= 0
          ? toMinorUnits(value)
          : 0;
      return shares;
    },
    {}
  );
  const shareTotal = Object.values(selectedShares).reduce(
    (sum, share) => sum + share,
    0
  );

  if (shareTotal <= 0) {
    return createEqualShares(expense.amount, expense.participants);
  }

  const expenseAmount = toMinorUnits(expense.amount);
  let assigned = 0;
  const normalized = Object.entries(selectedShares).reduce<Record<string, number>>(
    (shares, [participantId, share], index, entries) => {
      const normalizedShare =
        index === entries.length - 1
          ? expenseAmount - assigned
          : Math.floor((share / shareTotal) * expenseAmount);
      shares[participantId] = fromMinorUnits(normalizedShare);
      assigned += normalizedShare;
      return shares;
    },
    {}
  );

  return normalized;
};

export const toExpenseDateInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseExpenseDateInput = (value: string): Date => {
  const parsed = new Date(`${value}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};
