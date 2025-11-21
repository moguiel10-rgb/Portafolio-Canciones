document.addEventListener("deviceready", function () {

    console.log("📱 deviceready OK – Iniciando AdMob...");

    // ------------------------------------
    // 🔍 DETECTAR plugin de AdMob
    // ------------------------------------
    function admobDisponible() {
        return (
            (window.Median && window.Median.admob) ||
            (window.plugins && window.plugins.admob) ||
            window.Admob
        );
    }

    if (!admobDisponible()) {
        alert("❌ AdMob no está disponible.\nRevisa si el plugin se instaló correctamente.");
        console.error("AdMob no detectado en ninguna ruta.");
        return;
    }

    alert("✅ AdMob detectado correctamente.");

    // ------------------------------------
    // 📌 MOSTRAR BANNER AUTOMÁTICO
    // ------------------------------------
    try {
        if (window.Median && window.Median.admob && window.Median.admob.showBanner) {
            window.Median.admob.showBanner();
            console.log("Banner solicitado desde Median.");
        } else if (window.Admob && window.Admob.showBanner) {
            window.Admob.showBanner();
            console.log("Banner solicitado desde Admob.");
        } else {
            console.warn("❗ No existe función showBanner en ninguno de los plugins.");
        }
    } catch (err) {
        console.error("Error al mostrar banner:", err);
    }

    // ------------------------------------
    // 🎬 BOTÓN PARA INTERSTITIAL
    // ------------------------------------
    const btn = document.getElementById("video-btn");

    if (!btn) {
        console.error("❌ No se encontró el botón #video-btn.");
        return;
    }

    btn.addEventListener("click", function (e) {
        e.preventDefault();   // ❗ evita navegación del <a>
        e.stopPropagation();  // ❗ evita otros eventos
        console.log("Botón presionado. Intentando mostrar interstitial...");
        alert("Intentando mostrar interstitial...");

        // → Ruta Median
        if (window.Median && window.Median.admob) {
            window.Median.admob.showInterstitial({}, function (ok) {
                if (ok) {
                    alert("📢 Interstitial mostrado correctamente.");
                } else {
                    alert("❌ Error al mostrar interstitial. Ver logs.");
                }
            });
            return;
        }

        // → Ruta AdMob normal
        if (window.Admob && window.Admob.showInterstitial) {
            window.Admob.showInterstitial();
            alert("📢 Llamada a interstitial enviada (ruta AdMob).");
            return;
        }

        alert("❌ No existe método showInterstitial en ningún plugin.");
    });

}, false);
