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
console.log('sw ok');
