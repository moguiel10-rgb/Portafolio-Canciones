// ========================================================
//   MINI-CONSOLA VISIBLE EN PANTALLA
// ========================================================
function createDebugConsole() {
    const debugDiv = document.createElement('div');
    debugDiv.id = 'debug-console';
    debugDiv.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0,0,0,0.8);
        color: lime;
        padding: 10px;
        font-size: 12px;
        z-index: 9999;
        max-width: 300px;
        max-height: 200px;
        overflow-y: auto;
        border-radius: 5px;
        display: none;
    `;
    document.body.appendChild(debugDiv);
    
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'DEBUG';
    toggleBtn.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 10000;
        background: red;
        color: white;
        border: none;
        padding: 5px;
        border-radius: 3px;
    `;
    toggleBtn.onclick = () => {
        debugDiv.style.display = debugDiv.style.display === 'none' ? 'block' : 'none';
    };
    document.body.appendChild(toggleBtn);
    
    return debugDiv;
}

const debugConsole = createDebugConsole();

function debugLog(message) {
    console.log(message);
    const entry = document.createElement('div');
    entry.textContent = new Date().toLocaleTimeString() + ' - ' + message;
    debugConsole.appendChild(entry);
    debugConsole.scrollTop = debugConsole.scrollHeight;
}

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
    debugLog("📱 Device ready, esperando Median...");
    
    if (typeof median !== 'undefined') {
        debugLog("✅ Median encontrado");
        initAds();
    } else {
        debugLog("❌ Median NO encontrado, reintentando...");
        setTimeout(() => {
            if (typeof median !== 'undefined') {
                debugLog("✅ Median encontrado en reintento");
                initAds();
            } else {
                debugLog("❌❌ Median SDK no encontrado después de reintento");
            }
        }, 2000);
    }
}

function initAds() {
    debugLog("🚀 Inicializando anuncios...");
    
    if (median.admob && median.admob.interstitial) {
        try {
            median.admob.interstitial.config({
                id: 'ca-app-pub-3940256099942544/1033173712'
            });
            debugLog("✅ Interstitial CONFIGURADO");
        } catch (error) {
            debugLog("❌ Error configurando: " + error);
        }
    } else {
        debugLog("❌ median.admob.interstitial NO disponible");
    }
    
    registerMedianEvents();
    
    setTimeout(() => {
        loadInterstitial();
    }, 1000);
    
    const adButton = document.getElementById("show-ad-button");
    if (adButton) {
        adButton.addEventListener("click", onAdButtonClick);
        debugLog("✅ Botón configurado");
    } else {
        debugLog("❌ Botón NO encontrado");
    }
}

// ========================================================
//   EVENTOS DEL SDK MEDIAN + ADMOB
// ========================================================
function registerMedianEvents() {
    if (typeof median === 'undefined') {
        debugLog("❌ Median no disponible para eventos");
        return;
    }

    median.on("admob.interstitial.loaded", () => {
        debugLog("📥 Interstitial LISTO para mostrarse");
        interstitialLoaded = true;
        enableAdButton();
    });

    median.on("admob.interstitial.failedToLoad", (err) => {
        debugLog("❌ Falló carga interstitial: " + JSON.stringify(err));
        interstitialLoaded = false;
        enableAdButton();
        setTimeout(loadInterstitial, 3000);
    });

    median.on("admob.interstitial.dismissed", () => {
        debugLog("👋 Interstitial CERRADO");
        isShowingAd = false;
        interstitialLoaded = false;
        setTimeout(loadInterstitial, 1000);
        resetAdButton();
    });
}

// ========================================================
//   CARGAR INTERSTITIAL
// ========================================================
function loadInterstitial() {
    if (typeof median === 'undefined' || !median.admob || !median.admob.interstitial) {
        debugLog("❌ Median Admob no disponible para cargar");
        return;
    }

    debugLog("🔄 Cargando interstitial...");
    interstitialLoaded = false;

    median.admob.interstitial.load()
        .then(() => {
            debugLog("✅ Petición interstitial enviada");
        })
        .catch((err) => {
            debugLog("❌ Error cargar interstitial: " + err);
            interstitialLoaded = false;
            enableAdButton();
        });
}

// ========================================================
//   MOSTRAR INTERSTITIAL
// ========================================================
function showInterstitialAd() {
    if (typeof median === 'undefined' || !median.admob || !median.admob.interstitial) {
        debugLog("❌ Median Admob no disponible para mostrar");
        enableAdButton();
        return;
    }

    if (!interstitialLoaded) {
        debugLog("⚠ Interstitial no cargado, recargando...");
        loadInterstitial();
        enableAdButton();
        return;
    }

    debugLog("🎬 Mostrando interstitial...");
    
    median.admob.interstitial.show()
        .then(() => {
            debugLog("✅ Interstitial mostrado");
            isShowingAd = true;
        })
        .catch((err) => {
            debugLog("❌ Error mostrar interstitial: " + err);
            interstitialLoaded = false;
            resetAdButton();
            loadInterstitial();
        });
}

// ========================================================
//   LÓGICA DEL BOTÓN
// ========================================================
function onAdButtonClick() {
    debugLog("👆 Botón presionado - Estado: " + interstitialLoaded);
    
    if (!interstitialLoaded) {
        debugLog("🔄 Interstitial no listo, cargando...");
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
    debugLog("📄 DOM cargado, preparando anuncios...");
});