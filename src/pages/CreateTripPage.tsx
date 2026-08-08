import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "../components/ui/AppHeader";
import { FirebaseService } from "../services/firebase";
import { GroupHistoryService } from "../services/groupHistory";
import { t } from "../i18n";
import type { AvatarConfig, CreateTripForm } from "../types";
import { useToast } from "../components/ui/useToast";
import { FieldError } from "../components/ui/FieldError";
import { AvatarCustomizer } from "../components/AvatarCustomizer";
import { DEFAULT_AVATAR_CONFIG } from "../utils/avatars";
import { currentTripSession } from "../services/currentTripSession";

type CreateTripErrors = Partial<
  Record<"name" | "creatorName" | "perPersonBudget", string>
>;

const CreateTripPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<CreateTripErrors>({});
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({
    ...DEFAULT_AVATAR_CONFIG,
  });
  const [formData, setFormData] = useState<CreateTripForm>({
    name: "",
    description: "",
    creatorName: "",
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
    if (name in formErrors) {
      setFormErrors((current) => ({ ...current, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const perPersonBudget = formData.perPersonBudget.trim()
      ? Number(formData.perPersonBudget)
      : undefined;
    const nextErrors: CreateTripErrors = {};

    if (!formData.name.trim()) nextErrors.name = t("requiredField");
    if (!formData.creatorName.trim()) {
      nextErrors.creatorName = t("requiredField");
    }
    if (
      perPersonBudget !== undefined &&
      (!Number.isFinite(perPersonBudget) || perPersonBudget <= 0)
    ) {
      nextErrors.perPersonBudget = t("budgetInvalid");
    }

    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      const { trip, roomCode } = await FirebaseService.createTrip(
        formData.name.trim(),
        formData.description?.trim() || "",
        formData.creatorName.trim(),
        perPersonBudget,
        avatarConfig
      );

      currentTripSession.set({
        tripId: trip.id,
        userId: trip.participants[0].id,
        userName: trip.participants[0].name,
        roomCode,
      });

      // Add group to history
      GroupHistoryService.addGroupToHistory(
        trip.id,
        trip.name,
        roomCode,
        "creator",
        trip.participants[0].id,
        trip.participants[0].name,
        trip.participants[0].avatarId,
        trip.participants[0].avatarConfig
      );

      // Show success message with shareable link
      const shareableLink = `${window.location.origin}/join/${roomCode}`;

      // Try to copy to clipboard
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(shareableLink);
          showToast(t("groupCreatedAndLinkCopied"), "success", 4200);
        } catch {
          showToast(
            `${t("groupCreated")} · ${t("roomCode")} ${roomCode}`,
            "success",
            5000
          );
        }
      } else {
        showToast(
          `${t("groupCreated")} · ${t("roomCode")} ${roomCode}`,
          "success",
          5000
        );
      }

      // Navigate to trip dashboard
      void navigate(`/group/${trip.id}`);
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
        <form onSubmit={handleSubmit} className="form" noValidate>
          <div className="form-group">
            <label htmlFor="name">{t("groupName")}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t("newGroup")}
              autoFocus
              aria-invalid={Boolean(formErrors.name)}
              aria-describedby={formErrors.name ? "group-name-error" : undefined}
              required
            />
            <FieldError id="group-name-error" message={formErrors.name} />
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
              aria-invalid={Boolean(formErrors.perPersonBudget)}
              aria-describedby={
                formErrors.perPersonBudget
                  ? "per-person-budget-help per-person-budget-error"
                  : "per-person-budget-help"
              }
            />
            <span id="per-person-budget-help" className="form-help">
              {t("perPersonBudgetHelp")}
            </span>
            <FieldError
              id="per-person-budget-error"
              message={formErrors.perPersonBudget}
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
              aria-invalid={Boolean(formErrors.creatorName)}
              aria-describedby={
                formErrors.creatorName ? "creator-name-error" : undefined
              }
              required
            />
            <FieldError
              id="creator-name-error"
              message={formErrors.creatorName}
            />
          </div>

          <AvatarCustomizer
            value={avatarConfig}
            onChange={setAvatarConfig}
            label={t("chooseAvatar")}
          />

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
