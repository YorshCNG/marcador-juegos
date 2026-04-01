const inputJugador = document.getElementById("nombreJugador");
const botonAgregar = document.getElementById("agregarJugador");
const lista = document.getElementById("listaJugadores");
const infoJuego = document.getElementById("infoJuego");
const botonFinalizar = document.getElementById("finalizarPartida");

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

        const rondas = parseInt(localStorage.getItem("cantidadRondas"));

        if(jugadores.length === 0){
            mostrarMensaje("⚠ Error", "Debes agregar al menos un jugador.");
            return;
        }

        // 🔴 Si ya está en la última → terminar
        if(rondaActual >= rondas){
            finalizarJuego();
            return;
        }

        rondaActual++;

        document.getElementById("rondaActual").innerText =
        "Ronda actual: " + rondaActual;

        // 🔥 Cambia texto en última ronda
        if(rondaActual === rondas){
            document.getElementById("siguienteRonda").innerText = "Terminar juego";
        }
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
