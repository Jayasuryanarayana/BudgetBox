import { useEffect, useRef } from "react";
import { useToast } from "@/app/components/ToastContainer";

const OFFLINE_MESSAGE = "You're currently offline. Changes will sync when connection is restored.";

/**
 * Hook to detect offline/online status and show notifications
 * This can be used anywhere in the app to get offline notifications
 */
export function useOfflineDetection() {
  const { showToast, dismissToastByMessage } = useToast();
  const previousOnlineStatus = useRef<boolean | null>(null);
  const offlineToastId = useRef<string | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      // Dismiss offline notification when coming back online
      if (previousOnlineStatus.current === false) {
        dismissToastByMessage(OFFLINE_MESSAGE);
        offlineToastId.current = null;
        
        // Show success notification
        showToast("Connection restored. You're back online!", "success", 4000);
      }
      previousOnlineStatus.current = true;
    };

    const handleOffline = () => {
      // Show persistent offline notification (duration = 0 means persistent)
      if (!offlineToastId.current) {
        const id = showToast(
          OFFLINE_MESSAGE,
          "warning",
          0 // 0 = persistent, won't auto-dismiss
        );
        offlineToastId.current = id;
      }
      previousOnlineStatus.current = false;
    };

    // Set initial state
    const initialOnline = navigator.onLine;
    previousOnlineStatus.current = initialOnline;

    // Show offline notification if already offline on load
    if (!initialOnline) {
      const id = showToast(
        OFFLINE_MESSAGE,
        "warning",
        0 // Persistent
      );
      offlineToastId.current = id;
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [showToast, dismissToastByMessage]);
}

