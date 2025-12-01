import type { BudgetData } from "@/lib/types";

interface BudgetRecord {
  user_id: string;
  data: BudgetData;
  last_updated: number;
}

// Mock in-memory database
// In production, replace this with actual PostgreSQL queries
const mockDatabase = new Map<string, BudgetRecord>();

export async function getBudgetByUserId(
  userId: string
): Promise<BudgetRecord | null> {
  // Simulate database delay
  await new Promise((resolve) => setTimeout(resolve, 50));
  
  const record = mockDatabase.get(userId);
  return record ? { ...record } : null;
}

export async function upsertBudget(
  userId: string,
  data: BudgetData,
  lastUpdated: number
): Promise<void> {
  // Simulate database delay
  await new Promise((resolve) => setTimeout(resolve, 50));
  
  mockDatabase.set(userId, {
    user_id: userId,
    data,
    last_updated: lastUpdated,
  });
}

// For development: clear all data
export function clearMockDatabase(): void {
  mockDatabase.clear();
}

