import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FirebaseService } from "../services/firebase";
import type { Trip, BalanceSummary } from "../types";
import { calculateBalances } from "../utils/balanceCalculator";
import { formatCurrency } from "../utils";

const BalancePage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [balanceSummary, setBalanceSummary] = useState<BalanceSummary | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (userId) {
      setCurrentUserId(userId);
    }

    loadTrip();
  }, [groupId]);

  const loadTrip = async () => {
    if (!groupId) return;

    setLoading(true);
    try {
      const tripData = await FirebaseService.getTripById(groupId);
      if (tripData) {
        setTrip(tripData);
        const summary = calculateBalances(tripData);
        setBalanceSummary(summary);
      } else {
        alert("Group not found");
        navigate("/");
      }
    } catch (error) {
      console.error("Error loading trip:", error);
      alert("Failed to load group");
    } finally {
      setLoading(false);
    }
  };

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
          <h3>Unable to load balance</h3>
          <Link to={`/group/${groupId}`} className="btn btn-primary">
            Go Back
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
      <div className="header">
        <Link to={`/group/${groupId}`} className="back-button">
          ←
        </Link>
        <h1>Balance Summary</h1>
        <p>Who owes whom and how much</p>
      </div>

      <div className="content">
        {/* Trip Summary */}
        <div className="card">
          <h3>Trip Summary</h3>
          <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            <p>
              <strong>Total Expenses:</strong> {formatCurrency(totalExpenses)}
            </p>
            <p>
              <strong>Number of Expenses:</strong> {trip.expenses.length}
            </p>
            <p>
              <strong>Participants:</strong> {trip.participants.length}
            </p>
          </div>
        </div>

        {/* Your Balance */}
        {currentUserBalance && (
          <div className="card">
            <h3>Your Balance</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <div>
                <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  You paid
                </div>
                <div style={{ fontSize: "1.125rem", fontWeight: "600" }}>
                  {formatCurrency(currentUserBalance.totalPaid)}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  You owe
                </div>
                <div style={{ fontSize: "1.125rem", fontWeight: "600" }}>
                  {formatCurrency(currentUserBalance.totalOwed)}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  Net balance
                </div>
                <div
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    color:
                      currentUserBalance.netBalance > 0
                        ? "#059669"
                        : currentUserBalance.netBalance < 0
                        ? "#dc2626"
                        : "#6b7280",
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
                    ? "#d1fae5"
                    : currentUserBalance.netBalance < 0
                    ? "#fee2e2"
                    : "#f3f4f6",
                fontSize: "0.875rem",
                textAlign: "center",
              }}
            >
              {currentUserBalance.netBalance > 0 && (
                <span style={{ color: "#065f46" }}>
                  You are owed {formatCurrency(currentUserBalance.netBalance)}{" "}
                  overall
                </span>
              )}
              {currentUserBalance.netBalance < 0 && (
                <span style={{ color: "#991b1b" }}>
                  You owe{" "}
                  {formatCurrency(Math.abs(currentUserBalance.netBalance))}{" "}
                  overall
                </span>
              )}
              {currentUserBalance.netBalance === 0 && (
                <span style={{ color: "#374151" }}>
                  You're all settled up! 🎉
                </span>
              )}
            </div>
          </div>
        )}

        {/* Your Settlements */}
        {currentUserSettlements.length > 0 && (
          <div className="card">
            <h3>Your Settlements</h3>
            <div className="list">
              {currentUserSettlements.map((settlement, index) => (
                <div key={index} className="settlement-item">
                  {settlement.fromUserId === currentUserId ? (
                    <div>
                      You owe <strong>{settlement.toUserName}</strong>{" "}
                      <strong style={{ color: "#dc2626" }}>
                        {formatCurrency(settlement.amount)}
                      </strong>
                    </div>
                  ) : (
                    <div>
                      <strong>{settlement.fromUserName}</strong> owes you{" "}
                      <strong style={{ color: "#059669" }}>
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
          <h3>Everyone's Balance</h3>
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
                            color: "#667eea",
                          }}
                        >
                          (You)
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      Paid {formatCurrency(balance.totalPaid)} • Owes{" "}
                      {formatCurrency(balance.totalOwed)}
                    </div>
                  </div>
                  <div
                    style={{
                      fontWeight: "700",
                      color:
                        balance.netBalance > 0
                          ? "#059669"
                          : balance.netBalance < 0
                          ? "#dc2626"
                          : "#6b7280",
                    }}
                  >
                    {balance.netBalance > 0 && "+"}
                    {formatCurrency(Math.abs(balance.netBalance))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* All Settlements */}
        {balanceSummary.settlements.length > 0 && (
          <div className="card">
            <h3>Suggested Settlements</h3>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginBottom: "1rem",
              }}
            >
              These are the minimum transactions needed to settle all debts:
            </p>
            <div className="list">
              {balanceSummary.settlements.map((settlement, index) => (
                <div key={index} className="settlement-item">
                  <strong>{settlement.fromUserName}</strong> pays{" "}
                  <strong>{settlement.toUserName}</strong>{" "}
                  <strong style={{ color: "#667eea" }}>
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
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
                <h3 style={{ color: "#059669" }}>All Settled!</h3>
                <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                  Everyone has paid their fair share. No settlements needed!
                </p>
              </div>
            </div>
          )}

        {trip.expenses.length === 0 && (
          <div className="card">
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <h3>No Expenses Yet</h3>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "0.875rem",
                  marginBottom: "1rem",
                }}
              >
                Add some expenses to see the balance summary
              </p>
              <Link
                to={`/group/${groupId}/add-expense`}
                className="btn btn-primary"
              >
                Add First Expense
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BalancePage;
