"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ToastItem, type Toast } from "./Toast";

interface ToastContextType {
  showToast: (message: string, type?: Toast["type"], duration?: number) => string;
  dismissToast: (id: string) => void;
  dismissToastByMessage: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: Toast["type"] = "info", duration = 5000): string => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = {
        id,
        message,
        type,
        duration, // 0 or undefined means persistent
      };

      setToasts((prev) => {
        // Check if a toast with the same message already exists
        const existingToast = prev.find((t) => t.message === message);
        if (existingToast) {
          return prev; // Don't add duplicate
        }
        return [...prev, newToast];
      });
      return id;
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const dismissToastByMessage = useCallback((message: string) => {
    setToasts((prev) => prev.filter((toast) => toast.message !== message));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast, dismissToastByMessage }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onDismiss={dismissToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

