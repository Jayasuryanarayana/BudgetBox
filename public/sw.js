/* eslint-disable no-restricted-globals */

// Simple service worker for BudgetBox
// - Caches static assets and the app shell
// - Provides offline support for already visited pages

const CACHE_NAME = "budgetbox-cache-v1";

// URLs to pre-cache (app shell)
const PRECACHE_URLS = [
  "/",
  "/favicon.ico",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  // Network-first strategy for API calls (don't cache)
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // For navigation and static assets: cache-first, then network
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          // Only cache successful, basic (same-origin) responses
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === "basic"
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache).catch(() => {
                // Ignore cache put errors
              });
            });
          }

          return networkResponse;
        })
        .catch(() => {
          // If network fails and nothing in cache, let it fail silently.
          // (You could return a custom offline page here.)
          return cachedResponse || Promise.reject();
        });
    })
  );
});


