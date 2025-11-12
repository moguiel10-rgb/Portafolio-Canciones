document.addEventListener("DOMContentLoaded", function () {
  if (typeof median !== "undefined" && median.admob) {
    console.log("AdMob disponible desde Median ✅");

    // Mostrar banner automáticamente
    try {
      median.admob.banner.enable();
    } catch (err) {
      console.warn("No se pudo mostrar el banner:", err);
    }

    // Solicitar consentimiento (opcional)
    if (median.admob.request && median.admob.request.consent) {
      median.admob.request.consent().then((result) => {
        if (result.success) {
          console.log("Consentimiento otorgado para anuncios personalizados.");
        }
      });
    }

    // 🔥 Contador de clics y control de tiempo entre anuncios
    let clickCount = 0;
    let canShowAd = true; // Controla si se puede mostrar otro anuncio

    document.addEventListener("click", function (event) {
      const target = event.target;

      // Solo cuenta clics en botones o enlaces
      if (target.tagName === "BUTTON" || target.tagName === "A") {
        clickCount++;
        console.log("Clic válido número:", clickCount);

        if (clickCount >= 3 && canShowAd) {
          showInterstitialAd();
          clickCount = 0;
          canShowAd = false; // Desactivar anuncios por 5 segundos
          console.log("⏳ Esperando 5 segundos antes del siguiente anuncio...");

          setTimeout(() => {
            canShowAd = true;
            console.log("✅ Ahora se puede mostrar otro anuncio.");
          }, 5000);
        }
      }
    });
  } else {
    console.log("AdMob no disponible (probablemente estás en el navegador)");
  }
});

// Función para mostrar el interstitial
function showInterstitialAd() {
  if (typeof median !== "undefined" && median.admob) {
    console.log("🟡 Mostrando anuncio interstitial...");
    median.admob.showInterstitialIfReady();
  } else {
    console.log("No se puede mostrar interstitial: fuera de Median");
  }
}
