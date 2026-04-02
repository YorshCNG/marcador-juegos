function irJuego(juego){

    localStorage.setItem("juegoSeleccionado", juego);

    function mostrarToast(mensaje){

    const toast = document.getElementById("toast");

    toast.innerText = mensaje;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

    window.location.href = "/marcador-juegos/html/configurarPartida.html";

}
