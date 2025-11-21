document.addEventListener("DOMContentLoaded", function () {

    // ---- PRUEBA: Mostrar qué propiedades existen en window ----
    try {
        alert("Claves principales de window:\n" + JSON.stringify(Object.keys(window).slice(0, 30), null, 2));
    } catch (e) {
        alert("No se pudieron mostrar las claves de window.");
    }

    // ---- PRUEBA: Mostrar plugins si existen ----
    try {
        if (window.plugins) {
            alert("Plugins detectados en window.plugins:\n" + JSON.stringify(Object.keys(window.plugins), null, 2));
        } else {
            alert("window.plugins NO existe.");
        }
    } catch (e) {
        alert("Error leyendo window.plugins");
    }

    // ---- PRUEBA: Mostrar window.Admob si existe ----
    try {
        if (window.Admob) {
            alert("AdMob detectado en window.Admob:\n" + JSON.stringify(Object.keys(window.Admob), null, 2));
        } else {
            alert("window.Admob NO existe.");
        }
    } catch (e) {
        alert("Error leyendo window.Admob");
    }

    // ---- PRUEBA: Mostrar window.Median.admob si existe ----
    try {
        if (window.Median && window.Median.admob) {
            alert("AdMob detectado en window.Median.admob:\n" + JSON.stringify(Object.keys(window.Median.admob), null, 2));
        } else {
            alert("window.Median.admob NO existe.");
        }
    } catch (e) {
        alert("Error leyendo window.Median.admob");
    }

    // ---- ANALISIS AUTOMATICO ----
    function detectarAdmob() {
        if (window.plugins && window.plugins.admob) return "window.plugins.admob";
        if (window.Admob) return "window.Admob";
        if (window.Median && window.Median.admob) return "window.Median.admob";
        return null;
    }

    const detectado = detectarAdmob();

    if (detectado) {
        alert("✅ Plugin AdMob detectado correctamente en: " + detectado);
    } else {
        alert("❌ No se detectó plugin AdMob en ninguna ruta conocida.\n\nEso explica tu error.");
    }

});
