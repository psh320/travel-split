import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { getMemberAccentColor } from "../../config/trip";
import { t } from "../../i18n";
import type { Trip } from "../../types";
import { formatAmount } from "../../utils";
import { AnimatedAmount } from "../AnimatedAmount";
import { Avatar } from "../Avatar";

interface PaidByPersonCardProps {
  prefersReducedMotion: boolean;
  totalExpenses: number;
  trip: Trip;
}

export const PaidByPersonCard = ({
  prefersReducedMotion,
  totalExpenses,
  trip,
}: PaidByPersonCardProps) => {
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
  const groupBudget = trip.perPersonBudget
    ? trip.perPersonBudget * Math.max(trip.participants.length, 1)
    : null;

  return (
    <div className="card paid-by-person-card">
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
                  memberAccent
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

      {groupBudget && (
        <div className="summary-metrics">
          <div>
            <span>{t("groupSpent")}</span>
            <strong>
              <AnimatedAmount amount={totalExpenses} />
            </strong>
          </div>
          <div>
            <span>{t("groupBudget")}</span>
            <strong>
              <AnimatedAmount amount={groupBudget} />
            </strong>
          </div>
        </div>
      )}
    </div>
  );
};
