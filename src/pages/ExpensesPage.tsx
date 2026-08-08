import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ExpenseListItem } from "../components/ExpenseListItem";
import { AppHeader } from "../components/ui/AppHeader";
import {
  CloseIcon,
  FilterIcon,
  IconButton,
  IconLink,
  PlusIcon,
  SearchIcon,
} from "../components/ui/IconButton";
import { useToast } from "../components/ui/useToast";
import { t, countLabel } from "../i18n";
import { FirebaseService } from "../services/firebase";
import type { ExpenseCategory } from "../types";
import { formatAmount } from "../utils";
import { EXPENSE_CATEGORIES } from "../utils/expenses";
import { PageErrorState, PageSkeleton } from "../components/ui/PageState";
import { useDialogLifecycle } from "../hooks/useDialogLifecycle";
import { useCurrentTripUserId } from "../hooks/useCurrentTripUserId";
import { useTripData } from "../hooks/useTripData";

type ExpenseFilter = "all" | "paid-by-me" | "split-with-me";
type ExpenseSort = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";

const ExpensesPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const currentUserId = useCurrentTripUserId();
  const { trip, loading, reload } = useTripData(groupId, {
    onMissing: () => {
      showToast(t("groupNotFound"), "error");
      void navigate("/");
    },
    onError: (error) => {
      console.error("Error loading trip:", error);
      showToast(t("groupNotFound"), "error");
    },
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterBy, setFilterBy] = useState<ExpenseFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | ExpenseCategory>(
    "all"
  );
  const [sortBy, setSortBy] = useState<ExpenseSort>("date-desc");

  useDialogLifecycle(isFilterOpen, () => setIsFilterOpen(false));

  const handleDeleteExpense = async (expenseId: string) => {
    if (!trip || !window.confirm(t("remove"))) return;

    try {
      await FirebaseService.deleteExpense(trip.id, expenseId);
      await reload();
      showToast(t("expenseRemoved"), "success");
    } catch (error) {
      console.error("Error deleting expense:", error);
      showToast(t("remove"), "error");
    }
  };

  const filteredAndSortedExpenses = useMemo(() => {
    if (!trip) return [];

    const filtered = trip.expenses.filter((expense) => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const description = expense.description.toLowerCase();
        const paidByName =
          trip.participants
            .find((participant) => participant.id === expense.paidBy)
            ?.name.toLowerCase() ?? "";
        const categoryName = t(expense.category ?? "other").toLowerCase();

        if (
          !description.includes(searchLower) &&
          !paidByName.includes(searchLower) &&
          !categoryName.includes(searchLower)
        ) {
          return false;
        }
      }

      if (filterBy === "paid-by-me" && expense.paidBy !== currentUserId) {
        return false;
      }
      if (
        filterBy === "split-with-me" &&
        !expense.participants.includes(currentUserId)
      ) {
        return false;
      }
      if (
        categoryFilter !== "all" &&
        (expense.category ?? "other") !== categoryFilter
      ) {
        return false;
      }

      return true;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return b.date.getTime() - a.date.getTime();
        case "date-asc":
          return a.date.getTime() - b.date.getTime();
        case "amount-desc":
          return b.amount - a.amount;
        case "amount-asc":
          return a.amount - b.amount;
      }
    });

    return filtered;
  }, [categoryFilter, currentUserId, filterBy, searchTerm, sortBy, trip]);

  if (loading) {
    return <PageSkeleton variant="list" />;
  }

  if (!trip) {
    return (
      <PageErrorState
        message={t("groupNotFound")}
        actionTo="/"
        actionLabel={t("goHome")}
      />
    );
  }

  const totalExpenses = trip.expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const activeFilterCount =
    Number(filterBy !== "all") +
    Number(categoryFilter !== "all") +
    Number(sortBy !== "date-desc");
  const hasActiveQuery = Boolean(searchTerm || activeFilterCount);
  const filterOptions: Array<{ value: ExpenseFilter; label: string }> = [
    { value: "all", label: t("allExpenses") },
    { value: "paid-by-me", label: t("paidByMe") },
    { value: "split-with-me", label: t("splitWithMe") },
  ];
  const sortOptions: Array<{ value: ExpenseSort; label: string }> = [
    { value: "date-desc", label: t("newestFirst") },
    { value: "date-asc", label: t("oldestFirst") },
    { value: "amount-desc", label: t("highestAmount") },
    { value: "amount-asc", label: t("lowestAmount") },
  ];

  const resetFilters = () => {
    setFilterBy("all");
    setCategoryFilter("all");
    setSortBy("date-desc");
  };

  return (
    <>
      <AppHeader
        backTo={"/group/" + groupId}
        title={t("expenses")}
        subtitle={formatAmount(totalExpenses)}
        className="expenses-header"
        actions={
          isSearchOpen ? (
            <div className="expenses-header-search">
              <SearchIcon />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={t("searchExpenses")}
                aria-label={t("searchExpenses")}
                autoFocus
              />
              <IconButton
                className="expense-search-close"
                onClick={() => {
                  setSearchTerm("");
                  setIsSearchOpen(false);
                }}
                label={t("close")}
              >
                <CloseIcon />
              </IconButton>
            </div>
          ) : (
            <>
            <IconButton
              className="expenses-header-action"
              onClick={() => setIsSearchOpen(true)}
              label={t("searchExpenses")}
            >
              <SearchIcon />
            </IconButton>
            <IconButton
              className={
                "expenses-header-action filter-trigger" +
                (activeFilterCount ? " has-active-filters" : "")
              }
              onClick={() => setIsFilterOpen(true)}
              label={
                activeFilterCount
                  ? t("filter") + " " + activeFilterCount
                  : t("filter")
              }
            >
              <FilterIcon />
              {activeFilterCount > 0 && (
                <span className="filter-count-badge" aria-hidden="true">
                  {activeFilterCount}
                </span>
              )}
            </IconButton>
            <IconLink
              to={"/group/" + groupId + "/add-expense"}
              className="expenses-header-action"
              label={t("addExpense")}
            >
              <PlusIcon />
            </IconLink>
            </>
          )
        }
      />

      <main className="content expenses-content">
        <section className="card expenses-list-card">
          {hasActiveQuery && (
            <div className="expenses-result-count">
              {countLabel("expense", filteredAndSortedExpenses.length)}
            </div>
          )}

          {filteredAndSortedExpenses.length === 0 ? (
            <div className="expenses-empty-state">
              <p>{trip.expenses.length === 0 ? t("noExpenses") : t("noMatches")}</p>
            </div>
          ) : (
            <div className="list">
              {filteredAndSortedExpenses.map((expense) => (
                <ExpenseListItem
                  key={expense.id}
                  editTo={
                    "/group/" + groupId + "/edit-expense/" + expense.id
                  }
                  expense={expense}
                  onDelete={() => handleDeleteExpense(expense.id)}
                  participants={trip.participants}
                  paidByUser={trip.participants.find(
                    (participant) => participant.id === expense.paidBy
                  )}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {isFilterOpen && (
        <div
          className="expense-filter-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsFilterOpen(false);
          }}
        >
          <section
            className="expense-filter-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="expense-filter-title"
          >
            <div className="expense-filter-sheet-header">
              <div>
                <span>{t("expenses")}</span>
                <h2 id="expense-filter-title">{t("filter")}</h2>
              </div>
              <IconButton
                onClick={() => setIsFilterOpen(false)}
                label={t("close")}
                autoFocus
              >
                <CloseIcon />
              </IconButton>
            </div>

            <div className="expense-filter-sheet-body">
              <fieldset className="expense-filter-group">
                <legend>{t("filter")}</legend>
                <div className="expense-filter-chip-grid">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={filterBy === option.value ? "is-selected" : ""}
                      aria-pressed={filterBy === option.value}
                      onClick={() => setFilterBy(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="expense-filter-group">
                <legend>{t("category")}</legend>
                <div className="expense-filter-chip-grid category-filter-grid">
                  <button
                    type="button"
                    className={categoryFilter === "all" ? "is-selected" : ""}
                    aria-pressed={categoryFilter === "all"}
                    onClick={() => setCategoryFilter("all")}
                  >
                    {t("allCategories")}
                  </button>
                  {EXPENSE_CATEGORIES.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={categoryFilter === category ? "is-selected" : ""}
                      aria-pressed={categoryFilter === category}
                      onClick={() => setCategoryFilter(category)}
                    >
                      <span className={"expense-category-dot category-" + category} />
                      {t(category)}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="expense-filter-group">
                <legend>{t("sortBy")}</legend>
                <div className="expense-sort-list">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={sortBy === option.value ? "is-selected" : ""}
                      aria-pressed={sortBy === option.value}
                      onClick={() => setSortBy(option.value)}
                    >
                      <span>{option.label}</span>
                      <span className="expense-sort-check" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="expense-filter-sheet-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetFilters}
                disabled={activeFilterCount === 0}
              >
                {t("clearAll")}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsFilterOpen(false)}
              >
                {t("showResults")} · {filteredAndSortedExpenses.length}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default ExpensesPage;
