import { useState } from "react";
import { maskAccount, fmtMoney } from "../utils";
import type { Account } from "../types";

export function MaskedAccount({ account }: { account?: Account }) {
  const [reveal, setReveal] = useState(false);
  if (!account) return null;
  return (
    <div className="glass p-4 flex items-center justify-between">
      <div>
        <div className="text-lg font-semibold">{account.name || "Account"}</div>
        <div className="text-sm text-zinc-400 flex items-center gap-2">
          <span>{maskAccount(account.id, reveal)}</span>
          <button
            className="badge"
            onClick={()=>setReveal(v=>!v)}
            aria-label={reveal ? "Hide account number" : "Show account number"}
            title={reveal ? "Hide account number" : "Show account number"}
          >
            {reveal ? "🙈" : "👁️"}
          </button>
        </div>
      </div>
      <div className="text-right">
        <div className="text-zinc-400 text-xs">Current Balance</div>
        <div className="text-2xl font-bold">{fmtMoney(account.currentBalance ?? account.startingBalance)}</div>
      </div>
    </div>
  );
}
