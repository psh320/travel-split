import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "../components/ui/AppHeader";
import { FirebaseService } from "../services/firebase";
import { GroupHistoryService } from "../services/groupHistory";
import { t } from "../i18n";
import type { CreateTripForm } from "../types";
import { CURRENCY_OPTIONS } from "../utils/currencies";
import { useToast } from "../components/ui/useToast";

const CreateTripPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTripForm>({
    name: "",
    description: "",
    creatorName: "",
    currency: "USD",
    perPersonBudget: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
      showToast(`${t("groupName")} / ${t("yourName")}`, "error");
      return;
    }

    const perPersonBudget = formData.perPersonBudget.trim()
      ? Number(formData.perPersonBudget)
      : undefined;
    if (perPersonBudget !== undefined && (!Number.isFinite(perPersonBudget) || perPersonBudget <= 0)) {
      showToast(t("budgetInvalid"), "error");
      return;
    }

    setLoading(true);
    try {
      const { trip, roomCode } = await FirebaseService.createTrip(
        formData.name.trim(),
        formData.description?.trim() || "",
        formData.creatorName.trim(),
        formData.currency,
        perPersonBudget
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
          showToast(`${t("createGroup")} · ${shareableLink}`, "success", 5000);
        } catch {
          showToast(
            `${t("createGroup")} · ${t("roomCode")} ${roomCode}`,
            "success",
            5000
          );
        }
      } else {
        showToast(
          `${t("createGroup")} · ${t("roomCode")} ${roomCode}`,
          "success",
          5000
        );
      }

      // Navigate to trip dashboard
      navigate(`/group/${trip.id}`);
    } catch (error) {
      console.error("Error creating trip:", error);
      showToast(t("createGroup"), "error");
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
            <label htmlFor="currency">{t("currency")}</label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              required
            >
              {CURRENCY_OPTIONS.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="form-help">{t("currencyNote")}</span>
          </div>

          <div className="form-group">
            <label htmlFor="perPersonBudget">{t("perPersonBudget")}</label>
            <input
              type="number"
              inputMode="decimal"
              id="perPersonBudget"
              name="perPersonBudget"
              value={formData.perPersonBudget}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
            />
            <span className="form-help">
              {t("perPersonBudgetHelp")} · {formData.currency}
            </span>
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

        <div className="card">
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
