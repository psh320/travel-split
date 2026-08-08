import { CloseIcon, IconButton } from "../ui/IconButton";
import { countLabel, t } from "../../i18n";
import type { CombinationBalance } from "../../types";
import { formatAmount } from "../../utils";

interface CombinationDetailsDialogProps {
  combination: CombinationBalance;
  currentUserId: string;
  onClose: () => void;
}

export const CombinationDetailsDialog = ({
  combination,
  currentUserId,
  onClose,
}: CombinationDetailsDialogProps) => (
  <div
    className="dashboard-modal-backdrop"
    onMouseDown={(event) => event.target === event.currentTarget && onClose()}
  >
    <section
      className="dashboard-modal balance-details-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="balance-details-title"
    >
      <div className="dashboard-modal-header">
        <div>
          <span className="balance-details-eyebrow">{t("details")}</span>
          <h2 id="balance-details-title">{combination.participantNames.join(" + ")}</h2>
        </div>
        <IconButton onClick={onClose} label={t("close")}>
          <CloseIcon />
        </IconButton>
      </div>

      <div className="balance-modal-section">
        <div className="balance-modal-section-heading">
          <strong>{t("expenses")}</strong>
          <span>{countLabel("expense", combination.expenses.length)}</span>
        </div>
        <div className="balance-expense-list">
          {combination.expenses.map((expense) => (
            <div className="balance-expense-row" key={expense.id}>
              <span>{expense.description}</span>
              <strong>{formatAmount(expense.amount)}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="balance-modal-section">
        <div className="balance-modal-section-heading">
          <strong>{t("balanceBreakdown")}</strong>
        </div>
        <div className="balance-modal-balance-list">
          {[...combination.balances]
            .sort((a, b) => b.netBalance - a.netBalance)
            .map((balance) => (
              <div className="balance-modal-balance-row" key={balance.userId}>
                <div>
                  <strong>
                    {balance.userName}
                    {balance.userId === currentUserId && <span className="combination-you">{t("you")}</span>}
                  </strong>
                  <span>
                    {t("paid")} {formatAmount(balance.totalPaid)} · {t("owes")} {formatAmount(balance.totalOwed)}
                  </span>
                </div>
                <strong
                  className={
                    balance.netBalance > 0
                      ? "is-positive"
                      : balance.netBalance < 0
                        ? "is-negative"
                        : "is-neutral"
                  }
                >
                  {balance.netBalance > 0 && "+"}
                  {formatAmount(Math.abs(balance.netBalance))}
                </strong>
              </div>
            ))}
        </div>
      </div>
    </section>
  </div>
);
