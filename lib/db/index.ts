import type { BudgetData } from "@/lib/types";
import * as mockDb from "./mockDb";
import * as postgresDb from "./postgres";
import * as supabaseDb from "./supabase";

interface BudgetRecord {
  user_id: string;
  data: BudgetData;
  last_updated: number;
}

// Database selection priority:
// 1. Supabase (if env vars are set)
// 2. PostgreSQL (if USE_POSTGRES=true)
// 3. Mock database (default for development)

const USE_SUPABASE =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  (!!process.env.SUPABASE_SERVICE_ROLE_KEY ||
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const USE_POSTGRES = process.env.USE_POSTGRES === "true" && !USE_SUPABASE;

// Export database functions
export const getBudgetByUserId = USE_SUPABASE
  ? supabaseDb.getBudgetByUserId
  : USE_POSTGRES
  ? postgresDb.getBudgetByUserId
  : mockDb.getBudgetByUserId;

export const upsertBudget = USE_SUPABASE
  ? supabaseDb.upsertBudget
  : USE_POSTGRES
  ? postgresDb.upsertBudget
  : mockDb.upsertBudget;

