import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AppHeader } from "../components/ui/AppHeader";
import { IconLink } from "../components/ui/IconButton";
import { ExpenseListItem } from "../components/ExpenseListItem";
import { Dropdown } from "../components/ui/Dropdown";
import { FirebaseService } from "../services/firebase";
import type { ExpenseCategory, Trip } from "../types";
import { formatAmount, formatExpenseDate } from "../utils";
import { EXPENSE_CATEGORIES } from "../utils/expenses";
import { t } from "../i18n";
import { useToast } from "../components/ui/useToast";

const ExpensesPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const cachedTrip = groupId ? FirebaseService.getCachedTripById(groupId) : null;
  const [trip, setTrip] = useState<Trip | null>(cachedTrip);
  const [loading, setLoading] = useState(!cachedTrip);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<
    "all" | "paid-by-me" | "split-with-me"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | ExpenseCategory>(
    "all"
  );
  const [sortBy, setSortBy] = useState<
    "date-desc" | "date-asc" | "amount-desc" | "amount-asc"
  >("date-desc");

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (userId) {
      setCurrentUserId(userId);
    }

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

    loadTrip();
  }, [groupId, navigate, showToast]);

  const handleDeleteExpense = async (expenseId: string) => {
    if (
      !trip ||
      !window.confirm(t("remove"))
    )
      return;

    try {
      await FirebaseService.deleteExpense(trip.id, expenseId);
      // Refresh trip data by reloading
      const tripData = await FirebaseService.getTripById(trip.id);
      if (tripData) {
        setTrip(tripData);
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      showToast(t("remove"), "error");
    }
  };

  const filteredAndSortedExpenses = useMemo(() => {
    if (!trip) return [];

    const filtered = trip.expenses.filter((expense) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const description = expense.description.toLowerCase();
        const paidByUser = trip.participants.find(
          (p) => p.id === expense.paidBy
        );
        const paidByName = paidByUser?.name.toLowerCase() || "";
        const categoryName = t(expense.category ?? "other").toLowerCase();

        if (
          !description.includes(searchLower) &&
          !paidByName.includes(searchLower) &&
          !categoryName.includes(searchLower)
        ) {
          return false;
        }
      }

      // User filter
      if (filterBy === "paid-by-me") {
        return expense.paidBy === currentUserId;
      } else if (filterBy === "split-with-me") {
        return expense.participants.includes(currentUserId);
      }

      if (
        categoryFilter !== "all" &&
        (expense.category ?? "other") !== categoryFilter
      ) {
        return false;
      }

      return true;
    });

    // Sort
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
        default:
          return 0;
      }
    });

    return filtered;
  }, [trip, searchTerm, filterBy, categoryFilter, sortBy, currentUserId]);

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

  const filteredTotal = filteredAndSortedExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const totalExpenses = trip.expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  return (
    <>
      <AppHeader
        backTo={`/group/${groupId}`}
        title={t("expenses")}
        subtitle={formatAmount(totalExpenses)}
      />

      <div className="content">
        {/* Summary Card */}
        {filteredAndSortedExpenses.length > 0 && (
          <div className="card">
            <h3>{t("summary")}</h3>
            <div
              style={{
                fontSize: "0.875rem",
                color: "var(--ease-color-text-muted)",
                lineHeight: "1.6",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <span>{t("totalExpenses")}</span>
                <strong>{formatAmount(filteredTotal)}</strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <span>{t("averagePerExpense")}</span>
                <strong>
                  {formatAmount(filteredTotal / filteredAndSortedExpenses.length)}
                </strong>
              </div>
              {filterBy === "all" && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{t("averagePerPerson")}</span>
                  <strong>
                    {formatAmount(filteredTotal / trip.participants.length)}
                  </strong>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search and Filter Controls */}
        <div className="card">
          {/* Search */}
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("search")}
              style={{ width: "100%" }}
            />
          </div>

          {/* Filters and Sort */}
          <div className="filter-controls">
            <Dropdown
              label={t("filter")}
              value={filterBy}
              onChange={setFilterBy}
              options={[
                { value: "all", label: t("allExpenses") },
                { value: "paid-by-me", label: t("paidByMe") },
                { value: "split-with-me", label: t("splitWithMe") },
              ]}
            />
            <Dropdown
              label={t("sortBy")}
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: "date-desc", label: t("newestFirst") },
                { value: "date-asc", label: t("oldestFirst") },
                { value: "amount-desc", label: t("highestAmount") },
                { value: "amount-asc", label: t("lowestAmount") },
              ]}
            />
            <Dropdown
              label={t("category")}
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={[
                { value: "all", label: t("allCategories") },
                ...EXPENSE_CATEGORIES.map((category) => ({
                  value: category,
                  label: t(category),
                })),
              ]}
            />
          </div>
        </div>

        {/* Quick Stats */}
        {(searchTerm || filterBy !== "all" || categoryFilter !== "all") && (
          <div className="card">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: "1rem",
                textAlign: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    color: "var(--ease-color-brand)",
                  }}
                >
                  {filteredAndSortedExpenses.length}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--ease-color-text-muted)" }}>
                  {filterBy === "all"
                    ? t("found")
                    : filterBy === "paid-by-me"
                    ? t("paid")
                    : t("split")}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    color: "var(--ease-color-success)",
                  }}
                >
                  {formatAmount(filteredTotal)}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--ease-color-text-muted)" }}>
                  {t("total")}
                </div>
              </div>
              {filterBy !== "all" && (
                <div>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "600",
                      color: "var(--ease-color-warning)",
                    }}
                  >
                    {Math.round(
                      (filteredAndSortedExpenses.length /
                        Math.max(trip.expenses.length, 1)) *
                        100
                    )}
                    %
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--ease-color-text-muted)" }}>
                    {t("allExpenses")}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Expenses List */}
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h3>{t("list")}</h3>
            <IconLink
              to={`/group/${groupId}/add-expense`}
              label={t("addExpense")}
            >
              +
            </IconLink>
          </div>

          {filteredAndSortedExpenses.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "var(--ease-color-text-muted)",
                fontSize: "0.875rem",
              }}
            >
              {trip.expenses.length === 0 ? (
                <>
                  <p>{t("noExpenses")}</p>
                </>
              ) : (
                <>
                  <p>{t("noMatches")}</p>
                </>
              )}
            </div>
          ) : (
            <div className="list">
              {filteredAndSortedExpenses.map((expense) => {
                const paidByUser = trip.participants.find(
                  (p) => p.id === expense.paidBy
                );
                return (
                  <ExpenseListItem
                    key={expense.id}
                    dateLabel={formatExpenseDate(expense.date)}
                    editTo={`/group/${groupId}/edit-expense/${expense.id}`}
                    expense={expense}
                    onDelete={() => handleDeleteExpense(expense.id)}
                    paidByUser={paidByUser}
                  />
                );
              })}
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default ExpensesPage;
