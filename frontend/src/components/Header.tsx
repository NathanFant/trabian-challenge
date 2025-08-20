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
      <h1 className="text-4xl font-extrabold tracking-tight">Nathan&apos;s Bank</h1>

      {/* Account toggle */}
      <div className="flex items-center gap-2">
        {accounts.map((a, i) => (
          <button
            key={a.id}
            onClick={() => onSelect(a.id)}
            className={cls(
              "px-3 py-1 rounded-lg text-xs glass hover:bg-white/10 transition",
              selectedId === a.id && "bg-white/10"
            )}
            title={a.name || `Account ${i + 1}`}
          >
            Account {i + 1}
          </button>
        ))}
      </div>
    </header>
  );
}
