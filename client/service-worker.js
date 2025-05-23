const assetsToCache = [
  "/",
  "index.html",
  "glitch-pwa.js",
  "cm-modules-bundle.js",
  "chess.js",
  "manifest.json",
  "icon-120.png",
  "icon-180.png",
  "icon-192.png",
  "icon-512.png",
  "/assets/js/stockfish-niklasf-v10.js",
  "/assets/js/bootstrap.bundle.min.js",
  "/assets/js/es-module-shims.min.js",
  "/assets/js/jquery-3.3.1.slim.min.js",
  "/assets/js/bootstrap-auto-dark-mode.js",
  "/assets/styles/all.min.css",
  "/assets/styles/screen.css",
  "/assets/books/openings.bin",
  "/assets/sounds/chess_console_sounds.mp3",
  "/assets/pieces/staunty.svg",
  "/assets/extensions/markers/markers.svg",
  "/chess/webfonts/fa-solid-900.woff2",
  "/chess/webfonts/fa-solid-900.woff",
  "/chess/webfonts/fa-solid-900.ttf",
]

// what to cache for offline use
self.addEventListener("install", (e) => {

  const filesUpdate = cache => {
    const stack = [];
    assetsToCache.forEach(file => stack.push(
      cache.add(file).catch(_ => console.error(`can't load ${file} to cache`))
    ));
    return Promise.all(stack);
  };

  e.waitUntil(
    caches.open("glitch-hello-installable-cache").then(filesUpdate)
  );
});

// network first, with cache as backup
self.addEventListener("fetch", function (event) {
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request);
    })
  );
});
