importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

workbox.routing.registerRoute(
  ({request}) => request.destination === 'image' || request.destination === 'style' || request.destination === 'script',
  new workbox.strategies.CacheFirst({
    cacheName: 'athera-assets-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Hari (Mempuaskan PageSpeed)
      }),
    ],
  })
);