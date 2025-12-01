"use client";

import { useState, useEffect } from "react";
import { useBudgetStore } from "@/lib/store/useBudgetStore";
import { useSync } from "@/lib/hooks/useSync";
import { RefreshCw, Wifi, WifiOff, AlertCircle, HardDrive, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type SyncStatusType = "offline" | "local-only" | "sync-pending" | "synced";

export default function SyncStatus() {
  const isSynced = useBudgetStore((state) => state.isSynced);
  const hasEverSynced = useBudgetStore((state) => state.hasEverSynced);
  const { sync, isSyncing, error, clearError } = useSync();
  const [isOnline, setIsOnline] = useState(true);

  // Monitor online/offline status (notifications handled by useOfflineDetection)
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Set initial state
    setIsOnline(navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleSync = () => {
    if (!isOnline) return;
    clearError(); // Clear any previous errors
    sync();
  };

  const getSyncStatus = (): SyncStatusType => {
    // Always check online status first - offline takes priority
    // Double-check with navigator.onLine as a fallback
    const actuallyOnline = isOnline && navigator.onLine;
    
    if (!actuallyOnline) {
      return "offline";
    }
    
    // Only show synced status if we're actually online
    if (isSynced && actuallyOnline) {
      return "synced";
    }
    
    if (!hasEverSynced) {
      return "local-only";
    }
    
    return "sync-pending";
  };

  const getStatusInfo = () => {
    const status = getSyncStatus();

    switch (status) {
      case "offline":
        return {
          text: "Offline",
          description: "No internet connection",
          icon: <WifiOff className="w-4 h-4" />,
          color: "text-red-600 dark:text-red-400",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-800",
          dot: "🔴",
        };

      case "local-only":
        return {
          text: "Local Only",
          description: "Saved locally, never synced",
          icon: <HardDrive className="w-4 h-4" />,
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
          borderColor: "border-blue-200 dark:border-blue-800",
          dot: "🔵",
        };

      case "sync-pending":
        return {
          text: "Sync Pending",
          description: "Edits waiting for network",
          icon: <Clock className="w-4 h-4" />,
          color: "text-amber-600 dark:text-amber-400",
          bgColor: "bg-amber-50 dark:bg-amber-900/20",
          borderColor: "border-amber-200 dark:border-amber-800",
          dot: "🟡",
        };

      case "synced":
        return {
          text: "Synced",
          description: "Both server & local are aligned",
          icon: <Wifi className="w-4 h-4" />,
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-200 dark:border-green-800",
          dot: "🟢",
        };
    }
  };

  const status = getStatusInfo();

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "flex items-center justify-between gap-4 p-4 rounded-lg border-2",
          status.bgColor,
          status.borderColor
        )}
      >
        <div className="flex items-center gap-3 flex-1">
          <span className="text-xl">{status.dot}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn("text-sm font-semibold", status.color)}>
                {status.text}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {status.description}
            </p>
          </div>
          <div className="text-gray-400 dark:text-gray-500">
            {status.icon}
          </div>
        </div>

        <button
          onClick={handleSync}
          disabled={!isOnline || isSyncing}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 whitespace-nowrap",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            isOnline && !isSyncing
              ? "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm"
              : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          )}
        >
          <RefreshCw
            className={cn(
              "w-4 h-4",
              isSyncing && "animate-spin"
            )}
          />
          {isSyncing ? "Syncing..." : "Sync Now"}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

