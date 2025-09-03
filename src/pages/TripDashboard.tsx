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
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [addingUser, setAddingUser] = useState(false);
  const [addUserError, setAddUserError] = useState("");

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

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trip || !newUserName.trim()) {
      setAddUserError("Please enter a name");
      return;
    }

    // Check if user name already exists (case-insensitive)
    const existingUser = trip.participants.find(
      (p) => p.name.toLowerCase() === newUserName.trim().toLowerCase()
    );

    if (existingUser) {
      setAddUserError(`The name "${newUserName}" already exists in this group`);
      return;
    }

    setAddingUser(true);
    setAddUserError("");

    try {
      // Add new user to trip
      await FirebaseService.addUserToTrip(trip.id, newUserName.trim());

      // Refresh trip data to show new user
      await loadTrip();

      // Reset form
      setNewUserName("");
      setShowAddUser(false);
    } catch (error) {
      console.error("Error adding user:", error);
      setAddUserError("Failed to add user. Please try again.");
    } finally {
      setAddingUser(false);
    }
  };

  const handleCancelAddUser = () => {
    setShowAddUser(false);
    setNewUserName("");
    setAddUserError("");
  };

  const handleRemoveUser = async (userId: string, userName: string) => {
    if (
      !trip ||
      userId === currentUserId ||
      userId === trip.createdBy ||
      !window.confirm(`Remove ${userName} from this group?`)
    ) {
      return;
    }

    try {
      // Check if user has expenses - for now just warn, could implement cascade deletion later
      const userHasExpenses = trip.expenses.some(
        (expense) =>
          expense.paidBy === userId || expense.participants.includes(userId)
      );

      if (userHasExpenses) {
        const confirmed = window.confirm(
          `${userName} is involved in expenses. Removing them may affect balance calculations. Continue?`
        );
        if (!confirmed) return;
      }

      await FirebaseService.removeUserFromTrip(trip.id, userId);
      await loadTrip();
    } catch (error) {
      console.error("Error removing user:", error);
      alert("Failed to remove user. Please try again.");
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h3>Participants ({trip.participants.length})</h3>
            {trip.createdBy === currentUserId && (
              <button
                onClick={() => setShowAddUser(true)}
                className="btn btn-primary"
                style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
              >
                Add User
              </button>
            )}
          </div>

          {/* Add User Form */}
          {showAddUser && (
            <div
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <h4
                style={{ marginTop: 0, marginBottom: "1rem", fontSize: "1rem" }}
              >
                Add New User
              </h4>

              {addUserError && (
                <div
                  style={{
                    color: "#dc2626",
                    backgroundColor: "#fee2e2",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    fontSize: "0.875rem",
                  }}
                >
                  {addUserError}
                </div>
              )}

              <form onSubmit={handleAddUser}>
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label
                    htmlFor="newUserName"
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                    }}
                  >
                    User Name *
                  </label>
                  <input
                    type="text"
                    id="newUserName"
                    value={newUserName}
                    onChange={(e) => {
                      setNewUserName(e.target.value);
                      if (addUserError) setAddUserError("");
                    }}
                    placeholder="Enter user name"
                    style={{ width: "100%", fontSize: "0.875rem" }}
                    autoFocus
                    required
                  />
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#6b7280",
                      marginTop: "0.5rem",
                    }}
                  >
                    The user will be added to the group and can start
                    participating in expenses
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={addingUser}
                    style={{ fontSize: "0.875rem" }}
                  >
                    {addingUser ? (
                      <div
                        className="spinner"
                        style={{
                          width: "1rem",
                          height: "1rem",
                          margin: "0 auto",
                        }}
                      />
                    ) : (
                      "Add User"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelAddUser}
                    className="btn btn-secondary"
                    disabled={addingUser}
                    style={{ fontSize: "0.875rem" }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

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
                    {participant.id === trip.createdBy && (
                      <span
                        style={{
                          marginLeft: "0.5rem",
                          fontSize: "0.75rem",
                          color: "#f59e0b",
                          fontWeight: "600",
                        }}
                      >
                        (Creator)
                      </span>
                    )}
                  </div>
                  <div className="list-item-subtitle">
                    Joined {timeAgo(participant.createdAt)}
                  </div>
                </div>
                {/* Show remove button for creators, but not for themselves or the trip creator */}
                {trip.createdBy === currentUserId &&
                  participant.id !== currentUserId &&
                  participant.id !== trip.createdBy && (
                    <div className="list-item-actions">
                      <button
                        onClick={() =>
                          handleRemoveUser(participant.id, participant.name)
                        }
                        className="list-item-action"
                        style={{ color: "#ef4444", fontSize: "0.875rem" }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            marginBottom: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Link
            to={`/group/${trip.id}/add-expense`}
            className="btn btn-primary"
            style={{ flex: 1, minWidth: "120px" }}
          >
            Add Expense
          </Link>
          <Link
            to={`/group/${trip.id}/expenses`}
            className="btn btn-secondary"
            style={{ flex: 1, minWidth: "120px" }}
          >
            All Expenses
          </Link>
          <Link
            to={`/group/${trip.id}/balance`}
            className="btn btn-secondary"
            style={{ flex: 1, minWidth: "120px" }}
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

        {/* Show all expenses button if there are many */}
        {trip.expenses.length > 10 && (
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <Link
              to={`/group/${trip.id}/expenses`}
              className="btn btn-secondary"
              style={{ fontSize: "0.875rem" }}
            >
              View All {trip.expenses.length} Expenses
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default TripDashboard;
