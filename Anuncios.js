document.addEventListener("deviceready", function () {
    console.log("📱 deviceready OK – Iniciando AdMob...");

    // Variables globales
    let admobPlugin = null;
    let interstitialLoaded = false;

    // 🔍 DETECTAR y configurar AdMob
    function configurarAdMob() {
        // Verificar si estamos en Android o iOS
        if (/(android)/i.test(navigator.userAgent)) {
            if (window.Median && window.Median.admob) {
                admobPlugin = window.Median.admob;
                console.log("✅ Median AdMob detectado en Android");
            } else if (window.Admob) {
                admobPlugin = window.Admob;
                console.log("✅ Admob detectado en Android");
            }
        } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
            if (window.AdMob) {
                admobPlugin = window.AdMob;
                console.log("✅ AdMob detectado en iOS");
            }
        }

        if (!admobPlugin) {
            console.warn("❌ AdMob no disponible - Mostrando versión sin ads");
            return false;
        }
        return true;
    }

    // 📱 INICIALIZAR BANNER
    function inicializarBanner() {
        if (!admobPlugin) return;

        try {
            // Configurar banner según el plugin detectado
            if (admobPlugin === window.Median.admob) {
                admobPlugin.showBanner();
            } else if (admobPlugin.showBanner) {
                admobPlugin.showBanner();
            }
            console.log("📢 Banner inicializado");
        } catch (error) {
            console.error("Error en banner:", error);
        }
    }

    // 🎬 CARGAR INTERSTITIAL
    function cargarInterstitial() {
        if (!admobPlugin) {
            console.warn("AdMob no disponible - No se puede cargar interstitial");
            return;
        }

        try {
            if (admobPlugin === window.Median.admob) {
                admobPlugin.loadInterstitial({}, function(success) {
                    if (success) {
                        interstitialLoaded = true;
                        console.log("✅ Interstitial cargado correctamente");
                    } else {
                        console.warn("❌ Error cargando interstitial");
                        interstitialLoaded = false;
                    }
                });
            } else if (admobPlugin.prepareInterstitial) {
                // Para cordova-plugin-admob-free
                admobPlugin.prepareInterstitial({
                    adId: admobPlugin.AD_IDS.INTERSTITIAL,
                    autoShow: false
                }, function() {
                    interstitialLoaded = true;
                    console.log("✅ Interstitial preparado");
                }, function(error) {
                    console.warn("❌ Error preparando interstitial:", error);
                    interstitialLoaded = false;
                });
            } else {
                console.warn("No se encontró método para cargar interstitial");
            }
        } catch (error) {
            console.error("Excepción al cargar interstitial:", error);
        }
    }

    // 🎬 MOSTRAR INTERSTITIAL
    function mostrarInterstitial() {
        if (!admobPlugin) {
            console.warn("AdMob no disponible");
            return false;
        }

        try {
            if (admobPlugin === window.Median.admob) {
                admobPlugin.showInterstitial({}, function(mostrado) {
                    if (mostrado) {
                        console.log("📢 Interstitial mostrado");
                        // Recargar para next time
                        setTimeout(cargarInterstitial, 1000);
                    } else {
                        console.warn("❌ Interstitial no se pudo mostrar");
                    }
                    interstitialLoaded = false;
                });
                return true;
            } else if (admobPlugin.showInterstitial) {
                admobPlugin.showInterstitial();
                console.log("📢 Llamada a interstitial enviada");
                interstitialLoaded = false;
                // Recargar para next time
                setTimeout(cargarInterstitial, 3000);
                return true;
            }
        } catch (error) {
            console.error("Error mostrando interstitial:", error);
        }
        return false;
    }

    // 🚀 INICIALIZACIÓN PRINCIPAL
    if (configurarAdMob()) {
        inicializarBanner();
        // Cargar interstitial después de un breve delay
        setTimeout(cargarInterstitial, 2000);
    }

    // 🎯 CONFIGURAR BOTÓN
    const btn = document.getElementById("video-btn");
    
    if (btn) {
        btn.addEventListener("click", function (e) {
            console.log("🎬 Botón de video presionado");
            
            // Prevenir cualquier comportamiento por defecto
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // Intentar mostrar interstitial
            if (mostrarInterstitial()) {
                console.log("✅ Interstitial activado");
            } else {
                console.warn("❌ No se pudo mostrar interstitial");
                // Fallback: abrir enlace alternativo o mostrar mensaje
                alert("Video no disponible en este momento");
            }

            return false;
        });

        // Prevenir otros posibles eventos
        btn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
        
        btn.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
    } else {
        console.error("❌ No se encontró el botón #video-btn");
    }

}, false);