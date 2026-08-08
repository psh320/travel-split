import type { ChangeEvent } from "react";
import { t } from "../../i18n";
import type { AddExpenseForm, ExpenseCategory, Trip } from "../../types";
import { EXPENSE_CATEGORIES } from "../../utils/expenses";
import { FieldError } from "../ui/FieldError";

interface ExpenseDetailsFieldsProps {
  currentUserId: string;
  errors: {
    amount?: string;
    date?: string;
    description?: string;
    paidBy?: string;
  };
  formData: AddExpenseForm;
  onCategoryChange: (category: ExpenseCategory) => void;
  onInputChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  participants: Trip["participants"];
}

export const ExpenseDetailsFields = ({
  currentUserId,
  errors,
  formData,
  onCategoryChange,
  onInputChange,
  participants,
}: ExpenseDetailsFieldsProps) => (
  <>
    <div className="form-group">
      <label htmlFor="description">{t("expense")}</label>
      <input
        type="text"
        id="description"
        name="description"
        value={formData.description}
        onChange={onInputChange}
        placeholder={t("expense").replace(" *", "")}
        aria-invalid={Boolean(errors.description)}
        aria-describedby={
          errors.description ? "expense-description-error" : undefined
        }
        required
      />
      <FieldError
        id="expense-description-error"
        message={errors.description}
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
        onChange={onInputChange}
        placeholder="0.00"
        step="0.01"
        min="0.01"
        aria-invalid={Boolean(errors.amount)}
        aria-describedby={errors.amount ? "expense-amount-error" : undefined}
        required
      />
      <FieldError id="expense-amount-error" message={errors.amount} />
    </div>

    <div className="form-group">
      <label htmlFor="date">{t("expenseDate")}</label>
      <input
        type="date"
        id="date"
        name="date"
        value={formData.date}
        onChange={onInputChange}
        aria-invalid={Boolean(errors.date)}
        aria-describedby={errors.date ? "expense-date-error" : undefined}
        required
      />
      <FieldError id="expense-date-error" message={errors.date} />
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
            onClick={() => onCategoryChange(category)}
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
        onChange={onInputChange}
        aria-invalid={Boolean(errors.paidBy)}
        aria-describedby={errors.paidBy ? "expense-payer-error" : undefined}
        required
      >
        <option value="">{t("paidBy").replace(" *", "")}</option>
        {participants.map((participant) => (
          <option key={participant.id} value={participant.id}>
            {participant.name}
            {participant.id === currentUserId ? ` (${t("you")})` : ""}
          </option>
        ))}
      </select>
      <FieldError id="expense-payer-error" message={errors.paidBy} />
    </div>
  </>
);
