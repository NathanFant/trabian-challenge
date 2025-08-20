# Nathan's Bank

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

This was build in 2-4 hour sessions. Prior to begining this project, I had not used Tailwind or Node.js at all, and had barely touched TypeScript.

Multi-account demo bank. React + Vite + Tailwind frontend. Node.js + Express + TypeScript backend. Read-only API with filters. Data seeded to JSON. Swagger docs included.

## Table of Contents

1. [Stack](#stack)
2. [Features](#features)
3. [API (summary)](#api-summary)
4. [Run Locally](#run-locally)
5. [Project Structure](#project-structure)
6. [Implementation Notes](#implementation-notes)
7. [Future Improvements](#future-improvements)

## Stack

- Frontend: React, Vite, TypeScript, TailwindCSS
- Backend: Node.js, Express, TypeScript, Zod
- Docs: SwaggerUI (`/docs`)
- Dev proxy: Vite -> Express on `:4000`

## Features

- 5 demo accounts with unique 8-digit IDs
- Current balance computed from starting balance + transactions
- Transactions table with running `balanceAfter`
- Filter by date range and category
- Account selector in header
- Masked account number with reveal
- Dark glassmorphism styling (Tailwind)

## API (summary)

Base URL: `http://localhost:4000`

- `GET /api/accounts` → `[Account]`
- `GET /api/account?accountId=<8digits>` → `Account` + `currentBalance`
- `GET /api/transactions?accountId=<8digits>&from=YYYY-MM-DD&to=YYYY-MM-DD&category=Food&limit=50` → `[Transaction]` (sorted desc)
- `GET /health` → `{ ok: true }`
- Docs: `GET /docs`

Types:

```ts
Account { id: string; name: string; startingBalance: number; currentBalance?: number }
Transaction { id: string; accountId: string; date: string; description: string; amount: number; category: string; balanceAfter: number }
```

Quick cURL:

```bash
curl :4000/api/accounts
curl ":4000/api/account?accountId=12345678"
curl ":4000/api/transactions?accountId=12345678&from=2025-08-01&to=2025-08-31&category=Food&limit=20"
```

## Run Locally

### 1) Backend

```bash
cd backend
npm install
npm run seed # writes data/data.json with 5 accounts × 40 tx each
npm run dev # http://localhost:4000  (Swagger at /docs)
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev # http://localhost:5173 (proxied to :4000 for /api/*)
```

## Project Structure

```bash
trabian-challenge/
├─ backend/
│  ├─ src/
│  │  ├─ index.ts # Express routes + Swagger mount
│  │  ├─ lib.ts # domain logic (balances, filters)
│  │  ├─ store.ts # data access + Zod validation
│  │  ├─ swagger.ts # OpenAPI spec
│  │  └─ seed.ts # generate demo data (accounts + tx)
│  └─ data/data.json # generated dataset
├─ frontend/
│  ├─ src/
│  │  ├─ api.ts # API client
│  │  ├─ types.ts
│  │  ├─ utils.ts
│  │  ├─ App.tsx
│  │  ├─ index.css # Tailwind base + glass utilities
│  │  └─ components/
│  │     ├─ Header.tsx
│  │     ├─ MaskedAccount.tsx
│  │     ├─ Filters.tsx
│  │     └─ TransactionsTable.tsx
│  └─ vite.config.ts # proxy /api → :4000
└─ README.md
```

## Implementation Notes

- Mutli-account: FE always sends `accountId` (8-digit) to the API.
- Balance Calc: sort tx asc, run unning sum from `startingBalance`, attach `balanceAfter`, then return desc.
- Validation: Zod validates data.json on load and query params for `/api/transactions`.
- Styling: Tailwind utilities; `.glass` class provides blur + subtle border. (This is my weak suit)

## Future improvments

- Pagination and infinite scroll
- Persisted filters in URL
- POST `/transactions` with schema validation (disabled by design for this challenge)
- Dockerfile + docker-compose
- Redoc in addition to swagger
