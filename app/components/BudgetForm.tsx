"use client";

import { useState, useEffect } from "react";
import { useBudgetStore } from "@/lib/store/useBudgetStore";
import type { BudgetData } from "@/lib/types";
import {
  DollarSign,
  Receipt,
  UtensilsCrossed,
  Car,
  CreditCard,
  ShoppingBag,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldConfig {
  label: string;
  category: "income" | keyof BudgetData["expenses"];
  icon: React.ReactNode;
  placeholder: string;
}

const fieldConfigs: FieldConfig[] = [
  {
    label: "Income",
    category: "income",
    icon: <DollarSign className="w-5 h-5" />,
    placeholder: "0.00",
  },
  {
    label: "Monthly Bills",
    category: "bills",
    icon: <Receipt className="w-5 h-5" />,
    placeholder: "0.00",
  },
  {
    label: "Food",
    category: "food",
    icon: <UtensilsCrossed className="w-5 h-5" />,
    placeholder: "0.00",
  },
  {
    label: "Transport",
    category: "transport",
    icon: <Car className="w-5 h-5" />,
    placeholder: "0.00",
  },
  {
    label: "Subscriptions",
    category: "subscriptions",
    icon: <CreditCard className="w-5 h-5" />,
    placeholder: "0.00",
  },
  {
    label: "Miscellaneous",
    category: "miscellaneous",
    icon: <ShoppingBag className="w-5 h-5" />,
    placeholder: "0.00",
  },
];

export default function BudgetForm() {
  const income = useBudgetStore((state) => state.income);
  const expenses = useBudgetStore((state) => state.expenses);
  const setIncome = useBudgetStore((state) => state.setIncome);
  const setExpense = useBudgetStore((state) => state.setExpense);

  // Local state for inputs to avoid re-renders on every keystroke
  const [localValues, setLocalValues] = useState({
    income: income.toString(),
    bills: expenses.bills.toString(),
    food: expenses.food.toString(),
    transport: expenses.transport.toString(),
    subscriptions: expenses.subscriptions.toString(),
    miscellaneous: expenses.miscellaneous.toString(),
  });

  // Track which field was just saved
  const [savedField, setSavedField] = useState<string | null>(null);

  // Sync local state when store updates (e.g., on initial load)
  useEffect(() => {
    setLocalValues({
      income: income.toString(),
      bills: expenses.bills.toString(),
      food: expenses.food.toString(),
      transport: expenses.transport.toString(),
      subscriptions: expenses.subscriptions.toString(),
      miscellaneous: expenses.miscellaneous.toString(),
    });
  }, [income, expenses]);

  const handleSave = (
    category: "income" | keyof BudgetData["expenses"],
    value: string
  ) => {
    const numValue = parseFloat(value) || 0;
    
    if (category === "income") {
      setIncome(numValue);
    } else {
      setExpense(category, numValue);
    }

    // Show save indicator
    setSavedField(category);
    setTimeout(() => setSavedField(null), 1500);
  };

  const handleBlur = (
    category: "income" | keyof BudgetData["expenses"],
    value: string
  ) => {
    handleSave(category, value);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    category: "income" | keyof BudgetData["expenses"],
    value: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Blur the input to trigger save
      e.currentTarget.blur();
      handleSave(category, value);
    }
  };

  const handleChange = (
    category: "income" | keyof BudgetData["expenses"],
    value: string
  ) => {
    // Only allow numbers and decimal point
    const sanitized = value.replace(/[^0-9.]/g, "");
    // Prevent multiple decimal points
    const parts = sanitized.split(".");
    const finalValue =
      parts.length > 2
        ? parts[0] + "." + parts.slice(1).join("")
        : sanitized;

    setLocalValues((prev) => ({
      ...prev,
      [category]: finalValue,
    }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Budget Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fieldConfigs.map((field) => {
          const isIncome = field.category === "income";
          const value =
            isIncome
              ? localValues.income
              : localValues[field.category as keyof typeof localValues];
          const isSaved = savedField === field.category;

          return (
            <div
              key={field.category}
              className="relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <label
                htmlFor={field.category}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                <span className="text-gray-500 dark:text-gray-400">
                  {field.icon}
                </span>
                {field.label}
              </label>
              <div className="relative">
                <input
                  id={field.category}
                  type="text"
                  inputMode="decimal"
                  value={value}
                  onChange={(e) => handleChange(field.category, e.target.value)}
                  onBlur={(e) => handleBlur(field.category, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, field.category, value)}
                  placeholder={field.placeholder}
                  className={cn(
                    "w-full px-3 py-2 pr-10 text-lg font-semibold rounded-md border border-gray-300 dark:border-gray-600",
                    "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    "transition-all duration-200"
                  )}
                />
                <div
                  className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-300",
                    isSaved
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-0"
                  )}
                >
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

