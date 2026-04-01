const CACHE_NAME = "marcador-juegos-v2";

const urlsToCache = [
    "/",
    "/index.html",

    "/html/partida.html",
    "/html/configurarPartida.html",
    "/html/seleccionarJuego.html",

    "/css/indice.css",
    "/css/partida.css",
    "/css/configurarPartida.css",
    "/css/seleccionarJuego.css",

    "/js/app.js",
    "/js/partida.js",
    "/js/configurarPartida.js",
    "/js/seleccionarJuego.js",

    "/icons/icon-192.png",
    "/icons/icon-512.png"
];;

self.addEventListener("install", event => {

event.waitUntil(

caches.open(CACHE_NAME)
.then(cache => cache.addAll(urlsToCache))

);

});

self.addEventListener("fetch", event => {

event.respondWith(

caches.match(event.request)
.then(response => {

return response || fetch(event.request);

})

);

});

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
});
