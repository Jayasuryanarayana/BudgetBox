export interface BudgetData {
  id: string;
  income: number;
  expenses: {
    bills: number;
    food: number;
    transport: number;
    subscriptions: number;
    miscellaneous: number;
  };
  lastUpdated: number; // unix timestamp
  isSynced: boolean; // local only
}

