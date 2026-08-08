import { Link } from "react-router-dom";
import { countLabel, t } from "../../i18n";
import type { Trip } from "../../types";
import { formatExpenseDate } from "../../utils";
import { ExpenseListItem } from "../ExpenseListItem";

interface RecentExpensesCardProps {
  onDelete: (expenseId: string) => void;
  trip: Trip;
}

export const RecentExpensesCard = ({
  onDelete,
  trip,
}: RecentExpensesCardProps) => {
  const recentExpenses = [...trip.expenses]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10);

  return (
    <>
      <div className="card">
        <Link
          to={`/group/${trip.id}/expenses`}
          className="expense-section-link"
          aria-label={`${t("allExpenses")} · ${countLabel(
            "expense",
            trip.expenses.length
          )}`}
        >
          <div className="section-heading">
            <h3>{t("expenses")}</h3>
            <span
              className="count-dot"
              aria-label={countLabel("expense", trip.expenses.length)}
              title={countLabel("expense", trip.expenses.length)}
            >
              {trip.expenses.length}
            </span>
          </div>
          <span className="expense-section-chevron" aria-hidden="true" />
        </Link>

        {recentExpenses.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "var(--ease-color-text-muted)",
              fontSize: "0.875rem",
            }}
          >
            <p>{t("noExpenses")}</p>
          </div>
        ) : (
          <div className="list">
            {recentExpenses.map((expense) => (
              <ExpenseListItem
                key={expense.id}
                dateLabel={formatExpenseDate(expense.date)}
                editTo={`/group/${trip.id}/edit-expense/${expense.id}`}
                expense={expense}
                onDelete={() => onDelete(expense.id)}
                paidByUser={trip.participants.find(
                  (participant) => participant.id === expense.paidBy
                )}
              />
            ))}
          </div>
        )}
      </div>

      {trip.expenses.length > 10 && (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <Link
            to={`/group/${trip.id}/expenses`}
            className="btn btn-secondary"
            style={{ fontSize: "0.875rem" }}
          >
            {t("allExpenses")} ({trip.expenses.length})
          </Link>
        </div>
      )}
    </>
  );
};
