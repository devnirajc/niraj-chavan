/*
 * Retires the service worker registered by the previous version of this site.
 *
 * That build precached its pages with Workbox and registered
 * /niraj-chavan/sw.js with registerType "autoUpdate". Simply deleting the file
 * would leave returning visitors on the cached old site indefinitely — a
 * failed update check keeps the existing worker running. Instead, the browser
 * finds this new script at the same URL, installs it, and it removes itself:
 * clear every cache, unregister, and reload any open tabs onto the live site.
 *
 * Safe to delete once old visitors have had a few months to come back.
 */
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const windows = await self.clients.matchAll({ type: 'window' });
      windows.forEach((client) => client.navigate(client.url));
    })()
  );
});
