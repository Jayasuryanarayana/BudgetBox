"use client";

import { useEffect } from "react";

/**
 * Registers the service worker in supported browsers.
 * This enables offline caching of static assets and the app shell.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    // Only register in production builds
    const isProd = process.env.NODE_ENV === "production";
    if (!isProd) return;

    const registerServiceWorker = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
      } catch (error) {
        console.error("Service worker registration failed:", error);
      }
    };

    // Register after window load to avoid blocking initial render
    if (document.readyState === "complete") {
      void registerServiceWorker();
    } else {
      window.addEventListener("load", registerServiceWorker, { once: true });
    }

    return () => {
      window.removeEventListener("load", registerServiceWorker);
    };
  }, []);

  // No UI rendered
  return null;
}


