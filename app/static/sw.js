// =========================================
// ✅ Service Worker - Offline Caching Implementation
// =========================================

// Cache Setup - Define cache name and static assets
const CACHE_NAME = 'kusse-tech-studio-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/static/dist/css/main.css',
  '/static/dist/js/main.js',
  '/static/dist/js/main-legacy.js',
  '/static/dist/js/polyfills-legacy.js',
  '/static/images/ksb-logo.png',
  '/offline.html',
  '/projects',
  '/contact',
  '/about',
  '/static/manifest.json'
];

// Install Event - Cache core assets on install
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      console.log('Service Worker: Installation complete');
      return self.skipWaiting();
    }).catch((error) => {
      console.error('Service Worker: Installation failed', error);
    })
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', name);
            return caches.delete(name);
          }
        })
      )
    ).then(() => {
      console.log('Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch Event - Serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip external URLs and chrome extensions
  if (!event.request.url.startsWith(self.location.origin)) return;
  if (event.request.url.includes('chrome-extension://')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if found
      if (cachedResponse) {
        // Update cache in background for next time
        fetch(event.request).then((response) => {
          if (response.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, response.clone());
            });
          }
        }).catch(() => {
          // Network failed, but we have cached version
          console.log('Service Worker: Network failed, serving cached version');
        });
        
        return cachedResponse;
      }

      // Try network first for uncached requests
      return fetch(event.request).then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Network failed and no cache - serve offline page for navigation
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html').then((offlinePage) => {
            return offlinePage || new Response('Offline - Please check your connection', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'text/html' }
            });
          });
        }
        
        // For other requests, just fail
        throw new Error('Network request failed and no cache available');
      });
    })
  );
});

// Enhanced Features

// Background sync for analytics and form submissions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);

  if (event.tag === 'analytics-sync') {
    event.waitUntil(sendQueuedAnalytics());
  }

  if (event.tag === 'form-submission') {
    event.waitUntil(sendQueuedFormSubmissions());
  }
});

// Push notifications support
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');

  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'New update available',
    icon: '/static/images/icons/icon-192x192.png',
    badge: '/static/images/icons/icon-72x72.png',
    data: data.data || {},
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/static/images/icons/view-action.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    requireInteraction: true,
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'KusseTechStudio',
      options
    )
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event.action);

  event.notification.close();

  if (event.action === 'view') {
    const urlToOpen = event.notification.data.url || '/';
    event.waitUntil(
      clients.matchAll().then((windowClients) => {
        // Check if app is already open
        for (let client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window if not already open
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

// Periodic background sync for content updates
self.addEventListener('periodicsync', (event) => {
  console.log('Service Worker: Periodic sync', event.tag);

  if (event.tag === 'content-update') {
    event.waitUntil(updateContent());
  }
});

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

// Helper functions
async function sendQueuedAnalytics() {
  try {
    const cache = await caches.open('analytics-queue');
    const requests = await cache.keys();

    for (const request of requests) {
      try {
        await fetch(request.clone());
        await cache.delete(request);
      } catch (error) {
        console.log('Failed to send analytics data', error);
      }
    }
  } catch (error) {
    console.error('Background analytics sync failed', error);
  }
}

async function sendQueuedFormSubmissions() {
  try {
    const cache = await caches.open('form-queue');
    const requests = await cache.keys();

    for (const request of requests) {
      try {
        const response = await fetch(request.clone());
        if (response.ok) {
          await cache.delete(request);
        }
      } catch (error) {
        console.log('Failed to send form submission', error);
      }
    }
  } catch (error) {
    console.error('Background form sync failed', error);
  }
}

async function updateContent() {
  try {
    // Update critical pages
    const pagesToUpdate = ['/', '/projects', '/contact'];
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
    console.error('Content update failed', error);
  }
}
