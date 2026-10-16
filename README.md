# PoreDekho VTO 🛍️🕶️

> **Augmented Reality Virtual Try-On (VTO) pipeline and business assets tailored for the Bangladeshi e-commerce and F-commerce market.**

This repository contains the business strategy, marketing assets, and technical blueprint for **PoreDekho VTO**, a B2B startup designed to help local Bangladeshi brands (jewelry, boutiques, accessories) reduce Return to Origin (RTO) rates and increase sales through AR.

## 📂 Repository Contents

*   [**README.md**](./README.md): This index file.
*   [**index.html**](./index.html): Landing page (free-pilot offer; no prices yet).
*   [**tryon.html**](./tryon.html): The camera try-on. Sample shapes by default; a per-SKU link (`tryon.html?sku=<name>&type=ear|neck&ax&ay&mm[&name&shop&wa&m]`) loads `skus/<name>.png` and shows an order code with WhatsApp/Messenger buttons. Needs HTTPS or localhost (`python3 -m http.server`).
*   [**admin.html**](./admin.html): Asset tool: product photo, background removal, anchor point, real width, then a PNG for `skus/` and the try-on link.
*   [**report.html**](./report.html): Paste `code,status` rows from an order sheet; compares return rates of try-on orders (`PD-` codes) with other orders.
*   [**sw.js**](./sw.js): Service worker that keeps the MediaPipe runtime and face model (~6 MB) in the browser cache after the first visit; registered by `tryon.html`.
*   [**privacy.html**](./privacy.html): Privacy statement (draft, not legally reviewed).
*   [**sample_pitch.html**](./sample_pitch.html), [**ar_demo.html**](./ar_demo.html): Old prospect template and 3D viewer demo; not linked from the site.
*   [**judge.md**](./judge.md): Launch-readiness verdict and progress log. `docs/`: claims to verify, pricing questions, device QA matrix.
*   [**pitch_script.md**](./pitch_script.md): Cold-outreach email templates for B2B sales.
*   [**pricing_model.md**](./pricing_model.md): Hybrid pricing strategy adapted for the BD market (Setup + Seasonal + Performance).
*   [**marketing_assets.md**](./marketing_assets.md): Taglines (English & Bengali), value propositions, and buyer personas.

## 🚀 The Vision
A "Blue Ocean" B2B service tailored for the booming Bangladeshi market. We provide a **Virtual Try-On (VTO) Pipeline** that functions not just as a visual gimmick, but as a direct **sales conversion tool**.

## 🛠️ Technical Architecture & Best Practices
*   **Engine:** `tryon.html`: front camera plus MediaPipe Face Landmarker, 2D overlays drawn on a canvas, on-device only. Distributed as a hosted try-on link per SKU (no native FB/IG AR surface exists).
*   **Focus on Face/Head Tracking:** More accurate and stable on older smartphones common in BD compared to full-body tracking.
*   **Works without ARCore:** needs only `getUserMedia` and WebAssembly, so budget Android phones are covered; 3D/`<model-viewer>` is a later premium tier.
*   **Low-End Optimization:** Keep 3D models lightweight for fast loading over standard 4G connections.
