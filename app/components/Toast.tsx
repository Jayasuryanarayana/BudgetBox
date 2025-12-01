"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Toast {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

export function ToastItem({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    // Only auto-dismiss if duration is set and > 0
    // duration of 0 or undefined means persistent (no auto-dismiss)
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(toast.id);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
    // If duration is 0 or undefined, toast persists until manually dismissed
  }, [toast.id, toast.duration, onDismiss]);

  const getToastStyles = () => {
    switch (toast.type) {
      case "error":
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-800",
          text: "text-red-800 dark:text-red-300",
          icon: "text-red-600 dark:text-red-400",
        };
      case "warning":
        return {
          bg: "bg-amber-50 dark:bg-amber-900/20",
          border: "border-amber-200 dark:border-amber-800",
          text: "text-amber-800 dark:text-amber-300",
          icon: "text-amber-600 dark:text-amber-400",
        };
      case "success":
        return {
          bg: "bg-green-50 dark:bg-green-900/20",
          border: "border-green-200 dark:border-green-800",
          text: "text-green-800 dark:text-green-300",
          icon: "text-green-600 dark:text-green-400",
        };
      default:
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-200 dark:border-blue-800",
          text: "text-blue-800 dark:text-blue-300",
          icon: "text-blue-600 dark:text-blue-400",
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-in slide-in-from-top-2 fade-in",
        styles.bg,
        styles.border
      )}
      role="alert"
    >
      <div className={cn("flex-shrink-0 mt-0.5", styles.icon)}>
        {toast.type === "error" && "⚠️"}
        {toast.type === "warning" && "⚠️"}
        {toast.type === "success" && "✓"}
        {toast.type === "info" && "ℹ️"}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium", styles.text)}>
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className={cn(
          "flex-shrink-0 hover:opacity-70 transition-opacity",
          styles.text
        )}
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

