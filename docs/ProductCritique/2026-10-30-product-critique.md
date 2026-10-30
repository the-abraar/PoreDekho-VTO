# PoreDekho VTO
Verdict: A small, honest static try-on page whose on-device privacy claim holds in the code, but it has never been seen by a live person, a target phone, or a single seller, and it is not hosted anywhere; it is the cheapest lab to prove or kill.  |  Call: continue (owner-only, time-boxed: host it and get 3 seller reactions within 2 weeks; if none care, kill)
Scores (0-10): product 3, code health 7, ship-ready 3
Live/users: none. `https://the-abraar.github.io/PoreDekho-VTO/` and `/tryon.html` -> 404 (no Pages configured, judge Update 11). No customer, no seller conversation, no pilot; `docs/device_matrix.md` is an empty template. Lead form on `index.html:190` is not connected ("nothing was sent").
Main branch state: only branch, 0 ahead / 0 behind origin. Last commit 2026-10-27 (placement tuning on 4 still photos). Nothing deployed.
Checks run: `bash scripts/check.sh` in the snapshot -> all 7 steps pass (inline-scripts 8/8, lint-innerhtml, sw-test, placement-test, stray-files, claims-guard, camera-privacy). No browser/camera run here.

## Findings (most severe first, max 8)
- [High] No customer and no evidence anyone wants it — `docs/device_matrix.md`, judge Update 8 "What to do next" #1, #3 — every owner step (real faces, low-end Android, FB/IG in-app camera, 1-3 F-commerce sellers, real RTO numbers) is still open after 18 days. `index.html:145` still sells "Radically Reduce RTO" with no measurement behind it. The core risk is the FB/IG/Messenger in-app browser: if camera permission fails there (the main distribution channel), the product does not work for its market, and that has never been tried.
- [Medium] The privacy promise depends on unpinned third-party code with camera access — `tryon.html:55-61` — the page imports `vision_bundle.mjs` from jsDelivr and models from Google Storage at runtime, without Subresource Integrity (ES-module import has no `integrity`; no importmap integrity used). A compromised CDN response would run with the live camera stream. The version is pinned (`@0.10.21`), and `privacy.html:18` discloses that both CDNs see IP and browser details. Self-hosting the ~6.4 MB of files would close this and the payload issue together.
- [Medium] `check.sh` "camera-privacy" step proves less than its name — `scripts/check.sh:30-35` — it only greps `tryon.html` for `fetch|XMLHttpRequest|sendBeacon|WebSocket`; it does not cover `placement.js`, `sw.js`, the CDN bundle, `navigator.share`, or `<img src>`-style exfiltration. As of today the code really sends nothing (verified by reading: no network calls in `tryon.html`/`placement.js`; `sw.js` only caches two versioned URL patterns and never sees camera data), so the claim is true; the guard just would not catch a regression.
- [Medium] Anyone can mint a try-on link that routes orders to their own WhatsApp — `tryon.html:108-115` — `wa`, `m`, `shop` and `name` come from the URL (format-validated, safe from injection), so a scammer can copy a seller's link, swap the number, and get a credible PoreDekho-hosted order page. In BD F-commerce, where order scams are common, links should be signed or the number looked up from a seller registry before real sellers use it.
- [Low] Per-SKU flow needs a redeploy for every product — `tryon.html:97` loads `skus/<sku>.png` same-origin, and there is no `skus/` directory in the repo; `admin.html` only downloads a PNG. Today every SKU link falls back to sample shapes until someone commits the image and redeploys. Fine for a 5-SKU pilot, a wall after that.
- [Low] First visit downloads about 6.4 MB — judge Update 10/11 — 4x the 1.5 MB target, on the low-end Android and mobile data the pitch targets. The service worker helps only repeat visits.
- [Low] Dead pitch material still in the tree — `ar_demo.html:144` (Iridescence lamp), `sample_pitch.html:781,856` (Astronaut.glb, NeilArmstrong.glb), plus `pitch_deck.md`, `sales_playbook.md`, `marketing_*.md`, `pricing_model.md` (four conflicting price sheets per judge #6) — unlinked but shipped with any Pages deploy; `index.html:8` uses the Tailwind Play CDN, which is not meant for production.

## Claims vs reality
- "Camera video is processed in your browser ... not sent to us or anyone else" (`privacy.html:16`, `index.html:98`) -> true in the code: no network calls in `tryon.html`/`placement.js`; frames go only to the in-page MediaPipe wasm.
- "Service worker caches only the MediaPipe files and deletes only its own old caches" (judge Update 11, 2026-10-21 mutation check) -> true: `sw.js:6-7,11-13`; `scripts/test-sw.mjs` passes and asserts both cache cleanup scope and offline serving (stubbed SW scope, not a real browser).
- "Placement tuned on real faces" (judge 2026-10-27) -> partly: 4 still photos, 3 hand-labelled lobes fitted with 3 parameters; not validated on unseen faces or live video.
- "Distributed as a hosted try-on link per SKU" (`README.md:26`) -> false today: not hosted (404), no SKU images in the repo.
- "Pitch claims removed / marked UNVERIFIED" (judge Update 10) -> mostly true; `check.sh` claims-guard passes; "Radically Reduce RTO" (`index.html:145`) remains as an unqualified headline.

## Next actions (max 5, in priority order)
- [owner] Turn on GitHub Pages (or any HTTPS host) for `tryon.html` and open it on your own phone inside Messenger, Facebook and Instagram in-app browsers — this is the go/no-go for the whole channel — effort: 1h
- [owner] Show it to 3 F-commerce jewellery sellers with one of their own products (via `admin.html`); ask for their real return rates — effort: half-day
- [owner] Decide: if no seller would pilot, kill the repo; do not commission more agent rounds on placement or caching first — effort: 15m
- [agent] Self-host the MediaPipe bundle, wasm and model next to `tryon.html` (removes third-party code with camera access and the CDN IP disclosure; same cache path) — effort: 1h
- [agent] Delete `ar_demo.html`, `sample_pitch.html` and the stale pricing/pitch docs before the first public deploy — effort: 15m

## Not checked
- Running `tryon.html` in any browser or on any phone (no camera run this round).
- `admin.html` background removal quality; `report.html` maths beyond judge's claim.
- Contents of the jsDelivr bundle and Google model files.
- Marketing docs for remaining brand names beyond what claims-guard greps.
