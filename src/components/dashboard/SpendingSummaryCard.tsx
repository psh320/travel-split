import type { CSSProperties } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { getMemberAccentColor } from "../../config/trip";
import { t } from "../../i18n";
import type { Trip } from "../../types";
import { formatAmount } from "../../utils";
import { EXPENSE_CATEGORIES, getExpenseShares } from "../../utils/expenses";
import { AnimatedAmount } from "../AnimatedAmount";
import { Avatar } from "../Avatar";

interface SpendingSummaryCardProps {
  currentUserId: string;
  onEditBudget: () => void;
  prefersReducedMotion: boolean;
  totalExpenses: number;
  trip: Trip;
}

export const SpendingSummaryCard = ({
  currentUserId,
  onEditBudget,
  prefersReducedMotion,
  totalExpenses,
  trip,
}: SpendingSummaryCardProps) => {
  const paidSummary = trip.participants
    .map((participant, index) => ({
      ...participant,
      amount: trip.expenses
        .filter((expense) => expense.paidBy === participant.id)
        .reduce((sum, expense) => sum + expense.amount, 0),
      color: getMemberAccentColor(participant.colorIndex, index),
    }))
    .filter((participant) => participant.amount > 0)
    .sort((a, b) => b.amount - a.amount);
  const chartData = paidSummary.length
    ? paidSummary
    : [
        {
          id: "empty",
          name: t("noExpenses"),
          amount: 1,
          color: "#E5E7E9",
        },
      ];
  const categorySummary = EXPENSE_CATEGORIES.map((category) => ({
    category,
    amount: trip.expenses
      .filter((expense) => (expense.category ?? "other") === category)
      .reduce((sum, expense) => sum + expense.amount, 0),
  }))
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);
  const maxCategoryAmount = categorySummary[0]?.amount ?? 0;
  const participantCount = Math.max(trip.participants.length, 1);
  const currentParticipant = trip.participants.find(
    (participant) => participant.id === currentUserId
  );
  const currentUserSpending = currentParticipant
    ? trip.expenses.reduce((sum, expense) => {
        if (!expense.participants.includes(currentParticipant.id)) return sum;
        return sum + (getExpenseShares(expense)[currentParticipant.id] ?? 0);
      }, 0)
    : null;
  const groupBudget = trip.perPersonBudget
    ? trip.perPersonBudget * participantCount
    : null;
  const budgetSpending = currentUserSpending ?? totalExpenses;
  const activeBudgetTarget = trip.perPersonBudget
    ? currentParticipant
      ? trip.perPersonBudget
      : groupBudget
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
        <span className="summary-eyebrow">{t("budgetAtGlance")}</span>
      </div>

      {currentParticipant && (
        <div className="budget-user-context">
          <Avatar user={currentParticipant} size="sm" decorative />
          <span>{t("currentUser")}</span>
          <strong>{currentParticipant.name}</strong>
        </div>
      )}

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
          {trip.createdBy === currentUserId && (
            <button
              type="button"
              className="budget-edit-trigger"
              onClick={onEditBudget}
            >
              {t("editBudget")}
            </button>
          )}
        </div>
      ) : (
        <div className="budget-empty-state">
          <div>
            <strong>{t("budgetNotSet")}</strong>
            <span>{t("perPersonBudgetHelp")}</span>
          </div>
          {trip.createdBy === currentUserId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onEditBudget}
            >
              {t("setBudget")}
            </button>
          )}
        </div>
      )}

      <div className="spending-breakdown-heading">
        <span className="summary-eyebrow">{t("spendingByPerson")}</span>
      </div>

      <div className="spending-summary-body">
        <div
          className="spending-chart"
          role="img"
          aria-label={`${t("totalSpent")} ${formatAmount(totalExpenses)}`}
        >
          <div className="spending-chart-canvas" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart accessibilityLayer={false}>
                <Pie
                  data={chartData}
                  dataKey="amount"
                  nameKey="name"
                  rootTabIndex={-1}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="92%"
                  paddingAngle={paidSummary.length > 1 ? 2 : 0}
                  cornerRadius={4}
                  stroke="var(--ease-color-surface-raised)"
                  strokeWidth={2}
                  animationBegin={80}
                  animationDuration={720}
                  animationEasing="ease-out"
                  isAnimationActive={!prefersReducedMotion}
                >
                  {chartData.map((participant) => (
                    <Cell key={participant.id} fill={participant.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="spending-chart-hole">
            <span>{t("totalSpent")}</span>
            <strong>
              <AnimatedAmount amount={totalExpenses} compact duration={720} />
            </strong>
          </div>
        </div>

        <div className="spending-legend">
          {paidSummary.length ? (
            paidSummary.map((participant) => (
              <div key={participant.id} className="spending-legend-item">
                <Avatar
                  user={participant}
                  size="xs"
                  decorative
                  className="spending-legend-avatar"
                />
                <div className="spending-legend-copy">
                  <span
                    className="spending-legend-name"
                    title={participant.name}
                  >
                    {participant.name}
                  </span>
                  <strong>{formatAmount(participant.amount)}</strong>
                </div>
              </div>
            ))
          ) : (
            <p className="muted">{t("noExpenses")}</p>
          )}
        </div>
      </div>

      <div className="summary-metrics">
        <div>
          <span>{t("groupSpent")}</span>
          <strong>
            <AnimatedAmount amount={totalExpenses} />
          </strong>
        </div>
        <div>
          <span>{groupBudget ? t("groupBudget") : t("totalSpent")}</span>
          <strong>
            <AnimatedAmount amount={groupBudget ?? totalExpenses} />
          </strong>
        </div>
      </div>

      {categorySummary.length > 0 && (
        <div className="category-spending-section">
          <span className="summary-eyebrow">{t("spendingByCategory")}</span>
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
                  aria-label={`${t(item.category)} ${formatAmount(item.amount)}`}
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
      )}
    </div>
  );
};
