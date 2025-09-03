import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FirebaseService } from "../services/firebase";
import { GroupHistoryService } from "../services/groupHistory";
import type { Trip } from "../types";
import { formatCurrency, formatDate, timeAgo } from "../utils";

const TripDashboard = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const loadTrip = useCallback(async () => {
    if (!groupId) return;

    setLoading(true);
    try {
      const tripData = await FirebaseService.getTripById(groupId);
      if (tripData) {
        setTrip(tripData);
        // Update last accessed time in group history
        GroupHistoryService.updateLastAccessed(groupId);
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
  }, [groupId, navigate]);

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (userId) {
      setCurrentUserId(userId);
    }

    loadTrip();
  }, [groupId, loadTrip]);

  const handleDeleteExpense = async (expenseId: string) => {
    if (
      !trip ||
      !window.confirm("Are you sure you want to delete this expense?")
    )
      return;

    try {
      await FirebaseService.deleteExpense(trip.id, expenseId);
      // Refresh trip data
      await loadTrip();
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense");
    }
  };

  const copyRoomCode = () => {
    const roomCode = localStorage.getItem("roomCode") || trip?.roomCode;
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      alert(`Room code ${roomCode} copied to clipboard!`);
    }
  };

  const copyShareableLink = async () => {
    const roomCode = localStorage.getItem("roomCode") || trip?.roomCode;
    if (roomCode) {
      const shareableLink = `${window.location.origin}/join/${roomCode}`;
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(shareableLink);
          alert(
            `Shareable link copied to clipboard!\nSend this to friends so they can join instantly: ${shareableLink}`
          );
        } catch {
          alert(
            `Shareable link: ${shareableLink}\n\nCopy and send this to your friends!`
          );
        }
      } else {
        alert(
          `Shareable link: ${shareableLink}\n\nCopy and send this to your friends!`
        );
      }
    }
  };

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

  const totalExpenses = trip.expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <>
      <div className="header">
        <Link to="/" className="back-button">
          ←
        </Link>
        <h1>{trip.name}</h1>
        <p>
          {trip.participants.length} people • {formatCurrency(totalExpenses)}{" "}
          total
        </p>
      </div>

      <div className="content">
        {/* Group Info Card */}
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h3>Group Details</h3>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={copyShareableLink}
                className="btn btn-primary"
                style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
              >
                Share Link
              </button>
              <button
                onClick={copyRoomCode}
                className="btn btn-secondary"
                style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
              >
                Copy Code
              </button>
            </div>
          </div>
          <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            <p>
              <strong>Room Code:</strong> {trip.roomCode}
            </p>
            <p>
              <strong>Created:</strong> {formatDate(trip.createdAt)}
            </p>
            {trip.description && (
              <p>
                <strong>Description:</strong> {trip.description}
              </p>
            )}
          </div>
        </div>

        {/* Participants Card */}
        <div className="card">
          <h3>Participants ({trip.participants.length})</h3>
          <div className="list">
            {trip.participants.map((participant) => (
              <div key={participant.id} className="list-item">
                <div className="list-item-content">
                  <div className="list-item-title">
                    {participant.name}
                    {participant.id === currentUserId && (
                      <span
                        style={{
                          marginLeft: "0.5rem",
                          fontSize: "0.75rem",
                          color: "#667eea",
                          fontWeight: "600",
                        }}
                      >
                        (You)
                      </span>
                    )}
                  </div>
                  <div className="list-item-subtitle">
                    Joined {timeAgo(participant.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <Link
            to={`/group/${trip.id}/add-expense`}
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            Add Expense
          </Link>
          <Link
            to={`/group/${trip.id}/balance`}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            View Balance
          </Link>
        </div>

        {/* Recent Expenses */}
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h3>Recent Expenses</h3>
            <span className="badge badge-success">
              {trip.expenses.length} expenses
            </span>
          </div>

          {trip.expenses.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "#6b7280",
                fontSize: "0.875rem",
              }}
            >
              <p>No expenses yet</p>
              <p>Add your first expense to get started!</p>
            </div>
          ) : (
            <div className="list">
              {trip.expenses
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .slice(0, 10) // Show last 10 expenses
                .map((expense) => {
                  const paidByUser = trip.participants.find(
                    (p) => p.id === expense.paidBy
                  );
                  return (
                    <div key={expense.id} className="list-item">
                      <div className="list-item-content">
                        <div className="list-item-title">
                          {expense.description}
                        </div>
                        <div className="list-item-subtitle">
                          {formatCurrency(expense.amount)} • Paid by{" "}
                          {paidByUser?.name || "Unknown"} • Split{" "}
                          {expense.participants.length} ways •{" "}
                          {timeAgo(expense.date)}
                        </div>
                      </div>
                      <div className="list-item-actions">
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="list-item-action"
                          style={{ color: "#ef4444" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Show all expenses link if there are many */}
        {trip.expenses.length > 10 && (
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>
              Showing 10 of {trip.expenses.length} expenses
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TripDashboard;
