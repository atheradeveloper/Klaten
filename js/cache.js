/* Service Worker Native Mandiri (Tanpa Dependensi Pihak Ke-3) */
const CACHE_NAME = 'athera-properti-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/tailwind.css',
  './css/custom.css',
  './js/app.js',
  './assets/logo.webp',
  './assets/bg-home.webp',
  './assets/graha-athera-jogonalan-tipe-30.webp',
  './assets/icon.png'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event (Stale-While-Revalidate strategy)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Abaikan kegagalan network saat offline
      });

      return cachedResponse || fetchPromise;
    })
  );
});