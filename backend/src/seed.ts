import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type Account = { id: string; name: string; startingBalance: number };
type Category =
  | "Food"
  | "Bills"
  | "Income"
  | "Transport"
  | "Health"
  | "Entertainment"
  | "Shopping"
  | "Travel";
type Tx = {
  id: string;
  accountId: string;
  date: string;
  description: string;
  amount: number;
  category: Category;
};

const DATA_PATH = path.resolve(__dirname, "../data/data.json");

// deterministic PRNG
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const categoriesNoIncome = [
  "Food",
  "Bills",
  "Transport",
  "Health",
  "Entertainment",
  "Shopping",
  "Travel",
] as const;

const vendors: Record<Category, readonly string[]> = {
  Food: [
    "Walmart Groceries",
    "Kroger",
    "Costco",
    "Starbucks",
    "Chipotle",
    "Panera",
    "Pizza Hut",
    "Trader Joe's",
    "Aldi",
  ],
  Bills: ["Rent", "Electric", "Water", "Internet", "Phone", "Car Insurance"],
  Income: ["Paycheck - Employer Inc"],
  Transport: ["Gas - Shell", "Gas - Chevron", "Gas - BP", "Uber", "Taxi"],
  Health: ["Pharmacy", "Doctor Visit", "Gym Membership"],
  Entertainment: ["Movie Theater", "Concert Ticket", "Spotify", "Netflix"],
  Shopping: ["Amazon", "Target", "Best Buy", "Home Depot"],
  Travel: ["Hotel - Marriott", "Airline - Delta", "Airbnb", "Lyft Airport"],
};

const billAmounts = {
  Rent: -950,
  Electric: -120,
  Water: -60,
  Internet: -80,
  Phone: -75,
  "Car Insurance": -210,
} as const;

const spendRanges = {
  Food: [-15, -200],
  Transport: [-15, -80],
  Health: [-20, -250],
  Entertainment: [-10, -150],
  Shopping: [-20, -300],
  Travel: [-50, -500],
} as const;

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]!;
}
function round2(n: number) {
  return Math.round(n * 100) / 100;
}
function addDays(d: Date, n: number) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}
function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

function genTxForAccount(
  rng: () => number,
  accountId: string,
  startDate: Date,
  count: number,
): Tx[] {
  const txs: Tx[] = [];
  let day = 0;

  for (let i = 0; i < count; i++) {
    const isIncome = i % 9 === 5;
    const cat: Category = isIncome ? "Income" : pick(rng, categoriesNoIncome);

    if (cat === "Bills") {
      const bill = pick(rng, vendors.Bills) as keyof typeof billAmounts;
      const amount = billAmounts[bill];
      txs.push({
        id: `t-${accountId}-${i + 1}`,
        accountId,
        date: iso(addDays(startDate, day + Math.floor(rng() * 2))),
        description: bill,
        amount,
        category: "Bills",
      });
    } else if (cat === "Income") {
      const amount = Math.floor(1600 + rng() * 600); // 1600–2199
      const incomeDesc = vendors.Income[0]!; // guaranteed present
      txs.push({
        id: `t-${accountId}-${i + 1}`,
        accountId,
        date: iso(addDays(startDate, day + Math.floor(rng() * 2))),
        description: incomeDesc,
        amount,
        category: "Income",
      });
    } else {
      const [lo, hi] = spendRanges[cat];
      const amount = round2(lo + rng() * (hi - lo));
      txs.push({
        id: `t-${accountId}-${i + 1}`,
        accountId,
        date: iso(addDays(startDate, day + Math.floor(rng() * 2))),
        description: pick(rng, vendors[cat]),
        amount,
        category: cat,
      });
    }
    day += 1;
  }
  return txs.sort((a, b) => a.date.localeCompare(b.date));
}

function genAccountId(n: number, rng: () => number): string[] {
  const ids = new Set<string>();
  while (ids.size < n) {
    const num = Math.floor(rng() * 1_0000_0000); // 0–99999999
    const id = num.toString().padStart(8, "0");
    ids.add(id);
  }
  return Array.from(ids);
}

function main() {
  const rng = mulberry32(42);
  const startDate = new Date("2025-07-20");

  const ids = genAccountId(5, rng);
  const accounts: Account[] = [
    { id: ids[0], name: "Checking 1", startingBalance: 2500 },
    { id: ids[1], name: "Checking 2", startingBalance: 1800 },
    { id: ids[2], name: "Savings 1", startingBalance: 5200 },
    { id: ids[3], name: "Joint", startingBalance: 3000 },
    { id: ids[4], name: "Business", startingBalance: 8000 },
  ];

  const transactions: Tx[] = [];
  for (const acc of accounts) {
    transactions.push(...genTxForAccount(rng, acc.id, startDate, 50));
  }

  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(
    DATA_PATH,
    JSON.stringify({ accounts, transactions }, null, 2),
  );
  console.log(
    `Wrote ${transactions.length} transactions for ${accounts.length} accounts to ${DATA_PATH}`,
  );
}

main();
