const inputJugador = document.getElementById("nombreJugador");
const botonAgregar = document.getElementById("agregarJugador");
const lista = document.getElementById("listaJugadores");
const infoJuego = document.getElementById("infoJuego");
const botonFinalizar = document.getElementById("finalizarPartida");
const botonSiguienteRonda = document.getElementById("siguienteRonda");
const juego = localStorage.getItem("juegoSeleccionado");


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

let rondaActual = 1;

document.addEventListener("click", function(e){

    if(e.target && e.target.id === "siguienteRonda"){

        const rondas = parseInt(localStorage.getItem("cantidadRondas"));

        if(jugadores.length === 0){

            mostrarMensaje("⚠ Error", "Debes agregar al menos un jugador.");

            return;

        }

        if(rondaActual >= rondas){

            finalizarJuego();

            return;

        }

        rondaActual++;

        document.getElementById("rondaActual").innerText =
        "Ronda actual: " + rondaActual;

        if(rondaActual === rondas){

            document.getElementById("siguienteRonda").innerText = "Terminar juego";

        }

    }

});

let jugadores = [];

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

            <button id="sumar" onclick="sumarPuntos(${index})">+</button>

            <button id="restar" onclick="restarPuntos(${index})">-</button>

        </div>

        `;

        lista.appendChild(elemento);

    });
     

    localStorage.setItem("juegoActivo", "true");
    actualizarBotonesJuego();
    guardarPartida();

}

function sumarPuntos(index){

    const input = document.getElementById(`puntos-${index}`);

    const valor = parseInt(input.value);

    if(isNaN(valor)){

        mostrarMensaje("⚠️ Error", "Ingresa un número válido");

        return;

    }

    jugadores[index].puntos += valor;

    mostrarJugadores();
    verificarGanador();

}

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

let jugadorAEliminar = null;

function eliminarJugador(index){

    jugadorAEliminar = index;

    const modal = document.getElementById("modalConfirmacion");

    modal.style.display = "flex";

    document.getElementById("cancelarEliminar").addEventListener("click", function(){

    document.getElementById("modalConfirmacion").style.display = "none";

    document.getElementById("confirmarEliminar").addEventListener("click", function(){

    if(jugadorAEliminar !== null){

        jugadores.splice(jugadorAEliminar, 1);

        mostrarJugadores();

        jugadorAEliminar = null;

    }

    document.getElementById("modalConfirmacion").style.display = "none";

});

});

}

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

function verificarGanador(){

const objetivo = parseInt(localStorage.getItem("puntosObjetivo"));

let ganador = null;
let mayor = -Infinity;

jugadores.forEach(function(jugador){

if(jugador.puntos > mayor){

mayor = jugador.puntos;
ganador = jugador.nombre;

}

});

if(mayor >= objetivo){

mostrarResultado("🏆 Ganador", ganador);
}

}

function mostrarResultado(titulo, texto){

    const modal = document.getElementById("modalResultado");

    document.getElementById("tituloResultado").innerText = titulo;

    document.getElementById("textoResultado").innerText = texto;

    modal.style.display = "flex";

}

function mostrarMensaje(titulo, texto){

    const modal = document.getElementById("modalMensaje");

    document.getElementById("tituloMensaje").innerText = titulo;
    document.getElementById("textoMensaje").innerText = texto;

    modal.style.display = "flex";

    document.getElementById("cerrarModal").addEventListener("click", function(){

    document.getElementById("modalMensaje").style.display = "none";

});

}

function actualizarBotonesJuego(){

    const botonSiguienteRonda = document.getElementById("siguienteRonda");
    const botonFinalizar = document.getElementById("finalizarPartida");

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

function finalizarJuego(){

    const juego = localStorage.getItem("juegoSeleccionado");

    let resultado = [];

    if(juego === "careocas"){

        let menorPuntaje = Infinity;

        jugadores.forEach(function(jugador){

            if(jugador.puntos < menorPuntaje){

                menorPuntaje = jugador.puntos;

            }

        });

        resultado = jugadores.filter(function(j){

            return j.puntos === menorPuntaje;

        });

    }

    if(juego === "espanolas"){

        let mayorPuntaje = -Infinity;

        jugadores.forEach(function(jugador){

            if(jugador.puntos > mayorPuntaje){

                mayorPuntaje = jugador.puntos;

            }

        });

        resultado = jugadores.filter(function(j){

            return j.puntos === mayorPuntaje;

        });

    }

if(resultado.length > 1){

    let nombres = resultado.map(j => j.nombre).join(", ");

    mostrarResultado("🤝 Empate", nombres);

}else{

    mostrarResultado("🏆 Ganador", resultado[0].nombre);

}

document.getElementById("btnCerrarModal").addEventListener("click", function(){

    localStorage.clear();

    window.location.href = "index.html";

});}

botonFinalizar.addEventListener("click", function(){

    document.getElementById("modalFinalizar").style.display = "flex";

    document.getElementById("cancelarFinalizar").addEventListener("click", function(){

    document.getElementById("modalFinalizar").style.display = "none";

});

document.getElementById("confirmarFinalizar").addEventListener("click", function(){

    document.getElementById("modalFinalizar").style.display = "none";

    finalizarJuego();

});

});


actualizarBotonesJuego();
cargarPartida();
