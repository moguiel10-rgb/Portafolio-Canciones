// Anuncios.js - VERSIÓN SIMPLE
document.addEventListener("deviceready", function() {
    // Configurar el interstitial
    median.admob.interstitial.config({
        id: 'ca-app-pub-3940256099942544/1033173712'
    });

    // Cargar el interstitial al iniciar
    median.admob.interstitial.load();

    // Cuando el interstitial está listo
    median.on("admob.interstitial.loaded", function() {
        console.log("Interstitial cargado y listo");
        document.getElementById("show-ad-button").disabled = false;
    });

    // Cuando falla la carga
    median.on("admob.interstitial.failedToLoad", function() {
        console.log("Error cargando interstitial, reintentando...");
        setTimeout(function() {
            median.admob.interstitial.load();
        }, 3000);
    });

    // Cuando se cierra el interstitial
    median.on("admob.interstitial.dismissed", function() {
        console.log("Interstitial cerrado, recargando...");
        median.admob.interstitial.load();
    });

    // Configurar el botón
    document.getElementById("show-ad-button").addEventListener("click", function() {
        if (median.admob.interstitial) {
            median.admob.interstitial.show().catch(function(error) {
                console.log("Error mostrando interstitial: " + error);
                median.admob.interstitial.load();
            });
        }
    });
}, false);