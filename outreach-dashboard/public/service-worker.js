const CACHE_NAME = 'customer-development-system-v18-7-36-20260720-conversion-core';
const APP_SHELL = [
  './',
  './index.html',
  './outreach-dashboard.html',
  './country-market-data.js',
  './daily-outreach-tasks.js',
  './google-lead-discovery-latest.js',
  './daily-automation-latest.js',
  './daily-automation-execution-latest.js',
  './system-visibility-latest.js',
  './github-sync/latest-status.js',
  './outreach-engine.js',
  './outreach-analytics.js',
  './customer-event-ledger.js',
  './sales-automation-core.js',
  './system-readiness.js',
  './system-readiness-latest.js',
  './autonomous-outreach-results.js',
  './verified-profile-registry.js',
  './autonomous-outreach-data.js',
  './command-center.css',
  './command-center.js',
  './enhancements.css',
  './manifest.webmanifest',
  './icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  const isLocalDashboard = ['127.0.0.1', 'localhost', '::1'].includes(requestUrl.hostname);
  if (isLocalDashboard) {
    event.respondWith(fetch(event.request, { cache: 'no-store' }));
    return;
  }
  const realtimeFiles = [
    'daily-automation-latest.js',
    'daily-automation-execution-latest.js',
    'system-visibility-latest.js',
    'github-sync/latest-status.js',
    'google-lead-discovery-latest.js',
    'autonomous-outreach-results.js',
    'autonomous-outreach-data.js',
    'command-center.js',
    'system-readiness-latest.js',
  ];
  const isRealtimeFile = realtimeFiles.some((name) => requestUrl.pathname.endsWith(`/${name}`));
  if (isRealtimeFile) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./outreach-dashboard.html')))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
