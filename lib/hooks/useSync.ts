import { useState, useEffect, useCallback } from "react";
import { useBudgetStore } from "@/lib/store/useBudgetStore";
import type { BudgetData } from "@/lib/types";

interface SyncResponse {
  success: boolean;
  message: string;
  timestamp?: number;
  serverData?: BudgetData;
  error?: string;
}

/**
 * Hook for syncing budget data with the server
 * Handles authentication check, API calls, and store updates
 */
export function useSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get store state and actions
  const budgetData = useBudgetStore((state) => ({
    id: state.id,
    income: state.income,
    expenses: state.expenses,
    lastUpdated: state.lastUpdated,
    isSynced: state.isSynced,
  }));
  const updateBudgetData = useBudgetStore((state) => state.updateBudgetData);
  const setSyncStatus = useBudgetStore((state) => state.setSyncStatus);

  /**
   * Check if user is authenticated by checking for auth cookie
   */
  const isAuthenticated = useCallback((): boolean => {
    if (typeof document === "undefined") return false;
    
    const cookies = document.cookie.split(";");
    return cookies.some((cookie) => cookie.trim().startsWith("auth=true"));
  }, []);

  /**
   * Get userId from userEmail cookie
   * Uses the email as the userId for Supabase
   */
  const getUserId = useCallback((): string => {
    if (typeof document === "undefined") return "user-1";
    
    // Extract userEmail from cookies
    const cookies = document.cookie.split(";");
    const userEmailCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("userEmail=")
    );
    
    if (userEmailCookie) {
      const email = decodeURIComponent(
        userEmailCookie.split("=")[1]?.trim() || ""
      );
      // Use email as userId (or hash it for better security)
      return email || "user-1";
    }
    
    // Fallback to default if no email found
    return "user-1";
  }, []);

  /**
   * Sync function that sends current state to API and handles response
   */
  const sync = useCallback(async (): Promise<void> => {
    // Check if user is logged in
    if (!isAuthenticated()) {
      setError("Please log in to sync your data");
      return;
    }

    // Check if online - this is critical to prevent sync attempts when offline
    if (!navigator.onLine) {
      setError("You are currently offline. Cannot sync without internet connection.");
      // Ensure sync status is not set to true when offline
      setSyncStatus(false);
      return;
    }

    setIsSyncing(true);
    setError(null);

    try {
      const userId = getUserId();
      
      // Prepare budget data for API (exclude isSynced as it's local only)
      const payload = {
        budget: {
          id: budgetData.id,
          income: budgetData.income,
          expenses: budgetData.expenses,
          lastUpdated: budgetData.lastUpdated,
          isSynced: false, // This will be set by the API response
        },
        userId,
      };

      const response = await fetch("/api/budget/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Double-check we're still online after fetch attempt
      if (!navigator.onLine) {
        throw new Error("Connection lost during sync");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: "Unknown error",
          message: `HTTP ${response.status}`,
        }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = (await response.json()) as SyncResponse;

      // If server has newer data (server wins), update the store
      if (!data.success && data.serverData) {
        updateBudgetData(data.serverData);
        setError("Server had newer data. Your local data has been updated.");
        return;
      }

      // If sync was successful, mark as synced (only if we're still online)
      if (data.success && navigator.onLine) {
        setSyncStatus(true);
        // Update lastUpdated with server timestamp if provided
        if (data.timestamp) {
          // The timestamp is already handled by the server, but we could update it here if needed
        }
      } else {
        setSyncStatus(false);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to sync data";
      setError(errorMessage);
      // Always set to false on error - never set to synced when there's an error
      setSyncStatus(false);
      console.error("Sync error:", err);
    } finally {
      setIsSyncing(false);
    }
  }, [budgetData, isAuthenticated, getUserId, updateBudgetData, setSyncStatus]);

  /**
   * Auto-sync when coming back online (if data is unsynced)
   */
  useEffect(() => {
    const handleOnline = () => {
      // Only auto-sync if we're actually online and authenticated
      if (navigator.onLine && !budgetData.isSynced && isAuthenticated()) {
        // Small delay to ensure connection is stable
        setTimeout(() => {
          // Double-check we're still online before syncing
          if (navigator.onLine) {
            sync();
          }
        }, 1000);
      }
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budgetData.isSynced]);

  return {
    sync,
    isSyncing,
    error,
    clearError: () => setError(null),
  };
}

