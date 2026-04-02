const lista = document.getElementById("listaJugadores");
const infoJuego = document.getElementById("infoJuego");
const botonFinalizar = document.getElementById("finalizarPartida");
const btnRonda = document.getElementById("btnRonda");

const modalPuntajes = document.getElementById("modalPuntajes");
const inputsContainer = document.getElementById("inputsPuntajes");
const btnGuardar = document.getElementById("guardarPuntajes");

const juego = localStorage.getItem("juegoSeleccionado");

// 🔴 seguridad
if(!juego){
    window.location.href = "/marcador-juegos/index.html";
}

// ============================
// 📦 DATOS
// ============================

let jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];
let rondaActual = 1;

// ============================
// 🎮 INFO DEL JUEGO
// ============================

function cargarInfo(){

    const titulo = document.getElementById("tituloJuego");

    if(juego === "careocas"){

        const rondas = localStorage.getItem("cantidadRondas");

        titulo.innerText = "Careocas";

        infoJuego.innerHTML = `
            <p>Ronda: ${rondaActual} / ${rondas}</p>
        `;
    }

    if(juego === "espanolas"){

        const objetivo = localStorage.getItem("puntosObjetivo");

        titulo.innerText = "Las Españolas";

        infoJuego.innerHTML = `
            <p>Objetivo: ${objetivo} puntos</p>
        `;
    }
}

// ============================
// 👥 MOSTRAR JUGADORES
// ============================

function mostrarJugadores(){

    lista.innerHTML = "";

    jugadores.forEach(jugador => {

        const li = document.createElement("li");

        li.innerHTML = `
            <div class="jugadorHeader">
                <span class="nombre">${jugador.nombre}</span>
                <span class="puntos">${jugador.puntos}</span>
            </div>
        `;

        lista.appendChild(li);
    });
}

// ============================
// 📊 MODAL PUNTAJES
// ============================

function abrirModalPuntajes(){

    inputsContainer.innerHTML = "";

    jugadores.forEach((jugador, index) => {

        const div = document.createElement("div");

        div.innerHTML = `
            <label>${jugador.nombre}</label>
            <input type="number" id="puntaje-${index}" placeholder="0">
        `;

        inputsContainer.appendChild(div);
    });

    modalPuntajes.style.display = "flex";
}

btnGuardar.addEventListener("click", () => {

    for(let i = 0; i < jugadores.length; i++){

        const input = document.getElementById(`puntaje-${i}`);
        const valor = parseInt(input.value);

        if(isNaN(valor)){
            alert("Todos los jugadores deben tener puntaje");
            return;
        }

        jugadores[i].puntos += valor;
    }

    modalPuntajes.style.display = "none";

    guardarPartida();
    mostrarJugadores();
    avanzarRonda();
    verificarGanador();
});

// ============================
// 🔄 RONDAS
// ============================

function avanzarRonda(){

    if(juego === "careocas"){

        const rondas = parseInt(localStorage.getItem("cantidadRondas"));

        rondaActual++;

        if(rondaActual > rondas){
            btnRonda.style.display = "none";
        }

        cargarInfo();
    }
}

// ============================
// 🏆 GANADOR (ESPAÑOLAS)
// ============================

function verificarGanador(){

    if(juego !== "espanolas") return;

    const objetivo = parseInt(localStorage.getItem("puntosObjetivo"));

    let mayor = Math.max(...jugadores.map(j => j.puntos));

    if(mayor >= objetivo){
        finalizarJuego();
    }
}

// ============================
// 🏁 FINALIZAR JUEGO
// ============================

function finalizarJuego(){

    if(jugadores.length === 0){
        alert("No hay jugadores");
        return;
    }

    let resultado = [];

    if(juego === "careocas"){
        let menor = Math.min(...jugadores.map(j => j.puntos));
        resultado = jugadores.filter(j => j.puntos === menor);
    }

    if(juego === "espanolas"){
        let mayor = Math.max(...jugadores.map(j => j.puntos));
        resultado = jugadores.filter(j => j.puntos === mayor);
    }

    if(resultado.length > 1){

        let nombres = resultado.map(j => j.nombre).join(", ");
        mostrarResultado("🤝 Empate", nombres);

    }else{

        mostrarResultado("🏆 Ganador", resultado[0].nombre);
    }
}

// ============================
// 📊 MODAL RESULTADO
// ============================

function mostrarResultado(titulo, texto){

    const modal = document.getElementById("modalResultado");

    document.getElementById("tituloResultado").innerText = titulo;
    document.getElementById("textoResultado").innerText = texto;

    modal.style.display = "flex";
}

// ============================
// 🔘 BOTONES
// ============================

btnRonda.addEventListener("click", abrirModalPuntajes);

botonFinalizar.addEventListener("click", finalizarJuego);

// ============================
// 💾 GUARDADO
// ============================

function guardarPartida(){
    localStorage.setItem("jugadores", JSON.stringify(jugadores));
}

// ============================
// 🚀 INIT
// ============================

cargarInfo();
mostrarJugadores();
