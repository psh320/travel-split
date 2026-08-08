import { Link } from "react-router-dom";
import { countLabel, t } from "../../i18n";
import type { Expense, User } from "../../types";
import { formatAmount, formatExpenseDate } from "../../utils";
import { Avatar } from "../Avatar";
import { CloseIcon, IconButton } from "../ui/IconButton";

type ExpenseDetailsDialogProps = {
  editTo: string;
  expense: Expense;
  onClose: () => void;
  participants: User[];
};

export function ExpenseDetailsDialog({
  editTo,
  expense,
  onClose,
  participants,
}: ExpenseDetailsDialogProps) {
  const payer = participants.find(
    (participant) => participant.id === expense.paidBy
  );
  const splitParticipants = expense.participants
    .map((participantId) =>
      participants.find((participant) => participant.id === participantId)
    )
    .filter((participant): participant is User => Boolean(participant));
  const equalShare = expense.amount / Math.max(expense.participants.length, 1);

  return (
    <div
      className="dashboard-modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="dashboard-modal expense-details-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`expense-details-title-${expense.id}`}
      >
        <div className="dashboard-modal-header expense-details-header">
          <div>
            <span>{t("details")}</span>
            <h2 id={`expense-details-title-${expense.id}`}>
              {expense.description}
            </h2>
          </div>
          <IconButton onClick={onClose} label={t("close")} autoFocus>
            <CloseIcon />
          </IconButton>
        </div>

        <strong className="expense-details-total">
          {formatAmount(expense.amount)}
        </strong>

        <div className="expense-details-meta">
          <div>
            <span>{t("paidBy").replace(" *", "")}</span>
            <strong>{payer?.name || "-"}</strong>
          </div>
          <div>
            <span>{t("expenseDate")}</span>
            <strong>{formatExpenseDate(expense.date)}</strong>
          </div>
          <div>
            <span>{t("category")}</span>
            <strong>{t(expense.category ?? "other")}</strong>
          </div>
          <div>
            <span>{t("splitMethod")}</span>
            <strong>
              {expense.splitMode === "custom"
                ? t("splitCustom")
                : t("splitEqually")}
            </strong>
          </div>
        </div>

        <div className="expense-details-participants-heading">
          <strong>{t("participants")}</strong>
          <span>{countLabel("person", splitParticipants.length)}</span>
        </div>
        <div className="expense-details-participants">
          {splitParticipants.map((participant) => (
            <div className="expense-details-participant" key={participant.id}>
              <Avatar user={participant} size="xs" decorative />
              <strong>{participant.name}</strong>
              <span>
                {formatAmount(
                  expense.splitMode === "custom" && expense.shares
                    ? expense.shares[participant.id] ?? 0
                    : equalShare
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="dashboard-modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            {t("close")}
          </button>
          <Link className="btn btn-primary" to={editTo}>
            {t("editExpense")}
          </Link>
        </div>
      </section>
    </div>
  );
}
