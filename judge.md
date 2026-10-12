# PoreDekho VTO — Launch-Readiness Judgment

> **Current go-to-market score: 12%.** The verdict below is the original 2026-10-12 audit. See *Update 8* at the bottom for the current score, gaps and next steps, and `../GO_TO_MARKET_SCORECARD.md`.

Audited 2026-10-12. Files read in full: README.md, pitch_deck.md, pitch_script.md, pricing_model.md, sales_playbook.md, marketing_assets.md, marketing_campaign.md, ar_pipeline_guide.md, index.html, ar_demo.html, aarong_pitch.html.

## Verdict

**Readiness: about 5%.** This repo holds a sales and marketing kit around a product that does not exist. No file contains a virtual try-on: no camera access, no face, ear, neck or hand tracking, no overlay of a product on a person. The "Virtual Try-On" button opens model-viewer's world-placement AR, which puts the object on the floor, not on you. Every 3D model is a Google sample asset: an astronaut, a lamp, a shoe and Neil Armstrong, labelled as necklaces, earrings and rings. Half the planned distribution (Meta Spark filters on FB/IG) was shut down by Meta in January 2025. The pitch materials quote pilot data and testimonials that cannot exist yet, and they use real brands (Aarong/BRAC, Diamond World, Jarwa House, Tanishq, Mejuri, Kendra Scott) without permission. The four price sheets disagree with each other, and none is based on a measured cost per SKU. What has value: the market framing (RTO pain, F-commerce first, low-end Android) and the gltf-transform optimisation notes.

---

## Critical blockers (ranked)

### 1. No try-on engine exists. The "VTO" is a 3D product viewer.
- **Evidence:** `ar_demo.html:223` calls `activateAR()` on `<model-viewer ar ar-modes="webxr scene-viewer quick-look">` (`:149-150`). That mode places a model on a surface in world space. `aarong_pitch.html:854` admits it: "place the necklace in real space". No file contains `getUserMedia`, MediaPipe, a face mesh or a hand tracker. Face tracking appears only as an Enterprise upsell bullet (`aarong_pitch.html:1220`). `index.html:162` claims a "bespoke Web-AR SDK" that does not exist. `pitch_script.md:19` promises "a custom, working demo".
- **Why it blocks:** the product is the try-on itself. A spinning 3D model does not answer "will it suit me?", so nothing here can reduce RTO.
- **Fix system:** build a browser try-on engine before any more selling.
  1. Camera: `getUserMedia` with front camera, 640x480 to stay fast on low-end phones.
  2. Tracking: MediaPipe Tasks Vision. Face Landmarker for earrings, nose pins, tikka and glasses. Pose Landmarker (shoulders plus chin from face) for necklaces. Hand Landmarker for rings and bangles (phase 2).
  3. Rendering: start with **2D overlays** (a background-removed product PNG, anchored and scaled to landmarks, with temporal smoothing) on a canvas. Move to Three.js and GLB only for categories where 2D looks wrong.
  4. Occlusion: a hair/selfie segmentation mask so earrings sit behind hair or a hijab.
  5. Output: a snapshot/share button, plus an "Order on Messenger/WhatsApp" CTA.
  6. Ship the tracker on-device only. No frames leave the phone (this also helps blocker 7).

### 2. The distribution plan depends on dead platforms.
- **Evidence:** `README.md:19` names "Meta Spark ... or 8th Wall". All of `ar_pipeline_guide.md:38-81` covers Spark. `sales_playbook.md:89` sells "plug-and-play Meta Spark integration". `pitch_deck.md:25,44` and `aarong_pitch.html` (Growth tier, "Social AR filter creation (IG/FB)") rely on it too. Meta shut down Meta Spark and removed third-party AR effects from FB/IG on 14 Jan 2025. Niantic announced a wind-down of 8th Wall in 2025; check its status, but do not build on it.
- **Why it blocks:** the F-commerce channel, the stated main market, has no native AR surface left. The pitch sells something that cannot be delivered.
- **Fix system:** make the distribution unit a **hosted try-on link per SKU** (`try.<domain>/<shop>/<sku>`). Sellers paste it into Messenger, IG DMs, comments, Live descriptions and QR codes on parcels. It must work inside the **FB/IG/Messenger in-app browsers** on Android and iOS: test camera permission in each one and show an "Open in Chrome/Safari" fallback. Website embedding (a script tag or iframe) comes second. Delete all Spark content from the docs.

