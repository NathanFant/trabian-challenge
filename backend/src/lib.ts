import { account, transactions } from "./data";

export function getCurrentBalance() {
  const arr = calcBalances(transactions, account.startingBalance);
  return arr.length
    ? arr[arr.length - 1].balanceAfter
    : account.startingBalance;
}

export function calcBalances(
  txs: {
    date: string;
    amount: number;
    description?: string;
    category?: string;
  }[],
  starting: number,
) {
  const asc = [...txs].sort((a, b) => a.date.localeCompare(b.date));
  let running = starting;
  return asc.map((t) => {
    running += t.amount;
    return { ...t, balanceAfter: Number(running.toFixed(2)) };
  });
}

export function filterTx({
  from,
  to,
  category,
}: {
  from?: string;
  to?: string;
  category?: string;
}) {
  return transactions.filter((t) => {
    if (from && t.date < from) return false;
    if (to && t.date > to) return false;
    if (category && t.category !== category) return false;
    return true;
  });
}
