export type Account = {
  id: string;
  name: string;
  startingBalance: number;
  currentBalance?: number;
};
export type Transaction = {
  id: string;
  accountId: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  balanceAfter: number;
};
export type Filters = { from?: string; to?: string; category?: string };
