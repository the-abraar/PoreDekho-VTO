// Keeps the try-on's MediaPipe files (wasm runtime, face and hair models, ~6 MB) in the browser cache after the first
// visit, so a returning shopper loads them from the phone instead of the network. Only those exact, versioned URLs are
// cached; every other request goes to the network untouched, and nothing from the camera ever passes through here.
// Bump CACHE when tryon.html moves to another MediaPipe version or model.
const CACHE = "pd-mediapipe-0.10.21-v1";
const CACHED = [/^https:\/\/cdn\.jsdelivr\.net\/npm\/@mediapipe\/tasks-vision@0\.10\.21\//, /^https:\/\/storage\.googleapis\.com\/mediapipe-models\//];

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil((async () => {
  // drop only our older versions: on a shared origin (e.g. *.github.io) other sites' caches are in the same list
  for (const k of await caches.keys()) if (k.startsWith("pd-mediapipe-") && k !== CACHE) await caches.delete(k);
  await self.clients.claim();
})()));
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || !CACHED.some((r) => r.test(req.url))) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req);
    if (hit) return hit;
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone()).catch(() => {}); // storage full or blocked: still serve the file
    return res;
  })());
});
