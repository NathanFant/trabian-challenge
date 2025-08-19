import fs from "fs";
import path from "path";
import { z } from "zod";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const Account = z.object({
  id: z.string(),
  name: z.string(),
  startingBalance: z.number(),
});
const Tx = z.object({
  id: z.string(),
  accountId: z.string(),
  date: z.string(),
  description: z.string(),
  amount: z.number(),
  category: z.string(),
});
const DataFile = z.object({
  accounts: z.array(Account),
  transactions: z.array(Tx),
});
export type Account = z.infer<typeof Account>;
export type Tx = z.infer<typeof Tx>;

const DATA_PATH = path.resolve(__dirname, "../data/data.json");

let cache: { mtimeMs: number; data: z.infer<typeof DataFile> } | null = null;
function load() {
  const st = fs.statSync(DATA_PATH);
  if (!cache || cache.mtimeMs !== st.mtimeMs) {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    cache = { mtimeMs: st.mtimeMs, data: DataFile.parse(JSON.parse(raw)) };
  }
  return cache.data;
}

export function listAccounts() {
  return load().accounts;
}
export function getAccount(id: string) {
  return load().accounts.find((a) => a.id === id);
}
export function getTransactionsByAccount(id: string) {
  return load().transactions.filter((t) => t.accountId === id);
}
