import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import type { Expense, User } from "../../types";
import { ExpenseDetailsDialog } from "./ExpenseDetailsDialog";

const participants: User[] = [
  {
    id: "member-a",
    name: "Andrew",
    createdAt: new Date("2026-08-09T00:00:00Z"),
  },
  {
    id: "member-b",
    name: "Mina",
    createdAt: new Date("2026-08-09T00:00:00Z"),
  },
];

const expense: Expense = {
  id: "expense-a",
  description: "Hotel",
  amount: 300,
  paidBy: "member-a",
  participants: ["member-a", "member-b"],
  category: "lodging",
  splitMode: "equal",
  date: new Date("2026-08-09T00:00:00Z"),
  createdAt: new Date("2026-08-09T00:00:00Z"),
  tripId: "trip-a",
};

describe("ExpenseDetailsDialog", () => {
  it("shows the expense metadata and each participant share", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <ExpenseDetailsDialog
          editTo="/expenses/expense-a/edit"
          expense={expense}
          onClose={() => undefined}
          participants={participants}
        />
      </MemoryRouter>
    );

    expect(markup).toContain('role="dialog"');
    expect(markup).toContain("Hotel");
    expect(markup).toContain("$300.00");
    expect(markup).toContain("Andrew");
    expect(markup).toContain("Mina");
    expect(markup.match(/\$150\.00/g)).toHaveLength(2);
    expect(markup).toContain("Lodging");
  });
});
