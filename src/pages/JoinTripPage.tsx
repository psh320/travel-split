import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "../components/ui/AppHeader";
import { FirebaseService } from "../services/firebase";
import { GroupHistoryService } from "../services/groupHistory";
import type { AvatarConfig, Trip, User } from "../types";
import { Avatar } from "../components/Avatar";
import { isValidRoomCode } from "../utils";
import { countLabel, t } from "../i18n";
import { AvatarCustomizer } from "../components/AvatarCustomizer";
import { DEFAULT_AVATAR_CONFIG } from "../utils/avatars";
import { useToast } from "../components/ui/useToast";
import { FieldError } from "../components/ui/FieldError";
import {
  MAX_TRIP_PARTICIPANTS,
  TripParticipantLimitError,
} from "../config/trip";

const JoinTripPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState<"code" | "details">("code");
  const [loading, setLoading] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [trip, setTrip] = useState<Trip | null>(null);
  const [userName, setUserName] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({
    ...DEFAULT_AVATAR_CONFIG,
  });

  const handleRoomCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) {
      setError(t("requiredField"));
      return;
    }

    if (!isValidRoomCode(roomCode)) {
      setError(t("invalidRoomCode"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Find the trip by room code
      const tripData = await FirebaseService.getTripByRoomCode(roomCode);

      if (!tripData) {
        setError(t("groupNotFound"));
        return;
      }

      setTrip(tripData);
      setStep("details");
    } catch (error) {
      console.error("Error finding trip:", error);
      setError(t("groupNotFound"));
    } finally {
      setLoading(false);
    }
  };

  const handleParticipantClick = (participant: User) => {
    if (joining || !trip) return;

    // User already exists, log them in
    localStorage.setItem("currentTripId", trip.id);
    localStorage.setItem("currentUserId", participant.id);
    localStorage.setItem("currentUserName", participant.name);
    localStorage.setItem("roomCode", trip.roomCode);

    // Add group to history
    GroupHistoryService.addGroupToHistory(
      trip.id,
      trip.name,
      trip.roomCode,
      "participant",
      participant.id,
      participant.name,
      participant.avatarId,
      participant.avatarConfig
    );

    showToast(t("joinedGroup"), "success");
    navigate(`/group/${trip.id}`);
  };

  const handleNewUserJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !trip) {
      setError(t("requiredField"));
      return;
    }

    // Check if user name already exists (case-insensitive)
    const existingUser = trip.participants.find(
      (p) => p.name.toLowerCase() === userName.trim().toLowerCase()
    );

    if (existingUser) {
      setError(t("nameTaken"));
      return;
    }

    if (trip.participants.length >= MAX_TRIP_PARTICIPANTS) {
      setError(t("memberLimitReached"));
      return;
    }

    setJoining(true);
    setError("");

    try {
      // Add new user to trip
      const newUser = await FirebaseService.addUserToTrip(
        trip.id,
        userName.trim(),
        avatarConfig
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
        newUser.name,
        newUser.avatarId,
        newUser.avatarConfig
      );

      showToast(t("joinedGroup"), "success");
      navigate(`/group/${trip.id}`);
    } catch (error) {
      console.error("Error joining trip:", error);
      setError(
        error instanceof TripParticipantLimitError
          ? t("memberLimitReached")
          : t("unableToJoin")
      );
    } finally {
      setJoining(false);
    }
  };

  const handleBackToCode = () => {
    setStep("code");
    setTrip(null);
    setUserName("");
    setError("");
  };

  // Step 1: Room Code Entry
  if (step === "code") {
    return (
      <>
        <AppHeader
          backTo="/"
          title={t("joinGroup")}
          subtitle={t("enterCode")}
        />

        <div className="content">
          <form onSubmit={handleRoomCodeSubmit} className="form" noValidate>
            <div className="form-group">
              <label htmlFor="roomCode">{t("roomCodeField")}</label>
              <input
                type="text"
                id="roomCode"
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value.toUpperCase());
                  if (error) setError("");
                }}
                placeholder="ABCD12"
                maxLength={6}
                style={{
                  textTransform: "uppercase",
                  fontSize: "1.25rem",
                  textAlign: "center",
                  letterSpacing: "0.1em",
                }}
                autoFocus
                aria-invalid={Boolean(error)}
                aria-describedby={
                  error ? "room-code-help room-code-error" : "room-code-help"
                }
                required
              />
              <span id="room-code-help" className="form-help">
                {t("sixCharacters")}
              </span>
              <FieldError id="room-code-error" message={error} />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? (
                <div
                  className="spinner"
                  style={{ width: "1rem", height: "1rem", margin: "0 auto" }}
                />
              ) : (
                t("findGroup")
              )}
            </button>
          </form>

          <div className="card">
            <h3>{t("help")}</h3>
            <div
              style={{
                fontSize: "0.875rem",
                color: "var(--ease-color-text-muted)",
                lineHeight: "1.6",
              }}
            >
              <p>• {t("useRoomCode")}</p>
              <p>• {t("shareCode")}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Step 2: Trip Details and User Selection
  if (step === "details" && trip) {
    const isAtParticipantLimit =
      trip.participants.length >= MAX_TRIP_PARTICIPANTS;

    return (
      <>
        <AppHeader
          onBack={handleBackToCode}
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

          {/* Existing Participants */}
          {trip.participants.length > 0 && (
            <div className="card">
              <h3>{t("member")}</h3>
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
          )}

          {/* New User Form */}
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
            <form onSubmit={handleNewUserJoin} className="form" noValidate>
              <div className="form-group">
                  <label htmlFor="userName">{t("yourName")}</label>
                  <input
                    type="text"
                    id="userName"
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
                      if (error) setError("");
                  }}
                  placeholder={t("yourName").replace(" *", "")}
                  aria-invalid={Boolean(error)}
                  aria-describedby={
                    error ? "join-name-help join-name-error" : "join-name-help"
                  }
                  required
                />
                <span id="join-name-help" className="form-help">
                  {userName &&
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
                <FieldError id="join-name-error" message={error} />
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
  }

  // Fallback (shouldn't reach here)
  return null;
};

export default JoinTripPage;
