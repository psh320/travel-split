import type { Trip, Balance, Settlement, BalanceSummary } from "../types";

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

  return {
    balances: Object.values(balances),
    settlements,
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
