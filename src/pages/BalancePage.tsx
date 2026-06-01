import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AppHeader } from "../components/ui/AppHeader";
import { FirebaseService } from "../services/firebase";
import type { Trip, BalanceSummary } from "../types";
import { calculateBalances } from "../utils/balanceCalculator";
import { formatCurrency } from "../utils";
import { countLabel, t } from "../i18n";

const BalancePage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [balanceSummary, setBalanceSummary] = useState<BalanceSummary | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const loadTrip = useCallback(async () => {
    if (!groupId) return;

    setLoading(true);
    try {
      const tripData = await FirebaseService.getTripById(groupId);
      if (tripData) {
        setTrip(tripData);
        const summary = calculateBalances(tripData);
        setBalanceSummary(summary);
      } else {
        alert(t("groupNotFound"));
        navigate("/");
      }
    } catch (error) {
      console.error("Error loading trip:", error);
      alert(t("groupNotFound"));
    } finally {
      setLoading(false);
    }
  }, [groupId, navigate]);

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (userId) {
      setCurrentUserId(userId);
    }

    loadTrip();
  }, [groupId, loadTrip]);

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

  const totalExpenses = trip.expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const currentUserBalance = balanceSummary.balances.find(
    (b) => b.userId === currentUserId
  );
  const currentUserSettlements = balanceSummary.settlements.filter(
    (s) => s.fromUserId === currentUserId || s.toUserId === currentUserId
  );

  return (
    <>
      <AppHeader
        backTo={`/group/${groupId}`}
        title={t("balance")}
        subtitle={t("balanceSubtitle")}
      />

      <div className="content">
        {/* Trip Summary */}
        <div className="card">
          <h3>{t("summary")}</h3>
          <div style={{ fontSize: "0.875rem", color: "var(--ease-color-text-muted)" }}>
            <p>
              <strong>{t("totalExpenses")}</strong> {formatCurrency(totalExpenses)}
            </p>
            <p>
              <strong>{t("numberOfExpenses")}</strong>{" "}
              {countLabel("expense", trip.expenses.length)}
            </p>
            <p>
              <strong>{t("participants")}:</strong>{" "}
              {countLabel("person", trip.participants.length)}
            </p>
          </div>
        </div>

        {/* Your Balance */}
        {currentUserBalance && (
          <div className="card">
            <h3>{t("yourBalance")}</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <div>
                <div style={{ fontSize: "0.875rem", color: "var(--ease-color-text-muted)" }}>
                  {t("youPaid")}
                </div>
                <div style={{ fontSize: "1.125rem", fontWeight: "600" }}>
                  {formatCurrency(currentUserBalance.totalPaid)}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.875rem", color: "var(--ease-color-text-muted)" }}>
                  {t("youOwe")}
                </div>
                <div style={{ fontSize: "1.125rem", fontWeight: "600" }}>
                  {formatCurrency(currentUserBalance.totalOwed)}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.875rem", color: "var(--ease-color-text-muted)" }}>
                  {t("netBalance")}
                </div>
                <div
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    color:
                      currentUserBalance.netBalance > 0
                        ? "var(--ease-color-success)"
                        : currentUserBalance.netBalance < 0
                        ? "var(--ease-color-danger)"
                        : "var(--ease-color-text-muted)",
                  }}
                >
                  {currentUserBalance.netBalance > 0 && "+"}
                  {formatCurrency(Math.abs(currentUserBalance.netBalance))}
                </div>
              </div>
            </div>
            <div
              style={{
                padding: "0.75rem",
                borderRadius: "0.5rem",
                background:
                  currentUserBalance.netBalance > 0
                    ? "var(--ease-color-success-soft)"
                    : currentUserBalance.netBalance < 0
                    ? "var(--ease-color-danger-soft)"
                    : "var(--ease-color-surface-subtle)",
                fontSize: "0.875rem",
                textAlign: "center",
              }}
            >
              {currentUserBalance.netBalance > 0 && (
                <span style={{ color: "var(--ease-color-success)" }}>
                  {t("youAreOwed")}{" "}
                  {formatCurrency(currentUserBalance.netBalance)} {t("overall")}
                </span>
              )}
              {currentUserBalance.netBalance < 0 && (
                <span style={{ color: "var(--ease-color-danger)" }}>
                  {t("youOwe")}{" "}
                  {formatCurrency(Math.abs(currentUserBalance.netBalance))}{" "}
                  {t("overall")}
                </span>
              )}
              {currentUserBalance.netBalance === 0 && (
                <span style={{ color: "var(--ease-color-text)" }}>
                  {t("settled")}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Your Settlements */}
        {currentUserSettlements.length > 0 && (
          <div className="card">
            <h3>{t("yourSettlements")}</h3>
            <div className="list">
              {currentUserSettlements.map((settlement, index) => (
                <div key={index} className="settlement-item">
                  {settlement.fromUserId === currentUserId ? (
                    <div>
                      {t("youOwe")} <strong>{settlement.toUserName}</strong>{" "}
                      <strong style={{ color: "var(--ease-color-danger)" }}>
                        {formatCurrency(settlement.amount)}
                      </strong>
                    </div>
                  ) : (
                    <div>
                      <strong>{settlement.fromUserName}</strong>{" "}
                      {t("youAreOwed")}{" "}
                      <strong style={{ color: "var(--ease-color-success)" }}>
                        {formatCurrency(settlement.amount)}
                      </strong>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Everyone's Balance */}
        <div className="card">
          <h3>{t("everyoneBalance")}</h3>
          <div className="balance-summary">
            {balanceSummary.balances
              .sort((a, b) => b.netBalance - a.netBalance) // Sort by net balance, highest first
              .map((balance) => (
                <div
                  key={balance.userId}
                  className={`balance-item ${
                    balance.netBalance > 0
                      ? "balance-positive"
                      : balance.netBalance < 0
                      ? "balance-negative"
                      : "balance-neutral"
                  }`}
                >
                  <div>
                    <div style={{ fontWeight: "600" }}>
                      {balance.userName}
                      {balance.userId === currentUserId && (
                        <span
                          style={{
                            marginLeft: "0.5rem",
                            fontSize: "0.75rem",
                            color: "var(--ease-color-brand)",
                          }}
                        >
                          ({t("you")})
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--ease-color-text-muted)" }}>
                      {t("paid")} {formatCurrency(balance.totalPaid)} •{" "}
                      {t("owes")}{" "}
                      {formatCurrency(balance.totalOwed)}
                    </div>
                  </div>
                  <div
                    style={{
                      fontWeight: "700",
                      color:
                        balance.netBalance > 0
                          ? "var(--ease-color-success)"
                          : balance.netBalance < 0
                          ? "var(--ease-color-danger)"
                          : "var(--ease-color-text-muted)",
                    }}
                  >
                    {balance.netBalance > 0 && "+"}
                    {formatCurrency(Math.abs(balance.netBalance))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Balance by Combinations */}
        {balanceSummary.combinationBalances &&
          balanceSummary.combinationBalances.length > 0 && (
            <div className="card">
              <h3>{t("balanceByGroups")}</h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--ease-color-text-muted)",
                  marginBottom: "1rem",
                }}
              >
                {t("splitWith").replace(" *", "")}
              </p>
              {balanceSummary.combinationBalances.map((combo, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "1.5rem",
                    border: "1px solid var(--ease-color-border)",
                    borderRadius: "0.5rem",
                    padding: "1rem",
                  }}
                >
                  <div style={{ marginBottom: "0.75rem" }}>
                    <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1rem" }}>
                      {combo.participantNames.join(" + ")}
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--ease-color-text-muted)",
                          fontWeight: "400",
                          marginLeft: "0.5rem",
                        }}
                      >
                        ({countLabel("expense", combo.expenses.length)})
                      </span>
                    </h4>
                    <div style={{ fontSize: "0.75rem", color: "var(--ease-color-text-muted)" }}>
                      {t("total")}: {formatCurrency(combo.totalAmount)}
                    </div>
                  </div>

                  {/* Individual balances for this combination */}
                  <div style={{ marginBottom: "0.75rem" }}>
                    {combo.balances
                      .sort((a, b) => b.netBalance - a.netBalance)
                      .map((balance) => (
                        <div
                          key={balance.userId}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "0.375rem 0",
                            fontSize: "0.875rem",
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: "500" }}>
                              {balance.userName}
                              {balance.userId === currentUserId && (
                                <span
                                  style={{
                                    marginLeft: "0.25rem",
                                    fontSize: "0.7rem",
                                    color: "var(--ease-color-brand)",
                                  }}
                                >
                                  ({t("you")})
                                </span>
                              )}
                            </span>
                            <div
                              style={{ fontSize: "0.75rem", color: "var(--ease-color-text-soft)" }}
                            >
                              {t("paid")} {formatCurrency(balance.totalPaid)} •{" "}
                              {t("owes")}{" "}
                              {formatCurrency(balance.totalOwed)}
                            </div>
                          </div>
                          <div
                            style={{
                              fontWeight: "600",
                              color:
                                balance.netBalance > 0
                                  ? "var(--ease-color-success)"
                                  : balance.netBalance < 0
                                  ? "var(--ease-color-danger)"
                                  : "var(--ease-color-text-muted)",
                            }}
                          >
                            {balance.netBalance > 0 && "+"}
                            {formatCurrency(Math.abs(balance.netBalance))}
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Settlements within this combination */}
                  {combo.settlements.length > 0 && (
                    <div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--ease-color-text-muted)",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {t("settle")}
                      </div>
                      {combo.settlements.map((settlement, sIndex) => (
                        <div
                          key={sIndex}
                          style={{
                            fontSize: "0.8rem",
                            padding: "0.25rem 0.5rem",
                            background: "var(--ease-color-surface-raised)",
                            borderRadius: "0.25rem",
                            marginBottom: "0.25rem",
                          }}
                        >
                          <strong>{settlement.fromUserName}</strong>{" "}
                          {t("pays")}{" "}
                          <strong>{settlement.toUserName}</strong>{" "}
                          <strong style={{ color: "var(--ease-color-brand)" }}>
                            {formatCurrency(settlement.amount)}
                          </strong>
                        </div>
                      ))}
                    </div>
                  )}

                  {combo.settlements.length === 0 &&
                    combo.expenses.length > 0 && (
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--ease-color-success)",
                          textAlign: "center",
                          padding: "0.5rem",
                          background: "var(--ease-color-success-soft)",
                          borderRadius: "0.25rem",
                        }}
                      >
                        {t("allSettledInGroup")}
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}

        {/* All Settlements */}
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
                <div key={index} className="settlement-item">
                  <strong>{settlement.fromUserName}</strong> {t("pays")}{" "}
                  <strong>{settlement.toUserName}</strong>{" "}
                  <strong style={{ color: "var(--ease-color-brand)" }}>
                    {formatCurrency(settlement.amount)}
                  </strong>
                </div>
              ))}
            </div>
          </div>
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
    </>
  );
};

export default BalancePage;
