document.addEventListener("DOMContentLoaded", function () {
  if (typeof median !== "undefined" && median.admob) {
    console.log("AdMob conectado correctamente ✅");

    // Mostrar banner al cargar
    try {
      median.admob.banner.enable();
    } catch (err) {
      console.warn("Error mostrando banner:", err);
    }

    // Consentimiento (opcional)
    if (median.admob.request && median.admob.request.consent) {
      median.admob.request.consent().then((r) => {
        if (r.success) console.log("Consentimiento para anuncios: OK");
      });
    }

    // 🔥 Nuevo contador de clics
    let clickCount = 0;
    let canShowAd = true;

    // Selecciona los botones relevantes de tu app
    const botones = document.querySelectorAll("button, a");

    botones.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        clickCount++;
        console.log("👉 Clic detectado (" + clickCount + ")");

        // Si llega a 3 clics y se puede mostrar
        if (clickCount >= 3 && canShowAd) {
          clickCount = 0; // Reiniciar contador
          canShowAd = false; // Bloquear por 5 segundos
          showInterstitialAd();

          setTimeout(() => {
            canShowAd = true;
            console.log("🟢 Listo para mostrar otro anuncio");
          }, 5000);
        }
      });
    });
  } else {
    console.log("No se detectó AdMob (solo navegador).");
  }
});

// Mostrar el interstitial
function showInterstitialAd() {
  if (typeof median !== "undefined" && median.admob) {
    console.log("🟡 Intentando mostrar anuncio interstitial...");
    median.admob.showInterstitialIfReady();
  } else {
    console.warn("❌ No se puede mostrar: fuera de Median.");
  }
}
