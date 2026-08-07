// Service Worker using Workbox (Optimized for Static GitHub Pages deployment)

importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

if (workbox) {
  // 1. Caching Styles, Scripts, and Fonts with StaleWhileRevalidate Strategy
  // Hal ini menjamin situs dimuat instan, tetapi otomatis ter-update di latar belakang jika ada revisi baru.
  workbox.routing.registerRoute(
    ({request}) => request.destination === 'style' || request.destination === 'script' || request.destination === 'font',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'athera-assets-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60, // Simpan selama 7 Hari
        }),
      ],
    })
  );

  // 2. Caching Images with CacheFirst Strategy
  // Gambar jarang berubah, sehingga CacheFirst sangat cocok untuk menghemat bandwidth.
  workbox.routing.registerRoute(
    ({request}) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'athera-image-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 40,
          maxAgeSeconds: 30 * 24 * 60 * 60, // Simpan selama 30 Hari
        }),
      ],
    })
  );
}
