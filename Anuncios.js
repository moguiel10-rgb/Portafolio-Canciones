document.addEventListener("deviceready", function () {

    console.log("Device ready");

    // Configurar interstitial (solo por si acaso)
    if (median && median.admob && median.admob.interstitial && median.admob.interstitial.config) {
        median.admob.interstitial.config({
            id: "ca-app-pub-3940256099942544/1033173712" // ID de prueba
        });
    }

    // Cargar anuncio al inicio
    console.log("Cargando interstitial...");
    median.admob.interstitial.load();

    // Evento cuando se cargó
    median.on("admob.interstitial.loaded", function () {
        console.log("✔ Interstitial LISTO");
    });

    // Evento si falla la carga
    median.on("admob.interstitial.failedToLoad", function (err) {
        console.log("❌ Falló carga interstitial:", err);
        setTimeout(() => {
            median.admob.interstitial.load();
        }, 2000);
    });

    // Cuando se cierra
    median.on("admob.interstitial.dismissed", function () {
        console.log("🔄 Cerrado. Recargando...");
        median.admob.interstitial.load();
    });

    // BOTÓN PARA MOSTRAR
    document.getElementById("show-ad-button").addEventListener("click", function () {
        console.log("Botón presionado: intentar mostrar interstitial");

        median.admob.interstitial.show()
            .then(() => console.log("Mostrando anuncio..."))
            .catch(err => {
                console.log("❌ Error al mostrar:", err);
                median.admob.interstitial.load();
            });
    });

});
