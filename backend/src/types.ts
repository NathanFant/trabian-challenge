export type AccountDTO = {
  id: string; // 8-digit string, ex: "29387438"
  name: string;
  startingBalance: number;
  currentBalance?: number;
};

export type TransactionDTO = {
  id: string;
  accountId: string; // should correspond with AccountDTO.id
  date: string;
  description: string;
  amount: number; // +income / -expense
  category: string; // should be one of the predefined categories
  balanceAfter?: number;
};
