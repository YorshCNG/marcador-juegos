const inputJugador = document.getElementById("nombreJugador");
const botonAgregar = document.getElementById("agregarJugador");
const lista = document.getElementById("listaJugadores");
const infoJuego = document.getElementById("infoJuego");
const botonFinalizar = document.getElementById("finalizarPartida");
const modalPuntajes = document.getElementById("modalPuntajes");
const inputsContainer = document.getElementById("inputsPuntajes");
const btnGuardar = document.getElementById("guardarPuntajes");
const juego = localStorage.getItem("juegoSeleccionado");

// 🔴 Validación importante
if(!juego){
    window.location.href = "/marcador-juegos/index.html";
}

// ============================
// 🎮 CONFIGURACIÓN DEL JUEGO
// ============================

if(juego === "careocas"){

    const rondas = localStorage.getItem("cantidadRondas");

    infoJuego.innerHTML = `
    <div class="infoJuego">
        <h3>Configuración</h3>
        <p>Rondas totales: ${rondas}</p>
        <p id="rondaActual">Ronda actual: 1</p>
        <button id="siguienteRonda">Siguiente ronda</button>
    </div>
    `;
}

if(juego === "espanolas"){

    const objetivo = localStorage.getItem("puntosObjetivo");

    infoJuego.innerHTML = `
    <div class="infoJuego">
        <h3>Objetivo del juego</h3>
        <p>Puntaje objetivo: ${objetivo}</p>
    </div>
    `;
}

// ============================
// 🔄 CONTROL DE RONDAS
// ============================

let rondaActual = 1;

document.addEventListener("click", function(e){

    if(e.target && e.target.id === "siguienteRonda"){
        abrirModalPuntajes();
    }

});

// ============================
// 👥 JUGADORES (BASE)
// ============================

let jugadores = [];

// ============================
// ➕ AGREGAR JUGADOR
// ============================

botonAgregar.addEventListener("click", function(){

    const nombre = inputJugador.value;

    if(nombre === ""){
        mostrarMensaje("⚠️ Error", "Escribe un nombre");
        return;
    }

    const jugador = {
        nombre: nombre,
        puntos: 0
    };

    jugadores.push(jugador);

    mostrarJugadores();

    inputJugador.value = "";
});

// ============================
// 📋 MOSTRAR JUGADORES
// ============================

function mostrarJugadores(){

    lista.innerHTML = "";

    jugadores.forEach(function(jugador, index){

        const elemento = document.createElement("li");

        elemento.innerHTML = `
        
        <div class="jugadorHeader">

            <div class="infoJugador">
                <span class="nombre">${jugador.nombre}</span>
                <span class="puntos">| Total: ${jugador.puntos}</span>
            </div>

            <button class="btnEliminar" onclick="eliminarJugador(${index})">🗑️</button>

        </div>

        <div class="controles">

            <input type="number" id="puntos-${index}" placeholder="0">

            <button onclick="sumarPuntos(${index})">+</button>

            <button onclick="restarPuntos(${index})">-</button>

        </div>
        `;

        lista.appendChild(elemento);
    });

    localStorage.setItem("juegoActivo", "true");

    actualizarBotonesJuego();
    guardarPartida();
}

// ============================
// ➕ SUMAR PUNTOS
// ============================

function sumarPuntos(index){

    const input = document.getElementById(`puntos-${index}`);
    const valor = parseInt(input.value);

    if(isNaN(valor)){
        mostrarMensaje("⚠️ Error", "Ingresa un número válido");
        return;
    }

    jugadores[index].puntos += valor;

    mostrarJugadores();

    // 🔥 pequeña pausa para evitar errores de render
    setTimeout(() => {
        verificarGanador();
    }, 100);
}

// ============================
// ➖ RESTAR PUNTOS
// ============================

function restarPuntos(index){

    const input = document.getElementById(`puntos-${index}`);
    const valor = parseInt(input.value);

    if(isNaN(valor)){
        mostrarMensaje("⚠️ Error", "Ingresa un número válido");
        return;
    }

    jugadores[index].puntos -= valor;

    mostrarJugadores();
}

// ============================
// 🗑️ ELIMINAR JUGADOR (FIX TOTAL)
// ============================

let jugadorAEliminar = null;

function eliminarJugador(index){

    jugadorAEliminar = index;

    document.getElementById("modalConfirmacion").style.display = "flex";
}

