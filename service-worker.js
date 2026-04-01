const CACHE_NAME = "marcador-juegos-v1";

const urlsToCache = [

"/",
"/html/indice.html",
"/html/partida.html",
"/html/configurarPartida.html",
"/html/seleccionarJuego.html",

"/css/styles.css",

"/js/app.js",
"/js/partida.js",
"/js/configurarPartida.js",
"/js/seleccionarJuego.js"

];

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