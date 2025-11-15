// ========================================================
//   VARIABLES GLOBALES
// ========================================================
let interstitialLoaded = false;
let isShowingAd = false;

// ========================================================
//   INICIALIZACIÓN - ESPERAR A QUE MEDIAN ESTÉ LISTO
// ========================================================
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    console.log("📱 Device ready, esperando Median...");
    
    // Esperar a que Median esté completamente listo
    if (typeof median !== 'undefined') {
        initAds();
    } else {
        // Si median no está disponible, reintentar después de un tiempo
        setTimeout(() => {
            if (typeof median !== 'undefined') {
                initAds();
            } else {
                console.error("❌ Median SDK no encontrado");
            }
        }, 2000);
    }
}

function initAds() {
    console.log("🚀 Inicializando anuncios con Median...");
    
    // INICIALIZAR EL INTERSTITIAL (esto te falta)
    if (median.admob && median.admob.interstitial) {
        median.admob.interstitial.config({
            id: 'ca-app-pub-3940256099942544/1033173712' // Tu interstitial ID
        });
        console.log("✅ Interstitial configurado");
    }
    
    registerMedianEvents();
    
    // Cargar interstitial después de configurarlo
    setTimeout(() => {
        loadInterstitial();
    }, 1000);
    
    // Listener del botón
    const adButton = document.getElementById("show-ad-button");
    if (adButton) {
        adButton.addEventListener("click", onAdButtonClick);
        console.log("✅ Botón de anuncios configurado");
    } else {
        console.error("❌ Botón show-ad-button no encontrado");
    }
}

// ========================================================
//   EVENTOS DEL SDK MEDIAN + ADMOB
// ========================================================
function registerMedianEvents() {
    if (typeof median === 'undefined') {
        console.error("❌ Median no disponible para registrar eventos");
        return;
    }

    // Interstitial cargado correctamente
    median.on("admob.interstitial.loaded", () => {
        console.log("📥 Interstitial LISTO para mostrarse");
        interstitialLoaded = true;
        enableAdButton();
    });

    // Error al cargar el interstitial
    median.on("admob.interstitial.failedToLoad", (err) => {
        console.warn("❌ Falló la carga del interstitial:", err);
        interstitialLoaded = false;
        enableAdButton();
        // Reintentar después de 3 segundos
        setTimeout(loadInterstitial, 3000);
    });

    // Cuando se cierra
    median.on("admob.interstitial.dismissed", () => {
        console.log("👋 Interstitial CERRADO");
        isShowingAd = false;
        interstitialLoaded = false;
        
        // Cargar otro anuncio automáticamente
        setTimeout(loadInterstitial, 1000);
        resetAdButton();
    });
}

// ========================================================
//   CARGAR INTERSTITIAL
// ========================================================
function loadInterstitial() {
    if (typeof median === 'undefined' || !median.admob || !median.admob.interstitial) {
        console.error("❌ Median Admob no disponible para cargar interstitial");
        return;
    }

    console.log("🔄 Cargando interstitial...");
    interstitialLoaded = false;

    median.admob.interstitial.load()
        .then(() => {
            console.log("✅ Petición de interstitial enviada correctamente");
        })
        .catch((err) => {
            console.error("❌ Error al cargar interstitial:", err);
            interstitialLoaded = false;
            enableAdButton();
        });
}

// ========================================================
//   MOSTRAR INTERSTITIAL
// ========================================================
function showInterstitialAd() {
    if (typeof median === 'undefined' || !median.admob || !median.admob.interstitial) {
        console.error("❌ Median Admob no disponible para mostrar interstitial");
        enableAdButton();
        return;
    }

    if (!interstitialLoaded) {
        console.log("⚠ Interstitial no cargado, recargando...");
        loadInterstitial();
        enableAdButton();
        return;
    }

    console.log("🎬 Mostrando interstitial...");
    
    median.admob.interstitial.show()
        .then(() => {
            console.log("✅ Interstitial mostrado");
            isShowingAd = true;
        })
        .catch((err) => {
            console.error("❌ Error al mostrar interstitial:", err);
            interstitialLoaded = false;
            resetAdButton();
            loadInterstitial();
        });
}

// ========================================================
//   LÓGICA DEL BOTÓN
// ========================================================
function onAdButtonClick() {
    console.log("👆 Botón presionado - Estado interstitial:", interstitialLoaded);
    
    if (!interstitialLoaded) {
        console.log("🔄 Interstitial no listo, cargando...");
        disableAdButton();
        loadInterstitial();
        return;
    }

    disableAdButton();
    showInterstitialAd();
}

// DESACTIVAR BOTÓN
function disableAdButton() {
    const btn = document.getElementById("show-ad-button");
    if (btn) {
        btn.disabled = true;
        btn.style.opacity = "0.6";
        btn.style.cursor = "not-allowed";
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
    }
}

// ACTIVAR BOTÓN
function enableAdButton() {
    const btn = document.getElementById("show-ad-button");
    if (btn) {
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
        btn.innerHTML = '<i class="fas fa-play-circle"></i> Ver Anuncio';
    }
}

// RESTAURAR BOTÓN
function resetAdButton() {
    enableAdButton();
}

// Cargar interstitial cuando la página esté lista
document.addEventListener('DOMContentLoaded', function() {
    console.log("📄 DOM cargado, preparando anuncios...");
});