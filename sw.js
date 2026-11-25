// =====================================================================
//  MdP · sw.js — guarda la app en el dispositivo para usarla sin conexión.
//  Al publicar una versión nueva, cambia VERSION para que se actualice.
// =====================================================================
const VERSION = 'mdp-1.6.0';
const APP = [
  './', './index.html', './css/mdp.css', './js/app.js', './js/datos.js', './js/tablero.js', './js/biblioteca.js',
  './manifest.json', './favicon-32.png', './favicon-192.png', './apple-touch-icon.png',
];
const LIBRERIAS = [
  'https://cdn.jsdelivr.net/npm/chessground@9/assets/chessground.base.css',
  'https://cdn.jsdelivr.net/npm/chessground@9/assets/chessground.cburnett.css',
  'https://cdn.jsdelivr.net/npm/chessground@9/+esm',
  'https://cdn.jsdelivr.net/npm/chess.js@1/+esm',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm',
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await c.addAll(APP);
    await Promise.all(LIBRERIAS.map(u => c.add(u).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname.endsWith('supabase.co')) return;              // datos: siempre a la red
  if (url.hostname === 'cdn.jsdelivr.net') {                       // librerías: primero la copia guardada
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
      if (res.ok) { const copia = res.clone(); caches.open(VERSION).then(c => c.put(req, copia)); }
      return res;
    })));
    return;
  }
  if (url.origin !== location.origin) return;
  // App: se sirve la copia guardada al instante y se actualiza por detrás.
  e.respondWith((async () => {
    const c = await caches.open(VERSION);
    const guardada = await c.match(req, { ignoreSearch: true }) || (req.mode === 'navigate' ? await c.match('./index.html') : null);
    const red = fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => null);
    return guardada || (await red) || new Response('Sin conexión', { status: 503 });
  })());
});
