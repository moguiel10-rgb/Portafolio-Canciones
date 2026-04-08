document.addEventListener("deviceready", function () {
    console.log("📱 Puente Median detectado y listo");

    const INTERSTITIAL_INTERVAL = 6 * 60 * 1000; // 6 minutos
    const STORAGE_KEY = "lastInterstitialTime";

    function canShowInterstitial() {
        const lastTime = localStorage.getItem(STORAGE_KEY);
        if (!lastTime) return true;
        return (Date.now() - parseInt(lastTime, 10)) >= INTERSTITIAL_INTERVAL;
    }

    function triggerAdMobInterstitial() {
        // CORRECCIÓN: Median usa la "M" mayúscula en su objeto global
        const medianBridge = window.Median || window.median; 

        if (medianBridge && medianBridge.admob) {
            if (!canShowInterstitial()) {
                console.log("⏳ Esperando intervalo de 6 min para próximo anuncio");
                return;
            }

            try {
                console.log("🚀 Solicitando Intersticial a Median...");
                
                // SEGÚN DOCS: No usamos .load(), Median lo hace solo. 
                // Llamamos directamente a la función de visualización.
                medianBridge.admob.showInterstitialIfReady();
                
                // Actualizamos el tiempo (asumimos que se mostró o se intentó)
                localStorage.setItem(STORAGE_KEY, Date.now().toString());
            } catch (e) {
                console.error("❌ Error en el puente AdMob de Median:", e);
            }
        } else {
            console.warn("⚠️ Plugin de AdMob no detectado en el contenedor nativo");
        }
    }

    // Configuración de los selectores de enlaces
    const enlacesConAnuncio = [
        'a[href="#Portafolio"]',
        'a[href="#transponer-pdf"]',
        'a[href="#Contactos"]'
    ];

    // Delegación de eventos (más eficiente que un forEach masivo)
    document.addEventListener("click", function (event) {
        const target = event.target.closest('a');
        if (!target) return;

        const href = target.getAttribute('href');
        if (enlacesConAnuncio.includes(`a[href="${href}"]`)) {
            console.log("➡️ Clic en sección monetizada:", href);
            triggerAdMobInterstitial();
        }
    });

}, false);