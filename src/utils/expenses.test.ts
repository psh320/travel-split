import { describe, expect, it } from "vitest";
import type { Expense, Trip, User } from "../types";
import { calculateBalances } from "./balanceCalculator";
import { createEqualShares, getExpenseShares } from "./expenses";

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
});
