/**
 * Minimal static server for a second build — Astro allows only one
 * `astro preview` per project, so use this to serve e.g. dist-drafts:
 *
 *   MSYS_NO_PATHCONV=1 node serve-static.mjs ./dist-drafts 4322 /niraj-chavan/
 *
 * (MSYS_NO_PATHCONV stops Git Bash rewriting "/niraj-chavan/" into a Windows
 * path.) Serves <dir>/<path>/index.html for directory URLs and 404.html for
 * anything missing.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, resolve, sep } from 'node:path';

const [dir, port = '4322', base = '/niraj-chavan/'] = process.argv.slice(2);
if (!dir) {
  console.error('Usage: node serve-static.mjs <dir> [port] [base]');
  process.exit(2);
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
};

createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (!pathname.startsWith(base)) {
    res.writeHead(404).end();
    return;
  }
  // Decoding can turn "..%2F" into a real "../"; resolve and refuse anything
  // that lands outside the served directory.
  const root = resolve(dir);
  let file = resolve(root, `.${sep}${pathname.slice(base.length)}`);
  if (file !== root && !file.startsWith(root + sep)) {
    res.writeHead(403).end();
    return;
  }
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    res.end(await readFile(join(dir, '404.html')).catch(() => 'Not found'));
  }
}).listen(Number(port), '127.0.0.1', () => console.log(`Serving ${dir} at http://127.0.0.1:${port}${base}`));
