import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";
import type { BudgetData } from "@/lib/types";

// Create a storage adapter for idb-keyval that matches Zustand's persist storage interface
const idbStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await get<string>(name);
      return value ?? null;
    } catch (error) {
      console.error("Error reading from IndexedDB:", error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await set(name, value);
    } catch (error) {
      console.error("Error writing to IndexedDB:", error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await del(name);
    } catch (error) {
      console.error("Error removing from IndexedDB:", error);
    }
  },
} as const;

interface BudgetStore extends BudgetData {
  hasEverSynced: boolean; // Track if data has ever been synced
  setIncome: (amount: number) => void;
  setExpense: (category: keyof BudgetData["expenses"], amount: number) => void;
  setSyncStatus: (status: boolean) => void;
  updateBudgetData: (data: BudgetData) => void;
}

const defaultBudgetData: BudgetData = {
  id: "budget-1",
  income: 0,
  expenses: {
    bills: 0,
    food: 0,
    transport: 0,
    subscriptions: 0,
    miscellaneous: 0,
  },
  lastUpdated: Date.now(),
  isSynced: false,
};

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      ...defaultBudgetData,
      hasEverSynced: false,
      setIncome: (amount: number) =>
        set((state) => ({
          income: amount,
          lastUpdated: Date.now(),
          isSynced: false,
        })),
      setExpense: (category: keyof BudgetData["expenses"], amount: number) =>
        set((state) => ({
          expenses: {
            ...state.expenses,
            [category]: amount,
          },
          lastUpdated: Date.now(),
          isSynced: false,
        })),
      setSyncStatus: (status: boolean) =>
        set((state) => ({
          isSynced: status,
          hasEverSynced: status ? true : state.hasEverSynced, // Mark as synced if status is true
        })),
      updateBudgetData: (data: BudgetData) =>
        set(() => ({
          ...data,
          isSynced: true,
          hasEverSynced: true,
        })),
    }),
    {
      name: "budgetbox-storage",
      storage: createJSONStorage(() => idbStorage),
      // Ensure hasEverSynced is properly initialized when loading from storage
      partialize: (state) => ({
        ...state,
        hasEverSynced: state.hasEverSynced ?? false,
      }),
      // Migration: ensure hasEverSynced exists in persisted data
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<BudgetStore> | undefined;
        const merged = {
          ...currentState,
          ...persisted,
        } as BudgetStore;
        // Ensure hasEverSynced is always defined
        if (typeof merged.hasEverSynced !== "boolean") {
          merged.hasEverSynced = false;
        }
        return merged;
      },
    }
  )
);

