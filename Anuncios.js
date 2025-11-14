// Anuncios.js - Versión Mejorada con más logs y retraso
document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Inicializando sistema de anuncios...");

    // Función para inicializar anuncios
    function initAds() {
        console.log("🔍 Verificando disponibilidad de Median AdMob...");
        console.log("median:", typeof median !== "undefined" ? median : "NO DEFINIDO");
        console.log("median.admob:", median && median.admob ? "DISPONIBLE" : "NO DISPONIBLE");

        if (typeof median !== "undefined" && median.admob) {
            console.log("✅ Median AdMob detectado - MODO PRODUCCIÓN");

            let interstitialLoaded = false;
            let isShowingAd = false;

            // 1. ACTIVAR BANNER INFERIOR
            try {
                median.admob.banner.enable();
                console.log("✅ Banner inferior activado");
            } catch (err) {
                console.error("❌ Error activando banner:", err);
            }

            // 2. CARGAR ANUNCIO INTERSTICIAL
            function loadInterstitial() {
                console.log("🔄 Cargando anuncio intersticial...");
                
                median.admob.interstitial.load()
                    .then(result => {
                        if (result.success) {
                            interstitialLoaded = true;
                            console.log("✅ Intersticial cargado - LISTO para mostrar");
                        } else {
                            console.warn("⚠️ Intersticial no cargado:", result.message);
                            // Reintentar en 20 segundos
                            setTimeout(loadInterstitial, 20000);
                        }
                    })
                    .catch(err => {
                        console.error("💥 Error cargando intersticial:", err);
                        setTimeout(loadInterstitial, 20000);
                    });
            }

            // Cargar primer anuncio
            loadInterstitial();

            // 3. MANEJAR CLIC EN EL BOTÓN
            const adButton = document.getElementById('show-ad-button');
            
            if (adButton) {
                adButton.addEventListener('click', function() {
                    console.log("🎯 Clic en Ver Anuncio");
                    
                    if (isShowingAd) {
                        console.log("⏳ Ya se está mostrando un anuncio");
                        return;
                    }

                    if (interstitialLoaded) {
                        showInterstitialAd();
                    } else {
                        console.log("⏳ Anuncio no cargado, intentando cargar...");
                        adButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
                        adButton.disabled = true;
                        
                        // Forzar carga y mostrar
                        median.admob.interstitial.load()
                            .then(result => {
                                if (result.success) {
                                    showInterstitialAd();
                                } else {
                                    alert("Anuncio no disponible. Intenta más tarde.");
                                    resetButton();
                                }
                            })
                            .catch(() => {
                                alert("Error cargando anuncio.");
                                resetButton();
                            });
                    }
                });
            }

            function showInterstitialAd() {
                console.log("📱 Mostrando anuncio intersticial...");
                isShowingAd = true;
                
                median.admob.showInterstitialIfReady()
                    .then(result => {
                        console.log("📢 Resultado del anuncio:", result);
                        
                        if (result.success) {
                            console.log("🎉 Anuncio mostrado exitosamente");
                            // El anuncio se cierra automáticamente
                        } else {
                            console.log("❌ No se pudo mostrar el anuncio");
                        }
                        
                        // Recargar para próxima vez
                        setTimeout(() => {
                            interstitialLoaded = false;
                            isShowingAd = false;
                            resetButton();
                            loadInterstitial();
                            console.log("🔄 Reiniciando sistema de anuncios");
                        }, 3000);
                        
                    })
                    .catch(error => {
                        console.error("💥 Error mostrando anuncio:", error);
                        isShowingAd = false;
                        resetButton();
                        loadInterstitial();
                    });
            }

            function resetButton() {
                const button = document.getElementById('show-ad-button');
                if (button) {
                    button.innerHTML = '<i class="fas fa-play-circle"></i> Ver Anuncio';
                    button.disabled = false;
                }
            }

        } else {
            // MODO DESARROLLO/PRUEBAS
            console.log("🔧 Modo desarrollo - AdMob no disponible");
            
            const adButton = document.getElementById('show-ad-button');
            
            if (adButton) {
                adButton.addEventListener('click', function() {
                    console.log("🎯 [MODO PRUEBA] Botón clickeado");
                    
                    // Simular mejor el comportamiento real
                    adButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mostrando anuncio...';
                    adButton.disabled = true;
                    
                    setTimeout(() => {
                        alert("🎉 ¡Anuncio de prueba!\n\nEn la app real de Median, aquí verías un anuncio de AdMob con video que dice 'Nice Job' o similar.\n\nPara ver anuncios reales, compila tu app en Median con los IDs de AdMob configurados.");
                        resetDevButton();
                    }, 1500);
                });
            }
            
            function resetDevButton() {
                const button = document.getElementById('show-ad-button');
                if (button) {
                    button.innerHTML = '<i class="fas fa-play-circle"></i> Ver Anuncio';
                    button.disabled = false;
                }
            }
        }
    }

    // Dar un poco de tiempo para que Median inicialice
    setTimeout(initAds, 1000);
});