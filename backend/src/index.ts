import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import { account } from "./data";
import { getCurrentBalance, calcBalances, filterTx } from "./lib";

const app = express();
app.use(cors());

// --- Swagger setup ---
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bank Account API",
      version: "1.0.0",
      description: "Simple API for account info and transactions",
    },
  },
  apis: ["./src/index.ts"], // points to files with JSDoc comments
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @openapi
 * /api/account:
 *   get:
 *     summary: Get account info and current balance
 *     responses:
 *       200:
 *         description: Account details
 */
app.get("/api/account", (_req, res) => {
  res.json({ ...account, currentBalance: getCurrentBalance() });
});

/**
 * @openapi
 * /api/transactions:
 *   get:
 *     summary: Get transactions with optional filters
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of transactions
 */
app.get("/api/transactions", (req, res) => {
  const { from, to, category } = req.query as any;
  const filtered = filterTx({ from, to, category });
  const withBal = calcBalances(filtered, account.startingBalance);
  res.json([...withBal].sort((a, b) => b.date.localeCompare(a.date)));
});

app.listen(4000, () => console.log("api on :4000 (docs at /docs)"));
