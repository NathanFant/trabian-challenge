import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import {
  getAccountWithStart,
  getCurrentBalance,
  calcBalances,
  filterTx,
} from "./lib";

const app = express();
app.use(cors());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api/account", (_req, res) => {
  const acc = getAccountWithStart();
  res.json({ ...acc, currentBalance: getCurrentBalance() });
});

app.get("/api/transactions", (req, res) => {
  const { from, to, category } = req.query as any;
  const acc = getAccountWithStart();
  const filtered = filterTx({ from, to, category });
  const withBal = calcBalances(filtered, acc.startingBalance);
  res.json([...withBal].sort((a, b) => b.date.localeCompare(a.date)));
});

app.listen(4000, () => console.log("api on :4000 (docs at /docs)"));
