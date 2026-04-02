// Time Leonel - Service Worker
// ⚠️ INCREMENTAR ESTA VERSÃO a cada deploy para forçar atualização no celular
const CACHE_VERSION = 'time-leonel-v12';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// INSTALL — cacheia arquivos e ativa imediatamente
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// ACTIVATE — limpa TODOS os caches antigos e toma controle imediatamente
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_VERSION).map(k => {
          console.log('[SW] Deletando cache antigo:', k);
          return caches.delete(k);
        })
      )
    ).then(() => {
      console.log('[SW] Ativado:', CACHE_VERSION);
      return self.clients.claim();
    })
  );
});

// FETCH — Network first para index.html, cache first para assets
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Requisições externas (Firebase, fontes Google) — rede diretamente
  if (url.origin !== self.location.origin) return;

  // index.html — sempre rede primeiro para pegar versão mais recente
  if (url.pathname === '/' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then(c => c.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // Demais assets — cache first com atualização em background
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then(c => c.put(event.request, copy));
        }
        return response;
      });
      return cached || fetchPromise;
    })
  );
});

// Permite forçar atualização via postMessage
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
