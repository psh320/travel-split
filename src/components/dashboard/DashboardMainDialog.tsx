import { MAX_TRIP_PARTICIPANTS } from "../../config/trip";
import { countLabel, t } from "../../i18n";
import type { Trip } from "../../types";
import { formatAmount, formatDate } from "../../utils";
import { Avatar } from "../Avatar";
import { FieldError } from "../ui/FieldError";
import { CloseIcon, IconButton, TrashIcon } from "../ui/IconButton";
import type {
  AvatarDialogState,
  BudgetDialogState,
  TripDashboardDialogsProps,
} from "./dashboardDialogTypes";

export const DashboardMainDialog = ({
  activeModal,
  avatar,
  budget,
  currentUserId,
  onAddMember,
  onClose,
  onCopyRoomCode,
  onCopyShareLink,
  removal,
  trip,
}: TripDashboardDialogsProps) => (
  <div
    className="dashboard-modal-backdrop"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
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
        <IconButton onClick={onClose} label={t("close")}>
          <CloseIcon />
        </IconButton>
      </div>

      {activeModal === "details" ? (
        <TripDetails
          trip={trip}
          onCopyRoomCode={onCopyRoomCode}
          onCopyShareLink={onCopyShareLink}
        />
      ) : activeModal === "budget" ? (
        <BudgetForm budget={budget} onClose={onClose} />
      ) : (
        <ParticipantsList
          avatar={avatar}
          currentUserId={currentUserId}
          onAddMember={onAddMember}
          onRemove={removal.onRequest}
          trip={trip}
        />
      )}
    </section>
  </div>
);

const TripDetails = ({
  onCopyRoomCode,
  onCopyShareLink,
  trip,
}: Pick<
  TripDashboardDialogsProps,
  "onCopyRoomCode" | "onCopyShareLink" | "trip"
>) => (
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
      <button
        type="button"
        className="btn btn-secondary"
        onClick={onCopyRoomCode}
      >
        {t("copyCode")}
      </button>
      <button
        type="button"
        className="btn btn-primary"
        onClick={onCopyShareLink}
      >
        {t("shareLink")}
      </button>
    </div>
  </>
);

const BudgetForm = ({
  budget,
  onClose,
}: {
  budget: BudgetDialogState;
  onClose: () => void;
}) => (
  <form className="form budget-form" onSubmit={budget.onSubmit} noValidate>
    <div className="form-group">
      <label htmlFor="dashboardBudget">{t("perPersonBudget")}</label>
      <input
        type="number"
        inputMode="decimal"
        id="dashboardBudget"
        value={budget.value}
        onChange={(event) => budget.onChange(event.target.value)}
        placeholder="0.00"
        step="0.01"
        min="0.01"
        autoFocus
        aria-invalid={Boolean(budget.error)}
        aria-describedby={
          budget.error
            ? "dashboard-budget-help dashboard-budget-error"
            : "dashboard-budget-help"
        }
      />
      <span id="dashboard-budget-help" className="form-help">
        {t("budgetEditHelp")}
      </span>
      <FieldError id="dashboard-budget-error" message={budget.error} />
    </div>
    <div className="dashboard-modal-actions">
      <button
        type="button"
        className="btn btn-secondary"
        onClick={onClose}
        disabled={budget.saving}
      >
        {t("cancel")}
      </button>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={budget.saving}
      >
        {budget.saving ? (
          <div className="spinner spinner-small" />
        ) : (
          t("saveChanges")
        )}
      </button>
    </div>
  </form>
);

const ParticipantsList = ({
  avatar,
  currentUserId,
  onAddMember,
  onRemove,
  trip,
}: {
  avatar: AvatarDialogState;
  currentUserId: string;
  onAddMember: () => void;
  onRemove: (userId: string, userName: string) => void;
  trip: Trip;
}) => (
  <>
    <div className="participants-modal-heading">
      <div>
        <strong>{countLabel("person", trip.participants.length)}</strong>
        <span>{t("tapYourName")}</span>
      </div>
      {trip.createdBy === currentUserId && (
        <button
          type="button"
          className="btn btn-secondary participants-add-button"
          onClick={onAddMember}
          disabled={trip.participants.length >= MAX_TRIP_PARTICIPANTS}
        >
          {trip.participants.length < MAX_TRIP_PARTICIPANTS && (
            <span aria-hidden="true">+</span>
          )}
          {trip.participants.length >= MAX_TRIP_PARTICIPANTS
            ? t("groupFull")
            : t("addUser")}
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
              onClick={() => avatar.onBegin(participant)}
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
                onClick={() => onRemove(participant.id, participant.name)}
              >
                <TrashIcon />
              </IconButton>
            )}
        </div>
      ))}
    </div>
  </>
);
