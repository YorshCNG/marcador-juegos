const CACHE_NAME = "marcador-juegos-v4";

// 🔥 BASE PATH (CLAVE)
const BASE = "/marcador-juegos/";

const urlsToCache = [
    BASE,
    BASE + "index.html",

    BASE + "html/partida.html",
    BASE + "html/configurarPartida.html",
    BASE + "html/seleccionarJuego.html",

    BASE + "css/indice.css",
    BASE + "css/partida.css",
    BASE + "css/configurarPartida.css",
    BASE + "css/seleccionarJuego.css",

    BASE + "js/app.js",
    BASE + "js/partida.js",
    BASE + "js/configurarPartida.js",
    BASE + "js/seleccionarJuego.js",

    BASE + "icons/icon-192.png",
    BASE + "icons/icon-512.png"
];

// ============================
// 📦 INSTALL
// ============================

self.addEventListener("install", event => {

    self.skipWaiting(); // 🔥 fuerza instalación inmediata

    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache))
    );
});

// ============================
// 🔄 ACTIVATE (limpia cache viejo)
// ============================

self.addEventListener("activate", event => {

    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if(key !== CACHE_NAME){
                        return caches.delete(key);
                    }
                })
            );
        })
    );

    self.clients.claim(); // 🔥 toma control inmediato
});

// ============================
// 🌐 FETCH (MEJORADO)
// ============================

self.addEventListener("fetch", event => {

    event.respondWith(

        fetch(event.request)
        .then(response => {

            return caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, response.clone());
                return response;
            });

        })
        .catch(() => {
            return caches.match(event.request);
        })

    );

});
