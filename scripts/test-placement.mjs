// placement.js against hand-labelled earlobes on real faces (sources: docs/test_faces.md).
// Fixture = MediaPipe landmarks (only the indices place() reads) from 640x480 test frames; labels are canvas px, mirrored.
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { place } from '../placement.js';

const faces = JSON.parse(readFileSync(new URL('./test-faces.json', import.meta.url), 'utf8'));
// [132-side lobe, 361-side lobe]; null = ear hidden behind the turned head
const LOBES = { b: [[456, 200], [238, 200]], c: [null, [215, 314]] };
for (const [k, want] of Object.entries(LOBES)) {
  const r = place(faces[k], 640, 480);
  want.forEach((g, i) => {
    const e = r.ears[i];
    if (!g) return assert.equal(e.show, false, `${k} ear ${i} should be hidden`);
    assert.ok(e.show, `${k} ear ${i} should show`);
    const d = Math.hypot(e.x - g[0], e.y - g[1]) / r.F;
    assert.ok(d < 0.04, `${k} ear ${i} is ${d.toFixed(3)} face widths from the labelled lobe`);
  });
}
// frontal face a: both earrings shown, level, outside the cheeks; necklace below the chin and upright (not 180 deg)
const a = place(faces.a, 640, 480);
assert.ok(a.ears.every(e => e.show) && Math.abs(a.ears[0].y - a.ears[1].y) < 0.05 * a.F);
assert.ok(a.ears[0].x > 400 && a.ears[1].x < 230, 'earrings sit outside the cheeks');
assert.ok(a.neck.y > faces.a[152].y * 480 && Math.abs(a.roll) < 0.2);
console.log('placement ok');
