import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AppHeader } from "../components/ui/AppHeader";
import { IconButton } from "../components/ui/IconButton";
import { FirebaseService } from "../services/firebase";
import { GroupHistoryService } from "../services/groupHistory";
import { countLabel, t } from "../i18n";
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
        alert(t("noMatches"));
        navigate("/");
      }
    } catch (error) {
      console.error("Error loading trip:", error);
      alert(t("noMatches"));
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
      !window.confirm(t("remove"))
    )
      return;

    try {
      await FirebaseService.deleteExpense(trip.id, expenseId);
      // Refresh trip data
      await loadTrip();
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert(t("remove"));
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trip || !newUserName.trim()) {
      setAddUserError(t("yourName"));
      return;
    }

    // Check if user name already exists (case-insensitive)
    const existingUser = trip.participants.find(
      (p) => p.name.toLowerCase() === newUserName.trim().toLowerCase()
    );

    if (existingUser) {
      setAddUserError(`${newUserName}: ${t("noMatches")}`);
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
      setAddUserError(t("addUser"));
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
      !window.confirm(`${t("remove")} ${userName}?`)
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
          `${userName}: ${t("remove")}?`
        );
        if (!confirmed) return;
      }

      await FirebaseService.removeUserFromTrip(trip.id, userId);
      await loadTrip();
    } catch (error) {
      console.error("Error removing user:", error);
      alert(t("remove"));
    }
  };

  const copyRoomCode = () => {
    const roomCode = localStorage.getItem("roomCode") || trip?.roomCode;
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      alert(`${t("roomCode")} ${roomCode}`);
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
            `${t("shareLink")}:\n${shareableLink}`
          );
        } catch {
          alert(
            `${t("shareLink")}:\n${shareableLink}`
          );
        }
      } else {
        alert(
          `${t("shareLink")}:\n${shareableLink}`
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
          <h3>{t("noMatches")}</h3>
          <Link to="/" className="btn btn-primary">
            {t("splitExpenses")}
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
      <AppHeader
        backTo="/"
        title={trip.name}
        subtitle={`${countLabel("person", trip.participants.length)} • ${formatCurrency(
          totalExpenses
        )}`}
      />

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
            <h3>{t("details")}</h3>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={copyShareableLink}
                className="btn btn-primary"
                style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
              >
                {t("shareLink")}
              </button>
              <button
                onClick={copyRoomCode}
                className="btn btn-secondary"
                style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
              >
                {t("copyCode")}
              </button>
            </div>
          </div>
          <div style={{ fontSize: "0.875rem", color: "var(--ease-color-text-muted)" }}>
            <p>
              <strong>{t("roomCode")}</strong> {trip.roomCode}
            </p>
            <p>
              <strong>{t("created")}</strong> {formatDate(trip.createdAt)}
            </p>
            {trip.description && (
              <p>
                <strong>{t("description")}</strong> {trip.description}
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
            <h3>{t("participants")} ({trip.participants.length})</h3>
            {trip.createdBy === currentUserId && (
              <IconButton
                onClick={() => setShowAddUser(true)}
                label={t("addUser")}
              >
                +
              </IconButton>
            )}
          </div>

          {/* Add User Form */}
          {showAddUser && (
            <div
              style={{
                backgroundColor: "var(--ease-color-surface-raised)",
                border: "1px solid var(--ease-color-border)",
                borderRadius: "0.5rem",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <h4 style={{ marginTop: 0, marginBottom: "1rem", fontSize: "1rem" }}>
                {t("addUser")}
              </h4>

              {addUserError && (
                <div
                  style={{
                    color: "var(--ease-color-danger)",
                    backgroundColor: "var(--ease-color-danger-soft)",
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
                    {t("yourName")}
                  </label>
                  <input
                    type="text"
                    id="newUserName"
                    value={newUserName}
                    onChange={(e) => {
                      setNewUserName(e.target.value);
                      if (addUserError) setAddUserError("");
                    }}
                    placeholder={t("yourName").replace(" *", "")}
                    style={{ width: "100%", fontSize: "0.875rem" }}
                    autoFocus
                    required
                  />
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--ease-color-text-muted)",
                      marginTop: "0.5rem",
                    }}
                  >
                    {t("splitSubtitle")}
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
                      t("addUser")
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelAddUser}
                    className="btn btn-secondary"
                    disabled={addingUser}
                    style={{ fontSize: "0.875rem" }}
                  >
                    {t("cancel")}
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
                          color: "var(--ease-color-brand)",
                          fontWeight: "600",
                        }}
                      >
                        ({t("you")})
                      </span>
                    )}
                    {participant.id === trip.createdBy && (
                      <span
                        style={{
                          marginLeft: "0.5rem",
                          fontSize: "0.75rem",
                          color: "var(--ease-color-warning)",
                          fontWeight: "600",
                        }}
                      >
                        ({t("creator")})
                      </span>
                    )}
                  </div>
                  <div className="list-item-subtitle">
                    {t("joined")} {timeAgo(participant.createdAt)}
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
                        style={{ color: "var(--ease-color-danger)", fontSize: "0.875rem" }}
                      >
                        {t("remove")}
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
            {t("addExpense")}
          </Link>
          <Link
            to={`/group/${trip.id}/expenses`}
            className="btn btn-secondary"
            style={{ flex: 1, minWidth: "120px" }}
          >
            {t("allExpenses")}
          </Link>
          <Link
            to={`/group/${trip.id}/balance`}
            className="btn btn-secondary"
            style={{ flex: 1, minWidth: "120px" }}
          >
            {t("viewBalance")}
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
            <h3>{t("expenses")}</h3>
            <span className="badge badge-success">
              {countLabel("expense", trip.expenses.length)}
            </span>
          </div>

          {trip.expenses.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "var(--ease-color-text-muted)",
                fontSize: "0.875rem",
              }}
            >
              <p>{t("noExpenses")}</p>
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
                          {formatCurrency(expense.amount)} •{" "}
                          {t("paidBy").replace(" *", "")}{" "}
                          {paidByUser?.name || "-"} •{" "}
                          {countLabel("person", expense.participants.length)} •{" "}
                          {timeAgo(expense.date)}
                        </div>
                      </div>
                      <div className="list-item-actions">
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="list-item-action"
                          style={{ color: "var(--ease-color-danger)" }}
                        >
                          {t("remove")}
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
              {t("allExpenses")} ({trip.expenses.length})
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default TripDashboard;
