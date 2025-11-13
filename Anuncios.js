// Anuncios.js

// Objeto para gestionar el estado de los anuncios
const adManager = {
  isReady: false, // ¿Hay un anuncio cargado y listo?
  actionsSinceLastAd: 0, // Contador de acciones del usuario
  actionsThreshold: 3, // Cuántas acciones para mostrar un anuncio (ajústalo a tu gusto)

  // Carga un anuncio en segundo plano
  load: function() {
    if (typeof median !== 'undefined' && median.admob) {
      console.log("🔄 Cargando un nuevo anuncio intersticial...");
      this.isReady = false; // Marcar como no listo mientras carga
      median.admob.interstitial.load()
        .then(result => {
          if (result.success) {
            this.isReady = true;
            console.log("✅ Anuncio intersticial cargado y listo.");
          } else {
            console.warn("⚠️ No se pudo cargar el anuncio intersticial:", result.message);
          }
        })
        .catch(err => console.error("💥 Error crítico al cargar el intersticial:", err));
    }
  },

  // Intenta mostrar un anuncio si está listo
  show: function() {
    if (this.isReady && typeof median !== 'undefined' && median.admob) {
      console.log("🟢 Mostrando anuncio intersticial...");
      median.admob.showInterstitialIfReady(); // No necesitamos el .then() aquí
      this.isReady = false; // El anuncio se ha usado, ya no está listo
      this.actionsSinceLastAd = 0; // Reiniciar contador
      this.load(); // Cargar el siguiente inmediatamente
      return true;
    }
    console.log("🔴 El anuncio no estaba listo para mostrarse.");
    return false;
  },

  // Registra una acción del usuario y decide si mostrar un anuncio
  registerActionAndShowAd: function() {
    this.actionsSinceLastAd++;
    console.log(`Acciones desde el último anuncio: ${this.actionsSinceLastAd}`);
    if (this.actionsSinceLastAd >= this.actionsThreshold) {
      this.show();
    }
  }
};

// Inicialización cuando la app carga
document.addEventListener("DOMContentLoaded", function () {
  if (typeof median !== 'undefined' && median.admob) {
    console.log("✅ AdMob listo en Median");

    // Habilitar banner
    try {
      median.admob.banner.enable();
    } catch (err) {
      console.warn("⚠️ Error al mostrar el banner:", err);
    }
    
    // Cargar el primer anuncio intersticial
    adManager.load();
  } else {
    console.log("❌ AdMob no detectado (solo navegador).");
  }
});
