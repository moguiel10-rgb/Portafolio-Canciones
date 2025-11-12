document.addEventListener("DOMContentLoaded", function () {
  if (typeof median !== "undefined" && median.admob) {
    console.log("✅ AdMob listo en Median");

    // Mostrar banner al cargar
    try {
      median.admob.banner.enable();
    } catch (err) {
      console.warn("⚠️ Error mostrando banner:", err);
    }

    // Solicitar consentimiento (si aplica)
    if (median.admob.request && median.admob.request.consent) {
      median.admob.request.consent().then((r) => {
        if (r.success) console.log("Consentimiento otorgado ✅");
      });
    }

    // 🕒 Programar anuncios interstitial en intervalos específicos
    const tiempos = [15, 45, 60, 110]; // segundos (ajústalos a gusto)

    tiempos.forEach((t, i) => {
      setTimeout(() => {
        console.log(`🟡 Mostrando anuncio interstitial #${i + 1} (a los ${t}s)`);
        showInterstitialAd();
      }, t * 1000);
    });

  } else {
    console.log("❌ AdMob no detectado (solo navegador).");
  }
});

// Mostrar el interstitial si está listo
function showInterstitialAd() {
  if (typeof median !== "undefined" && median.admob) {
    median.admob.showInterstitialIfReady();
  } else {
    console.warn("⚠️ Median no disponible (modo web).");
  }
}
