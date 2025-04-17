const assetsToCache = [
  "/",
  "index.html",
  "style.css",
  "wiki.js",
  "glitch-pwa.js",
  "chess-console-stockfish.js",
  "chess.js",
  "favicon.png",
  "stockfish-niklasf-v10.js",
  "all.min.css",
  "bootstrap.bundle.min.js",
  "es-module-shims.min.js",
  "jquery-3.3.1.slim.min.js",
  "/assets/styles/screen.css",
  "/assets/books/openings.bin",
  "/assets/sounds/chess_console_sounds.mp3",
  "/assets/pieces/staunty.svg",
  "/assets/extensions/markers/markers.svg",
  "/webfonts/fa-solid-900.woff2",
  "/webfonts/fa-solid-900.woff",
  "/webfonts/fa-solid-900.ttf",
  "manifest.json",
  "icon-120.png",
  "icon-180.png",
  "icon-192.png",
  "icon-512.png"
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
