// Runs sw.js in a stub service-worker scope: activate must delete only older pd-mediapipe-* caches.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const names = ['pd-mediapipe-0.10.20-v1', 'pd-mediapipe-0.10.21-v0', 'pd-mediapipe-0.10.21-v1', 'other-site-cache', 'workbox-precache-v2'];
const store = new Set(names), deleted = [], handlers = {};
let claimed = false;
const self = {
  addEventListener: (t, f) => { handlers[t] = f; },
  skipWaiting() {}, clients: { claim: async () => { claimed = true; } },
};
const caches = { keys: async () => [...store], delete: async (k) => { deleted.push(k); return store.delete(k); } };
vm.runInNewContext(readFileSync(new URL('../sw.js', import.meta.url), 'utf8'), { self, caches, fetch: async () => { throw new Error('no network'); } });

let p; handlers.activate({ waitUntil: (x) => { p = x; } });
await p;
assert.deepEqual(deleted.sort(), ['pd-mediapipe-0.10.20-v1', 'pd-mediapipe-0.10.21-v0']);
assert.deepEqual([...store].sort(), ['other-site-cache', 'pd-mediapipe-0.10.21-v1', 'workbox-precache-v2']);
assert.ok(claimed);

// fetch: non-matching URLs must not be intercepted
let responded = false;
handlers.fetch({ request: { method: 'GET', url: 'https://example.com/x.js' }, respondWith: () => { responded = true; } });
assert.equal(responded, false);

// fetch: MediaPipe wasm + model URLs must be cached in the current cache, and served from it when offline
const cstore = new Map(), opened = [];
caches.open = async (n) => { opened.push(n); return { match: async (r) => cstore.get(r.url), put: async (r, v) => { cstore.set(r.url, v); } }; };
let net = 0;
const ctx2 = { self, caches, fetch: async () => { net++; return { ok: true, clone() { return this; } }; } };
vm.runInNewContext(readFileSync(new URL('../sw.js', import.meta.url), 'utf8'), ctx2);
for (const url of ['https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/wasm/x.wasm', 'https://storage.googleapis.com/mediapipe-models/face_landmarker/f.task']) {
  for (let i = 0; i < 2; i++) { let r; handlers.fetch({ request: { method: 'GET', url }, respondWith: (x) => { r = x; } }); assert.ok(r, 'not intercepted: ' + url); await r; }
}
assert.equal(net, 2, 'second load must come from cache');
assert.ok(opened.every((n) => n === 'pd-mediapipe-0.10.21-v1'));
console.log('sw ok');
