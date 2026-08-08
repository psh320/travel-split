import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import type { ExpenseCategory, Trip } from "../types";
import { formatAmount, formatExpenseDate } from "../utils";
import { EXPENSE_CATEGORIES } from "../utils/expenses";

type ExpenseFilter = "all" | "paid-by-me" | "split-with-me";
type ExpenseSort = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";

const ExpensesPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const cachedTrip = groupId ? FirebaseService.getCachedTripById(groupId) : null;
  const [trip, setTrip] = useState<Trip | null>(cachedTrip);
  const [loading, setLoading] = useState(!cachedTrip);
  const [currentUserId, setCurrentUserId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterBy, setFilterBy] = useState<ExpenseFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | ExpenseCategory>(
    "all"
  );
  const [sortBy, setSortBy] = useState<ExpenseSort>("date-desc");

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (userId) setCurrentUserId(userId);

    const loadTrip = async () => {
      if (!groupId) return;

      const hasCachedTrip = Boolean(FirebaseService.getCachedTripById(groupId));
      if (!hasCachedTrip) setLoading(true);

      try {
        const tripData = await FirebaseService.getTripById(groupId, {
          force: hasCachedTrip,
        });
        if (tripData) {
          setTrip(tripData);
        } else {
          showToast(t("groupNotFound"), "error");
          navigate("/");
        }
      } catch (error) {
        console.error("Error loading trip:", error);
        showToast(t("groupNotFound"), "error");
      } finally {
        setLoading(false);
      }
    };

    void loadTrip();
  }, [groupId, navigate, showToast]);

  useEffect(() => {
    if (!isFilterOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsFilterOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFilterOpen]);

  const handleDeleteExpense = async (expenseId: string) => {
    if (!trip || !window.confirm(t("remove"))) return;

    try {
      await FirebaseService.deleteExpense(trip.id, expenseId);
      const tripData = await FirebaseService.getTripById(trip.id);
      if (tripData) setTrip(tripData);
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
          <h3>{t("groupNotFound")}</h3>
          <Link to="/" className="btn btn-primary">
            {t("goHome")}
          </Link>
        </div>
      </div>
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
                  dateLabel={formatExpenseDate(expense.date)}
                  editTo={
                    "/group/" + groupId + "/edit-expense/" + expense.id
                  }
                  expense={expense}
                  onDelete={() => handleDeleteExpense(expense.id)}
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
