// Archivo: Anuncios.js

document.addEventListener("deviceready", function () {
    console.log("📱 deviceready OK – Iniciando lógica de AdMob...");

    // Verificar si ya se mostró el interstitial inicial
    const interstitialShown = localStorage.getItem('initialInterstitialShown');
    
    // 1. Lógica para mostrar interstitial SOLO UNA VEZ al inicio
    function showInitialInterstitial() {
        if (interstitialShown) {
            console.log("ℹ️ Interstitial inicial ya fue mostrado anteriormente");
            return;
        }
        
        if (window.Median && window.Median.admob) {
            try {
                console.log("🎬 Mostrando interstitial inicial...");
                // Marcar como mostrado ANTES de intentar mostrarlo
                localStorage.setItem('initialInterstitialShown', 'true');
                
                // Primero preparamos/recargamos el interstitial
                median.admob.interstitial.load();
                
                // Mostramos después de un breve retraso para asegurar que la app esté visible
                setTimeout(() => {
                    median.admob.showInterstitialIfReady();
                    console.log("✅ Interstitial inicial mostrado");
                }, 1000); // 1 segundo de retraso para mejor UX
            } catch (error) {
                console.error("❌ Error al mostrar interstitial inicial:", error);
            }
        } else {
            console.warn("⚠️ Median AdMob no está disponible.");
        }
    }

    // Mostrar interstitial al inicio (solo si no se ha mostrado antes)
    showInitialInterstitial();

}, false);