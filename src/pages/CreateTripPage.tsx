import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FirebaseService } from "../services/firebase";
import type { CreateTripForm } from "../types";

const CreateTripPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTripForm>({
    name: "",
    description: "",
    creatorName: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.creatorName.trim()) {
      alert("Trip name and your name are required");
      return;
    }

    setLoading(true);
    try {
      const { trip, roomCode } = await FirebaseService.createTrip(
        formData.name.trim(),
        formData.description?.trim() || "",
        formData.creatorName.trim()
      );

      // Store room code and user info in localStorage for easy access
      localStorage.setItem("currentTripId", trip.id);
      localStorage.setItem("currentUserId", trip.participants[0].id);
      localStorage.setItem("currentUserName", trip.participants[0].name);
      localStorage.setItem("roomCode", roomCode);

      // Show success message with room code
      alert(
        `Trip created successfully! Room code: ${roomCode}\nShare this code with your friends so they can join.`
      );

      // Navigate to trip dashboard
      navigate(`/trip/${trip.id}`);
    } catch (error) {
      console.error("Error creating trip:", error);
      alert("Failed to create trip. Please try again.");
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
        <h1>Create Trip</h1>
        <p>Start a new expense sharing trip</p>
      </div>

      <div className="content">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="name">Trip Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Tokyo Adventure 2024"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of your trip..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="creatorName">Your Name *</label>
            <input
              type="text"
              id="creatorName"
              name="creatorName"
              value={formData.creatorName}
              onChange={handleInputChange}
              placeholder="Enter your name"
              required
            />
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
              "Create Trip"
            )}
          </button>
        </form>

        <div className="card" style={{ marginTop: "2rem" }}>
          <h3>What happens next?</h3>
          <div
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              lineHeight: "1.6",
            }}
          >
            <p>• A unique room code will be generated</p>
            <p>• Share the code with your travel companions</p>
            <p>• Everyone can join and start adding expenses</p>
            <p>• The app will automatically calculate who owes whom</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTripPage;
