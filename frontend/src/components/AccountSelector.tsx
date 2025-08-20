import { cls, maskAccount } from "../utils";
import type { Account } from "../types";
import { useState } from "react";

export function AccountSelector({
  accounts, selectedId, onSelect
}: { accounts: Account[]; selectedId?: string; onSelect: (id: string)=>void }) {
  // label buttons Account 1..5 by index
  return (
    <div className="flex items-center gap-2">
      {accounts.map((a, i) => (
        <button
          key={a.id}
          className={cls("btn", selectedId===a.id && "btn-active")}
          onClick={()=>onSelect(a.id)}
          title={`${a.name ?? "Account"} • ${maskAccount(a.id)}`}
        >
          Account {i+1}
        </button>
      ))}
    </div>
  );
}
