import fs from "fs";
import path from "path";
import { z } from "zod";

const Tx = z.object({
  id: z.string(),
  date: z.string(), // YYYY-MM-DD
  description: z.string(),
  amount: z.number(),
  category: z.string(),
});
const Account = z.object({
  id: z.string(),
  name: z.string(),
  startingBalance: z.number(),
});
const DataFile = z.object({
  account: Account,
  transactions: z.array(Tx),
});
export type Tx = z.infer<typeof Tx>;
export type Account = z.infer<typeof Account>;

const DATA_PATH = path.resolve(__dirname, "../data/data.json");

function readJson(): { account: Account; transactions: Tx[] } {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  const parsed = JSON.parse(raw);
  return DataFile.parse(parsed);
}

// simple cache with mtime check
let cache: {
  data: { account: Account; transactions: Tx[] };
  mtimeMs: number;
} | null = null;

function getData() {
  const stat = fs.statSync(DATA_PATH);
  if (!cache || cache.mtimeMs !== stat.mtimeMs) {
    cache = { data: readJson(), mtimeMs: stat.mtimeMs };
  }
  return cache.data;
}

export function getAccount() {
  return getData().account;
}
export function getTransactions() {
  return getData().transactions;
}

// optional write helper (use carefully)
export function saveData(data: { account: Account; transactions: Tx[] }) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  cache = null; // bust cache
}
