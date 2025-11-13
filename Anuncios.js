// Anuncios.js - Versión con Overlay

document.addEventListener("DOMContentLoaded", function () {
  // Verificar si la API de Median y AdMob están disponibles
  if (typeof median !== "undefined" && median.admob) {
    console.log("✅ AdMob listo en Median");

    // Elementos del DOM
    const adOverlay = document.getElementById('ad-overlay');
    const showAdButton = document.getElementById('show-ad-button');

    // 1. Habilitar el anuncio de banner
    try {
      median.admob.banner.enable();
    } catch (err) {
      console.warn("⚠️ Error al mostrar el banner:", err);
    }

    // 2. Cargar el primer anuncio intersticial en segundo plano
    loadInterstitialAd();

    // 3. Configurar el temporizador para mostrar el overlay
    const tiempoParaMostrarOverlay = 45 * 1000; // 45 segundos (ajústalo a tu gusto)
    setTimeout(showAdOverlay, tiempoParaMostrarOverlay);

    // 4. Lógica del botón "Ver Anuncio"
    showAdButton.addEventListener('click', function() {
      console.log("🟡 Usuario hizo clic en 'Ver Anuncio'. Intentando mostrar...");
      
      // Intenta mostrar el anuncio. Si está listo, se mostrará.
      median.admob.showInterstitialIfReady()
        .then(result => {
          if (result.success) {
            console.log("🟢 Anuncio intersticial mostrado con éxito.");
          } else {
            console.log("🔴 El anuncio no estaba listo. Se oculta el overlay de todas formas.");
          }
          // Ocultar el overlay y cargar el siguiente anuncio, sin importar si se mostró o no.
          hideAdOverlay();
          loadInterstitialAd();
        })
        .catch(err => {
          console.error("💥 Error crítico al mostrar el intersticial:", err);
          // En caso de error, también ocultamos el overlay para no bloquear al usuario.
          hideAdOverlay();
          loadInterstitialAd();
        });
    });

    // --- FUNCIONES AUXILIARES ---

    /**
     * Muestra el overlay de "Ver Anuncio" si hay un anuncio listo.
     */
    function showAdOverlay() {
      // Solo mostramos el overlay si sabemos que hay un anuncio cargado.
      // Esto evita pedirle al usuario que vea un anuncio que no existe.
      if (adIsReady) {
        console.log("⏰ Tiempo cumplido. Mostrando overlay para ver anuncio.");
        adOverlay.className = 'ad-overlay-visible';
      } else {
        console.log("⏰ Tiempo cumplido, pero no hay anuncio listo. No se muestra el overlay.");
        // Opcional: podrías reintentar mostrar el overlay después de unos segundos.
      }
    }

    /**
     * Oculta el overlay.
     */
    function hideAdOverlay() {
      adOverlay.className = 'ad-overlay-hidden';
    }

  } else {
    console.log("❌ AdMob no detectado. Se asume ejecución en navegador web.");
  }
});


// --- GESTIÓN DE CARGA DE ANUNCIOS (Fuera del DOMContentLoaded) ---

let adIsReady = false; // Variable global para saber si un anuncio está listo

/**
 * Función para CARGAR un anuncio intersticial en segundo plano.
 */
function loadInterstitialAd() {
  if (typeof median !== "undefined" && median.admob) {
    console.log("🔄 Cargando un nuevo anuncio intersticial...");
    adIsReady = false; // Marcar como no listo mientras carga
    
    median.admob.interstitial.load()
      .then(result => {
        if (result.success) {
          adIsReady = true;
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
