// Time Leonel - Service Worker
// Versão do cache — incremente ao fazer atualizações
const CACHE_NAME = 'time-leonel-v3';

// Arquivos que serão cacheados para funcionar offline
const ASSETS = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// INSTALL: cacheia os arquivos essenciais
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// ACTIVATE: limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// FETCH: serve do cache, fallback para rede, fallback para index.html
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cacheia novas requisições de recursos estáticos
        if (response && response.status === 200 && event.request.method === 'GET') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => {
        // Offline fallback — retorna o app principal
        return caches.match('./index.html');
      });
    })
  );
});
