import type { Transaction } from "../types";
import { fmtMoney } from "../utils";

export function TransactionsTable({ txs }: { txs: Transaction[] }) {
  return (
    <div className="glass p-3 overflow-auto">
      <table className="table">
        <thead>
          <tr>
            <th className="th">Date</th>
            <th className="th">Description</th>
            <th className="th">Category</th>
            <th className="th text-right">Amount</th>
            <th className="th text-right">Balance</th>
          </tr>
        </thead>
        <tbody>
          {txs.map(t=>(
            <tr key={t.id}>
              <td className="td">{t.date}</td>
              <td className="td">{t.description}</td>
              <td className="td"><span className="badge">{t.category}</span></td>
              <td className="td text-right">
                <span className={t.amount < 0 ? "text-red-300" : "text-emerald-300"}>{fmtMoney(t.amount)}</span>
              </td>
              <td className="td text-right">{fmtMoney(t.balanceAfter)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
