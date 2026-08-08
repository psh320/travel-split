import { describe, expect, it } from "vitest";
import type { Expense } from "../types";
import {
  assertValidExpenseInput,
  removeParticipantFromExpenses,
} from "./tripMutations";

const date = new Date("2026-08-08T12:00:00Z");
const expense = (overrides: Partial<Expense>): Expense => ({
  id: "expense",
  tripId: "trip",
  description: "Dinner",
  amount: 30,
  paidBy: "a",
  participants: ["a", "b", "c"],
  splitMode: "equal",
  date,
  createdAt: date,
  ...overrides,
});

describe("trip mutations", () => {
  it("removes paid expenses and safely resets affected custom splits", () => {
    const expenses = [
      expense({ id: "paid", paidBy: "b" }),
      expense({
        id: "custom",
        splitMode: "custom",
        shares: { a: 10, b: 10, c: 10 },
      }),
      expense({ id: "unaffected", participants: ["a", "c"] }),
    ];

    expect(removeParticipantFromExpenses(expenses, "b")).toEqual([
      expense({
        id: "custom",
        participants: ["a", "c"],
        splitMode: "equal",
      }),
      expense({ id: "unaffected", participants: ["a", "c"] }),
    ]);
  });

  it("rejects dangling, duplicate, or inconsistent expense data", () => {
    const validInput = {
      description: "Dinner",
      amount: 30,
      paidBy: "a",
      participants: ["a", "b"],
      splitMode: "custom" as const,
      shares: { a: 10, b: 20 },
      date,
    };

    expect(() => assertValidExpenseInput(validInput, ["a", "b"])).not.toThrow();
    expect(() =>
      assertValidExpenseInput(
        { ...validInput, participants: ["a", "a"] },
        ["a", "b"]
      )
    ).toThrow("participants");
    expect(() =>
      assertValidExpenseInput(
        { ...validInput, shares: { a: 10, b: 19.99 } },
        ["a", "b"]
      )
    ).toThrow("shares");
  });
});
