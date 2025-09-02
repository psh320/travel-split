import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FirebaseService } from "../services/firebase";
import { isValidRoomCode } from "../utils";
import type { Trip, User } from "../types";

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
      setError("Invalid room code in URL");
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
        setError("Trip not found. Please check the room code.");
      }
    } catch (error) {
      console.error("Error loading trip:", error);
      setError("Failed to load trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !trip || !roomCode) {
      setError("Please enter your name");
      return;
    }

    setJoining(true);
    setError("");

    try {
      // Check if user name already exists in trip
      const existingUser = trip.participants.find(
        (p: User) => p.name.toLowerCase() === userName.toLowerCase()
      );

      if (existingUser) {
        // User already exists, just log them in
        localStorage.setItem("currentTripId", trip.id);
        localStorage.setItem("currentUserId", existingUser.id);
        localStorage.setItem("currentUserName", existingUser.name);
        localStorage.setItem("roomCode", trip.roomCode);

        navigate(`/trip/${trip.id}`);
      } else {
        // Add new user to trip
        const newUser = await FirebaseService.addUserToTrip(
          trip.id,
          userName.trim()
        );

        localStorage.setItem("currentTripId", trip.id);
        localStorage.setItem("currentUserId", newUser.id);
        localStorage.setItem("currentUserName", newUser.name);
        localStorage.setItem("roomCode", trip.roomCode);

        navigate(`/trip/${trip.id}`);
      }
    } catch (error) {
      console.error("Error joining trip:", error);
      setError("Failed to join trip. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <>
        <div className="header">
          <Link to="/" className="back-button">
            ←
          </Link>
          <h1>Joining Trip...</h1>
          <p>Loading trip information</p>
        </div>
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
        <div className="header">
          <Link to="/" className="back-button">
            ←
          </Link>
          <h1>Unable to Join</h1>
          <p>There was a problem with the trip link</p>
        </div>
        <div className="content">
          <div className="card">
            <h3>Error</h3>
            <p style={{ color: "#dc2626", marginBottom: "1rem" }}>{error}</p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Link to="/join-trip" className="btn btn-primary">
                Enter Code Manually
              </Link>
              <Link to="/" className="btn btn-secondary">
                Go Home
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
        <div className="header">
          <Link to="/" className="back-button">
            ←
          </Link>
          <h1>Trip Not Found</h1>
          <p>The trip link may have expired</p>
        </div>
        <div className="content">
          <div className="card">
            <h3>Trip Not Found</h3>
            <p style={{ marginBottom: "1rem" }}>
              The trip with room code <strong>{roomCode}</strong> could not be
              found.
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Link to="/join-trip" className="btn btn-primary">
                Enter Code Manually
              </Link>
              <Link to="/" className="btn btn-secondary">
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="header">
        <Link to="/" className="back-button">
          ←
        </Link>
        <h1>Join "{trip.name}"</h1>
        <p>You're invited to join this trip!</p>
      </div>

      <div className="content">
        {/* Trip Info */}
        <div className="card">
          <h3>Trip Details</h3>
          <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            <p>
              <strong>Trip Name:</strong> {trip.name}
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

        {/* Participants Preview */}
        <div className="card">
          <h3>Current Participants</h3>
          <div className="list">
            {trip.participants.slice(0, 5).map((participant: User) => (
              <div key={participant.id} className="list-item">
                <div className="list-item-content">
                  <div className="list-item-title">{participant.name}</div>
                </div>
              </div>
            ))}
            {trip.participants.length > 5 && (
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  textAlign: "center",
                  marginTop: "0.5rem",
                }}
              >
                and {trip.participants.length - 5} more...
              </div>
            )}
          </div>
        </div>

        {/* Join Form */}
        <div className="card">
          <h3>Enter Your Name to Join</h3>
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

          <form onSubmit={handleJoinTrip} className="form">
            <div className="form-group">
              <label htmlFor="userName">Your Name *</label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                required
                autoFocus
              />
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#6b7280",
                  marginTop: "0.5rem",
                }}
              >
                If you've joined this trip before, use the same name to access
                your previous data
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
            <p>• Join the trip and start tracking shared expenses</p>
            <p>• Add expenses as you travel together</p>
            <p>• See who owes what with automatic calculations</p>
            <p>• Settle up easily at the end of your trip</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AutoJoinPage;
