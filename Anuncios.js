// Anuncios.js - CÓDIGO MÁS SIMPLE
document.addEventListener("deviceready", function() {
    // Configurar interstitial
    median.admob.interstitial.config({
        id: "ca-app-pub-3940256099942544/1033173712"
    });
    
    // Cargar interstitial al iniciar
    median.admob.interstitial.load();
    
    // Cuando se cierra, recargar
    median.on("admob.interstitial.dismissed", function() {
        median.admob.interstitial.load();
    });
    
    // Botón para mostrar
    document.getElementById("show-ad-button").addEventListener("click", function() {
        median.admob.interstitial.show();
    });
});