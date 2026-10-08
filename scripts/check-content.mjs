/**
 * Content guard.
 *
 *   node scripts/check-content.mjs            # or: npm run check:content
 *   node scripts/check-content.mjs --report   # or: npm run content:status
 *
 * Default mode fails (exit 1) if any PUBLISHED entry still contains "TODO" —
 * so a placeholder metric, a guessed sentence or an unfinished section can
 * never reach the live site. Text inside <Draft>…</Draft> blocks is exempt:
 * those blocks are not rendered in production anyway.
 *
 * --report prints every draft and every TODO, published or not, as a
 * to-do list for finishing the site's content. It always exits 0.
 *
 * Runs before `astro build` (see package.json), alongside the contrast audit.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const CONTENT = join(ROOT, 'src/content');
const report = process.argv.includes('--report');

/** Collections stored as one YAML array per file (Astro's file() loader). */
const ARRAY_FILES = new Set(['experience.yaml', 'education.yaml', 'skills.yaml', 'radar.yaml', 'community.yaml']);

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const stripDraftBlocks = (text) => text.replace(/<Draft\b[\s\S]*?<\/Draft>/g, '');
const countTodos = (text) => (text.match(/\bTODO\b/g) ?? []).length;

/** @type {{ file: string, label: string, draft: boolean, todos: number }[]} */
const entries = [];

for (const path of walk(CONTENT)) {
  const file = relative(ROOT, path).replaceAll('\\', '/');
  const source = readFileSync(path, 'utf8');

  if (path.endsWith('.md') || path.endsWith('.mdx')) {
    const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!match) continue;
    const [, frontmatter, body] = match;
    const data = parse(frontmatter) ?? {};
    entries.push({
      file,
      label: data.title ?? file,
      draft: data.draft === true,
      todos: countTodos(frontmatter) + countTodos(stripDraftBlocks(body)),
    });
  } else if (path.endsWith('.yaml') || path.endsWith('.yml')) {
    const data = parse(source);
    if (ARRAY_FILES.has(path.split(/[\\/]/).pop())) {
      for (const item of data ?? []) {
        entries.push({
          file: `${file}#${item.id}`,
          label: item.title ?? item.name ?? item.company ?? item.area ?? item.id,
          draft: item.draft === true,
          todos: countTodos(JSON.stringify(item)),
        });
      }
    } else {
      // Comments are not content — strip them so a "# DRAFT —" note
      // explaining a file is not counted.
      const withoutComments = source.replace(/^\s*#.*$/gm, '');
      entries.push({
        file,
        label: (data?.quote ? data?.name : data?.title) ?? data?.name ?? file,
        draft: data?.draft === true,
        todos: countTodos(withoutComments),
      });
    }
  }
}

const blocking = entries.filter((e) => !e.draft && e.todos > 0);

if (report) {
  const drafts = entries.filter((e) => e.draft);
  const published = entries.filter((e) => !e.draft);
  console.log(`\nContent status — ${published.length} published, ${drafts.length} drafts\n`);

  if (drafts.length) {
    console.log('Drafts (visible in `npm run dev`, hidden in production):');
    for (const e of drafts) console.log(`  ${String(e.todos).padStart(3)} TODO  ${e.file}  — ${e.label}`);
  }

  const publishedWithDraftBlocks = published.filter((e) => {
    const path = join(ROOT, e.file.split('#')[0]);
    return /\.mdx?$/.test(path) && /<Draft\b/.test(readFileSync(path, 'utf8'));
  });
  if (publishedWithDraftBlocks.length) {
    console.log('\nPublished entries with <Draft> sections still to finish:');
    for (const e of publishedWithDraftBlocks) console.log(`  ${e.file}  — ${e.label}`);
  }

  if (blocking.length) {
    console.log('\nBLOCKING — published entries that still contain TODO:');
    for (const e of blocking) console.log(`  ${e.todos} TODO  ${e.file}`);
  }
  console.log('');
  process.exit(0);
}

if (blocking.length) {
  console.error('\nPublished content still contains TODO — finish it, or mark it draft: true:\n');
  for (const e of blocking) console.error(`  ${e.todos} × TODO  ${e.file}  (${e.label})`);
  console.error('');
  process.exit(1);
}

console.log(`Content check passed: ${entries.filter((e) => !e.draft).length} published entries, no TODOs.`);
