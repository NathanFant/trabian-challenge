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
        required: ["id", "name", "startingBalance"],
        properties: {
          id: { type: "string", description: "8-digit account id" },
          name: { type: "string" },
          startingBalance: { type: "number", format: "double" },
          currentBalance: { type: "number", format: "double" },
        },
      },
      Transaction: {
        type: "object",
        required: [
          "id",
          "accountId",
          "date",
          "description",
          "amount",
          "category",
          "balanceAfter",
        ],
        properties: {
          id: { type: "string" },
          accountId: { type: "string" },
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
    "/api/accounts": {
      get: {
        summary: "List accounts",
        responses: {
          "200": {
            description: "Accounts",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Account" },
                },
              },
            },
          },
        },
      },
    },
    "/api/account": {
      get: {
        summary: "Get account info and current balance",
        parameters: [
          {
            name: "accountId",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "8-digit account id",
          },
        ],
        responses: {
          "200": {
            description: "Account details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Account" },
              },
            },
          },
          "404": { description: "Not found" },
        },
      },
    },
    "/api/transactions": {
      get: {
        summary: "Get transactions with optional filters",
        parameters: [
          {
            name: "accountId",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
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
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 500 },
            description: "Defaults to 50",
          },
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
          "404": { description: "Account not found" },
        },
      },
    },
  },
};
