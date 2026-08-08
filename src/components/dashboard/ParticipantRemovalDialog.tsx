import { t } from "../../i18n";
import { TrashIcon } from "../ui/IconButton";
import type { RemovalDialogState } from "./dashboardDialogTypes";

export const ParticipantRemovalDialog = ({
  removal,
}: {
  removal: RemovalDialogState;
}) => {
  if (!removal.pending) return null;

  return (
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
          {removal.pending.linkedExpenseCount > 0
            ? t("participantLinkedTitle")
            : t("participantRemoveTitle")}
        </h2>
        <strong className="participant-confirm-name">
          {removal.pending.name}
        </strong>
        <p id="participant-confirm-description">
          {removal.pending.linkedExpenseCount > 0
            ? t("participantLinkedBody")
            : t("participantRemoveBody")}
        </p>

        {removal.pending.linkedExpenseCount > 0 && (
          <div className="participant-linked-count">
            <span>{t("relatedExpenses")}</span>
            <strong>{removal.pending.linkedExpenseCount}</strong>
          </div>
        )}

        <div className="participant-confirm-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={removal.onCancel}
            disabled={removal.saving}
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={removal.onConfirm}
            disabled={removal.saving}
          >
            {removal.saving ? (
              <div className="spinner spinner-small" />
            ) : (
              t("remove")
            )}
          </button>
        </div>
      </section>
    </div>
  );
};
