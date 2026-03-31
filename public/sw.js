// Estratégia nativa de cache e network fallback
const CACHE_NAME = "eduformacao-cache-v1";
const STATIC_ASSETS = [
   "/", "/login", "/cadastro", "/manifest.json"
];

self.addEventListener("install", (event) => {
   event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
         return cache.addAll(STATIC_ASSETS);
      })
   );
   self.skipWaiting();
});

self.addEventListener("activate", (event) => {
   event.waitUntil(
      caches.keys().then((cacheNames) => {
         return Promise.all(
            cacheNames.map((cacheName) => {
               if (cacheName !== CACHE_NAME) {
                  return caches.delete(cacheName);
               }
            })
         );
      })
   );
});

// Network First, Cache Fallback para as chamadas de página Next.js
self.addEventListener("fetch", (event) => {
   event.respondWith(
      fetch(event.request).catch(async () => {
         const cache = await caches.open(CACHE_NAME);
         return await cache.match(event.request);
      })
   );
});
