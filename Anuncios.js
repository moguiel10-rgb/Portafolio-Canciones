document.addEventListener("DOMContentLoaded", function () {
  // Verificar si la API de Median y AdMob están disponibles
  if (typeof median !== "undefined" && median.admob) {
    console.log("✅ AdMob listo en Median");

    // 1. Habilitar el anuncio de banner
    try {
      median.admob.banner.enable();
      console.log("Banner habilitado correctamente.");
    } catch (err) {
      console.warn("⚠️ Error al mostrar el banner:", err);
    }

    // 2. Solicitar consentimiento de usuario (si es necesario)
    if (median.admob.request && median.admob.request.consent) {
      median.admob.request.consent().then((r) => {
        if (r.success) {
          console.log("Consentimiento otorgado ✅");
        } else {
          console.warn("Consentimiento no otorgado o no requerido.");
        }
      });
    }

    // 3. Cargar el primer anuncio intersticial inmediatamente
    // Esto es crucial para que el primer temporizador tenga un anuncio que mostrar.
    loadInterstitialAd();

    // 4. Programar los anuncios en intervalos de tiempo
    const tiempos = [15, 45, 60, 110]; // Tiempos en segundos

    tiempos.forEach((t, i) => {
      setTimeout(() => {
        console.log(`🟡 Intentando mostrar anuncio #${i + 1} (a los ${t}s)`);
        showInterstitialAd();
      }, t * 1000);
    });

  } else {
    console.log("❌ AdMob no detectado. Se asume ejecución en navegador web.");
  }
});

/**
 * Función para CARGAR un anuncio intersticial en segundo plano.
 */
function loadInterstitialAd() {
  if (typeof median !== "undefined" && median.admob) {
    console.log("🔄 Cargando un nuevo anuncio intersticial...");
    median.admob.interstitial.load()
      .then(result => {
        if (result.success) {
          console.log("✅ Anuncio intersticial cargado y listo para mostrar.");
        } else {
          console.warn("⚠️ No se pudo cargar el anuncio intersticial:", result.message);
        }
      })
      .catch(err => {
        console.error("💥 Error crítico al cargar el intersticial:", err);
      });
  }
}

/**
 * Función para MOSTRAR un anuncio intersticial si está listo.
 * Después de mostrarlo, inmediatamente carga el siguiente.
 */
function showInterstitialAd() {
  if (typeof median !== "undefined" && median.admob) {
    median.admob.showInterstitialIfReady()
      .then(result => {
        if (result.success) {
          console.log("🟢 Anuncio intersticial mostrado con éxito.");
        } else {
          console.log("🔴 El anuncio no estaba listo para mostrarse. Mensaje:", result.message);
        }
        // IMPORTANTE: Ya sea que se haya mostrado o no, intentamos cargar el siguiente.
        // Esto asegura que para el próximo intervalo, haya un anuncio preparado.
        loadInterstitialAd();
      })
      .catch(err => {
        console.error("💥 Error crítico al mostrar el intersticial:", err);
        // Incluso si hay un error, intentamos recuperarnos cargando el siguiente.
        loadInterstitialAd();
      });
  } else {
    console.warn("⚠️ Median no disponible (modo web). No se puede mostrar el anuncio.");
  }
}
