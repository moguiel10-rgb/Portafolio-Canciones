document.addEventListener("DOMContentLoaded", function() {

    function isAdMobAvailable() {
        return typeof window.Median !== 'undefined' && typeof window.Median.admob !== 'undefined';
    }

    function showInterstitialAd() {
        if (!isAdMobAvailable()) {
            console.error("Error: El plugin AdMob de Median no está disponible.");
            alert("Error: El plugin AdMob de Median no está disponible.");
            return;
        }

        console.log("AdMob disponible. Intentando mostrar el anuncio interstitial...");
        alert("Intentando mostrar anuncio...");

        window.Median.admob.showInterstitial({}, function(success) {
            if (success) {
                console.log("Callback de éxito: Anuncio interstitial mostrado o cerrado.");
                alert("¡Anuncio mostrado con éxito!");
            } else {
                console.error("Callback de error: No se pudo mostrar el anuncio interstitial.");
                alert("Error al mostrar el anuncio. Revisa los logs de ADB.");
            }
        });
    }

    // ---- Aquí se corrige el ID ----
    var btn = document.getElementById("video-btn");

    if (btn) {
        btn.addEventListener("click", function(e) {
            e.preventDefault(); // evita refrescar la página
            showInterstitialAd();
        });
    } else {
        console.error("Error: No se encontró el botón con id 'video-btn'.");
    }

    // Banner opcional
    if (isAdMobAvailable() && window.Median.admob.showBanner) {
        console.log("Mostrando banner...");
        window.Median.admob.showBanner();
    }
});
