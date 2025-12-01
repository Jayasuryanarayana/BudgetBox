"use client";

import { useMemo } from "react";
import { useBudgetStore } from "@/lib/store/useBudgetStore";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { AlertTriangle, TrendingDown, CreditCard, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

interface Warning {
  id: string;
  message: string;
  icon: React.ReactNode;
}

const COLORS = {
  bills: "#3b82f6", // blue
  food: "#10b981", // green
  transport: "#f59e0b", // amber
  subscriptions: "#8b5cf6", // purple
  miscellaneous: "#ef4444", // red
};

const CATEGORY_LABELS: Record<string, string> = {
  bills: "Bills",
  food: "Food",
  transport: "Transport",
  subscriptions: "Subscriptions",
  miscellaneous: "Miscellaneous",
};

export default function Dashboard() {
  const income = useBudgetStore((state) => state.income);
  const expenses = useBudgetStore((state) => state.expenses);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const metrics = useMemo(() => {
    const totalExpenses =
      expenses.bills +
      expenses.food +
      expenses.transport +
      expenses.subscriptions +
      expenses.miscellaneous;

    const balance = income - totalExpenses;
    const burnRate = income > 0 ? (totalExpenses / income) * 100 : 0;
    const savingsPotential = balance * 12;

    return {
      totalExpenses,
      balance,
      burnRate,
      savingsPotential,
    };
  }, [income, expenses]);

  const chartData = useMemo(() => {
    return Object.entries(expenses)
      .filter(([, value]) => value > 0)
      .map(([category, value]) => ({
        name: CATEGORY_LABELS[category] || category,
        value: value,
        category,
      }));
  }, [expenses]);

  const warnings = useMemo((): Warning[] => {
    const warningsList: Warning[] = [];
    const formatCurrencyLocal = (value: number): string => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    };

    if (income > 0) {
      const totalExpenses = metrics.totalExpenses;
      const burnRate = metrics.burnRate;

      // Food warning: > 40% of income
      const foodPercentage = (expenses.food / income) * 100;
      if (foodPercentage > 40) {
        warningsList.push({
          id: "food-warning",
          message: `Food expenses (${foodPercentage.toFixed(1)}%) exceed 40% of income. Consider reducing food spending.`,
          icon: <UtensilsCrossed className="w-5 h-5" />,
        });
      }

      // Subscriptions warning: > 30% of income
      const subscriptionsPercentage = (expenses.subscriptions / income) * 100;
      if (subscriptionsPercentage > 30) {
        warningsList.push({
          id: "subscriptions-warning",
          message: `Subscriptions (${subscriptionsPercentage.toFixed(1)}%) exceed 30% of income. Review your subscriptions.`,
          icon: <CreditCard className="w-5 h-5" />,
        });
      }

      // High burn rate warning: > 90% of income
      if (burnRate > 90) {
        warningsList.push({
          id: "high-burn-rate",
          message: `Your burn rate is ${burnRate.toFixed(1)}%. You're spending ${burnRate.toFixed(1)}% of your income. Consider reducing expenses.`,
          icon: <TrendingDown className="w-5 h-5" />,
        });
      }

      // Bills warning: > 50% of income
      const billsPercentage = (expenses.bills / income) * 100;
      if (billsPercentage > 50) {
        warningsList.push({
          id: "bills-warning",
          message: `Bills (${billsPercentage.toFixed(1)}%) exceed 50% of income. This is unusually high.`,
          icon: <AlertTriangle className="w-5 h-5" />,
        });
      }
    } else if (income === 0 && metrics.totalExpenses > 0) {
      // No income but has expenses
      warningsList.push({
        id: "no-income",
        message: `You have expenses (${formatCurrencyLocal(metrics.totalExpenses)}) but no income recorded. Please add your income.`,
        icon: <AlertTriangle className="w-5 h-5" />,
      });
    }

    // Negative balance warning
    if (metrics.balance < 0) {
      warningsList.push({
        id: "negative-balance",
        message: `Your balance is negative (${formatCurrencyLocal(Math.abs(metrics.balance))}). You're spending more than you earn.`,
        icon: <TrendingDown className="w-5 h-5" />,
      });
    }

    return warningsList;
  }, [income, expenses, metrics]);

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Dashboard
      </h2>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Expenses"
          value={formatCurrency(metrics.totalExpenses)}
          className="border-blue-200 dark:border-blue-800"
        />
        <MetricCard
          label="Balance"
          value={formatCurrency(metrics.balance)}
          className={cn(
            "border",
            metrics.balance >= 0
              ? "border-green-200 dark:border-green-800"
              : "border-red-200 dark:border-red-800"
          )}
        />
        <MetricCard
          label="Burn Rate"
          value={formatPercentage(metrics.burnRate)}
          className="border-amber-200 dark:border-amber-800"
        />
        <MetricCard
          label="Annual Savings Potential"
          value={formatCurrency(metrics.savingsPotential)}
          className={cn(
            "border",
            metrics.savingsPotential >= 0
              ? "border-green-200 dark:border-green-800"
              : "border-red-200 dark:border-red-800"
          )}
        />
      </div>

      {/* Warnings / Anomalies Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Budget Anomalies & Warnings
          </h3>
          {warnings.length > 0 && (
            <span className="px-2 py-1 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 rounded-full">
              {warnings.length} {warnings.length === 1 ? "Issue" : "Issues"}
            </span>
          )}
        </div>
        {warnings.length > 0 ? (
          <div className="space-y-3">
            {warnings.map((warning) => (
              <div
                key={warning.id}
                className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg shadow-sm animate-in fade-in slide-in-from-top-2"
              >
                <div className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0">
                  {warning.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <span className="font-semibold text-red-900 dark:text-red-200">
                      Warning
                    </span>
                  </div>
                  <p className="text-sm text-red-800 dark:text-red-300 leading-relaxed">
                    {warning.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300 mb-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">All Good!</span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400">
              No budget anomalies detected. Your spending looks healthy.
            </p>
          </div>
        )}
      </div>

      {/* Pie Chart */}
      {chartData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Expense Breakdown
          </h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.category as keyof typeof COLORS]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend
                  formatter={(value) => {
                    const entry = chartData.find((d) => d.name === value);
                    return entry ? `${value}: ${formatCurrency(entry.value)}` : value;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {chartData.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No expense data to display. Add expenses to see the breakdown chart.
          </p>
        </div>
      )}
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  className?: string;
}

function MetricCard({ label, value, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm",
        className
      )}
    >
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {value}
      </p>
    </div>
  );
}

