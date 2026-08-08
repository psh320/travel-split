import type { Expense, User } from "../types";
import { countLabel, t } from "../i18n";
import { formatAmount } from "../utils";
import {
  EditIcon,
  IconButton,
  IconLink,
  PersonFilledIcon,
  TrashIcon,
} from "./ui/IconButton";
import { Avatar } from "./Avatar";

type ExpenseListItemProps = {
  editTo: string;
  expense: Expense;
  onDelete: () => void;
  paidByUser?: User;
};

export function ExpenseListItem({
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
        {paidByUser && <Avatar user={paidByUser} size="xs" decorative />}
        <strong title={paidByUser?.name}>{paidByUser?.name || "-"}</strong>
      </div>
      <div className="list-item-content expense-list-item-content">
        <div className="list-item-title">{expense.description}</div>
        <div className="expense-list-item-summary">
          <strong className="expense-list-item-amount">
            {formatAmount(expense.amount)}
          </strong>
          <span
            className="expense-list-participant-count"
            aria-label={`${countLabel("person", expense.participants.length)}${
              expense.splitMode === "custom" ? ` · ${t("splitCustom")}` : ""
            }`}
            title={countLabel("person", expense.participants.length)}
          >
            <strong>{expense.participants.length}</strong>
            <PersonFilledIcon />
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