### 3. The asset pipeline is undefined, and its economics contradict the prices.
- **Evidence:** `pitch_deck.md:43` says "We take the brand's 2D catalog and generate ... 3D models", with no method given. `aarong_pitch.html` (Week 2) says "Our 3D artists", but no artists, tools, capture rig or cost per SKU are named. `ar_pipeline_guide.md:12-33` only covers compressing a GLB that already exists. Prices imply roughly ৳600–1,000 (about $5–8) per SKU (Aarong Growth: 50 SKUs for ৳35,000; `pricing_model.md:6`: 5–15 items for ৳15–40k). Hand-modelled jewellery (thin chains, filigree, stones, reflective gold) typically costs tens to hundreds of USD per SKU and takes hours to days. The goal of "100 clients" (`pitch_deck.md:59`) at 15+ SKUs each, plus a new collection every Eid/Puja, is thousands of SKUs per year.
- **Why it blocks:** every sale loses money, or the service can't deliver at the promised volume and turnaround ("7 days", "under 30 days").
- **Fix system:**
  1. Default to **photo-to-2D-asset**: seller photo, then background removal (rembg/SAM), then a web admin tool to set anchor points (ear-hook point, necklace centre and width in mm), then publish. Target 15 minutes or less per SKU. Measure it.
  2. Write a capture spec sellers can follow on a phone (plain background, front view, ruler in frame for scale).
  3. Use 3D only as a premium tier, priced from real measured artist or photogrammetry cost.
  4. Track cost per SKU as a KPI and set prices at 3x or more of it.

