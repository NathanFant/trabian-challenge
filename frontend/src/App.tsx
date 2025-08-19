import { useEffect, useState } from "react";

export default function App() {
  const [account, setAccount] = useState<any>(null);
  const [txs, setTxs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/account")
      .then(r => r.json())
      .then(setAccount)
      .catch(e => setError(String(e)));

    fetch("/api/transactions")
      .then(r => r.json())
      .then(setTxs)
      .catch(e => setError(String(e)));
  }, []);

  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Smoke Test</h1>
      <pre className="bg-gray-100 p-3 rounded">
        {JSON.stringify(account, null, 2)}
      </pre>
      <pre className="bg-gray-100 p-3 rounded">
        {JSON.stringify(txs, null, 2)}
      </pre>
    </div>
  );
}
