import { getAccount, getTransactionsByAccount } from "./store.js";

export function calcBalances(
  txs: Pick<Tx, "date" | "amount" | "description" | "category">[],
  starting: number,
) {
  const asc = [...txs].sort((a, b) => a.date.localeCompare(b.date));
  let running = starting;
  return asc.map((t) => ({
    ...t,
    balanceAfter: Number((running += t.amount).toFixed(2)),
  }));
}

export function getCurrentBalance(accountId: string) {
  const acc = getAccount(accountId);
  if (!acc) throw new Error("account not found");
  const arr = calcBalances(
    getTransactionsByAccount(accountId),
    acc.startingBalance,
  );
  return arr.length ? arr[arr.length - 1].balanceAfter : acc.startingBalance;
}

export function filterTx(
  accountId: string,
  { from, to, category }: { from?: string; to?: string; category?: string },
) {
  return getTransactionsByAccount(accountId).filter((t) => {
    if (from && t.date < from) return false;
    if (to && t.date > to) return false;
    if (category && t.category !== category) return false;
    return true;
  });
}
