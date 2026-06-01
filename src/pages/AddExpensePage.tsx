import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppHeader } from "../components/ui/AppHeader";
import { FirebaseService } from "../services/firebase";
import { t } from "../i18n";
import type { Trip, AddExpenseForm } from "../types";

const AddExpensePage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [formData, setFormData] = useState<AddExpenseForm>({
    description: "",
    amount: "",
    paidBy: "",
    participants: [],
  });

  const loadTrip = useCallback(async () => {
    if (!groupId) return;

    try {
      const tripData = await FirebaseService.getTripById(groupId);
      if (tripData) {
        setTrip(tripData);
      } else {
        alert(t("noMatches"));
        navigate("/");
      }
    } catch (error) {
      console.error("Error loading trip:", error);
      alert(t("noMatches"));
    }
  }, [groupId, navigate]);

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (userId) {
      setCurrentUserId(userId);
    }

    loadTrip();
  }, [groupId, loadTrip]);

  useEffect(() => {
    // Set current user as default payer and select all participants by default
    if (trip && currentUserId) {
      setFormData((prev) => ({
        ...prev,
        paidBy: currentUserId,
        participants: trip.participants.map((p) => p.id), // Select all by default
      }));
    }
  }, [trip, currentUserId]);

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

  const handleParticipantChange = (participantId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      participants: checked
        ? [...prev.participants, participantId]
        : prev.participants.filter((id) => id !== participantId),
    }));
  };

  const selectAllParticipants = () => {
    if (!trip) return;
    setFormData((prev) => ({
      ...prev,
      participants: trip.participants.map((p) => p.id),
    }));
  };

  const selectNoParticipants = () => {
    setFormData((prev) => ({
      ...prev,
      participants: [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !trip ||
      !formData.description.trim() ||
      !formData.amount ||
      !formData.paidBy
    ) {
      alert(t("expense"));
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert(t("amount"));
      return;
    }

    if (formData.participants.length === 0) {
      alert(t("splitWith"));
      return;
    }

    setLoading(true);
    try {
      await FirebaseService.addExpense(
        trip.id,
        formData.description.trim(),
        amount,
        formData.paidBy,
        formData.participants
      );

      alert(t("addExpense"));
      navigate(`/group/${trip.id}`);
    } catch (error) {
      console.error("Error adding expense:", error);
      alert(t("addExpense"));
    } finally {
      setLoading(false);
    }
  };

  if (!trip) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );
  }

  const splitAmount =
    formData.amount && formData.participants.length > 0
      ? parseFloat(formData.amount) / formData.participants.length
      : 0;

  return (
    <>
      <AppHeader
        backTo={`/group/${groupId}`}
        title={t("addExpense")}
        subtitle={`${t("paidBy").replace(" *", "")}? ${t("splitWith").replace(
          " *",
          ""
        )}?`}
      />

      <div className="content">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="description">{t("expense")}</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={t("expense").replace(" *", "")}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">{t("amount")}</label>
            <input
              type="number"
              inputMode="tel"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="paidBy">{t("paidBy")}</label>
            <select
              id="paidBy"
              name="paidBy"
              value={formData.paidBy}
              onChange={handleInputChange}
              required
            >
              <option value="">{t("paidBy").replace(" *", "")}</option>
              {trip.participants.map((participant) => (
                <option key={participant.id} value={participant.id}>
                  {participant.name}
                  {participant.id === currentUserId ? ` (${t("you")})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{t("splitWith")}</label>
            <div style={{ display: "flex", gap: "0.5rem", margin: "0.5rem 0" }}>
              <button
                type="button"
                onClick={selectAllParticipants}
                className="btn btn-secondary"
                style={{ padding: "0.375rem 0.75rem", fontSize: "0.75rem" }}
              >
                {t("selectAll")}
              </button>
              <button
                type="button"
                onClick={selectNoParticipants}
                className="btn btn-secondary"
                style={{ padding: "0.375rem 0.75rem", fontSize: "0.75rem" }}
              >
                {t("selectNone")}
              </button>
            </div>
            <div className="checkbox-group">
              {trip.participants.map((participant) => (
                <label key={participant.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.participants.includes(participant.id)}
                    onChange={(e) =>
                      handleParticipantChange(participant.id, e.target.checked)
                    }
                  />
                  <span>
                    {participant.name}
                    {participant.id === currentUserId ? ` (${t("you")})` : ""}
                  </span>
                </label>
              ))}
            </div>
            {formData.participants.length > 0 && splitAmount > 0 && (
              <div
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.875rem",
                  color: "var(--ease-color-text-muted)",
                  padding: "0.5rem",
                  background: "var(--ease-color-surface-raised)",
                  borderRadius: "0.375rem",
                }}
              >
                {t("splitWith").replace(" *", "")}:{" "}
                <strong>${splitAmount.toFixed(2)}</strong>
              </div>
            )}
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
              t("addExpense")
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddExpensePage;
