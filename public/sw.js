self.addEventListener('install', (event) => {
  console.log('EduFormação SW installed.');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('EduFormação SW activated.');
});

self.addEventListener('fetch', (event) => {
  // Pass-through strategy for now (Network only)
  event.respondWith(fetch(event.request));
});
