// Enhanced Service Worker for Progressive Web App
const CACHE_NAME = "kusse-tech-studio-v2";
const STATIC_CACHE_URLS = [
  "/",
  "/projects",
  "/contact",
  "/about",
  "/services",
  "/static/src/css/main.css",
  "/static/src/js/main.js",
  "/static/src/js/animations.js",
  "/static/src/js/dark-mode.js",
  "/static/src/img/logo.svg",
  "/static/src/img/favicon.ico",
  "/static/manifest.json",
];

const OFFLINE_FALLBACK_PAGE = "/offline.html";
const OFFLINE_FALLBACK_IMAGE = "/static/src/img/offline-fallback.svg";

// Install event - cache static assets and offline fallbacks
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching files");
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log("Service Worker: Skip waiting");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Service Worker: Cache failed", error);
      }),
  );
});

// Activate event - clean up old caches and take control
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Service Worker: Deleting old cache", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      }),
      // Take control of all clients
      self.clients.claim(),
    ]),
  );
});

// Fetch event - serve from cache with network fallback and offline support
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip external URLs and Chrome extensions
  if (!request.url.startsWith(self.location.origin)) return;
  if (request.url.includes("chrome-extension://")) return;

  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  try {
    // Try cache first for navigation requests
    if (request.mode === "navigate") {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        // Update cache in background
        updateCacheInBackground(request);
        return cachedResponse;
      }
    }

    // Try network first for other requests
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.status === 200) {
      const responseClone = networkResponse.clone();
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, responseClone);
    }

    return networkResponse;
  } catch (error) {
    console.log("Service Worker: Network failed, trying cache", error);

    // Try cache as fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Offline fallbacks
    if (request.mode === "navigate") {
      return (
        caches.match(OFFLINE_FALLBACK_PAGE) ||
        new Response("Offline - Please check your connection", {
          status: 503,
          statusText: "Service Unavailable",
          headers: { "Content-Type": "text/html" },
        })
      );
    }

    if (request.destination === "image") {
      return (
        caches.match(OFFLINE_FALLBACK_IMAGE) ||
        new Response("", { status: 404 })
      );
    }

    throw error;
  }
}

async function updateCacheInBackground(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse);
    }
  } catch (error) {
    console.log("Background cache update failed", error);
  }
}

// Background sync for analytics and form submissions
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync", event.tag);

  if (event.tag === "analytics-sync") {
    event.waitUntil(sendQueuedAnalytics());
  }

  if (event.tag === "form-submission") {
    event.waitUntil(sendQueuedFormSubmissions());
  }
});

// Push notifications support
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push received");

  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || "New update available",
    icon: "/static/src/img/icons/icon-192x192.png",
    badge: "/static/src/img/icons/badge-72x72.png",
    data: data.data || {},
    actions: [
      {
        action: "view",
        title: "View",
        icon: "/static/src/img/icons/view-action.png",
      },
      {
        action: "dismiss",
        title: "Dismiss",
      },
    ],
    requireInteraction: true,
    vibrate: [200, 100, 200],
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || "KusseTechStudio",
      options,
    ),
  );
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked", event.action);

  event.notification.close();

  if (event.action === "view") {
    const urlToOpen = event.notification.data.url || "/";
    event.waitUntil(
      clients.matchAll().then((windowClients) => {
        // Check if app is already open
        for (let client of windowClients) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        // Open new window if not already open
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
    );
  }
});

// Handle app install prompt
self.addEventListener("beforeinstallprompt", (event) => {
  console.log("Service Worker: Before install prompt");
  event.preventDefault();
  // Store the event for later use
  self.deferredPrompt = event;
});

// Handle app installation
self.addEventListener("appinstalled", (event) => {
  console.log("Service Worker: App installed");
  // Track installation event
  if (self.registration && self.registration.active) {
    self.registration.active.postMessage({
      type: "APP_INSTALLED",
      timestamp: Date.now(),
    });
  }
});

// Periodic background sync for content updates
self.addEventListener("periodicsync", (event) => {
  console.log("Service Worker: Periodic sync", event.tag);

  if (event.tag === "content-update") {
    event.waitUntil(updateContent());
  }
});

// Helper functions
async function sendQueuedAnalytics() {
  try {
    const cache = await caches.open("analytics-queue");
    const requests = await cache.keys();

    for (const request of requests) {
      try {
        await fetch(request.clone());
        await cache.delete(request);
      } catch (error) {
        console.log("Failed to send analytics data", error);
      }
    }
  } catch (error) {
    console.error("Background analytics sync failed", error);
  }
}

async function sendQueuedFormSubmissions() {
  try {
    const cache = await caches.open("form-queue");
    const requests = await cache.keys();

    for (const request of requests) {
      try {
        const response = await fetch(request.clone());
        if (response.ok) {
          await cache.delete(request);
        }
      } catch (error) {
        console.log("Failed to send form submission", error);
      }
    }
  } catch (error) {
    console.error("Background form sync failed", error);
  }
}

async function updateContent() {
  try {
    // Update critical pages
    const pagesToUpdate = ["/", "/projects", "/contact"];
    const cache = await caches.open(CACHE_NAME);

    for (const page of pagesToUpdate) {
      try {
        const response = await fetch(page);
        if (response.ok) {
          await cache.put(page, response);
        }
      } catch (error) {
        console.log(`Failed to update ${page}`, error);
      }
    }
  } catch (error) {
    console.error("Content update failed", error);
  }
}

// Message handler for communication with main thread
self.addEventListener("message", (event) => {
  console.log("Service Worker: Message received", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "CACHE_URLS") {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      }),
    );
  }
});
