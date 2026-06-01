import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AppHeader } from "../components/ui/AppHeader";
import { FirebaseService } from "../services/firebase";
import { GroupHistoryService } from "../services/groupHistory";
import { isValidRoomCode } from "../utils";
import type { Trip, User } from "../types";
import { countLabel, t } from "../i18n";

const AutoJoinPage = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [userName, setUserName] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (roomCode && isValidRoomCode(roomCode)) {
      loadTrip(roomCode);
    } else {
      setError(t("invalidRoomCode"));
      setLoading(false);
    }
  }, [roomCode]);

  const loadTrip = async (code: string) => {
    setLoading(true);
    try {
      const tripData = await FirebaseService.getTripByRoomCode(code);
      if (tripData) {
        setTrip(tripData);
      } else {
        setError(t("groupNotFound"));
      }
    } catch (error: unknown) {
      console.error("Error loading trip:", error);
      setError(t("groupNotFound"));
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !trip || !roomCode) {
      setError(t("yourName"));
      return;
    }

    // Check for duplicate names (case-insensitive)
    const existingUser = trip.participants.find(
      (p: User) => p.name.toLowerCase() === userName.trim().toLowerCase()
    );

    if (existingUser) {
      // User already exists, log them in
      handleExistingUserJoin(existingUser);
      return;
    }

    setJoining(true);
    setError("");

    try {
      // Add new user to trip
      const newUser = await FirebaseService.addUserToTrip(
        trip.id,
        userName.trim()
      );

      localStorage.setItem("currentTripId", trip.id);
      localStorage.setItem("currentUserId", newUser.id);
      localStorage.setItem("currentUserName", newUser.name);
      localStorage.setItem("roomCode", trip.roomCode);

      // Add group to history
      GroupHistoryService.addGroupToHistory(
        trip.id,
        trip.name,
        trip.roomCode,
        "participant",
        newUser.id,
        newUser.name
      );

      navigate(`/group/${trip.id}`);
    } catch (error: unknown) {
      console.error("Error joining trip:", error);
      setError(t("unableToJoin"));
    } finally {
      setJoining(false);
    }
  };

  const handleExistingUserJoin = (user: User) => {
    localStorage.setItem("currentTripId", trip!.id);
    localStorage.setItem("currentUserId", user.id);
    localStorage.setItem("currentUserName", user.name);
    localStorage.setItem("roomCode", trip!.roomCode);

    // Add group to history
    GroupHistoryService.addGroupToHistory(
      trip!.id,
      trip!.name,
      trip!.roomCode,
      "participant",
      user.id,
      user.name
    );

    navigate(`/group/${trip!.id}`);
  };

  const handleParticipantClick = (participant: User) => {
    if (joining) return; // Prevent clicks during join process
    handleExistingUserJoin(participant);
  };

  if (loading) {
    return (
      <>
        <AppHeader
          backTo="/"
          title={t("joiningGroup")}
          subtitle={t("loading")}
        />
        <div className="content">
          <div className="loading">
            <div className="spinner" />
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AppHeader
          backTo="/"
          title={t("unableToJoin")}
          subtitle={t("enterCode")}
        />
        <div className="content">
          <div className="card">
            <h3>{t("error")}</h3>
            <p style={{ color: "var(--ease-color-danger)", marginBottom: "1rem" }}>{error}</p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Link to="/join-group" className="btn btn-primary">
                {t("enterCodeManually")}
              </Link>
              <Link to="/" className="btn btn-secondary">
                {t("goHome")}
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!trip) {
    return (
      <>
        <AppHeader
          backTo="/"
          title={t("groupNotFound")}
          subtitle={t("enterCode")}
        />
        <div className="content">
          <div className="card">
            <h3>{t("groupNotFound")}</h3>
            <p style={{ marginBottom: "1rem" }}>
              <strong>{roomCode}</strong>
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Link to="/join-group" className="btn btn-primary">
                {t("enterCodeManually")}
              </Link>
              <Link to="/" className="btn btn-secondary">
                {t("goHome")}
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader
        backTo="/"
        title={`${t("joinGroup")} "${trip.name}"`}
        subtitle={t("tapYourName")}
      />

      <div className="content">
        {/* Trip Info */}
        <div className="card">
          <h3>{t("groupDetails")}</h3>
          <div style={{ fontSize: "0.875rem", color: "var(--ease-color-text-muted)" }}>
            <p>
              <strong>{t("groupName").replace(" *", "")}:</strong> {trip.name}
            </p>
            {trip.description && (
              <p>
                <strong>{t("description")}</strong> {trip.description}
              </p>
            )}
            <p>
              <strong>{t("roomCode")}</strong> {trip.roomCode}
            </p>
            <p>
              <strong>{t("participants")}:</strong>{" "}
              {countLabel("person", trip.participants.length)}
            </p>
          </div>
        </div>

        {/* Participants - Clickable to Join */}
        <div className="card">
          <h3>{t("participants")}</h3>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--ease-color-text-muted)",
              marginBottom: "1rem",
            }}
          >
            {t("tapYourName")}
          </p>
          <div className="list">
            {trip.participants.map((participant: User) => (
              <div
                key={participant.id}
                className="list-item"
                onClick={() => handleParticipantClick(participant)}
                style={{
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  backgroundColor: "var(--ease-color-surface-raised)",
                  border: "1px solid var(--ease-color-border)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--ease-color-surface-subtle)";
                  e.currentTarget.style.borderColor = "var(--ease-color-brand)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--ease-color-surface-raised)";
                  e.currentTarget.style.borderColor = "var(--ease-color-border)";
                }}
              >
                <div className="list-item-content">
                  <div className="list-item-title">
                    {participant.name}
                    <span
                      style={{
                        marginLeft: "0.5rem",
                        fontSize: "0.75rem",
                        color: "var(--ease-color-brand)",
                        fontWeight: "500",
                      }}
                    >
                      ({t("clickToContinue")})
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "1.25rem",
                    color: "var(--ease-color-brand)",
                    opacity: 0.6,
                  }}
                >
                  →
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Join Form - New Users */}
        <div className="card">
          <h3>{t("newMember")}</h3>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--ease-color-text-muted)",
              marginBottom: "1rem",
            }}
          >
            {t("addYourName")}
          </p>

          {error && (
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
              {error}
            </div>
          )}

          <form onSubmit={handleJoinTrip} className="form">
            <div className="form-group">
              <label htmlFor="userName">{t("yourName")}</label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  // Clear error when user starts typing
                  if (error) setError("");
                }}
                placeholder={t("yourName").replace(" *", "")}
                required
                autoFocus
              />
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--ease-color-text-muted)",
                  marginTop: "0.5rem",
                }}
              >
                {trip &&
                trip.participants.some(
                  (p) => p.name.toLowerCase() === userName.toLowerCase()
                ) ? (
                  <span style={{ color: "var(--ease-color-danger)" }}>
                    {t("duplicateName")}
                  </span>
                ) : (
                  t("chooseRecognizableName")
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={joining}
            >
              {joining ? (
                <div
                  className="spinner"
                  style={{ width: "1rem", height: "1rem", margin: "0 auto" }}
                />
              ) : (
                `${t("joinGroup")} ${trip.name}`
              )}
            </button>
          </form>
        </div>

        <div className="card">
            <h3>{t("next")}</h3>
          <div
            style={{
              fontSize: "0.875rem",
              color: "var(--ease-color-text-muted)",
              lineHeight: "1.6",
            }}
          >
              <p>• {t("addExpense")}</p>
              <p>• {t("checkBalances")}</p>
              <p>• {t("settleUp")}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AutoJoinPage;
