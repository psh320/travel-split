import { describe, expect, it } from "vitest";
import type { Expense, Trip, User } from "../types";
import { calculateBalances } from "./balanceCalculator";
import {
  createEqualShares,
  getExpenseShares,
  getParticipantCategorySpending,
} from "./expenses";

const createdAt = new Date("2026-08-08T12:00:00");
const participants: User[] = [
  { id: "a", name: "A", createdAt },
  { id: "b", name: "B", createdAt },
  { id: "c", name: "C", createdAt },
];

const makeTrip = (expense: Expense): Trip => ({
  id: "trip",
  name: "Test trip",
  roomCode: "ABC123",
  createdBy: "a",
  participants,
  expenses: [expense],
  createdAt,
  updatedAt: createdAt,
});

describe("expense shares", () => {
  it("keeps equal shares rounded to the exact expense total", () => {
    const shares = createEqualShares(100, ["a", "b", "c"]);

    expect(shares).toEqual({ a: 33.33, b: 33.33, c: 33.34 });
    expect(Object.values(shares).reduce((sum, share) => sum + share, 0)).toBe(
      100
    );
  });

  it("keeps floating-point edge cases at the exact cent total", () => {
    const shares = createEqualShares(10.01, ["a", "b", "c"]);

    expect(shares).toEqual({ a: 3.33, b: 3.33, c: 3.35 });
    expect(Math.round(Object.values(shares).reduce((sum, share) => sum + share, 0) * 100)).toBe(1001);
  });

  it("uses exact custom shares in the final balances", () => {
    const expense: Expense = {
      id: "expense",
      tripId: "trip",
      description: "Room upgrade",
      amount: 120,
      paidBy: "a",
      participants: ["a", "b", "c"],
      splitMode: "custom",
      shares: { a: 20, b: 40, c: 60 },
      date: createdAt,
      createdAt,
    };

    expect(getExpenseShares(expense)).toEqual({ a: 20, b: 40, c: 60 });

    const balances = calculateBalances(makeTrip(expense)).balances;
    expect(balances.find((balance) => balance.userId === "a")?.netBalance).toBe(
      100
    );
    expect(balances.find((balance) => balance.userId === "b")?.netBalance).toBe(
      -40
    );
    expect(balances.find((balance) => balance.userId === "c")?.netBalance).toBe(
      -60
    );
  });

  it("falls back to equal shares for older expenses", () => {
    const expense: Expense = {
      id: "legacy",
      tripId: "trip",
      description: "Taxi",
      amount: 30,
      paidBy: "a",
      participants: ["a", "b", "c"],
      date: createdAt,
      createdAt,
    };

    expect(getExpenseShares(expense)).toEqual({ a: 10, b: 10, c: 10 });
  });

  it("does not drop a one-cent settlement", () => {
    const expense: Expense = {
      id: "cent",
      tripId: "trip",
      description: "Rounding edge",
      amount: 0.02,
      paidBy: "a",
      participants: ["a", "b"],
      date: createdAt,
      createdAt,
    };

    expect(calculateBalances(makeTrip(expense)).settlements).toEqual([
      {
        fromUserId: "b",
        fromUserName: "B",
        toUserId: "a",
        toUserName: "A",
        amount: 0.01,
      },
    ]);
  });

  it("groups only the participant's own shares by category", () => {
    const expenses: Expense[] = [
      {
        id: "dinner",
        tripId: "trip",
        description: "Dinner",
        amount: 90,
        paidBy: "b",
        participants: ["a", "b"],
        category: "food",
        date: createdAt,
        createdAt,
      },
      {
        id: "snack",
        tripId: "trip",
        description: "Snack",
        amount: 10,
        paidBy: "a",
        participants: ["a"],
        category: "food",
        date: createdAt,
        createdAt,
      },
      {
        id: "train",
        tripId: "trip",
        description: "Train",
        amount: 120,
        paidBy: "b",
        participants: ["a", "b"],
        splitMode: "custom",
        shares: { a: 20, b: 100 },
        category: "transport",
        date: createdAt,
        createdAt,
      },
      {
        id: "hotel",
        tripId: "trip",
        description: "Hotel",
        amount: 200,
        paidBy: "b",
        participants: ["b"],
        category: "lodging",
        date: createdAt,
        createdAt,
      },
    ];

    expect(getParticipantCategorySpending(expenses, "a")).toEqual([
      { category: "food", amount: 55 },
      { category: "transport", amount: 20 },
    ]);
  });
});
