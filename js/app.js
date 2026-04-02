const botonSi = document.getElementById("btnSi");
const botonNo = document.getElementById("btnNo");
const mensaje = document.getElementById("mensajeInicio");

const jugadores = JSON.parse(localStorage.getItem("jugadores"));
const partidaActiva = localStorage.getItem("juegoActivo");

if(jugadores && jugadores.length > 0 && partidaActiva === "true"){

    mensaje.innerHTML = "Hay una partida en curso<br>¿Deseas continuar el juego?";

}else{

    mensaje.innerHTML = "¿Deseas iniciar una nueva partida?";

}

// BOTÓN SI
botonSi.addEventListener("click", function(){

    const partidaActiva = localStorage.getItem("juegoActivo");

    if(partidaActiva === "true"){

        window.location.href = "/marcador-juegos/html/partida.html";

    }else{

        window.location.href = "/marcador-juegos/html/seleccionarJuego.html";

    }

});

// BOTÓN NO
botonNo.addEventListener("click", function(){

    localStorage.clear();

    mensaje.innerHTML = "¿Deseas iniciar una nueva partida?";

});
