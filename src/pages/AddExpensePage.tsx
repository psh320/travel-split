import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppHeader } from "../components/ui/AppHeader";
import { FirebaseService } from "../services/firebase";
import { t } from "../i18n";
import { formatAmount } from "../utils";
import { useToast } from "../components/ui/useToast";
import { Avatar } from "../components/Avatar";
import type { Trip, AddExpenseForm, ExpenseSplitMode } from "../types";
import {
  createEqualShares,
  EXPENSE_CATEGORIES,
  parseExpenseDateInput,
  toExpenseDateInput,
} from "../utils/expenses";

const AddExpensePage = () => {
  const { groupId, expenseId } = useParams<{
    groupId: string;
    expenseId?: string;
  }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEditing = Boolean(expenseId);
  const cachedTrip = groupId ? FirebaseService.getCachedTripById(groupId) : null;
  const [trip, setTrip] = useState<Trip | null>(cachedTrip);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [formData, setFormData] = useState<AddExpenseForm>({
    description: "",
    amount: "",
    paidBy: "",
    participants: [],
    category: "other",
    date: toExpenseDateInput(new Date()),
    splitMode: "equal",
    shares: {},
  });

  const loadTrip = useCallback(async () => {
    if (!groupId) return;

    try {
      const tripData = await FirebaseService.getTripById(groupId, {
        force: Boolean(FirebaseService.getCachedTripById(groupId)),
      });
      if (tripData) {
        setTrip(tripData);
      } else {
        showToast(t("noMatches"), "error");
        navigate("/");
      }
    } catch (error) {
      console.error("Error loading trip:", error);
      showToast(t("noMatches"), "error");
    }
  }, [groupId, navigate, showToast]);

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (userId) {
      setCurrentUserId(userId);
    }

    loadTrip();
  }, [groupId, loadTrip]);

  useEffect(() => {
    if (!trip) return;

    const expenseToEdit = expenseId
      ? trip.expenses.find((expense) => expense.id === expenseId)
      : null;

    if (expenseId && !expenseToEdit) {
      showToast(t("noMatches"), "error");
      navigate(`/group/${trip.id}/expenses`);
      return;
    }

    if (expenseToEdit) {
      setFormData({
        description: expenseToEdit.description,
        amount: expenseToEdit.amount.toString(),
        paidBy: expenseToEdit.paidBy,
        participants: expenseToEdit.participants,
        category: expenseToEdit.category ?? "other",
        date: toExpenseDateInput(expenseToEdit.date),
        splitMode: expenseToEdit.splitMode ?? "equal",
        shares: Object.fromEntries(
          Object.entries(expenseToEdit.shares ?? {}).map(([id, amount]) => [
            id,
            amount.toFixed(2),
          ])
        ),
      });
      return;
    }

    // Set current user as default payer and select all participants by default
    if (currentUserId) {
      setFormData((prev) => ({
        ...prev,
        paidBy: currentUserId,
        participants: trip.participants.map((p) => p.id),
      }));
    }
  }, [trip, currentUserId, expenseId, navigate, showToast]);

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
      shares: checked
        ? { ...prev.shares, [participantId]: prev.shares[participantId] ?? "" }
        : Object.fromEntries(
            Object.entries(prev.shares).filter(([id]) => id !== participantId)
          ),
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
      shares: {},
    }));
  };

  const setSplitMode = (splitMode: ExpenseSplitMode) => {
    setFormData((prev) => {
      if (splitMode === "equal") return { ...prev, splitMode };

      const equalShares = createEqualShares(
        Number(prev.amount),
        prev.participants
      );
      return {
        ...prev,
        splitMode,
        shares: Object.fromEntries(
          Object.entries(equalShares).map(([id, share]) => [
            id,
            share.toFixed(2),
          ])
        ),
      };
    });
  };

  const handleShareChange = (participantId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      shares: { ...prev.shares, [participantId]: value },
    }));
  };

  const resetEqualShares = () => {
    const equalShares = createEqualShares(
      Number(formData.amount),
      formData.participants
    );
    setFormData((prev) => ({
      ...prev,
      shares: Object.fromEntries(
        Object.entries(equalShares).map(([id, share]) => [
          id,
          share.toFixed(2),
        ])
      ),
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
      showToast(t("expense"), "error");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      showToast(t("amount"), "error");
      return;
    }

    if (formData.participants.length === 0) {
      showToast(t("splitWith"), "error");
      return;
    }

    const shares = Object.fromEntries(
      formData.participants.map((participantId) => [
        participantId,
        Number(formData.shares[participantId] || 0),
      ])
    );
    const customTotal = Object.values(shares).reduce(
      (sum, share) => sum + share,
      0
    );
    if (
      formData.splitMode === "custom" &&
      (Object.values(shares).some(
        (share) => !Number.isFinite(share) || share < 0
      ) || Math.round(customTotal * 100) !== Math.round(amount * 100))
    ) {
      showToast(t("customSplitMismatch"), "error");
      return;
    }

    setLoading(true);
    try {
      if (expenseId) {
        await FirebaseService.updateExpense(
          trip.id,
          expenseId,
          formData.description.trim(),
          amount,
          formData.paidBy,
          formData.participants,
          formData.category,
          parseExpenseDateInput(formData.date),
          formData.splitMode,
          formData.splitMode === "custom" ? shares : undefined
        );
      } else {
        await FirebaseService.addExpense(
          trip.id,
          formData.description.trim(),
          amount,
          formData.paidBy,
          formData.participants,
          formData.category,
          parseExpenseDateInput(formData.date),
          formData.splitMode,
          formData.splitMode === "custom" ? shares : undefined
        );
      }

      showToast(isEditing ? t("expenseUpdated") : t("expenseAdded"), "success");
      navigate(
        isEditing ? `/group/${trip.id}/expenses` : `/group/${trip.id}`
      );
    } catch (error) {
      console.error("Error adding expense:", error);
      showToast(t("error"), "error");
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
  const customTotal = formData.participants.reduce(
    (sum, participantId) => sum + Number(formData.shares[participantId] || 0),
    0
  );
  const enteredAmount = Number(formData.amount) || 0;
  const customRemaining = Math.round((enteredAmount - customTotal) * 100) / 100;

  return (
    <>
      <AppHeader
        backTo={isEditing ? `/group/${groupId}/expenses` : `/group/${groupId}`}
        title={isEditing ? t("editExpense") : t("addExpense")}
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
              inputMode="decimal"
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
            <label htmlFor="date">{t("expenseDate")}</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <fieldset className="form-group expense-category-fieldset">
            <legend>{t("category")}</legend>
            <div className="expense-category-grid">
              {EXPENSE_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`expense-category-option${
                    formData.category === category ? " is-selected" : ""
                  }`}
                  aria-pressed={formData.category === category}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, category }))
                  }
                >
                  <span className={`expense-category-dot category-${category}`} />
                  {t(category)}
                </button>
              ))}
            </div>
          </fieldset>

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
            <div className="expense-selection-actions">
              <button
                type="button"
                onClick={selectAllParticipants}
                className="btn btn-secondary btn-small"
              >
                {t("selectAll")}
              </button>
              <button
                type="button"
                onClick={selectNoParticipants}
                className="btn btn-secondary btn-small"
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
            {formData.participants.length > 0 && (
              <div className="split-method-section">
                <span className="split-method-label">{t("splitMethod")}</span>
                <div
                  className="split-method-toggle"
                  role="group"
                  aria-label={t("splitMethod")}
                >
                  <button
                    type="button"
                    className={formData.splitMode === "equal" ? "is-selected" : ""}
                    aria-pressed={formData.splitMode === "equal"}
                    onClick={() => setSplitMode("equal")}
                  >
                    {t("splitEqually")}
                  </button>
                  <button
                    type="button"
                    className={formData.splitMode === "custom" ? "is-selected" : ""}
                    aria-pressed={formData.splitMode === "custom"}
                    onClick={() => setSplitMode("custom")}
                  >
                    {t("splitCustom")}
                  </button>
                </div>

                {formData.splitMode === "equal" ? (
                  splitAmount > 0 && (
                    <div className="split-summary">
                      <span>{t("each")}</span>
                      <strong>{formatAmount(splitAmount)}</strong>
                    </div>
                  )
                ) : (
                  <div className="custom-share-editor">
                    <div className="custom-share-heading">
                      <span>{t("customSplitHelp")}</span>
                      <button type="button" onClick={resetEqualShares}>
                        {t("fillEqually")}
                      </button>
                    </div>
                    {formData.participants.map((participantId) => {
                      const participant = trip.participants.find(
                        (person) => person.id === participantId
                      );
                      if (!participant) return null;

                      return (
                        <label key={participantId} className="custom-share-row">
                          <span>
                            <Avatar user={participant} size="xs" decorative />
                            <strong>{participant.name}</strong>
                          </span>
                          <span className="custom-share-input">
                            <span aria-hidden="true">$</span>
                            <input
                              type="number"
                              inputMode="decimal"
                              min="0"
                              step="0.01"
                              value={formData.shares[participantId] ?? ""}
                              onChange={(event) =>
                                handleShareChange(participantId, event.target.value)
                              }
                              aria-label={participant.name + " " + t("shareAmount")}
                            />
                          </span>
                        </label>
                      );
                    })}
                    <div
                      className={
                        "custom-share-total" +
                        (customRemaining === 0 ? " is-balanced" : "")
                      }
                      aria-live="polite"
                    >
                      <span>
                        {t("allocated")}: {formatAmount(customTotal)}
                      </span>
                      <strong>
                        {customRemaining === 0
                          ? t("allocationComplete")
                          : customRemaining > 0
                            ? formatAmount(customRemaining) + " " + t("leftToAllocate")
                            : formatAmount(Math.abs(customRemaining)) +
                              " " +
                              t("overAllocated")}
                      </strong>
                    </div>
                  </div>
                )}
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
              isEditing ? t("saveChanges") : t("addExpense")
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddExpensePage;
