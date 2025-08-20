import { useEffect, useMemo, useState } from "react";
import { AccountSelector } from "./components/AccountSelector";
import { MaskedAccount } from "./components/MaskedAccount";
import { FiltersBar } from "./components/Filters";
import { TransactionsTable } from "./components/TransactionsTable";
import { fetchAccounts, fetchAccount, fetchTransactions } from "./api";
import type { Account, Transaction, Filters } from "./types";

const CATEGORIES = ["Food","Bills","Income","Transport","Health","Entertainment","Shopping","Travel"];

export default function App() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [account, setAccount] = useState<Account>();
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<Filters>({});

  // load accounts once
  useEffect(() => {
    fetchAccounts().then(list => {
      setAccounts(list);
      if (!selectedId && list.length) setSelectedId(list[0].id);
    }).catch(console.error);
  }, []);

  // when account or filters change, refetch
  useEffect(() => {
    if (!selectedId) return;
    fetchAccount(selectedId).then(setAccount).catch(console.error);
    fetchTransactions(selectedId, filters, 200).then(setTxs).catch(console.error);
  }, [selectedId, filters]);

  const headerSubtitle = useMemo(() => {
    if (!account) return "";
    return `${account.name || "Account"} • ${selectedId}`;
  }, [account, selectedId]);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="glass px-4 py-2">
          <h1 className="text-2xl font-bold">Nathan&apos;s Bank</h1>
          <div className="text-sm text-zinc-400">{headerSubtitle}</div>
        </div>
        <AccountSelector
          accounts={accounts}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      <MaskedAccount account={account} />

      <FiltersBar value={filters} onChange={setFilters} categories={CATEGORIES} />

      <TransactionsTable txs={txs} />
    </div>
  );
}
