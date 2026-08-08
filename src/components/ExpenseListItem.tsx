import { useState } from "react";
import { createPortal } from "react-dom";
import type { Expense, User } from "../types";
import { countLabel, t } from "../i18n";
import { formatAmount } from "../utils";
import { useDialogLifecycle } from "../hooks/useDialogLifecycle";
import {
  EditIcon,
  IconButton,
  IconLink,
  PersonFilledIcon,
  TrashIcon,
} from "./ui/IconButton";
import { Avatar } from "./Avatar";
import { ExpenseDetailsDialog } from "./expense/ExpenseDetailsDialog";

type ExpenseListItemProps = {
  editTo: string;
  expense: Expense;
  onDelete: () => void;
  paidByUser?: User;
  participants: User[];
};

export function ExpenseListItem({
  editTo,
  expense,
  onDelete,
  paidByUser,
  participants,
}: ExpenseListItemProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  useDialogLifecycle(detailsOpen, () => setDetailsOpen(false));

  return (
    <>
      <div className="list-item expense-list-item">
        <button
          type="button"
          className="expense-list-details-trigger"
          aria-haspopup="dialog"
          aria-label={`${expense.description}, ${formatAmount(expense.amount)}, ${t("details")}`}
          onClick={() => setDetailsOpen(true)}
        >
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
                  expense.splitMode === "custom"
                    ? ` · ${t("splitCustom")}`
                    : ""
                }`}
                title={countLabel("person", expense.participants.length)}
              >
                <strong>{expense.participants.length}</strong>
                <PersonFilledIcon />
              </span>
            </div>
          </div>
        </button>
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
      {detailsOpen &&
        createPortal(
          <ExpenseDetailsDialog
            editTo={editTo}
            expense={expense}
            onClose={() => setDetailsOpen(false)}
            participants={participants}
          />,
          document.body
        )}
    </>
  );
}
