// Runs `node --check` on every inline <script> (no src) of the given HTML files.
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dir = mkdtempSync(join(tmpdir(), 'inline-'));
let bad = 0, n = 0;
for (const f of process.argv.slice(2)) {
  const html = readFileSync(f, 'utf8');
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc\s*=/i.test(m[1])) continue;
    const type = /\btype\s*=\s*["']?([^"'\s>]+)/i.exec(m[1])?.[1];
    if (type && !/^(text\/javascript|module)$/i.test(type)) continue; // skip json/importmap etc.
    const line = html.slice(0, m.index).split('\n').length;
    const tmp = join(dir, `s${n++}.${type === 'module' ? 'mjs' : 'js'}`);
    writeFileSync(tmp, m[2]);
    try { execFileSync(process.execPath, ['--check', tmp], { stdio: 'pipe' }); }
    catch (e) { bad++; console.error(`${f}: inline script at line ${line}\n${e.stderr}`); }
  }
}
rmSync(dir, { recursive: true });
console.log(`checked ${n} inline scripts, ${bad} failed`);
process.exit(bad ? 1 : 0);
