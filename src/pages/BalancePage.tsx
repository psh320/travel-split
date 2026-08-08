import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppHeader } from "../components/ui/AppHeader";
import { PageErrorState, PageLoading } from "../components/ui/PageState";
import { BalanceOverviewCard } from "../components/balance/BalanceOverviewCard";
import { CombinationBalancesCard } from "../components/balance/CombinationBalancesCard";
import { CombinationDetailsDialog } from "../components/balance/CombinationDetailsDialog";
import { SettlementListCard } from "../components/balance/SettlementListCard";
import { useCurrentTripUserId } from "../hooks/useCurrentTripUserId";
import { useDialogLifecycle } from "../hooks/useDialogLifecycle";
import { useTripData } from "../hooks/useTripData";
import { t } from "../i18n";
import { calculateBalances } from "../utils/balanceCalculator";
import { useToast } from "../components/ui/useToast";

const BalancePage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const currentUserId = useCurrentTripUserId();
  const { trip, loading } = useTripData(groupId, {
    onMissing: () => {
      showToast(t("groupNotFound"), "error");
      void navigate("/");
    },
    onError: (error) => {
      console.error("Error loading trip:", error);
      showToast(t("groupNotFound"), "error");
    },
  });
  const balanceSummary = useMemo(() => (trip ? calculateBalances(trip) : null), [trip]);
  const [expandedCombinationIndex, setExpandedCombinationIndex] = useState<number | null>(null);
  const [detailsCombinationIndex, setDetailsCombinationIndex] = useState<number | null>(null);

  useDialogLifecycle(
    detailsCombinationIndex !== null,
    () => setDetailsCombinationIndex(null),
    { lockBodyScroll: false }
  );

  if (loading) return <PageLoading />;

  if (!trip || !balanceSummary) {
    return (
      <PageErrorState
        message={t("unableToLoadBalance")}
        actionTo={`/group/${groupId}`}
        actionLabel={t("goBack")}
      />
    );
  }

  const currentUserBalance = balanceSummary.balances.find(
    (balance) => balance.userId === currentUserId
  );
  const currentUser = trip.participants.find((user) => user.id === currentUserId);
  const currentUserSettlements = balanceSummary.settlements.filter(
    (settlement) =>
      settlement.fromUserId === currentUserId || settlement.toUserId === currentUserId
  );
  const combinationBalances = balanceSummary.combinationBalances ?? [];
  const selectedCombination =
    detailsCombinationIndex === null
      ? null
      : combinationBalances[detailsCombinationIndex] ?? null;

  return (
    <>
      <AppHeader
        backTo={`/group/${groupId}`}
        title={t("balance")}
        subtitle={t("balanceSubtitle")}
      />

      <div className="content">
        {currentUserBalance && (
          <BalanceOverviewCard balance={currentUserBalance} user={currentUser} />
        )}

        {currentUserSettlements.length > 0 && (
          <SettlementListCard
            title={t("yourSettlements")}
            settlements={currentUserSettlements}
            participants={trip.participants}
          />
        )}

        {balanceSummary.settlements.length > 0 && (
          <SettlementListCard
            title={t("suggestedSettlements")}
            description={t("minimumPayments")}
            settlements={balanceSummary.settlements}
            participants={trip.participants}
          />
        )}

        {combinationBalances.length > 0 && (
          <CombinationBalancesCard
            combinations={combinationBalances}
            expandedIndex={expandedCombinationIndex}
            onDetails={setDetailsCombinationIndex}
            onToggle={(index) =>
              setExpandedCombinationIndex((current) => (current === index ? null : index))
            }
          />
        )}

        {balanceSummary.settlements.length === 0 && trip.expenses.length > 0 && (
          <div className="card">
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <h3 style={{ color: "var(--ease-color-success)" }}>{t("allSettled")}</h3>
              <p style={{ color: "var(--ease-color-text-muted)", fontSize: "0.875rem" }}>
                {t("noPaymentsNeeded")}
              </p>
            </div>
          </div>
        )}

        {trip.expenses.length === 0 && (
          <div className="card">
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <h3>{t("noExpenses")}</h3>
              <p
                style={{
                  color: "var(--ease-color-text-muted)",
                  fontSize: "0.875rem",
                  marginBottom: "1rem",
                }}
              >
                {t("addExpenseToSeeBalances")}
              </p>
              <Link to={`/group/${groupId}/add-expense`} className="btn btn-primary">
                {t("addFirstExpense")}
              </Link>
            </div>
          </div>
        )}
      </div>

      {selectedCombination && (
        <CombinationDetailsDialog
          combination={selectedCombination}
          currentUserId={currentUserId}
          onClose={() => setDetailsCombinationIndex(null)}
        />
      )}
    </>
  );
};

export default BalancePage;
