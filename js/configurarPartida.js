const titulo = document.getElementById("tituloJuego");
const configuracion = document.getElementById("configuracionJuego");
const botonComenzar = document.getElementById("btnComenzar");
const juego = localStorage.getItem("juegoSeleccionado");

function mostrarMensaje(titulo, texto){

    const modal = document.getElementById("modalMensaje");

    document.getElementById("tituloMensaje").innerText = titulo;
    document.getElementById("textoMensaje").innerText = texto;

    modal.style.display = "flex";

    document.getElementById("cerrarModal").addEventListener("click", function(){

    document.getElementById("modalMensaje").style.display = "none";

});

}

if(juego === "careocas"){

    titulo.innerHTML = "Careocas (Poker)";

    configuracion.innerHTML = `
    
    <label>Cantidad de rondas</label>
    <input type="number" id="cantidadRondas" placeholder="Ej: 10">
    
    `;

}

if(juego === "espanolas"){

    titulo.innerHTML = "Las Españolas (Las Quince)";

    configuracion.innerHTML = `
    
    <label>Puntaje objetivo</label>
    <input type="number" id="puntosObjetivo" placeholder="Ej: 50">
    
    `;

}

function iniciarPartida(){

    if(juego === "careocas"){

        const rondas = document.getElementById("cantidadRondas").value;

        if(rondas === "" || rondas <= 0){

            mostrarMensaje("⚠ Error", "Debes ingresar la cantidad de rondas.");
            return;

        }

        localStorage.setItem("cantidadRondas", rondas);

    }

    if(juego === "espanolas"){

        const objetivo = document.getElementById("puntosObjetivo").value;

        if(objetivo === "" || objetivo <= 0){

            mostrarMensaje("⚠ Error", "Debes ingresar el puntaje objetivo.");
            return;

        }

        localStorage.setItem("puntosObjetivo", objetivo);

    }

    window.location.href = "partida.html";

}

botonComenzar.addEventListener("click", iniciarPartida);

document.addEventListener("keydown", function(e){

    if(e.key === "Enter"){

        iniciarPartida();

    }

});

