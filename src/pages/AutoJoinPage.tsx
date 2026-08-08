import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AppHeader } from "../components/ui/AppHeader";
import { FirebaseService } from "../services/firebase";
import { GroupHistoryService } from "../services/groupHistory";
import { isValidRoomCode } from "../utils";
import type { AvatarConfig, Trip, User } from "../types";
import { Avatar } from "../components/Avatar";
import { countLabel, t } from "../i18n";
import { AvatarCustomizer } from "../components/AvatarCustomizer";
import { DEFAULT_AVATAR_CONFIG } from "../utils/avatars";
import { useToast } from "../components/ui/useToast";
import { FieldError } from "../components/ui/FieldError";
import {
  MAX_TRIP_PARTICIPANTS,
  TripParticipantLimitError,
} from "../config/trip";
import { currentTripSession } from "../services/currentTripSession";
import { PageSkeleton } from "../components/ui/PageState";

const AutoJoinPage = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [userName, setUserName] = useState("");
  const [joining, setJoining] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [formError, setFormError] = useState("");
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({
    ...DEFAULT_AVATAR_CONFIG,
  });

  useEffect(() => {
    if (roomCode && isValidRoomCode(roomCode)) {
      void loadTrip(roomCode);
    } else {
      setLoadError(t("invalidRoomCode"));
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
        setLoadError(t("groupNotFound"));
      }
    } catch (error: unknown) {
      console.error("Error loading trip:", error);
      setLoadError(t("groupNotFound"));
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !trip || !roomCode) {
      setFormError(t("requiredField"));
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

    if (trip.participants.length >= MAX_TRIP_PARTICIPANTS) {
      setFormError(t("memberLimitReached"));
      return;
    }

    setJoining(true);
    setFormError("");

    try {
      // Add new user to trip
      const newUser = await FirebaseService.addUserToTrip(
        trip.id,
        userName.trim(),
        avatarConfig
      );

      currentTripSession.set({
        tripId: trip.id,
        userId: newUser.id,
        userName: newUser.name,
        roomCode: trip.roomCode,
      });

      // Add group to history
      GroupHistoryService.addGroupToHistory(
        trip.id,
        trip.name,
        trip.roomCode,
        "participant",
        newUser.id,
        newUser.name,
        newUser.avatarId,
        newUser.avatarConfig
      );

      showToast(t("joinedGroup"), "success");
      void navigate(`/group/${trip.id}`);
    } catch (error: unknown) {
      console.error("Error joining trip:", error);
      setFormError(
        error instanceof TripParticipantLimitError
          ? t("memberLimitReached")
          : t("unableToJoin")
      );
    } finally {
      setJoining(false);
    }
  };

  const handleExistingUserJoin = (user: User) => {
    if (!trip) return;
    currentTripSession.set({
      tripId: trip.id,
      userId: user.id,
      userName: user.name,
      roomCode: trip.roomCode,
    });

    // Add group to history
    GroupHistoryService.addGroupToHistory(
      trip.id,
      trip.name,
      trip.roomCode,
      "participant",
      user.id,
      user.name,
      user.avatarId,
      user.avatarConfig
    );

    showToast(t("joinedGroup"), "success");
    void navigate(`/group/${trip.id}`);
  };

  const handleParticipantClick = (participant: User) => {
    if (joining) return; // Prevent clicks during join process
    handleExistingUserJoin(participant);
  };

  if (loading) {
    return <PageSkeleton variant="list" />;
  }

  if (loadError) {
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
            <p style={{ color: "var(--ease-color-field-error)", marginBottom: "1rem" }}>
              {loadError}
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

  const isAtParticipantLimit =
    trip.participants.length >= MAX_TRIP_PARTICIPANTS;

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
              <button
                key={participant.id}
                type="button"
                className="participant-option"
                onClick={() => handleParticipantClick(participant)}
                aria-label={participant.name}
              >
                <span className="participant-option-profile">
                  <Avatar user={participant} size="sm" decorative />
                  <span className="participant-option-name">
                    {participant.name}
                  </span>
                </span>
                <span className="participant-option-arrow" aria-hidden="true" />
              </button>
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
            {isAtParticipantLimit ? t("memberLimitReached") : t("addYourName")}
          </p>

          {!isAtParticipantLimit && (
          <form onSubmit={handleJoinTrip} className="form" noValidate>
              <div className="form-group">
                <label htmlFor="userName">{t("yourName")}</label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => {
                  setUserName(e.target.value);
                  // Clear error when user starts typing
                  if (formError) setFormError("");
                }}
                placeholder={t("yourName").replace(" *", "")}
                aria-invalid={Boolean(formError)}
                aria-describedby={
                  formError ? "auto-join-name-help auto-join-name-error" : "auto-join-name-help"
                }
                required
                autoFocus
              />
              <span id="auto-join-name-help" className="form-help">
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
              </span>
              <FieldError id="auto-join-name-error" message={formError} />
              </div>

              <AvatarCustomizer
                value={avatarConfig}
                onChange={setAvatarConfig}
                label={t("chooseAvatar")}
              />

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
          )}
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
