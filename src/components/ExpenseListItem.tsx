import type { Expense } from "../types";
import { countLabel, t } from "../i18n";
import { formatCurrency } from "../utils";
import {
  EditIcon,
  IconButton,
  IconLink,
  TrashIcon,
} from "./ui/IconButton";

type ExpenseListItemProps = {
  currency: string;
  dateLabel: string;
  editTo: string;
  expense: Expense;
  onDelete: () => void;
  paidByName?: string;
};

export function ExpenseListItem({
  currency,
  dateLabel,
  editTo,
  expense,
  onDelete,
  paidByName,
}: ExpenseListItemProps) {
  return (
    <div className="list-item expense-list-item">
      <div className="list-item-content expense-list-item-content">
        <div className="list-item-title">{expense.description}</div>
        <div className="expense-list-item-summary">
          <strong className="expense-list-item-amount">
            {formatCurrency(expense.amount, currency)}
          </strong>
          <time
            className="expense-list-item-date"
            dateTime={expense.date.toISOString()}
          >
            {dateLabel}
          </time>
        </div>
        <div className="expense-list-item-meta">
          <span className="expense-list-item-meta-entry">
            <span className="expense-list-item-meta-label">
              {t("paidBy").replace(" *", "")}
            </span>
            <strong>{paidByName || "-"}</strong>
          </span>
          <span className="expense-list-item-meta-entry">
            <span className="expense-list-item-meta-label">{t("split")}</span>
            <strong>
              {countLabel("person", expense.participants.length)}
            </strong>
          </span>
        </div>
      </div>
      <div className="list-item-actions">
        <IconLink
          to={editTo}
          className="list-item-icon-action"
          label={t("editExpense")}
        >
          <EditIcon />
        </IconLink>
        <IconButton
          onClick={onDelete}
          className="list-item-icon-action list-item-delete-action"
          label={t("remove")}
        >
          <TrashIcon />
        </IconButton>
      </div>
    </div>
  );
}
