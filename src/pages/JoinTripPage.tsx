import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FirebaseService } from "../services/firebase";
import { GroupHistoryService } from "../services/groupHistory";
import type { Trip, User } from "../types";
import { isValidRoomCode } from "../utils";

const JoinTripPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"code" | "details">("code");
  const [loading, setLoading] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [trip, setTrip] = useState<Trip | null>(null);
  const [userName, setUserName] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  const handleRoomCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) {
      setError("Room code is required");
      return;
    }

    if (!isValidRoomCode(roomCode)) {
      setError(
        "Room code must be 6 characters long and contain only letters and numbers"
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Find the trip by room code
      const tripData = await FirebaseService.getTripByRoomCode(roomCode);

      if (!tripData) {
        setError("Group not found. Please check the room code and try again.");
        return;
      }

      setTrip(tripData);
      setStep("details");
    } catch (error) {
      console.error("Error finding trip:", error);
      setError(
        "Failed to find group. Please check the room code and try again."
      );
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
      participant.name
    );

    navigate(`/group/${trip.id}`);
  };

  const handleNewUserJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !trip) {
      setError("Please enter your name");
      return;
    }

    // Check if user name already exists (case-insensitive)
    const existingUser = trip.participants.find(
      (p) => p.name.toLowerCase() === userName.trim().toLowerCase()
    );

    if (existingUser) {
      setError(
        `The name "${userName}" is already taken. Click on the name above to join as that user, or choose a different name.`
      );
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
    } catch (error) {
      console.error("Error joining trip:", error);
      setError("Failed to join group. Please try again.");
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
        <div className="header">
          <Link to="/" className="back-button">
            ←
          </Link>
          <h1>Join Group</h1>
          <p>Enter room code to join existing trip</p>
        </div>

        <div className="content">
          {error && (
            <div
              className="card"
              style={{ marginBottom: "1rem", border: "1px solid #f87171" }}
            >
              <div style={{ color: "#dc2626", fontSize: "0.875rem" }}>
                ⚠️ {error}
              </div>
            </div>
          )}

          <form onSubmit={handleRoomCodeSubmit} className="form">
            <div className="form-group">
              <label htmlFor="roomCode">Room Code *</label>
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
                required
              />
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#6b7280",
                  marginTop: "0.5rem",
                }}
              >
                Enter the 6-character code shared by your trip organizer
              </div>
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
                "Find Group"
              )}
            </button>
          </form>

          <div className="card" style={{ marginTop: "2rem" }}>
            <h3>Need help?</h3>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                lineHeight: "1.6",
              }}
            >
              <p>• Ask your trip organizer for the room code</p>
              <p>• The code is exactly 6 characters long</p>
              <p>
                • All expenses and calculations will be synced automatically
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Step 2: Trip Details and User Selection
  if (step === "details" && trip) {
    return (
      <>
        <div className="header">
          <button onClick={handleBackToCode} className="back-button">
            ←
          </button>
          <h1>Join "{trip.name}"</h1>
          <p>Choose how to join this group</p>
        </div>

        <div className="content">
          {/* Trip Info */}
          <div className="card">
            <h3>Group Details</h3>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              <p>
                <strong>Group Name:</strong> {trip.name}
              </p>
              {trip.description && (
                <p>
                  <strong>Description:</strong> {trip.description}
                </p>
              )}
              <p>
                <strong>Room Code:</strong> {trip.roomCode}
              </p>
              <p>
                <strong>Participants:</strong> {trip.participants.length} people
              </p>
            </div>
          </div>

          {/* Existing Participants */}
          {trip.participants.length > 0 && (
            <div className="card">
              <h3>Rejoin as Existing Member</h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  marginBottom: "1rem",
                }}
              >
                Click on your name if you've joined this group before:
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
                      backgroundColor: "#f9fafb",
                      border: "1px solid #e5e7eb",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f3f4f6";
                      e.currentTarget.style.borderColor = "#667eea";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#f9fafb";
                      e.currentTarget.style.borderColor = "#e5e7eb";
                    }}
                  >
                    <div className="list-item-content">
                      <div className="list-item-title">
                        {participant.name}
                        <span
                          style={{
                            marginLeft: "0.5rem",
                            fontSize: "0.75rem",
                            color: "#667eea",
                            fontWeight: "500",
                          }}
                        >
                          (Click to continue)
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "1.25rem",
                        color: "#667eea",
                        opacity: 0.6,
                      }}
                    >
                      →
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New User Form */}
          <div className="card">
            <h3>Or Join as New Member</h3>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginBottom: "1rem",
              }}
            >
              If this is your first time joining this group, enter your name
              below:
            </p>

            {error && (
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
                {error}
              </div>
            )}

            <form onSubmit={handleNewUserJoin} className="form">
              <div className="form-group">
                <label htmlFor="userName">Your Name *</label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter your name"
                  required
                />
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#6b7280",
                    marginTop: "0.5rem",
                  }}
                >
                  {userName &&
                  trip.participants.some(
                    (p) => p.name.toLowerCase() === userName.toLowerCase()
                  ) ? (
                    <span style={{ color: "#dc2626" }}>
                      ⚠️ This name already exists. Click on "{userName}" above
                      to join as existing user.
                    </span>
                  ) : (
                    "Choose a unique name that others can recognize"
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
                  `Join ${trip.name}`
                )}
              </button>
            </form>
          </div>

          <div className="card">
            <h3>What's Next?</h3>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                lineHeight: "1.6",
              }}
            >
              <p>• Join the group and start tracking shared expenses</p>
              <p>• Add expenses as you spend together</p>
              <p>• See who owes what with automatic calculations</p>
              <p>• Settle up easily when you're done</p>
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