// 🔴 EVENTOS SOLO UNA VEZ (IMPORTANTE)

document.getElementById("cancelarEliminar").addEventListener("click", function(){
    document.getElementById("modalConfirmacion").style.display = "none";
});

document.getElementById("confirmarEliminar").addEventListener("click", function(){

    if(jugadorAEliminar !== null){

        jugadores.splice(jugadorAEliminar, 1);

        mostrarJugadores();

        jugadorAEliminar = null;
    }

    document.getElementById("modalConfirmacion").style.display = "none";
});

// ============================
// 💾 GUARDAR / CARGAR PARTIDA
// ============================

function guardarPartida(){
    localStorage.setItem("jugadores", JSON.stringify(jugadores));
}

function cargarPartida(){

    const datos = localStorage.getItem("jugadores");

    if(datos){
        jugadores = JSON.parse(datos);
        mostrarJugadores();
    }
}

// ============================
// 🏆 VERIFICAR GANADOR (ESPAÑOLAS)
// ============================

function verificarGanador(){

    const objetivo = parseInt(localStorage.getItem("puntosObjetivo"));

    if(!objetivo) return;

    let mayor = -Infinity;

    jugadores.forEach(function(jugador){
        if(jugador.puntos > mayor){
            mayor = jugador.puntos;
        }
    });

    if(mayor >= objetivo){
        finalizarJuego();
    }
}

// ============================
// 🏁 FINALIZAR JUEGO (FIX TOTAL)
// ============================

function finalizarJuego(){

    const juego = localStorage.getItem("juegoSeleccionado");

    if(jugadores.length === 0){
        mostrarMensaje("⚠ Error", "No hay jugadores.");
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

    // 🔴 PROTECCIÓN CRÍTICA
    if(resultado.length === 0){
        mostrarMensaje("⚠ Error", "No se pudo determinar ganador.");
        return;
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
// ⚠️ MODAL MENSAJES (FIX)
// ============================

function mostrarMensaje(titulo, texto){

    const modal = document.getElementById("modalMensaje");

    document.getElementById("tituloMensaje").innerText = titulo;
    document.getElementById("textoMensaje").innerText = texto;

    modal.style.display = "flex";
}

// 🔴 EVENTO GLOBAL (UNA SOLA VEZ)
document.getElementById("cerrarModal").addEventListener("click", function(){
    document.getElementById("modalMensaje").style.display = "none";
});

// ============================
// 🔘 BOTONES FINALIZAR PARTIDA
// ============================

botonFinalizar.addEventListener("click", function(){
    document.getElementById("modalFinalizar").style.display = "flex";
});

document.getElementById("cancelarFinalizar").addEventListener("click", function(){
    document.getElementById("modalFinalizar").style.display = "none";
});

document.getElementById("confirmarFinalizar").addEventListener("click", function(){

    document.getElementById("modalFinalizar").style.display = "none";

    finalizarJuego();
});

// ============================
// 🔄 BOTONES ACTIVOS / INACTIVOS
// ============================

function actualizarBotonesJuego(){

    const botonSiguienteRonda = document.getElementById("siguienteRonda");

    if(!botonFinalizar) return;

    if(jugadores.length === 0){

        if(botonSiguienteRonda){
            botonSiguienteRonda.disabled = true;
        }

        botonFinalizar.disabled = true;

    }else{

        if(botonSiguienteRonda){
            botonSiguienteRonda.disabled = false;
        }

        botonFinalizar.disabled = false;
    }
}

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

    mostrarJugadores();
    guardarPartida();

    avanzarRonda();
});

function avanzarRonda(){

    if(juego === "careocas"){

        const rondas = parseInt(localStorage.getItem("cantidadRondas"));

        rondaActual++;

        document.getElementById("rondaActual").innerText =
            "Ronda actual: " + rondaActual;

        if(rondaActual > rondas){
            finalizarJuego();
        }
    }
}

// ============================
// 🔄 CERRAR RESULTADO (VOLVER AL MENÚ)
// ============================

document.getElementById("btnCerrarModal").addEventListener("click", function(){

    localStorage.clear();

    window.location.href = "/marcador-juegos/index.html";
});

// ============================
// 🚀 INICIALIZACIÓN
// ============================

actualizarBotonesJuego();
cargarPartida();