### 4. The pitch materials contain fabricated evidence.
- **Evidence:** `aarong_pitch.html:1012-1015` cites "our own pilot data from BD boutique brands", but no pilots exist. `:1239-1262` shows three quoted testimonials, framed as "Projections", with fake attributions such as "Founder, Boutique Fashion Label (Dhaka)". `:722-734` shows unsourced stats ("40% average RTO", "94% satisfaction"). The headline numbers conflict across files: `index.html:144` says "3x", `marketing_assets.md:20` and `pitch_script.md:16` say "40%", `sales_playbook.md:27` says "20–30%", and `aarong_pitch.html` says "+38%, -32%, +22% AOV". `aarong_pitch.html:1329`: the formula is `savedOrders * aov * 0.15`, but the label (`:1112`) says "avg AOV × saved RTOs", so label and maths disagree. The 32% prevention rate is hardcoded.
- **Why it blocks:** one sharp buyer (Aarong's digital team will be one) checks a single claim and the deal and your reputation are gone. Fake testimonials also create misrepresentation liability.
- **Fix system:** remove every testimonial and every "our pilot" claim now. Keep only third-party stats with a citation and link. Rebuild the ROI calculator so each assumption is a visible input, with a default of 0% until real pilot data exists. Replace the claims with real numbers from blocker 6.

### 5. Brand and IP misuse.
- **Evidence:** `aarong_pitch.html` uses Aarong's name, a CSS block labelled "AARONG BRAND PALETTE" (`:29-36`), "Confidential Proposal" (`:701`), "prepared exclusively for Aarong / BRAC Enterprises Ltd." (`:1287`), "White-label Aarong VTO" (Enterprise tier), and prices for products presented as Aarong's. Yet `index.html:75` links this page from the public nav. `pitch_deck.md:34` names Diamond World and Jarwa House as targets. `sales_playbook.md:92-94` makes claims about Daraz and Aarong RTO. `aarong_pitch.html:1012` names Tanishq, Mejuri and Kendra Scott as data sources. `index.html:279` says "PoreDekho Inc.", but no entity is evidenced.
- **Why it blocks:** publishing a page styled as an unsolicited "proposal" to a named enterprise, with that brand's identity on it, invites trademark, passing-off and defamation complaints. It also undercuts the pitch.
- **Fix system:** remove the Aarong link from `index.html` and host prospect pages only behind unguessable URLs or as PDFs. Use your own branding on everything you publish, and mention a prospect's name only in a private 1:1 deck. Cut the competitor claims you can't source. Register the company (BD sole proprietorship or Ltd) and the trade name before invoicing.

### 6. No measurement or attribution, yet performance pricing and "analytics" are sold.
- **Evidence:** the Performance tier (`pricing_model.md:18-20`, `sales_playbook.md:40`, `pitch_deck.md:54`) and "conversion analytics dashboard" (`index.html:221`, `aarong_pitch.html` Week 4) are promised. No event tracking, backend or attribution code exists anywhere. COD orders on Messenger leave no web conversion trail.
- **Why it blocks:** you can't bill a revenue share, prove RTO reduction or produce a case study. The main value claim stays unprovable forever.
- **Fix system:** log events per try-on session (open, camera-granted, try-on seconds, snapshot, share, CTA click). The CTA pre-fills a Messenger/WhatsApp message containing a **unique order code**. The seller's order sheet records that code, so delivered vs returned can be matched per code. Run an A/B test per seller (half the SKUs get the try-on link) for 4–6 weeks. The dashboard is a simple per-shop page until real demand exists.

### 7. No privacy or legal layer for a camera product.
- **Evidence:** there is no privacy policy, terms of service, consent screen or data-handling statement. The demo form (`index.html:258`) is `alert('Demo requested!')`, which captures nothing. The contacts are placeholders (`example.com`, `+880 1XXX`).
- **Why it blocks:** a face-camera product without a consent screen and privacy policy will be rejected by any serious buyer. It is also exposed under Bangladesh's data-protection regime and app-store/Meta link policies.
- **Fix system:** process on-device only and state it. Show a one-screen camera consent (Bangla and English). Publish a privacy policy and terms. Write a client agreement covering asset ownership, uptime, data and revenue-share definitions. Wire the form to a real inbox or CRM, and use a real domain and phone number.

### 8. Device support: the chosen AR path excludes the target phones.
- **Evidence:** `ar_pipeline_guide.md:4` targets low-end Android (Symphony, Walton, `:56`). Scene Viewer and WebXR need ARCore-certified devices, and many budget BD phones are not certified. On those phones and on desktop, `activateAR()` (`ar_demo.html:223`) silently does nothing, and there is no `canActivateAR` check or fallback.
- **Why it blocks:** the core button fails on the core market's phones.
- **Fix system:** the camera plus MediaPipe approach (blocker 1) only needs `getUserMedia` and WebGL/WASM, so it works without ARCore. Set budgets: try-on visible in 5 seconds or less on 4G, 20 fps or more, total payload 1.5 MB or less (lazy-load the model files). Test on 10 or more real devices (Symphony, Walton, Xiaomi Redmi A-series, Samsung A0x, an old iPhone) and in the FB, IG, Messenger and Chrome/Safari browsers. Record the matrix in the repo.

---

## Major gaps

- **Buyer is undefined.** The materials pitch luxury enterprise ("Enterprise-Grade", Aarong, `$1,250` 18k necklace in `ar_demo.html:187`) and F-commerce boutiques selling ৳350–4,200 items (`aarong_pitch.html:822,897,964`). These differ in budget, sales cycle and channel (website vs Messenger). **Fix:** launch with Instagram/FB jewellery sellers (imitation and gold-plated earrings/necklaces) on hosted links. Approach enterprise only after 3–5 case studies.
- **Four contradictory price sheets.**
  - `pitch_deck.md:52`: ৳10–25k setup.
  - `pricing_model.md:6,14`: ৳15–40k setup plus ৳10–25k per collection, explicitly "no monthly fee".
  - `aarong_pitch.html`: ৳15k plus ৳5k/month, or ৳35k plus ৳12k/month.
  - `index.html:188-236`: **USD** $500 or $1,500 plus $200 or $600 per collection.

  **Fix:** one BDT sheet: per-SKU asset fee plus monthly hosting per shop, with a free pilot of 5 SKUs. Derive it from measured cost per SKU and hosting cost.
- **The RTO thesis is unvalidated.** BD RTO is driven heavily by COD refusals: changed mind, fake orders, nobody home, price shopping. Fit or look is only one cause. **Fix:** before building more, interview 15–20 sellers and get return-reason data from courier dashboards (Pathao, Steadfast, RedX). Size the share of RTO that try-on can address.
- **Render realism risk.** Poor gold or stone rendering creates new "chhobir sathe mile nai" complaints. **Fix:** show real scale (mm) and include a "colour may vary" note. Do a side-by-side QA (try-on vs real photo) before publishing each SKU.
- **Demos would embarrass a prospect.** The models are Astronaut, Neil Armstrong, a shoe and a lamp (`index.html:111`, `aarong_pitch.html:802,877,944`, `ar_demo.html:144`), and the store "Maison D'Or" is fictional. **Fix:** replace them with 3 real (own-bought) jewellery pieces running through the actual engine.
- **Marketing promises "zero coding" self-serve setup** (`marketing_campaign.md:32,45`), but no seller dashboard or onboarding flow exists. **Fix:** don't advertise self-serve until the admin tool from blocker 3 exists.
- **Production hygiene.** The pages load the Tailwind CDN JIT runtime (`index.html:8`, `ar_demo.html:8`), which Tailwind says is not for production, use render-blocking `@import` fonts, and have dead `href="#"` links everywhere. The README (`README.md:9-13`) lists only 5 of the 11 files. **Fix:** build CSS statically, preload fonts, fix the links and README, and host on HTTPS (required for camera access).
- **Unscalable ops.** The plan promises manual services (dedicated account manager, 7-day turnaround, kiosks, native SDK, SLA in `aarong_pitch.html` Enterprise) with no team or infrastructure. **Fix:** strip the tiers down to what one person plus the tooling can deliver.

---

## Launch path (ordered)

1. **Freeze outbound.** Pull the Aarong page from public nav and hosting. Delete the fake testimonials, "pilot data" and unsourced stats. Remove all Meta Spark and 8th Wall content.
2. **Validate the problem (1–2 weeks).** Interview 15–20 IG/FB jewellery sellers. Collect RTO reasons from courier data. Confirm their willingness to pay and that they will share order outcomes.
3. **Build the MVP engine (3–5 weeks).** Earrings plus necklaces only: getUserMedia, MediaPipe Face and Pose with segmentation, a 2D PNG overlay, snapshot/share, and a Messenger/WhatsApp CTA with an order code. Hosted per-SKU links on HTTPS.
4. **Build the asset admin tool.** Upload photo, remove background, set anchors and scale, publish. Measure minutes per SKU.
5. **Device QA.** Run the 10-device by 4-browser matrix, including FB/IG/Messenger in-app browsers, against the performance budgets (5 s or less, 20 fps or more, 1.5 MB or less) with an open-in-browser fallback.
6. **Measurement.** Event logging, order-code matching and a simple per-shop report.
7. **Legal minimum.** Register the company. Add a privacy policy, terms and consent screen. Write a client agreement. Set up a real domain, email and phone, and a working lead form.
8. **Free pilots (4–6 weeks, 3–5 sellers).** A/B test SKUs with and without try-on. Measure conversion and RTO delta per order code. Publish real case studies with permission.
9. **Set prices from data.** One BDT sheet (per-SKU plus monthly hosting) at 3x or more of measured cost. Turn on the performance share only where order-code attribution works.
10. **Expand.** Rings and bangles (Hand Landmarker), a website embed script and Shopify/WooCommerce plugins, then a 3D/GLB premium tier using the existing `ar_pipeline_guide.md` compression steps. Approach enterprise (Aarong-class) last, with real data and a private, permissioned pitch.


---

## Progress log (2026-10-12, Claude session)

**Done:** nothing changed in this session. No edits made.

**Next, in value order:**
1. Remove the Meta Spark and 8th Wall dependence from the docs and pitch.
2. Remove invented pilot data, testimonials and unlicensed brand names from the pitch and sales materials.
3. Build the MediaPipe try-on engine as described in blocker 1.


### Update 2 (supersedes "nothing changed" above; agent-made, not reviewed by a human)

**Done (edited, not rendered):** `aarong_pitch.html` has a red "SAMPLE TEMPLATE" banner; real brand names (Aarong/BRAC, Tanishq, Kalyan, Mejuri, Kendra Scott, Diamond World, Jarwa House) replaced with placeholders; "our own pilot data" now says no pilot data yet; testimonials labelled as placeholders; Meta Spark and 8th Wall marked discontinued in README, pitch deck, sales playbook and pipeline guide.

**Still open:** unsourced "40% RTO" and "94% satisfaction" stats, conflicting headline numbers across the four price sheets, Aarong-style prices and brand colours, the `aarong_pitch.html` filename. The try-on engine (blocker 1) is still unbuilt.


### Update 3 (agent-made; results are the agents' own reports unless stated)

**Done (syntax-checked with `node --check` only; never loaded in a browser):** new `tryon.html`: front camera at 640x480, MediaPipe Tasks Vision pinned to `@mediapipe/tasks-vision@0.10.21` (jsdelivr) with Google's `face_landmarker.task`, canvas overlay of earrings (Drop, Hoop, Stud) and necklaces (Chain, Pendant, Beads) as generated shapes, EMA smoothing 0.4, head-roll rotation, PNG snapshot, on-device-only note, visible error states. "Live Try-On" link added to the desktop nav in `index.html`.

**Still open:** landmark indices (chin 152, sides 234/454, lobe points 132/361, jaw 172/397) came from the agent's memory, not MediaPipe's docs, and have not been tested on a face, so placement is likely off. No hair or hijab occlusion (blocker 1, step 4). Needs HTTPS or localhost. Nav link is desktop-only. Real product images, pricing reconciliation and the rest of the judge.md list are untouched.


### Update 4 (agent-made; agents' own reports, not yet independently re-run)

**Done:** the agent checked the seven landmark indices in `tryon.html` against MediaPipe `face_mesh_connections.py` (`FACEMESH_FACE_OVAL`) and the tfjs-models `faceOval` constants. All were correct and unchanged. Indices 132 and 361 are documented as earlobe stand-ins. A visible UI note and code comment say hair, hijab and scarves are not occluded. `node --check` passes.

**Still open:** placement was never viewed on a real face; the page was never loaded in a browser; the nav link is desktop-only (the page has no mobile menu), so mobile users have no way in; the rest of the judge.md list.


### Update 5 (agent-made, round 6; agents' own reports unless marked)

**Done (`node --check` on all inline scripts; nothing loaded in a browser):** `aarong_pitch.html` renamed `sample_pitch.html` (link in `index.html` updated; no old brand names remain outside `judge.md`; CSS vars renamed `--brand-*`). Mobile menu in `index.html` (button with `aria-expanded` and `aria-controls`, closes on link click or Escape). "UNVERIFIED - source needed" markers on unsourced stats across the pitch, index and marketing files; full list in `docs/claims_to_verify.md`. `docs/pricing_open_questions.md` lays the four price sheets side by side with 10 unit-cost questions (no prices chosen). `tryon.html` has a collapsible tuning panel (4 sliders, `localStorage` in try/catch). Folder checked for stray backup files; none left.

**Still open:** try-on placement never viewed on a real face (use the tuning panel); hair and hijab occlusion; real product assets; actual pricing; the claims in `docs/claims_to_verify.md` need sources or removal before any customer sees them.


### Update 6 (agent-made: independent verification, security review, fixes; agents' own reports unless marked)

**Independent re-run confirmed:** every inline script in `index.html` (2), `sample_pitch.html` (1) and `tryon.html` (1) passes `node --check`. No changes this round.


---

## Update 8: go-to-market scoring (2026-10-12)

**Score: 12% (was 5%).** Stage: Prototype; never run on a face.

**Cap:** 12: the core product (a try-on that works on a person's face) has not been seen on a face.

**Dimension scores (0-10):** Product 3, Quality 2, Security 6, Legal 3, Market 1, Ops 2, Honesty 5. Rubric and the other five projects: `../GO_TO_MARKET_SCORECARD.md`.

**Basis and limits:** my judgement from this file's audit, the agents' reports, and independent re-runs of tests and builds. No real-device, real-user or real-host testing has happened, and nothing is committed. Agent-written code has had no human review. Treat the score as +/- 10 points.

### Gaps and flaws, ranked

1. **The try-on is unproven.** `tryon.html` was only syntax-checked and tested in no browser against a real face. Landmark indices were confirmed against two sources, but placement, scale and rotation offsets are untuned; earlobe points are proxies. There is now a tuning panel for this.
2. **Products are generated shapes**, not real jewellery. No real assets, no background removal pipeline, no hair or hijab occlusion.
3. **Not tested on low-end Android**, the stated target (frame rate, load time, MediaPipe wasm and model download on slow networks).
4. **Distribution plan was built on dead platforms** (Meta Spark shut down Jan 2025; 8th Wall wind-down). Docs now say so, but no replacement channel is designed or tested.
5. **Unsourced numbers remain** (e.g. 40% RTO, 94% satisfaction). They are marked UNVERIFIED and listed in `docs/claims_to_verify.md`; any that reach a customer unmarked is a risk.
6. **Pricing is unresolved:** four conflicting price sheets in `docs/pricing_open_questions.md`; no cost per SKU measured.
7. **Privacy:** camera frames stay on the device by design (a stated note, not independently verified); no privacy policy; not deployed anywhere.
8. The mobile menu and the rename to `sample_pitch.html` were checked only by script syntax, not in a browser.

### What to do next, in order

1. **You:** open `tryon.html` over HTTPS or localhost on 3-5 real faces and a low-end Android phone; use the tuning panel; record what is wrong.
2. **Code:** after that, fix placement and scale; add background-removed product PNG overlays; add a hair or selfie segmentation mask for occlusion; measure frame rate.
3. **You:** get 1-3 real F-commerce jewellery sellers to try it and say whether it would reduce returns; collect their real return-rate numbers to replace the unverified stats.
4. **You:** pick one price from real unit costs (`docs/pricing_open_questions.md`).
5. **You:** choose the distribution route (embeddable web widget is the simplest); build that, not a Meta filter.
6. **You:** add a short privacy statement and host the demo; ask permission before using any real brand in a pitch.

### Update 9 (2026-10-12, stopped at the 70% usage ceiling)

**Done this round:** retro guardrails (`scripts/check.sh`, pre-commit hook `.githooks/pre-commit`, CI workflow, `AGENTS.md`, `CODING_STANDARDS.md`); orphaned worktrees removed (Suggest.Bike); all work committed and pushed to `origin/main`. Usage mirror `../usage.md` is live (status line writes the 5-hour and 7-day percentages); read it before starting a round.

**I was in the middle of:** nothing half-done. The last action was this log. No uncommitted work remains apart from this file.

**Not verified:** the GitHub CI workflows have never run; the pre-commit hook has never blocked a real commit; no real-device, real-user or real-host testing.
**Next, first:** try `tryon.html` on real faces with the tuning panel; get a real seller's return-rate numbers; see Update 8.
