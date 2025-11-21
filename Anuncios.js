document.addEventListener("deviceready", function () {

    console.log("deviceready OK – Iniciando pruebas de AdMob...");

    // ---- Verificar disponibilidad del plugin ----
    function admobDisponible() {
        return (
            (window.Median && window.Median.admob) ||
            (window.plugins && window.plugins.admob) ||
            window.Admob
        );
    }

    if (!admobDisponible()) {
        alert("❌ AdMob NO está disponible todavía.\nRevisa si el plugin se instaló correctamente.");
        console.error("AdMob no detectado en ninguna ruta conocida.");
        return;
    }

    alert("✅ AdMob detectado correctamente.");

    // ------------------------------
    //   MOSTRAR BANNER AUTOMÁTICO
    // ------------------------------
    if (window.Median && window.Median.admob && window.Median.admob.showBanner) {
        window.Median.admob.showBanner();
        console.log("Banner solicitado.");
    } else if (window.Admob && window.Admob.showBanner) {
        window.Admob.showBanner();
    }


    // ------------------------------
    //   BOTÓN: MOSTRAR INTERSTITIAL
    // ------------------------------
    const btn = document.getElementById("video-btn");

    if (!btn) {
        console.error("Botón #video-btn no encontrado.");
        return;
    }

    btn.addEventListener("click", function () {
        alert("Intentando mostrar interstitial...");

        if (window.Median && window.Median.admob) {
            window.Median.admob.showInterstitial({}, function (ok) {
                alert(ok ? "📢 Interstitial mostrado" : "❌ Error al mostrar interstitial");
            });
        } else if (window.Admob && window.Admob.showInterstitial) {
            window.Admob.showInterstitial();
        } else {
            alert("❌ No existe método showInterstitial en ningún plugin.");
        }
    });

}, false);
