// Where tryon.html draws jewellery, from MediaPipe FaceLandmarker landmarks (x, y in 0-1; z in roughly x units).
// Pure maths so scripts/test-placement.mjs can check it against hand-labelled real faces (docs/test_faces.md).
// Output is canvas px, mirrored like a selfie view.

// Defaults fitted on real faces 2026-10-27 (fractions of the 3D face width F; see docs/test_faces.md).
// earOut/earDown/earBack: earlobe offset from the jaw-line proxy point (132/361) along the head's own axes;
// earBack is depth behind the cheek, which is what moves the lobe outward on screen when the head turns.
// hideYaw: sin(yaw) beyond which the far ear is behind the face, so its earring is not drawn.
export const DEF = { earOut: 0.03, earDown: 0.04, earBack: 0.21, neckY: 0.08, hideYaw: 0.35 };

const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
const mul = (a, k) => ({ x: a.x * k, y: a.y * k, z: a.z * k });
const unit = a => mul(a, 1 / Math.hypot(a.x, a.y, a.z));

export function place(lm, W, H, t = DEF) {
  // Indices are FACEMESH_FACE_OVAL points: 234/454 face sides, 10 forehead, 152 chin, 172/397 jaw corners.
  // Earlobe has no landmark; 132/361 (oval, just below the face sides toward the ear) are the proxies.
  const P = i => ({ x: (1 - lm[i].x) * W, y: lm[i].y * H, z: lm[i].z * W });
  const across = sub(P(454), P(234)), F = Math.hypot(across.x, across.y, across.z); // F does not shrink when the head turns
  const u = mul(across, 1 / F); // head's sideways axis, from the 234 side to the 454 side
  const h = sub(P(152), P(10)), v = unit(sub(h, mul(u, dot(h, u)))); // head's down axis
  let w = { x: u.y * v.z - u.z * v.y, y: u.z * v.x - u.x * v.z, z: u.x * v.y - u.y * v.x };
  if (w.z < 0) w = mul(w, -1); // into the head, away from the camera
  const ears = [[132, -1], [361, 1]].map(([i, s]) => {
    const p = P(i), o = { x: s * u.x * t.earOut + v.x * t.earDown + w.x * t.earBack, y: s * u.y * t.earOut + v.y * t.earDown + w.y * t.earBack };
    return { x: p.x + F * o.x, y: p.y + F * o.y, show: s * u.z < t.hideYaw };
  });
  const chin = P(152), lj = P(172), rj = P(397);
  // the mirrored view puts 454 on the screen left; roll runs screen-left to screen-right or everything draws upside down
  return {
    F, ears, roll: Math.atan2(-u.y, -u.x),
    neck: { x: chin.x + F * t.neckY * v.x, y: chin.y + F * t.neckY * v.y, w: Math.hypot(rj.x - lj.x, rj.y - lj.y) * 1.3 },
  };
}
