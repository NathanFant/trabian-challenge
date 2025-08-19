# Trabian Coding Challenge – Bank Account Web App

A simple full-stack web application that displays account information, current balance, and recent transactions.
Built with Node.js (Express + TypeScript) on the backend and React + Vite + Tailwind CSS on the frontend.

## Features

- Backend API (/api) with:
- Account info endpoint
- Transactions endpoint with filters (from, to, category)
- Balance-after-transaction logic
- Frontend with:
- Responsive layout using Tailwind
- Transactions table with amounts, categories, and balances
- Filters by category and date
- Conditional formatting (negative amounts red, positive green)
- Git commit history showing development steps
- Designed to demonstrate clarity, autonomy, and problem-solving

---

## Project Structure

```text
trabian-challenge/
├── backend/ # Node.js + Express API
│ ├── src/
│ │ ├── data.ts
│ │ ├── lib.ts
│ │ └── index.ts
│ └── tsconfig.json
├── frontend/ # React + Vite + Tailwind app
│ ├── src/
│ │ ├── App.tsx
│ │ ├── api.ts
│ │ ├── utils.ts
│ │ └── index.css
│ └── vite.config.ts
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+ (tested on Node 22)
- npm 9+

### Setup

Clone repo and install dependencies:

```bash
git clone https://github.com/NathanFant/trabian-challenge.git
cd trabian-challenge
```

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend will run on http://localhost:4000

API docs available at http://localhost:4000/docs
(Swagger UI).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on http://localhost:5173
(proxy forwards /api calls to backend).

---

## API Endpoints

`GET /api/account`

Returns account info and current balance.

Example:

```json
{
  "id": "acc-1",
  "name": "Checking",
  "startingBalance": 2500,
  "currentBalance": 3313.37
}
```

---

`GET /api/transactions`

Optional query parameters:

- `from` (YYYY-MM-DD)
- `to` (YYYY-MM-DD)
- `category` (string)

Example:

`/api/transactions?from=2025-07-01&to=2025-07-31&category=Food`

Response:

```json
[
  {
    "id": "t1",
    "date": "2025-07-28",
    "description": "Groceries",
    "amount": -82.13,
    "category": "Food",
    "balanceAfter": 2417.87
  }
]
```

---

## Frontend UI

- Header shows account name and current balance.
- Table lists transactions with columns:
- Date
- Description
- Amount (green for credit, red for debit)
- Category (styled pill)
- Balance after transaction
- Filters above the table:
- Date range (from / to)
- Category dropdown

---

### Development Notes

- Backend written in TypeScript, using ts-node-dev for hot reload.
- Frontend bootstrapped with Vite, styled with Tailwind.
- Commit history shows incremental development steps (API first, then UI).
- Data is mock JSON in memory for simplicity.
- Balance-after logic is computed server-side to ensure a single source of truth.
