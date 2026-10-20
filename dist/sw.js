// REA Music Service Worker v2.5.2
// Provides reliable PWA installability, app shell offline fallback, and safe audio passthrough

const CACHE_NAME = 'rea-music-shell-v2.5.2';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/assets/logo.jpg',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/assets/icons/icon-maskable-512.png',
  '/assets/icons/apple-touch-icon.png'
];

// Install: Cache essential app shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS).catch((err) => {
          console.warn('[REA SW] Pre-cache partial warning:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate: Clean up old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
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
    request.headers.get('range')
  ) {
    return; // Pass through to browser native networking
  }

  // 3. Dynamic JioSaavn API requests: Always network-only to preserve real-time recommendations & search
  if (url.pathname.startsWith('/api')) {
    return; // Let browser fetch directly from server without caching
  }

  // 4. HTML Navigation requests: Network-first with offline fallback to cached app shell
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
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

  // 5. Static app shell resources (CSS, JS, Webmanifest, Icons, Images): Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
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
