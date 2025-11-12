document.addEventListener("DOMContentLoaded", function () {
  // Verifica que estás dentro de la app Median (no navegador normal)
  if (typeof median !== "undefined" && median.admob) {
    console.log("AdMob disponible desde Median ✅");

    // Mostrar banner automáticamente al iniciar (si está deshabilitado en Median)
    try {
      median.admob.banner.enable();
    } catch (err) {
      console.warn("No se pudo mostrar el banner:", err);
    }

    // Opcional: pedir consentimiento (GDPR / iOS)
    if (median.admob.request && median.admob.request.consent) {
      median.admob.request.consent().then((result) => {
        if (result.success) {
          console.log("Consentimiento otorgado para anuncios personalizados.");
        }
      });
    }
  } else {
    console.log("AdMob no disponible (probablemente estás en el navegador)");
  }
});

// Función global para mostrar interstitial cuando quieras
function showInterstitialAd() {
  if (typeof median !== "undefined" && median.admob) {
    median.admob.showInterstitialIfReady();
  } else {
    console.log("No se puede mostrar interstitial: fuera de Median");
  }
}
