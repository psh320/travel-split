import { t } from "../../i18n";
import type { AddExpenseForm, ExpenseSplitMode, Trip } from "../../types";
import { formatAmount } from "../../utils";
import { toMinorUnits } from "../../utils/currency";
import { Avatar } from "../Avatar";
import { FieldError } from "../ui/FieldError";

interface ExpenseSplitEditorProps {
  currentUserId: string;
  errors: { participants?: string; shares?: string };
  formData: AddExpenseForm;
  onParticipantChange: (participantId: string, checked: boolean) => void;
  onResetEqualShares: () => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
  onShareChange: (participantId: string, value: string) => void;
  onSplitModeChange: (mode: ExpenseSplitMode) => void;
  participants: Trip["participants"];
}

export const ExpenseSplitEditor = ({
  currentUserId,
  errors,
  formData,
  onParticipantChange,
  onResetEqualShares,
  onSelectAll,
  onSelectNone,
  onShareChange,
  onSplitModeChange,
  participants,
}: ExpenseSplitEditorProps) => {
  const splitAmount =
    formData.amount && formData.participants.length > 0
      ? Number(formData.amount) / formData.participants.length
      : 0;
  const customTotal = formData.participants.reduce(
    (sum, participantId) =>
      sum + Number(formData.shares[participantId] || 0),
    0
  );
  const customRemaining =
    (toMinorUnits(Number(formData.amount) || 0) - toMinorUnits(customTotal)) / 100;

  return (
    <div className="form-group">
      <label id="split-with-label">{t("splitWith")}</label>
      <div className="expense-selection-actions">
        <button
          type="button"
          onClick={onSelectAll}
          className="btn btn-secondary btn-small"
        >
          {t("selectAll")}
        </button>
        <button
          type="button"
          onClick={onSelectNone}
          className="btn btn-secondary btn-small"
        >
          {t("selectNone")}
        </button>
      </div>
      <div
        className="checkbox-group"
        role="group"
        aria-labelledby="split-with-label"
        aria-invalid={Boolean(errors.participants)}
        aria-describedby={
          errors.participants ? "expense-participants-error" : undefined
        }
      >
        {participants.map((participant) => (
          <label key={participant.id} className="checkbox-item">
            <input
              type="checkbox"
              checked={formData.participants.includes(participant.id)}
              onChange={(event) =>
                onParticipantChange(participant.id, event.target.checked)
              }
            />
            <span>
              {participant.name}
              {participant.id === currentUserId ? ` (${t("you")})` : ""}
            </span>
          </label>
        ))}
      </div>
      <FieldError
        id="expense-participants-error"
        message={errors.participants}
      />

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
              onClick={() => onSplitModeChange("equal")}
            >
              {t("splitEqually")}
            </button>
            <button
              type="button"
              className={formData.splitMode === "custom" ? "is-selected" : ""}
              aria-pressed={formData.splitMode === "custom"}
              onClick={() => onSplitModeChange("custom")}
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
            <CustomShareFields
              customRemaining={customRemaining}
              customTotal={customTotal}
              error={errors.shares}
              formData={formData}
              onResetEqualShares={onResetEqualShares}
              onShareChange={onShareChange}
              participants={participants}
            />
          )}
        </div>
      )}
    </div>
  );
};

const CustomShareFields = ({
  customRemaining,
  customTotal,
  error,
  formData,
  onResetEqualShares,
  onShareChange,
  participants,
}: {
  customRemaining: number;
  customTotal: number;
  error?: string;
  formData: AddExpenseForm;
  onResetEqualShares: () => void;
  onShareChange: (participantId: string, value: string) => void;
  participants: Trip["participants"];
}) => (
  <div className="custom-share-editor">
    <div className="custom-share-heading">
      <span>{t("customSplitHelp")}</span>
      <button type="button" onClick={onResetEqualShares}>
        {t("fillEqually")}
      </button>
    </div>
    {formData.participants.map((participantId) => {
      const participant = participants.find(
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
                onShareChange(participantId, event.target.value)
              }
              aria-label={`${participant.name} ${t("shareAmount")}`}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "expense-shares-error" : undefined}
            />
          </span>
        </label>
      );
    })}
    <div
      className={`custom-share-total${
        customRemaining === 0 ? " is-balanced" : ""
      }`}
      aria-live="polite"
    >
      <span>
        {t("allocated")}: {formatAmount(customTotal)}
      </span>
      <strong>
        {customRemaining === 0
          ? t("allocationComplete")
          : customRemaining > 0
            ? `${formatAmount(customRemaining)} ${t("leftToAllocate")}`
            : `${formatAmount(Math.abs(customRemaining))} ${t(
                "overAllocated"
              )}`}
      </strong>
    </div>
    <FieldError id="expense-shares-error" message={error} />
  </div>
);
