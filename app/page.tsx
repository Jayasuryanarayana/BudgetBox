"use client";

import BudgetForm from "./components/BudgetForm";
import Dashboard from "./components/Dashboard";
import SyncStatus from "./components/SyncStatus";
import { useOfflineDetection } from "@/lib/hooks/useOfflineDetection";

export default function Home() {
  // Global offline detection - shows notifications when app goes offline
  useOfflineDetection();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <SyncStatus />
        </div>

        <div className="space-y-8">
          <BudgetForm />
          <Dashboard />
        </div>
      </div>
    </main>
  );
}

