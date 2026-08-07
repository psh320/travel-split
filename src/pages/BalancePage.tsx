import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AppHeader } from "../components/ui/AppHeader";
import { CloseIcon, IconButton } from "../components/ui/IconButton";
import { FirebaseService } from "../services/firebase";
import type { Trip, BalanceSummary } from "../types";
import { calculateBalances } from "../utils/balanceCalculator";
import { formatAmount } from "../utils";
import { countLabel, t } from "../i18n";
import { useToast } from "../components/ui/useToast";
import { Avatar } from "../components/Avatar";
import { SettlementRouteCard } from "../components/SettlementRouteCard";

const BalancePage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const cachedTrip = groupId ? FirebaseService.getCachedTripById(groupId) : null;
  const [trip, setTrip] = useState<Trip | null>(cachedTrip);
  const [balanceSummary, setBalanceSummary] = useState<BalanceSummary | null>(
    cachedTrip ? calculateBalances(cachedTrip) : null
  );
  const [loading, setLoading] = useState(!cachedTrip);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [expandedCombinationIndex, setExpandedCombinationIndex] = useState<number | null>(null);
  const [detailsCombinationIndex, setDetailsCombinationIndex] = useState<number | null>(null);

  const loadTrip = useCallback(async () => {
    if (!groupId) return;

    const hasCachedTrip = Boolean(FirebaseService.getCachedTripById(groupId));
    if (!hasCachedTrip) setLoading(true);
    try {
      const tripData = await FirebaseService.getTripById(groupId, {
        force: hasCachedTrip,
      });
      if (tripData) {
        setTrip(tripData);
        const summary = calculateBalances(tripData);
        setBalanceSummary(summary);
      } else {
        showToast(t("groupNotFound"), "error");
        navigate("/");
      }
    } catch (error) {
      console.error("Error loading trip:", error);
      showToast(t("groupNotFound"), "error");
    } finally {
      setLoading(false);
    }
  }, [groupId, navigate, showToast]);

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (userId) {
      setCurrentUserId(userId);
    }

    loadTrip();
  }, [groupId, loadTrip]);

  useEffect(() => {
    if (detailsCombinationIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDetailsCombinationIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [detailsCombinationIndex]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );
  }

  if (!trip || !balanceSummary) {
    return (
      <div className="content">
        <div className="card">
          <h3>{t("unableToLoadBalance")}</h3>
          <Link to={`/group/${groupId}`} className="btn btn-primary">
            {t("goBack")}
          </Link>
        </div>
      </div>
    );
  }

  const currentUserBalance = balanceSummary.balances.find(
    (b) => b.userId === currentUserId
  );
  const currentUser = trip.participants.find((user) => user.id === currentUserId);
  const currentUserSettlements = balanceSummary.settlements.filter(
    (s) => s.fromUserId === currentUserId || s.toUserId === currentUserId
  );
  const combinationBalances = balanceSummary.combinationBalances ?? [];
  const selectedCombination =
    detailsCombinationIndex === null
      ? null
      : combinationBalances[detailsCombinationIndex] ?? null;

  return (
    <>
      <AppHeader
        backTo={`/group/${groupId}`}
        title={t("balance")}
        subtitle={t("balanceSubtitle")}
      />

      <div className="content">
        {/* Your Balance */}
        {currentUserBalance && (
          <section className="card balance-result-card">
            <div className="balance-result-profile">
              {currentUser && <Avatar user={currentUser} size="lg" decorative eager />}
              <div>
                <span>{t("yourBalance")}</span>
                <strong>{currentUser?.name ?? currentUserBalance.userName}</strong>
              </div>
            </div>
            <div
              className={`balance-result-message ${
                currentUserBalance.netBalance > 0
                  ? "is-positive"
                  : currentUserBalance.netBalance < 0
                  ? "is-negative"
                  : "is-neutral"
              }`}
            >
              {currentUserBalance.netBalance > 0
                ? t("receiveMessage").replace(
                    "{amount}",
                    formatAmount(currentUserBalance.netBalance)
                  )
                : currentUserBalance.netBalance < 0
                ? t("payMessage").replace(
                    "{amount}",
                    formatAmount(Math.abs(currentUserBalance.netBalance))
                  )
                : t("settled")}
            </div>
            <div className="balance-result-metrics">
              <div>
                <span>{t("totalPaidLabel")}</span>
                <strong>{formatAmount(currentUserBalance.totalPaid)}</strong>
              </div>
              <div>
                <span>{t("yourShare")}</span>
                <strong>{formatAmount(currentUserBalance.totalOwed)}</strong>
              </div>
              <div>
                <span>{t("finalBalance")}</span>
                <strong
                  className={
                    currentUserBalance.netBalance > 0
                      ? "is-positive"
                      : currentUserBalance.netBalance < 0
                      ? "is-negative"
                      : "is-neutral"
                  }
                >
                  {currentUserBalance.netBalance > 0 && "+"}
                  {formatAmount(Math.abs(currentUserBalance.netBalance))}
                </strong>
              </div>
            </div>
          </section>
        )}


        {/* Your Settlements */}
        {currentUserSettlements.length > 0 && (
          <div className="card">
            <h3>{t("yourSettlements")}</h3>
            <div className="list">
              {currentUserSettlements.map((settlement, index) => (
                <SettlementRouteCard
                  key={`${settlement.fromUserId}-${settlement.toUserId}-${index}`}
                  settlement={settlement}
                  participants={trip.participants}
                  senderLabel={t("sender")}
                  receiverLabel={t("receiver")}
                />
              ))}
            </div>
          </div>
        )}

        {balanceSummary.settlements.length > 0 && (
          <div className="card">
            <h3>{t("suggestedSettlements")}</h3>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--ease-color-text-muted)",
                marginBottom: "1rem",
              }}
            >
              {t("minimumPayments")}
            </p>
            <div className="list">
              {balanceSummary.settlements.map((settlement, index) => (
                <SettlementRouteCard
                  key={`${settlement.fromUserId}-${settlement.toUserId}-${index}`}
                  settlement={settlement}
                  participants={trip.participants}
                  senderLabel={t("sender")}
                  receiverLabel={t("receiver")}
                />
              ))}
            </div>
          </div>
        )}

        {/* Group settlements */}
        {combinationBalances.length > 0 && (
          <section className="card balance-groups-section">
            <div className="balance-groups-heading">
              <h3>{t("balanceByGroups")}</h3>
              <p>{t("balanceByGroupsSubtitle")}</p>
            </div>
            <div className="combination-list">
              {combinationBalances.map((combo, index) => {
                const isSettled =
                  combo.expenses.length > 0 &&
                  combo.balances.every((balance) => Math.abs(balance.netBalance) <= 0.01);
                const hasMultipleSettlements = combo.settlements.length > 1;
                const isExpanded = expandedCombinationIndex === index;
                const statusLabel = isSettled
                  ? t("allSettled")
                  : combo.settlements.length > 1
                  ? `${combo.settlements.length} ${t("paymentsNeeded")}`
                  : combo.settlements.length === 0
                  ? t("needsSettlement")
                  : null;

                return (
                  <div
                    className={`combination-row ${isExpanded ? "is-expanded" : ""}`}
                    key={index}
                  >
                    <div className="combination-summary">
                      <button
                        type="button"
                        className={`combination-summary-toggle ${hasMultipleSettlements ? "is-expandable" : "is-static"}`}
                        onClick={() => {
                          if (hasMultipleSettlements) {
                            setExpandedCombinationIndex(isExpanded ? null : index);
                          }
                        }}
                        aria-expanded={hasMultipleSettlements ? isExpanded : undefined}
                        aria-controls={hasMultipleSettlements ? `combination-routes-${index}` : undefined}
                      >
                        <span className="combination-summary-main">
                          <span className="combination-names">
                            {combo.participantNames.join(" + ")}
                          </span>
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
                      <button
                        type="button"
                        className="combination-details-trigger"
                        onClick={() => setDetailsCombinationIndex(index)}
                      >
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
                            <strong className="combination-route-amount">
                              {formatAmount(settlement.amount)}
                            </strong>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}


        {balanceSummary.settlements.length === 0 &&
          trip.expenses.length > 0 && (
            <div className="card">
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <h3 style={{ color: "var(--ease-color-success)" }}>
                  {t("allSettled")}
                </h3>
                <p style={{ color: "var(--ease-color-text-muted)", fontSize: "0.875rem" }}>
                  {t("noPaymentsNeeded")}
                </p>
              </div>
            </div>
          )}

        {trip.expenses.length === 0 && (
          <div className="card">
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <h3>{t("noExpenses")}</h3>
              <p
                style={{
                  color: "var(--ease-color-text-muted)",
                  fontSize: "0.875rem",
                  marginBottom: "1rem",
                }}
              >
                {t("addExpenseToSeeBalances")}
              </p>
              <Link
                to={`/group/${groupId}/add-expense`}
                className="btn btn-primary"
              >
                {t("addFirstExpense")}
              </Link>
            </div>
          </div>
        )}
      </div>

      {selectedCombination && (
        <div
          className="dashboard-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDetailsCombinationIndex(null);
            }
          }}
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
                <h2 id="balance-details-title">
                  {selectedCombination.participantNames.join(" + ")}
                </h2>
              </div>
              <IconButton
                onClick={() => setDetailsCombinationIndex(null)}
                label={t("close")}
              >
                <CloseIcon />
              </IconButton>
            </div>

            <div className="balance-modal-section">
              <div className="balance-modal-section-heading">
                <strong>{t("expenses")}</strong>
                <span>{countLabel("expense", selectedCombination.expenses.length)}</span>
              </div>
              <div className="balance-expense-list">
                {selectedCombination.expenses.map((expense) => (
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
                {[...selectedCombination.balances]
                  .sort((a, b) => b.netBalance - a.netBalance)
                  .map((balance) => (
                    <div className="balance-modal-balance-row" key={balance.userId}>
                      <div>
                        <strong>
                          {balance.userName}
                          {balance.userId === currentUserId && (
                            <span className="combination-you">{t("you")}</span>
                          )}
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
      )}
    </>
  );
};

export default BalancePage;
