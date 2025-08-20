import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
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

  useEffect(() => {
    fetchAccounts().then(list => {
      setAccounts(list);
      if (!selectedId && list.length) setSelectedId(list[0].id);
    }).catch(console.error);
  }, []);

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
    <>
      <Header accounts={accounts} selectedId={selectedId} onSelect={setSelectedId} />
      <div className="max-w-5xl mx-auto p-4 space-y-4">
        <MaskedAccount account={account} />
        <FiltersBar value={filters} onChange={setFilters} categories={CATEGORIES} />
        <TransactionsTable txs={txs} />
      </div>
    </>
  );
}
