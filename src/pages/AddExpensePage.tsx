import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppHeader } from "../components/ui/AppHeader";
import { FirebaseService } from "../services/firebase";
import { t } from "../i18n";
import { useToast } from "../components/ui/useToast";
import type { AddExpenseForm, ExpenseSplitMode } from "../types";
import {
  createEqualShares,
  parseExpenseDateInput,
  toExpenseDateInput,
} from "../utils/expenses";
import { toMinorUnits } from "../utils/currency";
import { PageLoading } from "../components/ui/PageState";
import { ExpenseDetailsFields } from "../components/expense/ExpenseDetailsFields";
import { ExpenseSplitEditor } from "../components/expense/ExpenseSplitEditor";
import { useCurrentTripUserId } from "../hooks/useCurrentTripUserId";
import { useTripData } from "../hooks/useTripData";

type ExpenseFormErrors = Partial<
  Record<
    "description" | "amount" | "date" | "paidBy" | "participants" | "shares",
    string
  >
>;

const AddExpensePage = () => {
  const { groupId, expenseId } = useParams<{
    groupId: string;
    expenseId?: string;
  }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEditing = Boolean(expenseId);
  const [saving, setSaving] = useState(false);
  const currentUserId = useCurrentTripUserId();
  const { trip } = useTripData(groupId, {
    onMissing: () => {
      showToast(t("noMatches"), "error");
      void navigate("/");
    },
    onError: (error) => {
      console.error("Error loading trip:", error);
      showToast(t("noMatches"), "error");
    },
  });
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
  const [formErrors, setFormErrors] = useState<ExpenseFormErrors>({});

  useEffect(() => {
    if (!trip) return;

    const expenseToEdit = expenseId
      ? trip.expenses.find((expense) => expense.id === expenseId)
      : null;

    if (expenseId && !expenseToEdit) {
      showToast(t("noMatches"), "error");
      void navigate(`/group/${trip.id}/expenses`);
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
    if (name in formErrors) {
      setFormErrors((current) => ({ ...current, [name]: undefined }));
    }
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
    if (checked) {
      setFormErrors((current) => ({
        ...current,
        participants: undefined,
        shares: undefined,
      }));
    }
  };

  const selectAllParticipants = () => {
    if (!trip) return;
    setFormData((prev) => ({
      ...prev,
      participants: trip.participants.map((p) => p.id),
    }));
    setFormErrors((current) => ({
      ...current,
      participants: undefined,
      shares: undefined,
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
    setFormErrors((current) => ({ ...current, shares: undefined }));
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
    setFormErrors((current) => ({ ...current, shares: undefined }));
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
    setFormErrors((current) => ({ ...current, shares: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trip) return;

    const amount = Number(formData.amount);
    const nextErrors: ExpenseFormErrors = {};
    if (!formData.description.trim()) {
      nextErrors.description = t("requiredField");
    }
    if (!formData.amount) {
      nextErrors.amount = t("requiredField");
    } else if (!Number.isFinite(amount) || amount <= 0) {
      nextErrors.amount = t("invalidAmount");
    }
    if (!formData.date) nextErrors.date = t("requiredField");
    if (!formData.paidBy) nextErrors.paidBy = t("choosePayer");
    if (formData.participants.length === 0) {
      nextErrors.participants = t("chooseSplitParticipants");
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
      !nextErrors.amount &&
      !nextErrors.participants &&
      formData.splitMode === "custom" &&
      (Object.values(shares).some(
        (share) => !Number.isFinite(share) || share < 0
      ) || toMinorUnits(customTotal) !== toMinorUnits(amount))
    ) {
      nextErrors.shares = t("customSplitMismatch");
    }

    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSaving(true);
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
      void navigate(
        isEditing ? `/group/${trip.id}/expenses` : `/group/${trip.id}`
      );
    } catch (error) {
      console.error("Error adding expense:", error);
      showToast(t("error"), "error");
    } finally {
      setSaving(false);
    }
  };

  if (!trip) {
    return <PageLoading />;
  }

  return (
    <>
      <AppHeader
        backTo={isEditing ? `/group/${groupId}/expenses` : `/group/${groupId}`}
        title={isEditing ? t("editExpense") : t("addExpense")}
      />

      <div className="content">
        <form onSubmit={handleSubmit} className="form" noValidate>
          <ExpenseDetailsFields
            currentUserId={currentUserId}
            errors={formErrors}
            formData={formData}
            onCategoryChange={(category) =>
              setFormData((current) => ({ ...current, category }))
            }
            onInputChange={handleInputChange}
            participants={trip.participants}
          />

          <ExpenseSplitEditor
            currentUserId={currentUserId}
            errors={formErrors}
            formData={formData}
            onParticipantChange={handleParticipantChange}
            onResetEqualShares={resetEqualShares}
            onSelectAll={selectAllParticipants}
            onSelectNone={selectNoParticipants}
            onShareChange={handleShareChange}
            onSplitModeChange={setSplitMode}
            participants={trip.participants}
          />

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={saving}
          >
            {saving ? (
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
