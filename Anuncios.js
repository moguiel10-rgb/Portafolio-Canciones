// Estado del sistema
let interstitialLoaded = false;
let isShowingAd = false;

// Inicializar Ads cuando Median está listo
document.addEventListener("deviceready", () => {
    console.log("📱 Device ready. Iniciando AdMob...");
    initializeAds();
});

// Inicializar AdMob
function initializeAds() {
    median.admob.initialize()
        .then(() => {
            console.log("🎉 AdMob inicializado");
            loadBanner();
            loadInterstitial();
        })
        .catch(err => {
            console.error("💥 Error al inicializar AdMob:", err);
        });
}

// -------------------------
// BANNER
// -------------------------
function loadBanner() {
    median.admob.banner.show()
        .then(() => console.log("📢 Banner mostrado"))
        .catch(err => console.error("💥 Error al mostrar banner:", err));
}

// -------------------------
// INTERSTITIAL
// -------------------------

// Cargar interstitial
function loadInterstitial() {
    console.log("🔄 Cargando intersticial...");

    median.admob.interstitial.load()
        .then(() => {
            console.log("👍 Interstitial cargado");
            interstitialLoaded = true;
        })
        .catch(err => {
            console.error("💥 Error cargando interstitial:", err);
            interstitialLoaded = false;
        });
}

// Mostrar interstitial
function showInterstitialAd() {
    if (!interstitialLoaded) {
        console.warn("⚠ Interstitial no está listo aún");
        return;
    }

    if (isShowingAd) {
        console.warn("⏳ Ya se está mostrando un anuncio");
        return;
    }

    console.log("📱 Mostrando intersticial...");
    isShowingAd = true;

    median.admob.interstitial.show()
        .then(result => {
            console.log("📢 Resultado del anuncio:", result);

            setTimeout(() => {
                interstitialLoaded = false;
                isShowingAd = false;
                resetButton();
                loadInterstitial();
                console.log("🔄 Sistema de anuncios reiniciado");
            }, 2000);
        })
        .catch(error => {
            console.error("💥 Error mostrando anuncio:", error);
            isShowingAd = false;
            resetButton();
            loadInterstitial();
        });
}

// -------------------------
// BOTÓN
// -------------------------
function onAdButtonClick() {
    console.log("👆 Botón presionado");

    disableButton();

    if (interstitialLoaded) {
        showInterstitialAd();
    } else {
        console.log("🚫 No hay interstitial listo, cargando de nuevo...");
        loadInterstitial();
        resetButton();
    }
}

function disableButton() {
    const btn = document.getElementById("adButton");
    if (btn) btn.disabled = true;
}

function resetButton() {
    const btn = document.getElementById("adButton");
    if (btn) btn.disabled = false;
}
