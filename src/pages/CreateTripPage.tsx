import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "../components/ui/AppHeader";
import { FirebaseService } from "../services/firebase";
import { GroupHistoryService } from "../services/groupHistory";
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
      alert("Group name and your name are required");
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

      // Add group to history
      GroupHistoryService.addGroupToHistory(
        trip.id,
        trip.name,
        roomCode,
        "creator",
        trip.participants[0].id,
        trip.participants[0].name
      );

      // Show success message with shareable link
      const shareableLink = `${window.location.origin}/join/${roomCode}`;

      // Try to copy to clipboard
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(shareableLink);
          alert(
            `Group created successfully!\n\nShareable link copied to clipboard:\n${shareableLink}\n\nSend this link to your friends so they can join instantly!`
          );
        } catch {
          alert(
            `Group created successfully!\n\nShare this link with your friends:\n${shareableLink}\n\nRoom code: ${roomCode}`
          );
        }
      } else {
        alert(
          `Group created successfully!\n\nShare this link with your friends:\n${shareableLink}\n\nRoom code: ${roomCode}`
        );
      }

      // Navigate to trip dashboard
      navigate(`/group/${trip.id}`);
    } catch (error) {
      console.error("Error creating trip:", error);
      alert("Failed to create group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppHeader
        backTo="/"
        title="New Group"
        subtitle="Name it. Share the code."
      />

      <div className="content">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="name">Group Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Weekend trip"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Notes (optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Optional notes"
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
              placeholder="Your name"
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
              "Create Group"
            )}
          </button>
        </form>

        <div className="card" style={{ marginTop: "2rem" }}>
          <h3>Next</h3>
          <div
            style={{
              fontSize: "0.875rem",
              color: "var(--ease-color-text-muted)",
              lineHeight: "1.6",
            }}
          >
            <p>• Share the code</p>
            <p>• Add expenses</p>
            <p>• Settle up</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTripPage;
