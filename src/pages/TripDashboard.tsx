import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AppHeader } from "../components/ui/AppHeader";
import {
  IconButton,
  InfoIcon,
  LinkIcon,
  UsersIcon,
} from "../components/ui/IconButton";
import { FirebaseService } from "../services/firebase";
import { GroupHistoryService } from "../services/groupHistory";
import { countLabel, t } from "../i18n";
import type { AvatarConfig, Trip } from "../types";
import { useToast } from "../components/ui/useToast";
import { DEFAULT_AVATAR_CONFIG, getAvatarConfig } from "../utils/avatars";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { currentTripSession } from "../services/currentTripSession";
import { PageErrorState, PageSkeleton } from "../components/ui/PageState";
import { useDialogLifecycle } from "../hooks/useDialogLifecycle";
import { SpendingSummaryCard } from "../components/dashboard/SpendingSummaryCard";
import { RecentExpensesCard } from "../components/dashboard/RecentExpensesCard";
import { PaidByPersonCard } from "../components/dashboard/PaidByPersonCard";
import {
  TripDashboardDialogs,
  type DashboardModal,
  type PendingParticipantRemoval,
} from "../components/dashboard/TripDashboardDialogs";
import { useCurrentTripUserId } from "../hooks/useCurrentTripUserId";
import { useTripData } from "../hooks/useTripData";

