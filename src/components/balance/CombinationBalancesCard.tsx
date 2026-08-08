import { countLabel, t } from "../../i18n";
import type { CombinationBalance } from "../../types";
import { formatAmount } from "../../utils";

interface CombinationBalancesCardProps {
  combinations: CombinationBalance[];
  expandedIndex: number | null;
  onDetails: (index: number) => void;
  onToggle: (index: number) => void;
}

export const CombinationBalancesCard = ({
  combinations,
  expandedIndex,
  onDetails,
  onToggle,
}: CombinationBalancesCardProps) => (
  <section className="card balance-groups-section">
    <div className="balance-groups-heading">
      <h3>{t("balanceByGroups")}</h3>
      <p>{t("balanceByGroupsSubtitle")}</p>
    </div>
    <div className="combination-list">
      {combinations.map((combo, index) => {
        const isSettled =
          combo.expenses.length > 0 &&
          combo.balances.every((balance) => Math.abs(balance.netBalance) <= 0.01);
        const hasMultipleSettlements = combo.settlements.length > 1;
        const isExpanded = expandedIndex === index;
        const statusLabel = isSettled
          ? t("allSettled")
          : combo.settlements.length > 1
            ? `${combo.settlements.length} ${t("paymentsNeeded")}`
            : combo.settlements.length === 0
              ? t("needsSettlement")
              : null;

        return (
          <div className={`combination-row ${isExpanded ? "is-expanded" : ""}`} key={index}>
            <div className="combination-summary">
              <button
                type="button"
                className={`combination-summary-toggle ${hasMultipleSettlements ? "is-expandable" : "is-static"}`}
                onClick={() => hasMultipleSettlements && onToggle(index)}
                aria-expanded={hasMultipleSettlements ? isExpanded : undefined}
                aria-controls={hasMultipleSettlements ? `combination-routes-${index}` : undefined}
              >
                <span className="combination-summary-main">
                  <span className="combination-names">{combo.participantNames.join(" + ")}</span>
                  <span className="combination-meta">
                    {countLabel("expense", combo.expenses.length)} · {t("total")} {formatAmount(combo.totalAmount)}
                  </span>
                  {combo.settlements.length === 1 && (
                    <span className="combination-inline-route">
                      <span>
                        <strong>{combo.settlements[0].fromUserName}</strong>{" "}
                        <span className="combination-route-arrow">→</span>{" "}
                        <strong>{combo.settlements[0].toUserName}</strong>
                      </span>
                      <strong className="combination-route-amount">
                        {formatAmount(combo.settlements[0].amount)}
                      </strong>
                    </span>
                  )}
                </span>
                {statusLabel && (
                  <span className={`combination-status ${isSettled ? "is-settled" : "needs-settlement"}`}>
                    {statusLabel}
                  </span>
                )}
                {hasMultipleSettlements ? (
                  <span className="combination-chevron" aria-hidden="true" />
                ) : (
                  <span className="combination-summary-spacer" aria-hidden="true" />
                )}
              </button>
              <button type="button" className="combination-details-trigger" onClick={() => onDetails(index)}>
                {t("details")}
              </button>
            </div>

            {hasMultipleSettlements && isExpanded && (
              <div className="combination-routes" id={`combination-routes-${index}`}>
                <div className="combination-routes-heading">
                  <span>{t("paymentRoutes")}</span>
                  <span>{combo.settlements.length}</span>
                </div>
                {combo.settlements.map((settlement, settlementIndex) => (
                  <div className="combination-route-row" key={settlementIndex}>
                    <span>
                      <strong>{settlement.fromUserName}</strong>{" "}
                      <span className="combination-route-arrow">→</span>{" "}
                      <strong>{settlement.toUserName}</strong>
                    </span>
                    <strong className="combination-route-amount">{formatAmount(settlement.amount)}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  </section>
);
