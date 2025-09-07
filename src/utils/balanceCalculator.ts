import type {
  Trip,
  Balance,
  Settlement,
  BalanceSummary,
  CombinationBalance,
  Expense,
} from "../types";

// Calculate balances and settlements for a trip
export const calculateBalances = (trip: Trip): BalanceSummary => {
  const balances: Record<string, Balance> = {};

  // Initialize balances for all participants
  trip.participants.forEach((user) => {
    balances[user.id] = {
      userId: user.id,
      userName: user.name,
      totalPaid: 0,
      totalOwed: 0,
      netBalance: 0,
    };
  });

  // Calculate total paid and owed for each user
  trip.expenses.forEach((expense) => {
    const paidBy = expense.paidBy;
    const splitAmount = expense.amount / expense.participants.length;

    // Add to total paid for the payer
    if (balances[paidBy]) {
      balances[paidBy].totalPaid += expense.amount;
    }

    // Add to total owed for each participant
    expense.participants.forEach((participantId) => {
      if (balances[participantId]) {
        balances[participantId].totalOwed += splitAmount;
      }
    });
  });

  // Calculate net balances
  Object.values(balances).forEach((balance) => {
    balance.netBalance = balance.totalPaid - balance.totalOwed;
  });

  // Calculate settlements using the algorithm to minimize transactions
  const settlements = calculateSettlements(Object.values(balances));

  // Calculate combination-based balances
  const combinationBalances = calculateCombinationBalances(trip);

  return {
    balances: Object.values(balances),
    settlements,
    combinationBalances,
  };
};

// Calculate optimal settlements to minimize number of transactions
const calculateSettlements = (balances: Balance[]): Settlement[] => {
  const settlements: Settlement[] = [];

  // Create copies for manipulation
  const creditors = balances
    .filter((b) => b.netBalance > 0.01) // They are owed money
    .map((b) => ({ ...b }))
    .sort((a, b) => b.netBalance - a.netBalance); // Largest creditors first

  const debtors = balances
    .filter((b) => b.netBalance < -0.01) // They owe money
    .map((b) => ({ ...b, netBalance: Math.abs(b.netBalance) }))
    .sort((a, b) => b.netBalance - a.netBalance); // Largest debtors first

  let i = 0,
    j = 0;

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    const settlementAmount = Math.min(creditor.netBalance, debtor.netBalance);

    if (settlementAmount > 0.01) {
      // Only create settlement if amount is significant
      settlements.push({
        fromUserId: debtor.userId,
        fromUserName: debtor.userName,
        toUserId: creditor.userId,
        toUserName: creditor.userName,
        amount: Math.round(settlementAmount * 100) / 100, // Round to 2 decimal places
      });
    }

    creditor.netBalance -= settlementAmount;
    debtor.netBalance -= settlementAmount;

    if (creditor.netBalance < 0.01) i++; // Move to next creditor
    if (debtor.netBalance < 0.01) j++; // Move to next debtor
  }

  return settlements;
};

// Calculate balances broken down by participant combinations
const calculateCombinationBalances = (trip: Trip): CombinationBalance[] => {
  // Group expenses by participant combinations
  const combinationGroups = new Map<
    string,
    { expenses: Expense[]; participantIds: string[] }
  >();

  trip.expenses.forEach((expense) => {
    // Sort participant IDs to create consistent keys
    const sortedParticipants = [...expense.participants].sort();
    const key = sortedParticipants.join(",");

    if (!combinationGroups.has(key)) {
      combinationGroups.set(key, {
        expenses: [],
        participantIds: sortedParticipants,
      });
    }

    combinationGroups.get(key)!.expenses.push(expense);
  });

  // Calculate balances for each combination
  const combinationBalances: CombinationBalance[] = [];

  combinationGroups.forEach(({ expenses, participantIds }) => {
    // Create a map to get participant names
    const participantMap = new Map<string, string>();
    trip.participants.forEach((p) => {
      participantMap.set(p.id, p.name);
    });

    const participantNames = participantIds.map(
      (id) => participantMap.get(id) || id
    );

    // Calculate balances for this combination
    const balances: Record<string, Balance> = {};

    // Initialize balances for participants in this combination
    participantIds.forEach((userId) => {
      balances[userId] = {
        userId,
        userName: participantMap.get(userId) || userId,
        totalPaid: 0,
        totalOwed: 0,
        netBalance: 0,
      };
    });

    // Calculate paid and owed amounts for this combination
    let totalAmount = 0;
    expenses.forEach((expense) => {
      const splitAmount = expense.amount / expense.participants.length;
      totalAmount += expense.amount;

      // Add to total paid for the payer
      if (balances[expense.paidBy]) {
        balances[expense.paidBy].totalPaid += expense.amount;
      }

      // Add to total owed for each participant
      expense.participants.forEach((participantId) => {
        if (balances[participantId]) {
          balances[participantId].totalOwed += splitAmount;
        }
      });
    });

    // Calculate net balances
    Object.values(balances).forEach((balance) => {
      balance.netBalance = balance.totalPaid - balance.totalOwed;
    });

    // Calculate settlements for this combination
    const combinationSettlements = calculateSettlements(
      Object.values(balances)
    );

    combinationBalances.push({
      participantIds,
      participantNames,
      expenses,
      balances: Object.values(balances),
      settlements: combinationSettlements,
      totalAmount,
    });
  });

  // Sort by total amount descending
  return combinationBalances.sort((a, b) => b.totalAmount - a.totalAmount);
};
