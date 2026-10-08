/**
 * Accessibility audit with axe-core across routes, both themes and two widths.
 *
 * Kept out of the project's dependencies (Playwright is large). Copy it into
 * a scratch directory that has the packages installed — ES modules resolve
 * imports from the script's own folder, so running it in place fails:
 *
 *   mkdir audit && cd audit && npm init -y && npm i playwright @axe-core/playwright
 *   cp <skill>/scripts/a11y-audit.mjs .
 *   node a11y-audit.mjs http://127.0.0.1:4321/niraj-chavan/ "" about/ projects/rxbit/
 *
 * Uses the installed Google Chrome (channel: 'chrome'), so no browser download
 * is needed. Every <details> element is opened before auditing, so collapsed
 * content is checked too. Exits 1 if anything is found.
 */
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

const [base, ...routes] = process.argv.slice(2);
if (!base) {
  console.error('Usage: node a11y-audit.mjs <baseUrl> [route ...]   ("" is the home page)');
  process.exit(2);
}
const targets = routes.length ? routes : [''];

const browser = await chromium.launch({ channel: 'chrome' });
let violations = 0;

for (const theme of ['light', 'dark']) {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme, reducedMotion: 'reduce' });
    const page = await context.newPage();
    for (const route of targets) {
      await page.goto(base + route, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.querySelectorAll('details').forEach((d) => (d.open = true)));
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
        .analyze();
      for (const v of result.violations) {
        violations += 1;
        console.log(`[${theme} ${width}px] /${route}  ${v.id} (${v.impact}): ${v.help}`);
        for (const node of v.nodes.slice(0, 3)) console.log(`    ${node.target.join(' ')}`);
      }
    }
    await context.close();
  }
}

await browser.close();
console.log(violations ? `\n${violations} violation group(s)` : `axe: no violations across ${targets.length} route(s), 2 themes, 2 widths`);
process.exit(violations ? 1 : 0);
