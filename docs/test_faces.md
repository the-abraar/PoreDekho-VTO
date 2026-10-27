# Test faces for the try-on (placement tuning, 2026-10-27)

The images are not in the repo. `scripts/test-faces.json` holds only MediaPipe landmarks (8 points per face) measured on 640x480 crops of faces a-c. Earlobe labels in `scripts/test-placement.mjs` were placed by eye on 4-6x zooms.

| Key | Source (Wikimedia Commons) | Licence | Author | Pose / use |
|---|---|---|---|---|
| a | [Portrait of Chakma woman, Bangladesh (2)](https://commons.wikimedia.org/wiki/File:Portrait_of_Chakma_woman,_Bangladesh_(2).jpg) | Public domain (per Commons) | Harrison Forman, c. 1968 | frontal; ears under hair, visual check only |
| b | [Smiling older woman in a patterned headscarf in Santa Lucía, Maracaibo, Venezuela](https://commons.wikimedia.org/wiki/File:Smiling_older_woman_in_a_patterned_headscarf_in_Santa_Luc%C3%ADa,_Maracaibo,_Venezuela.jpg) | CC0 | Wilfredor | near-frontal; wears real earrings, so both lobes are labelled |
| c | [Portrait of Chakma woman in Chittagong, Bangladesh (2)](https://commons.wikimedia.org/wiki/File:Portrait_of_Chakma_woman_in_Chittagong,_Bangladesh_(2).jpg) | Public domain (per Commons) | Harrison Forman, c. 1968 | head turned about 30 degrees; near lobe labelled, far ear hidden |
| e | [Bengali woman portrait](https://commons.wikimedia.org/wiki/File:Bengali_woman_portrait.jpg) | CC BY-SA 4.0 | Anton Gutmann | frontal, headscarf, real hoops and nose pin; screenshots only, not in the fixture |

How they were run: each crop became a still `.y4m` clip (plus a +/-15 degree rolling clip for a and b) fed to headless Chrome with `--use-fake-device-for-media-stream --use-file-for-fake-video-capture=<clip>`, `tryon.html` served from localhost, viewport screenshots at 375x812 and 1280x800.

Limits: still photos, not live faces; three labelled lobes fit three parameters, so the fit is tight but not validated on unseen faces. Real people (hijab, long hair, skin tones, phones) are still needed (`docs/device_matrix.md`).
