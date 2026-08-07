import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { AppHeader } from "../components/ui/AppHeader";
import {
  CloseIcon,
  IconButton,
  InfoIcon,
  LinkIcon,
  TrashIcon,
  UsersIcon,
} from "../components/ui/IconButton";
import { ExpenseListItem } from "../components/ExpenseListItem";
import { Avatar } from "../components/Avatar";
import { AvatarCustomizer } from "../components/AvatarCustomizer";
import { FirebaseService } from "../services/firebase";
import { GroupHistoryService } from "../services/groupHistory";
import { countLabel, t } from "../i18n";
import type { AvatarConfig, Trip } from "../types";
import {
  formatAmount,
  formatCompactAmount,
  formatDate,
  formatExpenseDate,
} from "../utils";
import { useToast } from "../components/ui/useToast";
import { DEFAULT_AVATAR_CONFIG, getAvatarConfig } from "../utils/avatars";

const spendColors = [
  "#2F3437",
  "#7C8794",
  "#B58F72",
  "#9FA8A3",
  "#D1B8A0",
];

type DashboardModal = "details" | "participants" | "budget" | null;
type PendingRemoval = {
  id: string;
  name: string;
  linkedExpenseCount: number;
} | null;

const TripDashboard = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const cachedTrip = groupId ? FirebaseService.getCachedTripById(groupId) : null;
  const [trip, setTrip] = useState<Trip | null>(cachedTrip);
  const [loading, setLoading] = useState(!cachedTrip);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [activeModal, setActiveModal] = useState<DashboardModal>(null);
  const [budgetValue, setBudgetValue] = useState("");
  const [budgetError, setBudgetError] = useState("");
  const [savingBudget, setSavingBudget] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState<PendingRemoval>(null);
  const [removingUser, setRemovingUser] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [avatarDraft, setAvatarDraft] = useState<AvatarConfig>({
    ...DEFAULT_AVATAR_CONFIG,
  });
  const [savingAvatar, setSavingAvatar] = useState(false);

  const loadTrip = useCallback(async (showLoading = false) => {
    if (!groupId) return;

    if (showLoading) setLoading(true);
    try {
      const tripData = await FirebaseService.getTripById(groupId, {
        force: Boolean(FirebaseService.getCachedTripById(groupId)),
      });
      if (tripData) {
        setTrip(tripData);
        // Update last accessed time in group history
        GroupHistoryService.updateLastAccessed(groupId);
      } else {
        showToast(t("noMatches"), "error");
        navigate("/");
      }
    } catch (error) {
      console.error("Error loading trip:", error);
      showToast(t("noMatches"), "error");
    } finally {
      setLoading(false);
    }
  }, [groupId, navigate, showToast]);

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (userId) {
      setCurrentUserId(userId);
    }

    loadTrip(!FirebaseService.getCachedTripById(groupId ?? ""));
  }, [groupId, loadTrip]);

  useEffect(() => {
    if (!activeModal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (pendingRemoval) {
          setPendingRemoval(null);
          return;
        }
        setActiveModal(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModal, pendingRemoval]);

  const handleDeleteExpense = async (expenseId: string) => {
    if (
      !trip ||
      !window.confirm(t("remove"))
    )
      return;

    try {
      await FirebaseService.deleteExpense(trip.id, expenseId);
      // Refresh trip data
      await loadTrip();
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
      await FirebaseService.updateUserAvatarConfig(trip.id, currentUserId, avatarDraft);
      GroupHistoryService.updateAvatarConfig(trip.id, avatarDraft);
      await loadTrip();
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
      await FirebaseService.removeUserFromTrip(trip.id, pendingRemoval.id);
      await loadTrip();
      setPendingRemoval(null);
    } catch (error) {
      console.error("Error removing user:", error);
      showToast(t("remove"), "error");
    } finally {
      setRemovingUser(false);
    }
  };

  const copyRoomCode = () => {
    const roomCode = localStorage.getItem("roomCode") || trip?.roomCode;
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      showToast(`${t("roomCode")} ${roomCode}`, "success");
    }
  };

  const copyShareableLink = async () => {
    const roomCode = localStorage.getItem("roomCode") || trip?.roomCode;
    if (roomCode) {
      const shareableLink = `${window.location.origin}/join/${roomCode}`;
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(shareableLink);
          showToast(`${t("shareLink")}: ${shareableLink}`, "success", 5000);
        } catch {
          showToast(`${t("shareLink")}: ${shareableLink}`, "success", 5000);
        }
      } else {
        showToast(`${t("shareLink")}: ${shareableLink}`, "success", 5000);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="content">
        <div className="card">
          <h3>{t("noMatches")}</h3>
          <Link to="/" className="btn btn-primary">
            {t("splitExpenses")}
          </Link>
        </div>
      </div>
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
        {(() => {
          const paidSummary = trip.participants
            .map((participant, index) => ({
              id: participant.id,
              name: participant.name,
              avatarId: participant.avatarId,
              avatarConfig: participant.avatarConfig,
              amount: trip.expenses
                .filter((expense) => expense.paidBy === participant.id)
                .reduce((sum, expense) => sum + expense.amount, 0),
              color: spendColors[index % spendColors.length],
            }))
            .filter((participant) => participant.amount > 0)
            .sort((a, b) => b.amount - a.amount);
          const chartData = paidSummary.length
            ? paidSummary
            : [
                {
                  id: "empty",
                  name: t("noExpenses"),
                  amount: 1,
                  color: "#E5E7E9",
                },
              ];
          const participantCount = Math.max(trip.participants.length, 1);
          const currentParticipant = trip.participants.find(
            (participant) => participant.id === currentUserId
          );
          const currentUserSpending = currentParticipant
            ? trip.expenses.reduce((sum, expense) => {
                if (
                  !expense.participants.includes(currentParticipant.id) ||
                  expense.participants.length === 0
                ) {
                  return sum;
                }

                return sum + expense.amount / expense.participants.length;
              }, 0)
            : null;
          const perPersonBudget = trip.perPersonBudget;
          const groupBudget = perPersonBudget
            ? perPersonBudget * participantCount
            : null;
          const budgetSpending = currentUserSpending ?? totalExpenses;
          const activeBudgetTarget = perPersonBudget
            ? currentParticipant
              ? perPersonBudget
              : groupBudget
            : null;
          const budgetUsage = activeBudgetTarget
            ? (budgetSpending / activeBudgetTarget) * 100
            : 0;
          const isOverBudget = Boolean(
            activeBudgetTarget && budgetSpending > activeBudgetTarget
          );
          const budgetOverage = activeBudgetTarget
            ? Math.max(budgetSpending - activeBudgetTarget, 0)
            : 0;
          const spendingLabel = currentParticipant
            ? t("mySpending")
            : t("groupSpent");

          return (
            <div className="card spending-summary-card">
              <div className="summary-card-heading">
                <span className="summary-eyebrow">{t("budgetAtGlance")}</span>
              </div>

              {currentParticipant && (
                <div className="budget-user-context">
                  <Avatar user={currentParticipant} size="sm" decorative />
                  <span>{t("currentUser")}</span>
                  <strong>{currentParticipant.name}</strong>
                </div>
              )}

              {activeBudgetTarget ? (
                <div className={`budget-progress${isOverBudget ? " is-over" : ""}`}>
                  <div className="budget-amount-comparison">
                    <strong>{formatAmount(budgetSpending)}</strong>
                    <span>/ {formatAmount(activeBudgetTarget)}</span>
                  </div>
                  <div className="budget-progress-caption">
                    <span>{spendingLabel}</span>
                    <span>{Math.round(budgetUsage)}% {t("budgetUsed")}</span>
                  </div>
                  <div
                    className="budget-progress-track"
                    role="progressbar"
                    aria-label={`${spendingLabel} ${formatAmount(
                      budgetSpending
                    )} / ${formatAmount(activeBudgetTarget)}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(Math.min(budgetUsage, 100))}
                    aria-valuetext={`${Math.round(budgetUsage)}% ${t("budgetUsed")}`}
                  >
                    <span style={{ width: `${Math.min(budgetUsage, 100)}%` }} />
                  </div>
                  {isOverBudget && (
                    <strong className="budget-overage">
                      {formatAmount(budgetOverage)} {t("overBudget")}
                    </strong>
                  )}
                  {trip.createdBy === currentUserId && (
                    <button
                      type="button"
                      className="budget-edit-trigger"
                      onClick={openBudgetModal}
                    >
                      {t("editBudget")}
                    </button>
                  )}
                </div>
              ) : (
                <div className="budget-empty-state">
                  <div>
                    <strong>{t("budgetNotSet")}</strong>
                    <span>{t("perPersonBudgetHelp")}</span>
                  </div>
                  {trip.createdBy === currentUserId && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={openBudgetModal}
                    >
                      {t("setBudget")}
                    </button>
                  )}
                </div>
              )}

              <div className="spending-breakdown-heading">
                <span className="summary-eyebrow">{t("spendingByPerson")}</span>
              </div>

              <div className="spending-summary-body">
                <div
                  className="spending-chart"
                  role="img"
                  aria-label={`${t("totalSpent")} ${formatAmount(totalExpenses)}`}
                >
                  <div className="spending-chart-canvas" aria-hidden="true">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                      <PieChart accessibilityLayer={false}>
                        <Pie
                          data={chartData}
                          dataKey="amount"
                          nameKey="name"
                          rootTabIndex={-1}
                          cx="50%"
                          cy="50%"
                          innerRadius="60%"
                          outerRadius="92%"
                          paddingAngle={paidSummary.length > 1 ? 2 : 0}
                          cornerRadius={4}
                          stroke="var(--ease-color-surface-raised)"
                          strokeWidth={2}
                          animationBegin={80}
                          animationDuration={720}
                          animationEasing="ease-out"
                          isAnimationActive="auto"
                        >
                          {chartData.map((participant) => (
                            <Cell key={participant.id} fill={participant.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="spending-chart-hole">
                    <span>{t("totalSpent")}</span>
                    <strong>{formatCompactAmount(totalExpenses)}</strong>
                  </div>
                </div>

                <div className="spending-legend">
                  {paidSummary.length ? (
                    paidSummary.slice(0, 5).map((participant) => (
                      <div key={participant.id} className="spending-legend-item">
                        <Avatar
                          user={participant}
                          size="xs"
                          decorative
                          className="spending-legend-avatar"
                        />
                        <div className="spending-legend-copy">
                          <span className="spending-legend-name" title={participant.name}>
                            {participant.name}
                          </span>
                          <strong>{formatAmount(participant.amount)}</strong>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="muted">{t("noExpenses")}</p>
                  )}
                </div>
              </div>

              <div className="summary-metrics">
                <div>
                  <span>{t("groupSpent")}</span>
                  <strong>{formatAmount(totalExpenses)}</strong>
                </div>
                <div>
                  <span>{groupBudget ? t("groupBudget") : t("totalSpent")}</span>
                  <strong>
                    {formatAmount(groupBudget ?? totalExpenses)}
                  </strong>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Quick Actions */}
        <div
          className="dashboard-actions"
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <Link
            to={`/group/${trip.id}/add-expense`}
            className="btn btn-primary"
            style={{ flex: 1, minWidth: "120px" }}
          >
            {t("addExpense")}
          </Link>
          <Link
            to={`/group/${trip.id}/balance`}
            className="btn btn-secondary"
            style={{ flex: 1, minWidth: "120px" }}
          >
            {t("viewBalance")}
          </Link>
        </div>

        {/* Recent Expenses */}
        <div className="card">
          <Link
            to={`/group/${trip.id}/expenses`}
            className="expense-section-link"
            aria-label={`${t("allExpenses")} · ${countLabel("expense", trip.expenses.length)}`}
          >
            <div className="section-heading">
              <h3>{t("expenses")}</h3>
              <span
                className="count-dot"
                aria-label={countLabel("expense", trip.expenses.length)}
                title={countLabel("expense", trip.expenses.length)}
              >
                {trip.expenses.length}
              </span>
            </div>
            <span className="expense-section-chevron" aria-hidden="true" />
          </Link>

          {trip.expenses.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "var(--ease-color-text-muted)",
                fontSize: "0.875rem",
              }}
            >
              <p>{t("noExpenses")}</p>
            </div>
          ) : (
            <div className="list">
              {[...trip.expenses]
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .slice(0, 10) // Show last 10 expenses
                .map((expense) => {
                  const paidByUser = trip.participants.find(
                    (p) => p.id === expense.paidBy
                  );
                  return (
                    <ExpenseListItem
                      key={expense.id}
                      dateLabel={formatExpenseDate(expense.date)}
                      editTo={`/group/${trip.id}/edit-expense/${expense.id}`}
                      expense={expense}
                      onDelete={() => handleDeleteExpense(expense.id)}
                      paidByUser={paidByUser}
                    />
                  );
                })}
            </div>
          )}
        </div>

        {/* Show all expenses button if there are many */}
        {trip.expenses.length > 10 && (
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <Link
              to={`/group/${trip.id}/expenses`}
              className="btn btn-secondary"
              style={{ fontSize: "0.875rem" }}
            >
              {t("allExpenses")} ({trip.expenses.length})
            </Link>
          </div>
        )}
      </div>

      {activeModal && !(activeModal === "participants" && editingAvatar) && (
        <div
          className="dashboard-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            className="dashboard-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dashboard-modal-title"
          >
            <div className="dashboard-modal-header">
              <h2 id="dashboard-modal-title">
                {activeModal === "details"
                  ? t("groupDetails")
                  : activeModal === "budget"
                    ? trip.perPersonBudget
                      ? t("editBudget")
                      : t("setBudget")
                    : t("participants")}
              </h2>
              <IconButton onClick={closeModal} label={t("close")}>
                <CloseIcon />
              </IconButton>
            </div>

            {activeModal === "details" ? (
              <>
                <div className="dashboard-detail-list">
                  <div>
                    <span>{t("roomCode")}</span>
                    <strong>{trip.roomCode}</strong>
                  </div>
                  <div>
                    <span>{t("created")}</span>
                    <strong>{formatDate(trip.createdAt)}</strong>
                  </div>
                  <div>
                    <span>{t("budgetTarget")}</span>
                    <strong>
                      {trip.perPersonBudget
                        ? formatAmount(trip.perPersonBudget)
                        : t("budgetNotSet")}
                    </strong>
                  </div>
                  {trip.description && (
                    <div>
                      <span>{t("description")}</span>
                      <strong>{trip.description}</strong>
                    </div>
                  )}
                </div>
                <div className="dashboard-modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={copyRoomCode}>
                    {t("copyCode")}
                  </button>
                  <button type="button" className="btn btn-primary" onClick={copyShareableLink}>
                    {t("shareLink")}
                  </button>
                </div>
              </>
            ) : activeModal === "budget" ? (
              <form className="form budget-form" onSubmit={handleBudgetSubmit}>
                <div className="form-group">
                  <label htmlFor="dashboardBudget">{t("perPersonBudget")}</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    id="dashboardBudget"
                    value={budgetValue}
                    onChange={(event) => {
                      setBudgetValue(event.target.value);
                      if (budgetError) setBudgetError("");
                    }}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    autoFocus
                  />
                  <span className="form-help">{t("budgetEditHelp")}</span>
                </div>
                {budgetError && (
                  <div className="callout callout-danger">{budgetError}</div>
                )}
                <div className="dashboard-modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                    disabled={savingBudget}
                  >
                    {t("cancel")}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={savingBudget}
                  >
                    {savingBudget ? (
                      <div className="spinner spinner-small" />
                    ) : (
                      t("saveChanges")
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="participants-modal-heading">
                  <div>
                    <strong>{countLabel("person", trip.participants.length)}</strong>
                    <span>{t("tapYourName")}</span>
                  </div>
                  {trip.createdBy === currentUserId && !editingAvatar && (
                    <button
                      type="button"
                      className="btn btn-secondary participants-add-button"
                      onClick={() => navigate(`/group/${trip.id}/add-member`)}
                    >
                      <span aria-hidden="true">+</span>
                      {t("addUser")}
                    </button>
                  )}
                </div>

                <div className="participants-modal-list">
                  {trip.participants.map((participant) => (
                    <div key={participant.id} className="participant-modal-item">
                      <Avatar user={participant} size="sm" decorative />
                      <div className="participant-modal-copy">
                        <strong>
                          {participant.name}
                          {participant.id === currentUserId && ` (${t("you")})`}
                          {participant.id === trip.createdBy && ` (${t("creator")})`}
                        </strong>
                      </div>
                      {participant.id === currentUserId && (
                        <button
                          type="button"
                          className="avatar-edit-trigger"
                          onClick={() => beginAvatarEdit(participant)}
                        >
                          {t("changeAvatar")}
                        </button>
                      )}
                      {trip.createdBy === currentUserId &&
                        participant.id !== currentUserId &&
                        participant.id !== trip.createdBy && (
                          <IconButton
                            className="participant-remove-icon"
                            label={`${t("remove")} ${participant.name}`}
                            onClick={() => handleRemoveUser(participant.id, participant.name)}
                          >
                            <TrashIcon />
                          </IconButton>
                        )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      )}

      {activeModal === "participants" && editingAvatar && (
        <section
          className="avatar-editor-shell"
          role="dialog"
          aria-modal="true"
          aria-labelledby="avatar-editor-title"
        >
          <header className="avatar-editor-header">
            <IconButton
              onClick={() => setEditingAvatar(false)}
              label={t("close")}
              disabled={savingAvatar}
            >
              <CloseIcon />
            </IconButton>
            <h2 id="avatar-editor-title">{t("changeAvatar")}</h2>
            <button
              type="button"
              className="avatar-editor-save"
              onClick={saveAvatar}
              disabled={savingAvatar}
            >
              {savingAvatar ? <div className="spinner spinner-small" /> : t("done")}
            </button>
          </header>
          <AvatarCustomizer
            value={avatarDraft}
            onChange={setAvatarDraft}
            label={t("changeAvatar")}
            editor
          />
        </section>
      )}

      {pendingRemoval && (
        <div className="participant-confirm-backdrop">
          <section
            className="participant-confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="participant-confirm-title"
            aria-describedby="participant-confirm-description"
          >
            <div className="participant-confirm-icon" aria-hidden="true">
              <TrashIcon />
            </div>
            <h2 id="participant-confirm-title">
              {pendingRemoval.linkedExpenseCount > 0
                ? t("participantLinkedTitle")
                : t("participantRemoveTitle")}
            </h2>
            <strong className="participant-confirm-name">{pendingRemoval.name}</strong>
            <p id="participant-confirm-description">
              {pendingRemoval.linkedExpenseCount > 0
                ? t("participantLinkedBody")
                : t("participantRemoveBody")}
            </p>

            {pendingRemoval.linkedExpenseCount > 0 && (
              <div className="participant-linked-count">
                <span>{t("relatedExpenses")}</span>
                <strong>{pendingRemoval.linkedExpenseCount}</strong>
              </div>
            )}

            <div className="participant-confirm-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setPendingRemoval(null)}
                disabled={removingUser}
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmRemoveUser}
                disabled={removingUser}
              >
                {removingUser ? <div className="spinner spinner-small" /> : t("remove")}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default TripDashboard;
