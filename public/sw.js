// Split Expense - Service Worker
const CACHE_NAME = "split-expense-v2";
const STATIC_CACHE_NAME = "split-expense-static-v2";

// Files to cache immediately (App Shell)
const STATIC_FILES = [
  "/",
  "/index.html",
  "/manifest.json",
  "/coin.svg",
  "/icons/app-icon.svg",
  "/sitemap.xml",
  "/robots.txt",
  // Add your CSS and JS files here - they'll be generated with hash names
];

// Runtime cache for dynamic content
const RUNTIME_CACHE = "split-expense-runtime-v2";

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Install event");

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching static files");
        return cache.addAll(STATIC_FILES);
      })
      .catch((error) => {
        console.error("Service Worker: Error caching static files:", error);
      })
  );

  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activate event");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== RUNTIME_CACHE
            ) {
              console.log("Service Worker: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all clients
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const requestUrl = new URL(request.url);

  // Skip cross-origin requests
  if (requestUrl.origin !== location.origin) {
    return;
  }

  // Handle different types of requests
  if (request.method === "GET") {
    event.respondWith(handleGetRequest(request));
  }
});

async function handleGetRequest(request) {
  const requestUrl = new URL(request.url);

  // For HTML pages, try cache first, then network
  if (request.headers.get("accept").includes("text/html")) {
    try {
      // Try cache first
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }

      // Try network, cache the response
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      // Fallback to offline page or cached index
      const cachedResponse = await caches.match("/");
      return (
        cachedResponse ||
        new Response("Offline - Split Expense app is not available", {
          status: 503,
          statusText: "Service Unavailable",
        })
      );
    }
  }

  // For static assets, try cache first
  if (isStaticAsset(requestUrl.pathname)) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // If not in cache, fetch and cache
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        const cache = await caches.open(STATIC_CACHE_NAME);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      console.error("Service Worker: Error fetching static asset:", error);
      throw error;
    }
  }

  // For API requests, try network first, cache as backup
  if (
    requestUrl.pathname.includes("api") ||
    requestUrl.hostname.includes("firebase")
  ) {
    try {
      const networkResponse = await fetch(request);

      // Cache successful GET requests
      if (networkResponse.ok && request.method === "GET") {
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, networkResponse.clone());
      }

      return networkResponse;
    } catch (error) {
      // For GET requests, try to serve from cache
      if (request.method === "GET") {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
      }
      throw error;
    }
  }

  // Default: just fetch
  return fetch(request);
}

function isStaticAsset(pathname) {
  return pathname.match(
    /\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/
  );
}

// Handle background sync (for offline form submissions)
self.addEventListener("sync", (event) => {
  if (event.tag === "expense-sync") {
    console.log("Service Worker: Background sync triggered");
    event.waitUntil(syncExpenses());
  }
});

async function syncExpenses() {
  // Implement background sync for offline expense submissions
  console.log("Service Worker: Syncing offline expenses...");
}

// Handle push notifications (future enhancement)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: "/icons/app-icon.svg",
      badge: "/coin.svg",
      vibrate: [100, 50, 100],
      data: data.data,
      actions: [
        {
          action: "view",
          title: "View",
          icon: "/coin.svg",
        },
        {
          action: "close",
          title: "Close",
        },
      ],
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "view") {
    event.waitUntil(clients.openWindow("/"));
  }
});
