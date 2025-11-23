document.addEventListener("deviceready", function () {
    console.log("📱 deviceready OK – Iniciando AdMob...");

    const btn = document.getElementById("video-btn");
    
    if (btn && window.Median && window.Median.admob) {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            try {
                console.log("🎬 Solicitando interstitial...");
                window.Median.admob.showInterstitialIfReady();
                console.log("✅ Solicitud de interstitial enviada");
                
                // Opcional: Mostrar mensaje al usuario
                setTimeout(() => {
                    alert("Si hay un anuncio disponible, se mostrará en breve");
                }, 500);
                
            } catch (error) {
                console.error("❌ Error al mostrar interstitial:", error);
                alert("Error al cargar el anuncio");
            }
            
            return false;
        });
        
        console.log("✅ Botón de interstitial configurado correctamente");
        
    } else {
        console.error("❌ No se pudo configurar el botón - Elemento o AdMob no disponible");
    }

}, false);