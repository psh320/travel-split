import type { Expense, User } from "../types";
import { countLabel, t } from "../i18n";
import { formatAmount } from "../utils";
import {
  EditIcon,
  IconButton,
  IconLink,
  TrashIcon,
} from "./ui/IconButton";
import { Avatar } from "./Avatar";

type ExpenseListItemProps = {
  dateLabel: string;
  editTo: string;
  expense: Expense;
  onDelete: () => void;
  paidByUser?: User;
};

export function ExpenseListItem({
  dateLabel,
  editTo,
  expense,
  onDelete,
  paidByUser,
}: ExpenseListItemProps) {
  return (
    <div className="list-item expense-list-item">
      <div
        className="expense-list-payer-profile"
        aria-label={`${t("paidBy").replace(" *", "")} ${paidByUser?.name || "-"}`}
      >
        {paidByUser && <Avatar user={paidByUser} size="md" decorative />}
        <strong title={paidByUser?.name}>{paidByUser?.name || "-"}</strong>
      </div>
      <div className="list-item-content expense-list-item-content">
        <div className="list-item-title">{expense.description}</div>
        <div className="expense-list-item-summary">
          <strong className="expense-list-item-amount">
            {formatAmount(expense.amount)}
          </strong>
        </div>
        <div className="expense-list-item-meta">
          <span className="expense-list-item-meta-entry">
            <span className="expense-list-item-meta-label">{t("split")}</span>
            <strong>
              {countLabel("person", expense.participants.length)}
              {expense.splitMode === "custom" ? ` · ${t("splitCustom")}` : ""}
            </strong>
          </span>
          <time
            className="expense-list-item-date"
            dateTime={expense.date.toISOString()}
          >
            {dateLabel}
          </time>
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
