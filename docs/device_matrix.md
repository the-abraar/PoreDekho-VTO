# Device QA matrix (judge.md launch step 5)

Budgets: first try-on in 5 s or less on 4G, 20 fps or more, payload 1.5 MB or less. Read fps and "first face after" from the Tuning panel in `tryon.html`. Payload today is over budget (face model 3.8 MB, MediaPipe wasm several MB, hair model 0.8 MB when ticked) before caching.

Fill one row per device and browser. Camera = did permission work; Fallback = did "Open in Chrome" / "Copy link" work when it did not.

| Device | OS | Browser | Camera | First face (s) | fps | Hair on fps | Placement OK? | Fallback | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Symphony (model?) | Android | Chrome | | | | | | n/a | |
| Symphony | Android | Facebook in-app | | | | | | | |
| Walton (model?) | Android | Chrome | | | | | | n/a | |
| Walton | Android | Messenger in-app | | | | | | | |
| Redmi A-series | Android | Chrome | | | | | | n/a | |
| Redmi A-series | Android | Instagram in-app | | | | | | | |
| Samsung A0x | Android | Chrome | | | | | | n/a | |
| Samsung A0x | Android | Facebook in-app | | | | | | | |
| Old iPhone (model?) | iOS | Safari | | | | | | n/a | |
| Old iPhone | iOS | Instagram in-app | | | | | | | |
