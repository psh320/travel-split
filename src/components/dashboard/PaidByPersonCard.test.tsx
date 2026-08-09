import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { Trip } from "../../types";
import { PaidByPersonCard } from "./PaidByPersonCard";

const now = new Date("2026-08-09T00:00:00Z");
const trip: Trip = {
  id: "trip-a",
  name: "Test trip",
  roomCode: "ABC123",
  createdBy: "member-a",
  perPersonBudget: 500,
  participants: [
    { id: "member-a", name: "Andrew", createdAt: now },
    { id: "member-b", name: "Mina", createdAt: now },
  ],
  expenses: [
    {
      id: "expense-a",
      description: "Hotel",
      amount: 300,
      paidBy: "member-a",
      participants: ["member-a", "member-b"],
      category: "lodging",
      date: now,
      createdAt: now,
      tripId: "trip-a",
    },
  ],
  createdAt: now,
  updatedAt: now,
};

describe("PaidByPersonCard", () => {
  it("shows group payment distribution and group metrics", () => {
    const markup = renderToStaticMarkup(
      <PaidByPersonCard
        prefersReducedMotion
        totalExpenses={300}
        trip={trip}
      />
    );

    expect(markup).toContain("spending-summary-body");
    expect(markup).toContain("summary-metrics");
    expect(markup).toContain("Andrew");
  });

  it("does not repeat group totals when no budget is set", () => {
    const markup = renderToStaticMarkup(
      <PaidByPersonCard
        prefersReducedMotion
        totalExpenses={300}
        trip={{ ...trip, perPersonBudget: undefined }}
      />
    );

    expect(markup).toContain("spending-summary-body");
    expect(markup).not.toContain("summary-metrics");
  });
});
