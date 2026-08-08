import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import type { Expense, User } from "../types";
import { ExpenseListItem } from "./ExpenseListItem";

const paidByUser: User = {
  id: "member-a",
  name: "Andrew",
  colorIndex: 0,
  createdAt: new Date("2026-08-09T00:00:00Z"),
};

const expense: Expense = {
  id: "expense-a",
  description: "Hotel",
  amount: 300,
  paidBy: paidByUser.id,
  participants: [paidByUser.id, "member-b"],
  category: "lodging",
  date: new Date("2026-08-09T00:00:00Z"),
  createdAt: new Date("2026-08-09T00:00:00Z"),
  tripId: "trip-a",
};

describe("ExpenseListItem", () => {
  it("keeps category details out of the compact expense row", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <ExpenseListItem
          dateLabel="26/08/09"
          editTo="/expenses/expense-a/edit"
          expense={expense}
          onDelete={() => undefined}
          paidByUser={paidByUser}
        />
      </MemoryRouter>
    );

    expect(markup).toContain(">Hotel</div>");
    expect(markup).not.toContain("expense-category-badge");
    expect(markup).not.toContain("category-lodging");
  });
});
