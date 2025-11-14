// Anuncios.js - Control de anuncios para Debbie App
document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Inicializando sistema de anuncios...");

    // Verificar si la API de Median y AdMob están disponibles
    if (typeof median !== "undefined" && median.admob) {
        console.log("✅ AdMob detectado en Median");

        // Variables de control
        let interstitialAdReady = false;
        let isShowingAd = false;

        // 1. INICIAR BANNER (anuncio de abajo)
        try {
            median.admob.banner.enable();
            console.log("✅ Banner inferior activado");
        } catch (err) {
            console.warn("⚠️ Error al activar banner:", err);
        }

        // 2. CARGAR ANUNCIO INTERSTICIAL (pantalla completa)
        function loadInterstitialAd() {
            console.log("🔄 Cargando anuncio de pantalla completa...");
            interstitialAdReady = false;
            
            median.admob.interstitial.load()
                .then(result => {
                    if (result.success) {
                        interstitialAdReady = true;
                        console.log("✅ Anuncio de pantalla completa listo");
                    } else {
                        console.warn("⚠️ No se pudo cargar el anuncio:", result.message);
                        // Reintentar en 30 segundos si falla
                        setTimeout(loadInterstitialAd, 30000);
                    }
                })
                .catch(err => {
                    console.error("💥 Error al cargar anuncio:", err);
                    setTimeout(loadInterstitialAd, 30000);
                });
        }

        // Cargar primer anuncio
        loadInterstitialAd();

        // 3. CONFIGURAR BOTÓN "VER ANUNCIO"
        const showAdButton = document.getElementById('show-ad-button');
        
        if (showAdButton) {
            showAdButton.addEventListener('click', function() {
                console.log("🎯 Usuario hizo clic en 'Ver Anuncio'");
                
                if (!interstitialAdReady) {
                    console.log("⏳ Anuncio no está listo, cargando...");
                    showAdButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
                    showAdButton.disabled = true;
                    
                    // Intentar cargar y luego mostrar
                    median.admob.interstitial.load()
                        .then(result => {
                            if (result.success) {
                                showInterstitialAd();
                            } else {
                                alert("Anuncio no disponible en este momento. Intenta más tarde.");
                                resetButton();
                            }
                        })
                        .catch(() => {
                            alert("Error al cargar el anuncio.");
                            resetButton();
                        });
                    return;
                }
                
                showInterstitialAd();
            });
        }

        // Función para mostrar anuncio intersticial
        function showInterstitialAd() {
            if (isShowingAd) return;
            
            isShowingAd = true;
            console.log("📱 Mostrando anuncio de pantalla completa...");
            
            median.admob.showInterstitialIfReady()
                .then(result => {
                    if (result.success) {
                        console.log("🎉 Anuncio mostrado exitosamente");
                        // El anuncio se muestra, se recarga automáticamente después de cerrarse
                    } else {
                        console.log("❌ Anuncio no se pudo mostrar");
                    }
                    
                    // Recargar anuncio para próxima vez
                    setTimeout(() => {
                        loadInterstitialAd();
                        isShowingAd = false;
                        resetButton();
                    }, 2000);
                })
                .catch(err => {
                    console.error("💥 Error al mostrar anuncio:", err);
                    isShowingAd = false;
                    resetButton();
                    loadInterstitialAd();
                });
        }

        // Función para resetear el botón
        function resetButton() {
            if (showAdButton) {
                showAdButton.innerHTML = '<i class="fas fa-play-circle"></i> Ver Anuncio';
                showAdButton.disabled = false;
            }
        }

        // 4. MANEJO DE VISIBILIDAD DE LA APP
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden && !interstitialAdReady) {
                // Si la app vuelve a primer plano y no hay anuncio listo, cargar uno
                loadInterstitialAd();
            }
        });

    } else {
        // MODO DESARROLLO - Simular comportamiento cuando no hay AdMob
        console.log("🔧 Modo desarrollo: AdMob no detectado");
        
        const showAdButton = document.getElementById('show-ad-button');
        
        if (showAdButton) {
            showAdButton.addEventListener('click', function() {
                console.log("🎯 [DEV] Botón de anuncio clickeado");
                alert("🎉 En producción, aquí se mostraría un anuncio de pantalla completa.\n\n¡Anuncio simulado exitoso!");
                
                // Simular carga de nuevo anuncio después de 2 segundos
                showAdButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
                showAdButton.disabled = true;
                
                setTimeout(() => {
                    showAdButton.innerHTML = '<i class="fas fa-play-circle"></i> Ver Anuncio';
                    showAdButton.disabled = false;
                    console.log("✅ [DEV] Anuncio simulado completado");
                }, 2000);
            });
        }
        
        // Simular banner en desarrollo
        console.log("📱 [DEV] Banner inferior simulado");
    }

    console.log("🎊 Sistema de anuncios inicializado correctamente");
});