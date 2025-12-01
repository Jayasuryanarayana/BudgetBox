"use client";

import { useRouter } from "next/navigation";
import { LogIn, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication status and get user email
    const checkAuth = () => {
      if (typeof document === "undefined") return;
      const cookies = document.cookie.split(";");
      const hasAuth = cookies.some((cookie) =>
        cookie.trim().startsWith("auth=true")
      );
      setIsAuthenticated(hasAuth);

      // Get user email from cookie
      if (hasAuth) {
        const emailCookie = cookies.find((cookie) =>
          cookie.trim().startsWith("userEmail=")
        );
        if (emailCookie) {
          const email = decodeURIComponent(
            emailCookie.split("=")[1]?.trim() || ""
          );
          setUserEmail(email);
        }
      } else {
        setUserEmail(null);
      }
    };

    checkAuth();
    // Check periodically in case cookie changes
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    document.cookie = "auth=; path=/; max-age=0";
    document.cookie = "userEmail=; path=/; max-age=0";
    setIsAuthenticated(false);
    setUserEmail(null);
    router.push("/");
  };

  const getInitials = (email: string): string => {
    const parts = email.split("@")[0]?.split(".") || [];
    if (parts.length >= 2) {
      return (parts[0]?.[0] || "").toUpperCase() + (parts[1]?.[0] || "").toUpperCase();
    }
    return email[0]?.toUpperCase() || "U";
  };

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              BudgetBox
            </h1>
          </div>
          <nav>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* User Account Info */}
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-xs font-semibold">
                    {userEmail ? getInitials(userEmail) : <User className="w-4 h-4" />}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {userEmail || "User"}
                    </p>
                  </div>
                </div>
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push("/signup")}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

