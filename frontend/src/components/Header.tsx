import type { Account } from "../types";
import { cls } from "../utils";

export default function Header({
  accounts,
  selectedId,
  onSelect,
}: {
  accounts: Account[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <header className="glass px-6 py-4 flex items-center justify-between">
      {/* Title */}
      <h1 className="text-4xl font-extrabold tracking-tight whitespace-nowrap">Nathan&apos;s Bank</h1>

      {/* Account toggle */}
      <div className="flex items-center gap-2">
        <label htmlFor="acct" className="text-xs text-zinc-400">Account</label>
        <select
          id="acct"
          value={selectedId ?? ""}
          onChange={e => onSelect(e.target.value)}
          className="input text-xs"
        >
          {accounts.map((a, i) => (
            <option key={a.id} value={a.id}>
              {`Account ${i + 1}`}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}
