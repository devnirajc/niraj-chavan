// postinstall: keep the Markdown parser working when Windows blocks its
// native binary.
//
// Astro parses Markdown with `satteri`, which ships an unsigned native
// binary (.node) per platform. Smart App Control on Windows refuses to load
// a binary until Microsoft's cloud has seen it widely, so every new satteri
// release breaks the local build ("Cannot find native binding") for a while.
// satteri already falls back to its WebAssembly build when the native one
// fails to load — but npm never installs that build on Windows x64, because
// its manifest says `cpu: wasm32`.
//
// This script installs the matching WebAssembly build only when it is
// needed: on Windows, when satteri cannot load. It doesn't touch
// package.json or package-lock.json, and it is a no-op everywhere else
// (including CI on Linux).

import { execSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

if (process.platform !== 'win32') process.exit(0);

const loads = () =>
  spawnSync(process.execPath, ['--no-warnings', '-e', "import('satteri')"], { stdio: 'ignore' }).status === 0;

let version;
try {
  version = JSON.parse(readFileSync('node_modules/satteri/package.json', 'utf8')).version;
} catch {
  process.exit(0); // satteri isn't installed; nothing to do
}

if (loads()) process.exit(0);

const pkg = `@bruits/satteri-wasm32-wasi@${version}`;
console.log(`[wasi-fallback] satteri ${version}'s native binary is blocked; installing ${pkg}`);
try {
  // --force: bypass the cpu: wasm32 platform check. --ignore-scripts: don't
  // re-run this postinstall. --no-save: leave package.json and the lockfile alone.
  execSync(`npm install ${pkg} --no-save --force --ignore-scripts --no-audit --no-fund --loglevel=error`, {
    stdio: 'inherit',
  });
} catch {
  // fall through to the check below
}

if (loads()) {
  console.log('[wasi-fallback] satteri now loads via WebAssembly.');
} else {
  // Warn rather than fail: a failed postinstall would abort `npm install`.
  console.warn('[wasi-fallback] satteri still fails to load; `astro build` will fail on this machine.');
}
