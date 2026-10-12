# AGENTS.md

Static HTML + Markdown pitch/demo repo. No package.json, no Python. Needs only bash and node.

- Run `scripts/check.sh` before finishing; `scripts/check.sh --fast` (lint + stray files) runs as the pre-commit hook.
- Hook setup: `git config core.hooksPath .githooks` is set locally (re-run it in a fresh clone).
- CI: `.github/workflows/check.yml` runs the same script on Node 20.
- `scripts/check-inline-scripts.mjs` syntax-checks every inline `<script>` in `*.html`.
- Allow a deliberate HTML sink with a trailing `// safe-html: <reason>`.
- Known failing check: `claims-guard` flags Meta Spark mentions in `ar_pipeline_guide.md` (judge.md blocker 2: the content must be deleted, not whitelisted).
- Brand-name guard exempts only `judge.md`, `docs/claims_to_verify.md`, `docs/pricing_open_questions.md`.
- Read `judge.md` when changing positioning, pricing or claims; it is the launch-readiness verdict and progress log.
- Read `docs/claims_to_verify.md` when adding any statistic.
- Rules for reviewers and authors: `CODING_STANDARDS.md`.
