// Archivo: Anuncios.js

document.addEventListener("deviceready", function () {
    console.log("📱 deviceready OK – Iniciando lógica de AdMob...");

    // 1. Lógica del Contador de Acciones
    let actionCount = 0;
    const ACTIONS_BEFORE_AD = 5; // Muestra un anuncio cada 5 acciones importantes

    function showInterstitialAd() {
        if (window.Median && window.Median.admob) {
            try {
                console.log("🎬 Solicitando interstitial...");
                median.admob.showDemoInterstitial();
                console.log("✅ Solicitud de interstitial enviada");
                // Reiniciar el contador solo si se intenta mostrar el anuncio
                actionCount = 0; 
            } catch (error) {
                console.error("❌ Error al intentar mostrar interstitial:", error);
            }
        } else {
            console.warn("⚠️ Median AdMob no está disponible.");
        }
    }

    function handleAction() {
        actionCount++;
        console.log(`Contador de acciones: ${actionCount}/${ACTIONS_BEFORE_AD}`);
        if (actionCount >= ACTIONS_BEFORE_AD) {
            showInterstitialAd();
        }
    }

    // 2. Identificar y adjuntar eventos a las acciones importantes

    // A. Acciones de Descarga de PDF (Elementos con atributo 'download' dentro de #Portafolio)
    const pdfLinks = document.querySelectorAll('#Portafolio a[download]');
    pdfLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // No prevenimos el default, ya que queremos que la descarga ocurra
            handleAction();
        });
    });
    console.log(`✅ ${pdfLinks.length} enlaces de PDF configurados para contar acciones.`);

    // B. Acciones de Transponer (El enlace de navegación #transponer-pdf)
    // Asumimos que el clic en este enlace lleva a la funcionalidad de transponer
    const transponerLink = document.querySelector('a[href="#transponer-pdf"]');
    if (transponerLink) {
        transponerLink.addEventListener('click', (e) => {
            // No prevenimos el default, ya que queremos que la navegación ocurra
            handleAction();
        });
        console.log("✅ Enlace de Transponer configurado para contar acciones.");
    }

    // C. Acciones de Transponer PDF (Generar Vista Previa y Descargar)
    const procesarBtn = document.getElementById('procesarBtn');
    const descargarBtn = document.getElementById('descargarBtn');

    if (procesarBtn) {
        procesarBtn.addEventListener('click', handleAction);
        console.log("✅ Botón 'Generar Vista Previa' configurado para contar acciones.");
    }

    if (descargarBtn) {
        descargarBtn.addEventListener('click', handleAction);
        console.log("✅ Botón 'Descargar PDF Transpuesto' configurado para contar acciones.");
    }

    // D. Otras acciones importantes que quieras monetizar
    // Por ejemplo, el enlace de Iniciar Sesión/Cerrar Sesión
    const loginLink = document.getElementById('login-link');
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            // El login/logout es una acción importante
            handleAction();
        });
        console.log("✅ Enlace de Login/Logout configurado para contar acciones.");
    }
    
    // 3. (Opcional) Lógica para el banner (si no se muestra automáticamente)
    // Como indicaste que el banner se muestra siempre, no es necesario código aquí.
    // Si quisieras controlarlo:
    // median.admob.banner.enable(); // Para mostrarlo
    // median.admob.banner.disable(); // Para ocultarlo

}, false);