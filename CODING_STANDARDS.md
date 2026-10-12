# Coding standards (judgement calls; mechanical ones live in scripts/check.sh)

- Never name a real brand, show its imagery or style a page as its proposal without written permission. Why: judge.md blocker 5, trademark and passing-off risk. Use own branding and fictional or own-bought products.
- Never invent evidence: no testimonials, "our pilot data" or fake attributions. Why: one checked claim kills a deal and creates misrepresentation liability (judge.md blocker 4).
- Mark every unsourced statistic with an inline `UNVERIFIED - source needed` AND add a row to `docs/claims_to_verify.md`. Why: the headline numbers (3x, 40%, 20-30%, +38%) already conflict across files.
- Keep one number per claim across all files; if two files disagree, fix both or mark both UNVERIFIED. Why: buyers cross-check.
- Calculators expose every assumption as a visible input with a 0% default until pilot data exists; labels must match the formula. Why: sample_pitch.html has a label/maths mismatch and a hardcoded 32%.
- Camera frames never leave the device: no canvas, video or ImageData goes to `fetch`, `XMLHttpRequest`, `sendBeacon` or a socket. Show a consent screen before `getUserMedia`. Why: face-camera product; privacy is the sales promise. `check.sh` only flags the obvious cases; review the rest.
- Do not sell or document discontinued platforms (Meta Spark, 8th Wall) as available. Why: the distribution plan cannot be delivered on them.
- Do not promise features that have no code (SDK, analytics, self-serve setup, face tracking) in copy. Why: judge.md blockers 1 and 6.
- Put untrusted or user-entered text into the DOM with `textContent`; use `innerHTML` only for constant markup. Why: check.sh catches only same-line concatenation.
- Pricing figures must agree with `pricing_model.md` or be listed in `docs/pricing_open_questions.md`. Why: four contradictory price sheets existed.
- Demo copy must work in FB/IG/Messenger in-app browsers on non-ARCore Android; do not rely on WebXR/Scene Viewer alone. Why: target phones lack ARCore.
