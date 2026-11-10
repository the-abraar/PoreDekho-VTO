# AGENTS.md

Static HTML + Markdown pitch/demo repo. No package.json, no Python. Needs only bash and node.

- Run `scripts/check.sh` before finishing; `scripts/check.sh --fast` (lint + stray files) runs as the pre-commit hook.
- Hook setup: `git config core.hooksPath .githooks` is set locally (re-run it in a fresh clone).
- CI: `.github/workflows/check.yml` runs the same script on Node 20.
- Hosting: `.github/workflows/pages.yml` publishes an allowlist only (try-on pages, `placement.js`, `sw.js`, `vendor/`, `skus/`, `demo/`). A new public file must be added there; pitch files, docs and face photos must never be.
- `scripts/test-sw.mjs` checks the service worker deletes only its own old caches.
- `placement.js` holds the try-on placement maths; `scripts/test-placement.mjs` checks it against labelled earlobes on real photos (`docs/test_faces.md`). Re-fit and update the labels together.
- `scripts/check-inline-scripts.mjs` syntax-checks every inline `<script>` in `*.html`.
- Allow a deliberate HTML sink with a trailing `// safe-html: <reason>`.
- The Meta Spark section of `ar_pipeline_guide.md` is deleted (2026-10-16); keep it that way (judge.md blocker 2).
- Browser-test the try-on with a fake camera: Chrome flags `--use-fake-device-for-media-stream --use-file-for-fake-video-capture=<face>.y4m`, served from localhost.
- Brand-name guard exempts only `judge.md`, `docs/claims_to_verify.md`, `docs/pricing_open_questions.md`.
- Read `judge.md` when changing positioning, pricing or claims; it is the launch-readiness verdict and progress log.
- Read `docs/claims_to_verify.md` when adding any statistic.
- Rules for reviewers and authors: `CODING_STANDARDS.md`.
