import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FirebaseService } from "../services/firebase";
import type { Trip } from "../types";
import { formatCurrency, formatDate } from "../utils";

const ExpensesPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<
    "all" | "paid-by-me" | "split-with-me"
  >("all");
  const [sortBy, setSortBy] = useState<
    "date-desc" | "date-asc" | "amount-desc" | "amount-asc"
  >("date-desc");

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (userId) {
      setCurrentUserId(userId);
    }

    const loadTrip = async () => {
      if (!groupId) return;

      setLoading(true);
      try {
        const tripData = await FirebaseService.getTripById(groupId);
        if (tripData) {
          setTrip(tripData);
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

    loadTrip();
  }, [groupId, navigate]);

  const handleDeleteExpense = async (expenseId: string) => {
    if (
      !trip ||
      !window.confirm("Are you sure you want to delete this expense?")
    )
      return;

    try {
      await FirebaseService.deleteExpense(trip.id, expenseId);
      // Refresh trip data by reloading
      const tripData = await FirebaseService.getTripById(trip.id);
      if (tripData) {
        setTrip(tripData);
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense");
    }
  };

  const filteredAndSortedExpenses = useMemo(() => {
    if (!trip) return [];

    const filtered = trip.expenses.filter((expense) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const description = expense.description.toLowerCase();
        const paidByUser = trip.participants.find(
          (p) => p.id === expense.paidBy
        );
        const paidByName = paidByUser?.name.toLowerCase() || "";

        if (
          !description.includes(searchLower) &&
          !paidByName.includes(searchLower)
        ) {
          return false;
        }
      }

      // User filter
      if (filterBy === "paid-by-me") {
        return expense.paidBy === currentUserId;
      } else if (filterBy === "split-with-me") {
        return expense.participants.includes(currentUserId);
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return b.date.getTime() - a.date.getTime();
        case "date-asc":
          return a.date.getTime() - b.date.getTime();
        case "amount-desc":
          return b.amount - a.amount;
        case "amount-asc":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [trip, searchTerm, filterBy, sortBy, currentUserId]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="content">
        <div className="card">
          <h3>Group not found</h3>
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const filteredTotal = filteredAndSortedExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <>
      <div className="header">
        <Link to={`/group/${groupId}`} className="back-button">
          ←
        </Link>
        <h1>All Expenses</h1>
        <p>
          {filteredAndSortedExpenses.length} of {trip.expenses.length} expenses
          • {formatCurrency(filteredTotal)}
        </p>
      </div>

      <div className="content">
        {/* Search and Filter Controls */}
        <div className="card" style={{ marginBottom: "1rem" }}>
          {/* Search */}
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search expenses or payer names..."
              style={{ width: "100%" }}
            />
          </div>

          {/* Filters and Sort */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <label
                style={{
                  fontSize: "0.75rem",
                  color: "#6b7280",
                  fontWeight: "600",
                }}
              >
                FILTER
              </label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as typeof filterBy)}
                style={{ fontSize: "0.875rem" }}
              >
                <option value="all">All Expenses</option>
                <option value="paid-by-me">Paid by Me</option>
                <option value="split-with-me">Split with Me</option>
              </select>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <label
                style={{
                  fontSize: "0.75rem",
                  color: "#6b7280",
                  fontWeight: "600",
                }}
              >
                SORT BY
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                style={{ fontSize: "0.875rem" }}
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {(searchTerm || filterBy !== "all") && (
          <div className="card" style={{ marginBottom: "1rem" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: "1rem",
                textAlign: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    color: "#667eea",
                  }}
                >
                  {filteredAndSortedExpenses.length}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                  {filterBy === "all"
                    ? "Found"
                    : filterBy === "paid-by-me"
                    ? "Paid"
                    : "Split"}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    color: "#10b981",
                  }}
                >
                  {formatCurrency(filteredTotal)}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                  Total
                </div>
              </div>
              {filterBy !== "all" && (
                <div>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "600",
                      color: "#f59e0b",
                    }}
                  >
                    {Math.round(
                      (filteredAndSortedExpenses.length /
                        trip.expenses.length) *
                        100
                    )}
                    %
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                    of All
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Expenses List */}
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h3>Expenses</h3>
            <Link
              to={`/group/${groupId}/add-expense`}
              className="btn btn-primary"
              style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
            >
              Add New
            </Link>
          </div>

          {filteredAndSortedExpenses.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "#6b7280",
                fontSize: "0.875rem",
              }}
            >
              {trip.expenses.length === 0 ? (
                <>
                  <p>No expenses yet</p>
                  <p>Add your first expense to get started!</p>
                </>
              ) : (
                <>
                  <p>No expenses match your search</p>
                  <p>Try adjusting your filters or search term</p>
                </>
              )}
            </div>
          ) : (
            <div className="list">
              {filteredAndSortedExpenses.map((expense) => {
                const paidByUser = trip.participants.find(
                  (p) => p.id === expense.paidBy
                );
                const splitAmount =
                  expense.amount / expense.participants.length;
                const isUserInvolved =
                  expense.participants.includes(currentUserId);
                const userOwes =
                  isUserInvolved && expense.paidBy !== currentUserId;
                const userPaid = expense.paidBy === currentUserId;

                return (
                  <div key={expense.id} className="list-item">
                    <div className="list-item-content">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "start",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div
                            className="list-item-title"
                            style={{ marginBottom: "0.25rem" }}
                          >
                            {expense.description}
                          </div>
                          <div className="list-item-subtitle">
                            <div style={{ marginBottom: "0.25rem" }}>
                              <strong>{formatCurrency(expense.amount)}</strong>{" "}
                              • Paid by {paidByUser?.name || "Unknown"}
                              {userPaid && (
                                <span
                                  style={{
                                    color: "#10b981",
                                    fontWeight: "600",
                                  }}
                                >
                                  {" "}
                                  (You)
                                </span>
                              )}
                            </div>
                            <div
                              style={{ fontSize: "0.75rem", color: "#9ca3af" }}
                            >
                              Split {expense.participants.length} ways (
                              {formatCurrency(splitAmount)} each) •{" "}
                              {formatDate(expense.date)}
                              {userOwes && (
                                <span
                                  style={{
                                    color: "#f59e0b",
                                    fontWeight: "600",
                                  }}
                                >
                                  {" "}
                                  • You owe {formatCurrency(splitAmount)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div
                          className="list-item-actions"
                          style={{ marginLeft: "1rem" }}
                        >
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="list-item-action"
                            style={{ color: "#ef4444" }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Summary Card */}
        {filteredAndSortedExpenses.length > 0 && (
          <div className="card">
            <h3>Summary</h3>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                lineHeight: "1.6",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <span>Total Expenses:</span>
                <strong>{formatCurrency(filteredTotal)}</strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <span>Average per Expense:</span>
                <strong>
                  {formatCurrency(
                    filteredTotal / filteredAndSortedExpenses.length
                  )}
                </strong>
              </div>
              {filterBy === "all" && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Average per Person:</span>
                  <strong>
                    {formatCurrency(filteredTotal / trip.participants.length)}
                  </strong>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ExpensesPage;
