import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";
import { listAccounts, getAccount } from "./store.js";
import { getCurrentBalance, calcBalances, filterTx } from "./lib.js";

const app = express();
app.use(cors());

// account resolution: query ?accountId=... or header x-account-id, default acc-1
function resolveAccountId(req: express.Request) {
  return (
    (req.query.accountId as string) ||
    (req.header("x-account-id") as string) ||
    "acc-1"
  );
}

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api/accounts", (_req, res) => res.json(listAccounts()));

app.get("/api/account", (req, res) => {
  const accountId = resolveAccountId(req);
  const acc = getAccount(accountId);
  if (!acc) return res.status(404).json({ error: "account_not_found" });
  res.json({ ...acc, currentBalance: getCurrentBalance(accountId) });
});

app.get("/api/transactions", (req, res) => {
  const accountId = resolveAccountId(req);
  const acc = getAccount(accountId);
  if (!acc) return res.status(404).json({ error: "account_not_found" });

  const { from, to, category } = req.query as any;
  const limit = Math.min(Number(req.query.limit ?? 50), 500);

  const filtered = filterTx(accountId, { from, to, category });
  const withBal = calcBalances(filtered, acc.startingBalance);
  res.json(
    withBal.sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit),
  );
});

// health + errors
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use((req, res) => res.status(404).json({ error: "not_found" }));
app.use((err: any, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "internal_error" });
});

app.listen(4000, () => console.log("api on :4000 (docs at /docs)"));