const TripDashboard = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const prefersReducedMotion = useReducedMotion();
  const currentUserId = useCurrentTripUserId();
  const { trip, setTrip, loading } = useTripData(groupId, {
    onLoaded: () => {
      if (groupId) GroupHistoryService.updateLastAccessed(groupId);
    },
    onMissing: () => {
      showToast(t("noMatches"), "error");
      void navigate("/");
    },
    onError: (error) => {
      console.error("Error loading trip:", error);
      showToast(t("noMatches"), "error");
    },
  });
  const [activeModal, setActiveModal] = useState<DashboardModal>(null);
  const [budgetValue, setBudgetValue] = useState("");
  const [budgetError, setBudgetError] = useState("");
  const [savingBudget, setSavingBudget] = useState(false);
  const [pendingRemoval, setPendingRemoval] =
    useState<PendingParticipantRemoval>(null);
  const [removingUser, setRemovingUser] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [avatarDraft, setAvatarDraft] = useState<AvatarConfig>({
    ...DEFAULT_AVATAR_CONFIG,
  });
  const [savingAvatar, setSavingAvatar] = useState(false);

  useDialogLifecycle(Boolean(activeModal), () => {
    if (pendingRemoval) setPendingRemoval(null);
    else setActiveModal(null);
  });

  const handleDeleteExpense = async (expenseId: string) => {
    if (
      !trip ||
      !window.confirm(t("remove"))
    )
      return;

    try {
      const updatedTrip = await FirebaseService.deleteExpense(
        trip.id,
        expenseId
      );
      setTrip(updatedTrip);
      showToast(t("expenseRemoved"), "success");
    } catch (error) {
      console.error("Error deleting expense:", error);
      showToast(t("remove"), "error");
    }
  };

  const beginAvatarEdit = (participant: Trip["participants"][number]) => {
    setAvatarDraft({ ...getAvatarConfig(participant) });
    setEditingAvatar(true);
  };

  const saveAvatar = async () => {
    if (!trip || !currentUserId) return;

    setSavingAvatar(true);
    try {
      const updatedTrip = await FirebaseService.updateUserAvatarConfig(
        trip.id,
        currentUserId,
        avatarDraft
      );
      GroupHistoryService.updateAvatarConfig(trip.id, avatarDraft);
      setTrip(updatedTrip);
      setEditingAvatar(false);
      showToast(t("avatarUpdated"), "success");
    } catch (error) {
      console.error("Error updating avatar:", error);
      showToast(t("error"), "error");
    } finally {
      setSavingAvatar(false);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditingAvatar(false);
    setBudgetError("");
  };

  const openBudgetModal = () => {
    if (!trip || trip.createdBy !== currentUserId) return;
    setBudgetValue(trip.perPersonBudget?.toString() ?? "");
    setBudgetError("");
    setActiveModal("budget");
  };

  const handleBudgetSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!trip || trip.createdBy !== currentUserId) return;

    const nextBudget = budgetValue.trim() ? Number(budgetValue) : null;
    if (nextBudget !== null && (!Number.isFinite(nextBudget) || nextBudget <= 0)) {
      setBudgetError(t("budgetInvalid"));
      return;
    }

    setSavingBudget(true);
    setBudgetError("");
    try {
      await FirebaseService.updateTripBudget(trip.id, nextBudget);
      setTrip((currentTrip) =>
        currentTrip
          ? {
              ...currentTrip,
              perPersonBudget: nextBudget ?? undefined,
              updatedAt: new Date(),
            }
          : currentTrip
      );
      showToast(t("budgetSaved"), "success");
      closeModal();
    } catch (error) {
      console.error("Error saving trip budget:", error);
      setBudgetError(t("error"));
    } finally {
      setSavingBudget(false);
    }
  };

  const handleRemoveUser = (userId: string, userName: string) => {
    if (
      !trip ||
      userId === currentUserId ||
      userId === trip.createdBy
    ) {
      return;
    }

    const linkedExpenseCount = trip.expenses.filter(
      (expense) =>
        expense.paidBy === userId || expense.participants.includes(userId)
    ).length;
    setPendingRemoval({
      id: userId,
      name: userName,
      linkedExpenseCount,
    });
  };

  const confirmRemoveUser = async () => {
    if (!trip || !pendingRemoval) return;

    setRemovingUser(true);
    try {
      const updatedTrip = await FirebaseService.removeUserFromTrip(
        trip.id,
        pendingRemoval.id
      );
      setTrip(updatedTrip);
      setPendingRemoval(null);
      showToast(t("participantRemoved"), "success");
    } catch (error) {
      console.error("Error removing user:", error);
      showToast(t("remove"), "error");
    } finally {
      setRemovingUser(false);
    }
  };

  const copyRoomCode = () => {
    const roomCode = currentTripSession.get().roomCode || trip?.roomCode;
    if (roomCode) {
      void navigator.clipboard
        .writeText(roomCode)
        .then(() => showToast(t("codeCopied"), "success"))
        .catch(() => showToast(`${t("shareCode")}: ${roomCode}`, "success"));
    }
  };

  const copyShareableLink = async () => {
    const roomCode = currentTripSession.get().roomCode || trip?.roomCode;
    if (roomCode) {
      const shareableLink = `${window.location.origin}/join/${roomCode}`;
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(shareableLink);
          showToast(t("linkCopied"), "success");
        } catch {
          showToast(`${t("shareLink")}: ${shareableLink}`, "success", 5000);
        }
      } else {
        showToast(`${t("shareLink")}: ${shareableLink}`, "success", 5000);
      }
    }
  };

  if (loading) {
    return <PageSkeleton variant="dashboard" />;
  }

  if (!trip) {
    return (
      <PageErrorState
        message={t("noMatches")}
        actionTo="/"
        actionLabel={t("splitExpenses")}
      />
    );
  }

  const totalExpenses = trip.expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  return (
    <>
      <AppHeader
        backTo="/"
        className="dashboard-header"
        title={trip.name}
        titleAccessory={
          <IconButton
            className="dashboard-title-info"
            onClick={() => setActiveModal("details")}
            label={t("groupDetails")}
          >
            <InfoIcon />
          </IconButton>
        }
        actions={
          <>
            <IconButton
              className="dashboard-header-action dashboard-people-action"
              onClick={() => setActiveModal("participants")}
              label={`${t("participants")} ${countLabel("person", trip.participants.length)}`}
            >
              <UsersIcon />
              <span>{trip.participants.length}</span>
            </IconButton>
            <IconButton
              className="dashboard-header-action"
              onClick={copyShareableLink}
              label={t("shareLink")}
            >
              <LinkIcon />
            </IconButton>
          </>
        }
      />

      <div className="content dashboard-content">
        <SpendingSummaryCard
          currentUserId={currentUserId}
          totalExpenses={totalExpenses}
          trip={trip}
        />

        <div className="dashboard-actions">
          <Link
            to={`/group/${trip.id}/add-expense`}
            className="btn btn-primary dashboard-action-primary"
          >
            {t("addExpense")}
          </Link>
          <Link
            to={`/group/${trip.id}/balance`}
            className="btn btn-secondary dashboard-action-secondary"
          >
            {t("viewBalance")}
          </Link>
        </div>

        <PaidByPersonCard
          prefersReducedMotion={prefersReducedMotion}
          totalExpenses={totalExpenses}
          trip={trip}
        />

        <RecentExpensesCard trip={trip} onDelete={handleDeleteExpense} />
      </div>

      <TripDashboardDialogs
        activeModal={activeModal}
        avatar={{
          draft: avatarDraft,
          editing: editingAvatar,
          onBegin: beginAvatarEdit,
          onChange: setAvatarDraft,
          onClose: () => setEditingAvatar(false),
          onSave: () => void saveAvatar(),
          saving: savingAvatar,
        }}
        budget={{
          error: budgetError,
          onChange: (value) => {
            setBudgetValue(value);
            if (budgetError) setBudgetError("");
          },
          onSubmit: (event) => void handleBudgetSubmit(event),
          saving: savingBudget,
          value: budgetValue,
        }}
        currentUserId={currentUserId}
        onAddMember={() => void navigate(`/group/${trip.id}/add-member`)}
        onClose={closeModal}
        onCopyRoomCode={copyRoomCode}
        onCopyShareLink={copyShareableLink}
        onEditBudget={openBudgetModal}
        removal={{
          onCancel: () => setPendingRemoval(null),
          onConfirm: () => void confirmRemoveUser(),
          onRequest: handleRemoveUser,
          pending: pendingRemoval,
          saving: removingUser,
        }}
        trip={trip}
      />
    </>
  );
};

export default TripDashboard;
