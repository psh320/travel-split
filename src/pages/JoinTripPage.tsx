import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FirebaseService } from "../services/firebase";
import { GroupHistoryService } from "../services/groupHistory";
import type { JoinTripForm } from "../types";
import { isValidRoomCode } from "../utils";

const JoinTripPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<JoinTripForm>({
    roomCode: "",
    userName: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "roomCode" ? value.toUpperCase() : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roomCode.trim() || !formData.userName.trim()) {
      alert("Room code and your name are required");
      return;
    }

    if (!isValidRoomCode(formData.roomCode)) {
      alert(
        "Room code must be 6 characters long and contain only letters and numbers"
      );
      return;
    }

    setLoading(true);
    try {
      // First, find the trip by room code
      const trip = await FirebaseService.getTripByRoomCode(formData.roomCode);

      if (!trip) {
        alert("Group not found. Please check the room code and try again.");
        return;
      }

      // Check if user name already exists in trip
      const existingUser = trip.participants.find(
        (p) => p.name.toLowerCase() === formData.userName.toLowerCase()
      );

      if (existingUser) {
        // User already exists, just log them in
        localStorage.setItem("currentTripId", trip.id);
        localStorage.setItem("currentUserId", existingUser.id);
        localStorage.setItem("currentUserName", existingUser.name);
        localStorage.setItem("roomCode", trip.roomCode);

        // Add group to history
        GroupHistoryService.addGroupToHistory(
          trip.id,
          trip.name,
          trip.roomCode,
          "participant",
          existingUser.id,
          existingUser.name
        );

        navigate(`/group/${trip.id}`);
      } else {
        // Add new user to trip
        const newUser = await FirebaseService.addUserToTrip(
          trip.id,
          formData.userName.trim()
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

        alert(`Welcome to ${trip.name}!`);
        navigate(`/group/${trip.id}`);
      }
    } catch (error) {
      console.error("Error joining trip:", error);
      alert("Failed to join group. Please check the room code and try again.");
    } finally {
      setLoading(false);
    }
  };

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
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="roomCode">Room Code *</label>
            <input
              type="text"
              id="roomCode"
              name="roomCode"
              value={formData.roomCode}
              onChange={handleInputChange}
              placeholder="ABCD12"
              maxLength={6}
              style={{
                textTransform: "uppercase",
                fontSize: "1.25rem",
                textAlign: "center",
                letterSpacing: "0.1em",
              }}
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

          <div className="form-group">
            <label htmlFor="userName">Your Name *</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
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
              If you've already joined this trip before, use the same name to
              access your previous data
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
              "Join Group"
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
            <p>• Use the same name if you've joined this trip before</p>
            <p>• All expenses and calculations will be synced automatically</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default JoinTripPage;
