import { useId, useState, type CSSProperties } from "react";
import { t } from "../../i18n";
import type { Trip } from "../../types";
import { formatAmount } from "../../utils";
import { getParticipantCategorySpending } from "../../utils/expenses";
import { AnimatedAmount } from "../AnimatedAmount";
import { Avatar } from "../Avatar";

interface SpendingSummaryCardProps {
  currentUserId: string;
  totalExpenses: number;
  trip: Trip;
}

export const SpendingSummaryCard = ({
  currentUserId,
  totalExpenses,
  trip,
}: SpendingSummaryCardProps) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const detailsId = useId();
  const currentParticipant = trip.participants.find(
    (participant) => participant.id === currentUserId
  );
  const categorySummary = currentParticipant
    ? getParticipantCategorySpending(trip.expenses, currentParticipant.id)
    : [];
  const maxCategoryAmount = categorySummary[0]?.amount ?? 0;
  const currentUserSpending = currentParticipant
    ? categorySummary.reduce((sum, item) => sum + item.amount, 0)
    : null;
  const budgetSpending = currentUserSpending ?? totalExpenses;
  const activeBudgetTarget = trip.perPersonBudget
    ? currentParticipant
      ? trip.perPersonBudget
      : trip.perPersonBudget * Math.max(trip.participants.length, 1)
    : null;
  const budgetUsage = activeBudgetTarget
    ? (budgetSpending / activeBudgetTarget) * 100
    : 0;
  const budgetOverage = activeBudgetTarget
    ? Math.max(budgetSpending - activeBudgetTarget, 0)
    : 0;
  const isOverBudget = budgetOverage > 0;
  const spendingLabel = currentParticipant ? t("mySpending") : t("groupSpent");

  return (
    <div className="card spending-summary-card">
      <div className="summary-card-heading">
        <span className="summary-eyebrow">
          {activeBudgetTarget ? t("budgetAtGlance") : t("spendingSummary")}
        </span>
      </div>

      {currentParticipant && (
        <div className="budget-user-context">
          <Avatar user={currentParticipant} size="sm" decorative />
          <strong>{currentParticipant.name}</strong>
        </div>
      )}

      <div className="personal-spending-summary">
        {activeBudgetTarget ? (
          <div className={`budget-progress${isOverBudget ? " is-over" : ""}`}>
            <div className="budget-amount-comparison">
              <strong>
                <AnimatedAmount amount={budgetSpending} />
              </strong>
              <span>/ {formatAmount(activeBudgetTarget)}</span>
            </div>
            <div className="budget-progress-caption">
              <span>{spendingLabel}</span>
              <span>
                {Math.round(budgetUsage)}% {t("budgetUsed")}
              </span>
            </div>
            <div
              className="budget-progress-track"
              role="progressbar"
              aria-label={`${spendingLabel} ${formatAmount(
                budgetSpending
              )} / ${formatAmount(activeBudgetTarget)}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(Math.min(budgetUsage, 100))}
              aria-valuetext={`${Math.round(budgetUsage)}% ${t("budgetUsed")}`}
            >
              <span
                className="motion-progress-fill"
                style={{ width: `${Math.min(budgetUsage, 100)}%` }}
              />
            </div>
            {isOverBudget && (
              <strong className="budget-overage">
                {formatAmount(budgetOverage)} {t("overBudget")}
              </strong>
            )}
          </div>
        ) : (
          <div className="spending-amount-only">
            <div className="budget-amount-comparison">
              <strong>
                <AnimatedAmount amount={budgetSpending} />
              </strong>
            </div>
            <span>{spendingLabel}</span>
          </div>
        )}
      </div>

      {categorySummary.length > 0 && (
        <>
          <button
            type="button"
            className="budget-details-toggle"
            aria-controls={detailsId}
            aria-expanded={detailsOpen}
            onClick={() => setDetailsOpen((open) => !open)}
          >
            <span>{detailsOpen ? t("hideDetails") : t("showDetails")}</span>
            <span className="budget-details-chevron" aria-hidden="true" />
          </button>

          {detailsOpen && (
            <div className="budget-details" id={detailsId}>
              <div className="category-spending-section is-personal">
                <span className="summary-eyebrow">
                  {t("mySpendingByCategory")}
                </span>
                <div className="category-bar-list">
                  {categorySummary.map((item, index) => (
                    <div className="category-bar-row" key={item.category}>
                      <div className="category-bar-heading">
                        <span>
                          <span
                            className={`expense-category-dot category-${item.category}`}
                          />
                          {t(item.category)}
                        </span>
                        <strong>
                          <AnimatedAmount amount={item.amount} />
                        </strong>
                      </div>
                      <div
                        className="category-bar-track"
                        role="img"
                        aria-label={`${t("mySpendingByCategory")}: ${t(
                          item.category
                        )} ${formatAmount(item.amount)}`}
                      >
                        <span
                          className={`category-bar-fill category-${item.category}`}
                          style={
                            {
                              width: `${(item.amount / maxCategoryAmount) * 100}%`,
                              "--bar-delay": `${160 + index * 80}ms`,
                            } as CSSProperties
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
