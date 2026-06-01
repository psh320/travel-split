import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "../components/ui/AppHeader";
import { FirebaseService } from "../services/firebase";
import { GroupHistoryService } from "../services/groupHistory";
import { t } from "../i18n";
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
      alert(`${t("groupName")} / ${t("yourName")}`);
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
            `${t("createGroup")}\n\n${t("shareLink")}:\n${shareableLink}`
          );
        } catch {
          alert(
            `${t("createGroup")}\n\n${t("shareLink")}:\n${shareableLink}\n\n${t("roomCode")} ${roomCode}`
          );
        }
      } else {
        alert(
          `${t("createGroup")}\n\n${t("shareLink")}:\n${shareableLink}\n\n${t("roomCode")} ${roomCode}`
        );
      }

      // Navigate to trip dashboard
      navigate(`/group/${trip.id}`);
    } catch (error) {
      console.error("Error creating trip:", error);
      alert(t("createGroup"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppHeader
        backTo="/"
        title={t("newGroup")}
        subtitle={`${t("groupName").replace(" *", "")}. ${t("shareCode")}.`}
      />

      <div className="content">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="name">{t("groupName")}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t("newGroup")}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">{t("notes")}</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={t("notes")}
            />
          </div>

          <div className="form-group">
            <label htmlFor="creatorName">{t("yourName")}</label>
            <input
              type="text"
              id="creatorName"
              name="creatorName"
              value={formData.creatorName}
              onChange={handleInputChange}
              placeholder={t("yourName").replace(" *", "")}
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
              t("createGroup")
            )}
          </button>
        </form>

        <div className="card" style={{ marginTop: "2rem" }}>
          <h3>{t("next")}</h3>
          <div
            style={{
              fontSize: "0.875rem",
              color: "var(--ease-color-text-muted)",
              lineHeight: "1.6",
            }}
          >
            <p>• {t("shareCode")}</p>
            <p>• {t("addExpense")}</p>
            <p>• {t("settleUp")}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTripPage;
