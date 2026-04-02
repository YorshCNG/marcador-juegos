const juego = localStorage.getItem("juegoSeleccionado");

const titulo = document.getElementById("tituloJuego");

// pasos
const paso1 = document.getElementById("paso1");
const paso2 = document.getElementById("paso2");
const paso3 = document.getElementById("paso3");

// botones
const btnPaso1 = document.getElementById("btnPaso1");
const btnPaso2 = document.getElementById("btnPaso2");
const btnIniciar = document.getElementById("btnIniciar");

// jugadores
const inputJugador = document.getElementById("nombreJugador");
const lista = document.getElementById("listaJugadores");

let jugadores = [];

// CONFIGURAR JUEGO
if(juego === "careocas"){
    titulo.innerText = "Careocas (Poker)";
    document.getElementById("configuracionJuego").innerHTML = `
        <label>Cantidad de rondas</label>
        <input type="number" id="cantidadRondas">
    `;
}

if(juego === "espanolas"){
    titulo.innerText = "Las Españolas";
    document.getElementById("configuracionJuego").innerHTML = `
        <label>Puntaje objetivo</label>
        <input type="number" id="puntosObjetivo">
    `;
}

//////////////////////////////
// PASO 1 → PASO 2
//////////////////////////////
btnPaso1.addEventListener("click", () => {

    if(juego === "careocas"){
        const rondas = document.getElementById("cantidadRondas").value;
        if(rondas === "" || rondas <= 0){
            mostrarToast("Ingresa rondas válidas");
            return;
        }
        localStorage.setItem("cantidadRondas", rondas);
    }

    if(juego === "espanolas"){
        const puntos = document.getElementById("puntosObjetivo").value;
        if(puntos === "" || puntos <= 0){
            mostrarToast("Ingresa puntaje válido");
            return;
        }
        localStorage.setItem("puntosObjetivo", puntos);
    }

    paso1.style.display = "none";
    paso2.style.display = "flex";
});

//////////////////////////////
// AGREGAR JUGADOR
//////////////////////////////
document.getElementById("agregarJugador").addEventListener("click", () => {

    const nombre = inputJugador.value.trim();

    if(nombre === ""){
        mostrarToast("Escribe un nombre");
        return;
    }

    jugadores.push({
        nombre,
        puntos: 0
    });

    inputJugador.value = "";

    renderJugadores();
});

function renderJugadores(){
    lista.innerHTML = "";

    jugadores.forEach((j, i) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${j.nombre}
            <button onclick="eliminarJugador(${i})">❌</button>
        `;
        lista.appendChild(li);
    });
}

function eliminarJugador(index){
    jugadores.splice(index, 1);
    renderJugadores();
}

//////////////////////////////
// PASO 2 → PASO 3
//////////////////////////////
btnPaso2.addEventListener("click", () => {

    if(jugadores.length === 0){
        mostrarToast("Agrega al menos un jugador");
        return;
    }

    paso2.style.display = "none";
    paso3.style.display = "flex";

    mostrarResumen();
});

//////////////////////////////
// RESUMEN
//////////////////////////////
function mostrarResumen(){

    const resumen = document.getElementById("resumen");

    let html = "<h3>Resumen</h3>";

    if(juego === "careocas"){
        html += `<p>Rondas: ${localStorage.getItem("cantidadRondas")}</p>`;
    }

    if(juego === "espanolas"){
        html += `<p>Objetivo: ${localStorage.getItem("puntosObjetivo")}</p>`;
    }

    html += "<p>Jugadores:</p>";

    jugadores.forEach(j => {
        html += `<p>• ${j.nombre}</p>`;
    });

    resumen.innerHTML = html;
}

function mostrarToast(mensaje){

    const toast = document.getElementById("toast");

    toast.innerText = mensaje;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

//////////////////////////////
// INICIAR PARTIDA
//////////////////////////////
btnIniciar.addEventListener("click", () => {

    localStorage.setItem("jugadores", JSON.stringify(jugadores));
    localStorage.setItem("juegoActivo", "true");

    window.location.href = "partida.html";
});
