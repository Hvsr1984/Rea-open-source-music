// REA Music Service Worker v2.6.0
// High-performance PWA service worker with app shell caching, Stale-While-Revalidate API cache, and safe audio passthrough

const SHELL_CACHE_NAME = 'rea-music-shell-v2.6.0';
const API_CACHE_NAME = 'rea-music-api-v2.6.0';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/css/index.css',
  '/js/app.js',
  '/assets/logo.jpg',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/assets/icons/icon-maskable-512.png',
  '/assets/icons/apple-touch-icon.png',
  '/assets/rea-donation-qr.png'
];

// Install: Cache essential app shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS).catch((err) => {
          console.warn('[REA SW] Pre-cache partial notice:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate: Clean up old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  const allowedCaches = new Set([SHELL_CACHE_NAME, API_CACHE_NAME]);
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (!allowedCaches.has(key)) {
              console.log('[REA SW] Removing obsolete cache:', key);
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch: Safe routing strategy
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // 1. Only handle standard GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 2. CRITICAL: Never intercept or cache audio media streams, Range requests, or Saavn CDN media
  if (
    url.hostname.includes('saavncdn') ||
    url.pathname.endsWith('.mp4') ||
    url.pathname.endsWith('.m4a') ||
    url.pathname.endsWith('.mp3') ||
    url.pathname.endsWith('.aac') ||
    url.pathname.startsWith('/api/download') ||
    request.headers.get('range')
  ) {
    return; // Pass through directly to browser native streaming engine
  }

  // 3. Stale-While-Revalidate for Catalog & Recommendations API endpoints (Instant 0ms UI load)
  if (
    url.pathname.startsWith('/api/trending') ||
    url.pathname.startsWith('/api/explore') ||
    url.pathname.startsWith('/api/recommendations') ||
    url.pathname.startsWith('/api/song') ||
    url.pathname.startsWith('/api/album') ||
    url.pathname.startsWith('/api/artist') ||
    url.pathname.startsWith('/api/lyrics')
  ) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch((err) => {
            if (cachedResponse) return cachedResponse;
            throw err;
          });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 4. Network-first with fast timeout for Search queries (preserve real-time queries with offline backup)
  if (url.pathname.startsWith('/api/search')) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(async (cache) => {
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (_) {
          const cached = await cache.match(request);
          if (cached) return cached;
          return new Response(JSON.stringify({ results: [], artists: [], albums: [], topResult: null, offline: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
      })
    );
    return;
  }

  // 5. HTML Navigation requests: Network-first with offline fallback to cached app shell
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(SHELL_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const fallbackShell = await caches.match('/index.html') || await caches.match('/');
          if (fallbackShell) return fallbackShell;
          return new Response('<!DOCTYPE html><html><body style="background:#0a0a0e;color:#fff;font-family:sans-serif;text-align:center;padding:50px;"><h2>REA Music is offline</h2><p>Please check your connection and reload.</p></body></html>', {
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
          });
        })
    );
    return;
  }

  // 6. Static app shell resources (CSS, JS, Webmanifest, Icons, Images): Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseClone = networkResponse.clone();
            caches.open(SHELL_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// Skip waiting message listener
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
