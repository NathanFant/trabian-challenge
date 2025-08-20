// frontend/src/api.ts
import type { Account, Transaction, Filters } from "./types";

const qs = (p: Record<string, string | number | undefined>) =>
  Object.entries(p)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(
      ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
    )
    .join("&");

export async function fetchAccounts(): Promise<Account[]> {
  const r = await fetch("/api/accounts");
  if (!r.ok) throw new Error("failed to load accounts");
  return r.json();
}

export async function fetchAccount(accountId: string): Promise<Account> {
  const r = await fetch(`/api/account?${qs({ accountId })}`);
  if (!r.ok) throw new Error("failed to load account");
  return r.json();
}

export async function fetchTransactions(
  accountId: string,
  f: Filters,
  limit = 100,
): Promise<Transaction[]> {
  const r = await fetch(`/api/transactions?${qs({ accountId, ...f, limit })}`);
  if (!r.ok) throw new Error("failed to load transactions");
  return r.json();
}
