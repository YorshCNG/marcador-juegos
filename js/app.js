const botonSi = document.getElementById("btnSi");
const botonNo = document.getElementById("btnNo");
const mensaje = document.getElementById("mensajeInicio");

const partidaGuardada = localStorage.getItem("jugadores");

if(partidaGuardada){

    mensaje.innerHTML = "Hay una partida en curso<br>¿Deseas continuar el juego?";

}

botonSi.addEventListener("click", function(){

    const partidaActiva = localStorage.getItem("juegoActivo");

    if(partidaActiva === "true"){

        window.location.href = "/marcador-juegos/html/partida.html";

    }else{

        window.location.href = "/marcador-juegos/html/seleccionarJuego.html";

    }

});

botonNo.addEventListener("click", function(){

    localStorage.removeItem("jugadores");

    mensaje.innerHTML = "¿Deseas iniciar una nueva partida?";

});
