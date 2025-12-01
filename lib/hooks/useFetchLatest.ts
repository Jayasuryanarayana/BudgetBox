import { useCallback } from "react";
import { useBudgetStore } from "@/lib/store/useBudgetStore";
import type { BudgetData } from "@/lib/types";

interface FetchLatestResponse {
  success: boolean;
  budget?: BudgetData;
  timestamp?: number;
  error?: string;
  message?: string;
}

/**
 * Hook for fetching the latest budget from server
 */
export function useFetchLatest() {
  const updateBudgetData = useBudgetStore((state) => state.updateBudgetData);

  /**
   * Get userId from cookie or use a default
   */
  const getUserId = useCallback((): string => {
    // For now, use a default userId
    // In production, extract from auth token/cookie
    return "user-1";
  }, []);

  /**
   * Fetch latest budget from server
   */
  const fetchLatest = useCallback(async (): Promise<BudgetData | null> => {
    // Check if online
    if (!navigator.onLine) {
      throw new Error("You are currently offline");
    }

    try {
      const userId = getUserId();
      const response = await fetch(`/api/budget/latest?userId=${encodeURIComponent(userId)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: "Unknown error",
          message: `HTTP ${response.status}`,
        }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = (await response.json()) as FetchLatestResponse;

      if (data.success && data.budget) {
        // Update store with server data
        updateBudgetData(data.budget);
        return data.budget;
      }

      throw new Error(data.message || "Failed to fetch latest budget");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch latest budget";
      console.error("Fetch latest error:", err);
      throw new Error(errorMessage);
    }
  }, [getUserId, updateBudgetData]);

  return {
    fetchLatest,
  };
}

