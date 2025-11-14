// ========================================================
//   VARIABLES GLOBALES
// ========================================================
let interstitialLoaded = false;
let isShowingAd = false;

// ========================================================
//   ESPERAR AL DEVICEREADY
// ========================================================
document.addEventListener("deviceready", () => {
    console.log("📱 Device ready");
    
    registerMedianEvents();
    loadInterstitial();

    // Activar listener del botón
    document.getElementById("show-ad-button").addEventListener("click", onAdButtonClick);
});

// ========================================================
//   EVENTOS DEL SDK MEDIAN + ADMOB
// ========================================================
function registerMedianEvents() {

    // Cuando el interstitial realmente se cargó
    median.on("admob.interstitial.load", () => {
        console.log("📥 Interstitial LISTO para mostrarse");
        interstitialLoaded = true;
        enableAdButton();
    });

    // Si falla la carga
    median.on("admob.interstitial.loadfail", (err) => {
        console.warn("❌ Falló la carga del interstitial:", err);
        interstitialLoaded = false;
        enableAdButton(); 
    });

    // Cuando se muestra
    median.on("admob.interstitial.show", () => {
        console.log("🎬 Interstitial MOSTRADO");
        isShowingAd = true;
    });

    // Cuando se cierra
    median.on("admob.interstitial.dismiss", () => {
        console.log("👋 Interstitial CERRADO");

        isShowingAd = false;
        interstitialLoaded = false;

        // Cargar el siguiente anuncio
        loadInterstitial();

        // Restaurar botón
        resetAdButton();
    });

}

// ========================================================
//   CARGAR INTERSTITIAL
// ========================================================
function loadInterstitial() {
    console.log("🔄 Solicitando anuncio interstitial...");

    median.admob.interstitial.load()
        .then(() => {
            console.log("📨 Petición enviada. Esperando evento 'load'.");
        })
        .catch((err) => {
            console.error("❌ Error al solicitar anuncio:", err);
            interstitialLoaded = false;
            enableAdButton();
        });
}

// ========================================================
//   MOSTRAR INTERSTITIAL
// ========================================================
function showInterstitialAd() {
    if (!interstitialLoaded) {
        console.log("⚠ No se puede mostrar: aún no está cargado.");
        enableAdButton();
        return;
    }

    console.log("🎬 Intentando mostrar interstitial...");

    median.admob.interstitial.show()
        .catch((err) => {
            console.error("❌ Error al mostrar el anuncio:", err);
            interstitialLoaded = false;
            resetAdButton();
            loadInterstitial();
        });
}

// ========================================================
//   LÓGICA DEL BOTÓN
// ========================================================
function onAdButtonClick() {
    console.log("👆 Botón presionado");

    if (!interstitialLoaded) {
        console.log("🚫 Interstitial no listo, cargando...");
        disableAdButton(); // Deshabilitar mientras se carga
        loadInterstitial();
        return;
    }

    disableAdButton();
    showInterstitialAd();
}

// DESACTIVAR BOTÓN
function disableAdButton() {
    const btn = document.getElementById("show-ad-button");
    btn.disabled = true;
    btn.style.opacity = "0.6";
    btn.style.cursor = "not-allowed";
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
}

// ACTIVAR BOTÓN
function enableAdButton() {
    const btn = document.getElementById("show-ad-button");
    btn.disabled = false;
    btn.style.opacity = "1";
    btn.style.cursor = "pointer";
    btn.innerHTML = '<i class="fas fa-play-circle"></i> Ver Anuncio';
}

// RESTAURAR BOTÓN
function resetAdButton() {
    enableAdButton();
}
