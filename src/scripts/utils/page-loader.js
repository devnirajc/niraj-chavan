/**
 * Page loader
 *
 * The overlay itself is markup in index.html, styled by the inline critical CSS
 * in that file's <head> — it has to be able to paint before this bundle, and
 * therefore before the stylesheet this bundle imports, exists. All this module
 * does is take it back down once there is a rendered page behind it.
 */

/* A warm reload can be ready in well under a tenth of a second, which would
   show the loader for a frame or two and read as a flicker. Below this mark the
   visitor sees a still, correctly coloured canvas instead: the ring and label
   are held back by roughly the same amount in CSS. */
const MIN_VISIBLE_MS = 450;

/* Revealing the page mid font-swap undoes the point of the overlay, but a slow
   font server must not keep it up either. */
const FONT_WAIT_MS = 1200;

/* Must outlast the fade in `.page-loader--done`. */
const FADE_MS = 340;

/**
 * Fades the overlay out and removes it. Safe to call more than once, and safe
 * to call when the markup is absent.
 */
export function hidePageLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  const dismiss = () => {
    loader.classList.add('page-loader--done');
    // The status is over; stop exposing it while it fades.
    loader.setAttribute('aria-hidden', 'true');
    window.setTimeout(() => loader.remove(), FADE_MS);
  };

  // Same handler for both outcomes: a rejected `fonts.ready` is not a reason to
  // leave the page covered.
  whenReady().then(dismiss, dismiss);
}

function whenReady() {
  return Promise.all([fontsSettled(), minimumElapsed()]).then(nextPaint);
}

function fontsSettled() {
  if (!document.fonts) return Promise.resolve();
  // Swallowed rather than propagated: fonts that failed to load are a reason to
  // stop waiting, not a reason to skip the rest of the sequence below.
  return Promise.race([document.fonts.ready, delay(FONT_WAIT_MS)]).catch(() => {});
}

function minimumElapsed() {
  // `performance.now()` counts from navigation start, so this is how long the
  // visitor has actually been looking at the overlay — not how long we took.
  return delay(Math.max(0, MIN_VISIBLE_MS - performance.now()));
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

/** Resolves once the browser has painted the frame the sections are in. */
function nextPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
}
