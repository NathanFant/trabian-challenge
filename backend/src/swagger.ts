// backend/src/swagger.ts
import { OpenAPIV3 } from "openapi-types";

export const swaggerSpec: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "Bank Account API",
    version: "1.0.0",
    description: "Simple API for account info and transactions",
  },
  servers: [{ url: "http://localhost:4000" }],
  components: {
    schemas: {
      Account: {
        type: "object",
        required: ["id", "name", "startingBalance", "currentBalance"],
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          startingBalance: { type: "number", format: "double" },
          currentBalance: { type: "number", format: "double" },
        },
      },
      Transaction: {
        type: "object",
        required: [
          "id",
          "date",
          "description",
          "amount",
          "category",
          "balanceAfter",
        ],
        properties: {
          id: { type: "string" },
          date: { type: "string", format: "date" },
          description: { type: "string" },
          amount: { type: "number", format: "double" },
          category: { type: "string" },
          balanceAfter: { type: "number", format: "double" },
        },
      },
    },
  },
  paths: {
    "/api/account": {
      get: {
        summary: "Get account info and current balance",
        responses: {
          "200": {
            description: "Account details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Account" },
              },
            },
          },
        },
      },
    },
    "/api/transactions": {
      get: {
        summary: "Get transactions with optional filters",
        parameters: [
          {
            name: "from",
            in: "query",
            schema: { type: "string", format: "date" },
          },
          {
            name: "to",
            in: "query",
            schema: { type: "string", format: "date" },
          },
          { name: "category", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": {
            description: "List of transactions",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Transaction" },
                },
              },
            },
          },
        },
      },
    },
  },
};
