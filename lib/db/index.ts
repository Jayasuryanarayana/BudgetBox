import type { BudgetData } from "@/lib/types";
import * as mockDb from "./mockDb";
import * as postgresDb from "./postgres";

interface BudgetRecord {
  user_id: string;
  data: BudgetData;
  last_updated: number;
}

// Use mock database by default
// To use PostgreSQL, set USE_POSTGRES=true and configure lib/db/postgres.ts
const USE_POSTGRES = process.env.USE_POSTGRES === "true";

// Export database functions
// Default to mock database, switch to PostgreSQL when configured
export const getBudgetByUserId = USE_POSTGRES
  ? postgresDb.getBudgetByUserId
  : mockDb.getBudgetByUserId;

export const upsertBudget = USE_POSTGRES
  ? postgresDb.upsertBudget
  : mockDb.upsertBudget;

