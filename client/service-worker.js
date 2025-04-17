const assetsToCache = [
  "/",
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
  "jquery-3.3.1.slim.min.js"
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
