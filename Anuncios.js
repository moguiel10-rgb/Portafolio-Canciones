// Archivo: Anuncios.js
document.addEventListener("deviceready", function () {
    console.log("📱 AdMob listo (menú navegación)");

    const INTERSTITIAL_INTERVAL = 6 * 60 * 1000; // 6 minutos
    const STORAGE_KEY = "lastInterstitialTime";

    function canShowInterstitial() {
        const lastTime = localStorage.getItem(STORAGE_KEY);
        if (!lastTime) return true;
        return (Date.now() - parseInt(lastTime, 10)) >= INTERSTITIAL_INTERVAL;
    }

    function showInterstitial() {
        if (!window.Median || !window.Median.admob) return;
        if (!canShowInterstitial()) return;

        try {
            median.admob.interstitial.load();
            setTimeout(() => {
                median.admob.showInterstitialIfReady();
                localStorage.setItem(STORAGE_KEY, Date.now().toString());
            }, 1200);
        } catch (e) {
            console.error("Error interstitial:", e);
        }
    }

    const enlacesConAnuncio = [
        'a[href="#Portafolio"]',
        'a[href="#transponer-pdf"]',
        'a[href="#Contactos"]'
    ];

    enlacesConAnuncio.forEach(selector => {
        document.querySelectorAll(selector).forEach(link => {
            link.addEventListener("click", () => {
                console.log("➡️ Navegación con posible intersticial:", selector);
                showInterstitial();
            });
        });
    });

}, false);
