function irJuego(juego){

    localStorage.setItem("juegoSeleccionado", juego);

    window.location.href = "/marcador-juegos/html/configurarPartida.html";

}
