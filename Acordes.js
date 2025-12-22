// ====================================================================
// SECCIÓN 1: CONFIGURACIÓN DE FIREBASE Y AUTENTICACIÓN
// ====================================================================

// Importar Firebase desde CDN (esto debe estar en el HTML)
// Nota: Las siguientes líneas son para referencia, no se ejecutan aquí
// <script src="https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js"></script>

// Inicializar Firebase cuando esté disponible
function inicializarFirebase() {
    // Verificar si Firebase está cargado
    if (typeof firebase === 'undefined') {
        console.error('Firebase no está cargado. Esperando...');
        setTimeout(inicializarFirebase, 500);
        return;
    }
    
    const firebaseConfig = {
        apiKey: "AIzaSyDbzwAI7OGNPSNMXqTDz5vJH1A-gE-VxKs",
        authDomain: "conexion-4-13.firebaseapp.com",
        projectId: "conexion-4-13",
        storageBucket: "conexion-4-13.firebasestorage.app",
        messagingSenderId: "508766935713",
        appId: "1:508766935713:web:318bc72eb805de3faceee0",
        measurementId: "G-HW8K01LJZQ"
    };
    
    const app = firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    
    // Escuchar cambios en la autenticación
    auth.onAuthStateChanged((user) => {
        const portafolio = document.getElementById('Portafolio');
        const transponer = document.getElementById('transponer-pdf');
        const loginLink = document.getElementById('login-link');
        
        if (user) {
            console.log("Usuario autenticado:", user.email);
            
            // Mostrar secciones protegidas
            if (portafolio) portafolio.style.display = 'block';
            if (transponer) transponer.style.display = 'block';
            
            // Cambiar enlace a "Cerrar Sesión"
            if (loginLink) {
                loginLink.textContent = 'Cerrar Sesión';
                loginLink.href = '#';
                loginLink.onclick = (e) => {
                    e.preventDefault();
                    auth.signOut().then(() => {
                        window.location.reload();
                    }).catch((error) => {
                        console.error("Error al cerrar sesión:", error);
                    });
                };
            }
            
        } else {
            console.log("Usuario no autenticado.");
            
            // Ocultar secciones protegidas
            if (portafolio) portafolio.style.display = 'none';
            if (transponer) transponer.style.display = 'none';
            
            // Mantener enlace como "Iniciar Sesión"
            if (loginLink) {
                loginLink.textContent = 'Iniciar Sesión';
                loginLink.href = 'login.html';
                loginLink.onclick = null;
            }
        }
        
        // Disparar evento para que el buscador se inicialice después de mostrar la sección
        document.dispatchEvent(new CustomEvent('firebaseAuthChanged'));
    });
}

// ====================================================================
// SECCIÓN 2: FUNCIONALIDAD DEL BUSCADOR
// ====================================================================

function inicializarBuscador() {
    const buscador = document.getElementById('buscador-pdf');
    const pdfItems = document.querySelectorAll('.pdf-item');
    const contador = document.getElementById('contador-resultados');
    
    if (!buscador) return;
    
    buscador.addEventListener('input', function() {
        const termino = this.value.toLowerCase().trim();
        let encontrados = 0;
        
        pdfItems.forEach(item => {
            const texto = item.querySelector('a').textContent.toLowerCase();
            const esVisible = texto.includes(termino);
            
            if (esVisible) {
                item.style.display = 'flex';
                encontrados++;
                
                // Resaltar el término buscado
                const enlace = item.querySelector('a');
                if (termino) {
                    const textoOriginal = enlace.textContent;
                    const regex = new RegExp(`(${termino})`, 'gi');
                    enlace.innerHTML = textoOriginal.replace(regex, '<span class="resaltado">$1</span>');
                } else {
                    enlace.innerHTML = enlace.textContent;
                }
            } else {
                item.style.display = 'none';
            }
        });
        
        // Actualizar contador
        if (contador) {
            if (termino === '') {
                contador.textContent = '';
                contador.classList.remove('visible');
            } else {
                contador.textContent = `${encontrados} de ${pdfItems.length} resultados`;
                contador.classList.add('visible');
            }
        }
    });
    
    // Limpiar búsqueda con la tecla Escape
    buscador.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            this.dispatchEvent(new Event('input'));
        }
    });
}

// ====================================================================
// SECCIÓN 3: FUNCIONES DE TRANSFORMACIÓN DE ACORDES
// ====================================================================

// Variables globales para la transposición
const notas = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const equivalencias = {
    "Db": "C#", "Eb": "D#", "Gb": "F#", "Ab": "G#", 
    "Bb": "A#", "Cb": "B", "Fb": "E", "B#": "C", "E#": "F"
};
const seccionesNegritas = new Set([
    "Intro", "Intro:", "//Intro//", "//Intro//:", "////Intro////:", 
    "////Intro////", "Verso", "//Verso//", "Verso I", "Verso II", 
    "//Verso I//", "///Verso I///", "////Verso I////", "//Verso II//", 
    "Verso III", "Verso IV", "Verso V", "I", "II", "III", "IV", 
    "Pre", "Pre Coro", "//Pre Coro//", "//Pre", "Coro", "Coro I", 
    "Coro II", "//Coro I//", "//Coro II//", "////Coro II////", 
    "Coro III", "//Coro//", "///Coro///", "////Coro////", "Coro//", 
    "Puente", "//Puente//", "//Puente I//", "Puente I", "Puente II", 
    "///Puente I///", "////Puente I////", "////Puente II////", 
    "//Puente II//", "///Puente II///", "///Puente///", 
    "////Puente////", "Inter", "Inter:", "//Inter//", "//Inter//:", 
    "////Inter////", "////Inter////:", "Intermedios", "Final", 
    "//Final//:", "Outro", "Rap:", "Rap", ":", "////Aplausos////:", 
    "Espontaneo", "Espontanea", "Puente termina en:", 
    "Ultima vuelta para ir al coro"
]);

// Lista de palabras comunes que NO deben ser interpretadas como acordes
const palabrasExcluidas = new Set([
    "Dios", "Digno", "Coro", "El", "En", "Es", "De", "Caen", "Fe", 
    "Gloria", "Gracia", "Amor", "Alabanza", "Gozo", "Fuente", "Fluye", 
    "Cristo", "Jesús", "Señor", "Rey", "Padre", "Espíritu", "Santo", 
    "Cielo", "Tierra", "Corazón", "Alma", "Vida", "Luz", "Paz", 
    "Esperanza", "Salvación", "Eternidad", "Adoración", "Bendición", 
    "Misericordia", "Perdón", "Redención", "Santidad", "Poder", 
    "Fuerza", "Refugio", "Fortaleza", "Protección", "Guía", "Camino", 
    "Verdad", "Justicia", "Bondad", "Fidelidad", "Compasión", 
    "Ternura", "Dulzura", "Hermosura", "Majestad", "Grandeza", 
    "Infinito", "Eterno", "Perfecto", "Puro", "Limpio", "Nuevo", 
    "Viejo", "Grande", "Pequeño", "Alto", "Bajo", "Cerca", "Lejos", 
    "Aquí", "Allí", "Ahora", "Siempre", "Nunca", "Todo", "Nada", 
    "Algo", "Alguien", "Nadie", "Todos", "Ninguno", "Uno", "Dos", 
    "Tres", "Cuatro", "Cinco", "Seis", "Siete", "Ocho", "Nueve", 
    "Diez", "Primero", "Segundo", "Tercero", "Último", "Final", 
    "Inicio", "Principio", "Fin", "Día", "Noche", "Mañana", "Tarde", 
    "Hora", "Tiempo", "Momento", "Instante", "Segundo", "Minuto", 
    "Año", "Mes", "Semana", "Hoy", "Ayer", "Mañana", "Antes", 
    "Después", "Durante", "Casa", "Hogar", "Familia", "Hermano", 
    "Hermana", "Hijo", "Hija", "Madre", "Padre", "Abuelo", "Abuela", 
    "Tío", "Tía", "Primo", "Prima", "Esposo", "Esposa", "Amigo", 
    "Amiga", "Pueblo", "Ciudad", "País", "Mundo", "Universo", 
    "Creación", "Naturaleza", "Mar", "Río", "Monte", "Valle", 
    "Cielo", "Estrella", "Sol", "Luna", "Viento", "Lluvia", "Fuego", 
    "Agua", "Aire", "Tierra", "Piedra", "Arena", "Hierba", "Árbol", 
    "Flor", "Fruto", "Semilla", "Raíz"
]);

// Funciones de utilidad para acordes
function esSeccionNegrita(texto) { 
    return texto ? seccionesNegritas.has(texto.trim().replace(/:$/, '')) : false; 
}

function normalizarNota(nota) { 
    return equivalencias[nota] || nota; 
}

function transponerNota(nota, semitonos) {
    if (!nota) return nota;
    const notaNormalizada = normalizarNota(nota);
    const indice = notas.indexOf(notaNormalizada);
    if (indice === -1) return nota;
    const nuevoIndice = (indice + semitonos + 12) % 12;
    return notas[nuevoIndice];
}

function esAcorde(texto) {
    if (!texto || typeof texto !== 'string' || texto.trim().length === 0) return false;
    
    const t = texto.trim();
    
    // Verificar longitud máxima
    if (t.length > 8) return false;
    
    // Verificar que empiece con una nota válida (A-G)
    if (!/^[A-G]/.test(t)) return false;
    
    // Excluir palabras comunes que empiezan con A-G
    if (palabrasExcluidas.has(t)) return false;
    
    // Excluir secciones de canciones
    if (t.toLowerCase().startsWith("verso") || 
        t.toLowerCase().startsWith("coro") || 
        t.toLowerCase().startsWith("puente") ||
        t.toLowerCase().startsWith("intro") ||
        t.toLowerCase().startsWith("final") ||
        t.toLowerCase().startsWith("outro")) return false;
    
    // Patrón para acordes
    const patronAcorde = /^[A-G][b#]?(m|maj|dim|aug|sus[24]?|add[0-9]+|alt|M|[0-9]+)*(\/[A-G][b#]?)?$/;
    
    if (!patronAcorde.test(t)) return false;
    
    // Verificaciones adicionales
    if (t.length === 1) return true;
    
    if (t.length === 2) return /^[A-G][#b]$/.test(t);
    
    const modificadoresValidos = ['m', 'maj', 'dim', 'aug', 'sus', 'add', 'alt', 'M'];
    const tieneModificadorValido = modificadoresValidos.some(mod => t.includes(mod));
    const tieneNumero = /\d/.test(t);
    const tieneBarra = t.includes('/');
    
    if (t.length > 2) return tieneModificadorValido || tieneNumero || tieneBarra;
    
    return true;
}

function procesarAcorde(acorde, semitonos) {
    if (!acorde || !esAcorde(acorde)) return { original: acorde, transpuesto: acorde };
    
    const partes = acorde.trim().split('/');
    const principal = partes[0];
    const bajoOriginal = partes.length > 1 ? partes[1] : null;

    const matchPrincipal = principal.match(/^([A-G][b#]?)(.*)/);
    if (!matchPrincipal) return { original: acorde, transpuesto: acorde };

    const notaPrincipal = matchPrincipal[1];
    const extension = matchPrincipal[2];
    
    const notaPrincipalTranspuesta = transponerNota(notaPrincipal, semitonos);
    const bajoTranspuesto = bajoOriginal ? transponerNota(bajoOriginal, semitonos) : null;

    let acordeTranspuesto = notaPrincipalTranspuesta + extension;
    if (bajoTranspuesto) acordeTranspuesto += "/" + bajoTranspuesto;
    
    return { original: acorde, transpuesto: acordeTranspuesto };
}

async function procesarPagina(page, docInstance, semitonos) {
    const content = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1.0 });
    
    docInstance.internal.pageSize.width = viewport.width;
    docInstance.internal.pageSize.height = viewport.height;

    const borderMargin = 25;
    const borderColor = 'black';
    const borderWidth = 1;
    
    docInstance.setDrawColor(borderColor);
    docInstance.setLineWidth(borderWidth);
    docInstance.rect(
        borderMargin, 
        borderMargin, 
        viewport.width - (borderMargin * 2), 
        viewport.height - (borderMargin * 2)
    );
    
    const items = content.items.map(item => ({
        text: item.str,
        x: item.transform[4],
        y: viewport.height - item.transform[5],
        width: item.width,
        height: item.height,
        fontSize: item.transform[0],
        isChord: esAcorde(item.str),
        isBoldSection: esSeccionNegrita(item.str)
    }));

    const lineas = {};
    items.forEach(item => {
        const lineaKey = Math.round(item.y);
        if (!lineas[lineaKey]) lineas[lineaKey] = [];
        lineas[lineaKey].push(item);
    });

    Object.values(lineas).forEach(linea => linea.sort((a, b) => a.x - b.x));

    Object.values(lineas).forEach(linea => {
        let desplazamientoAcumulado = 0;
        linea.forEach(item => {
            item.x += desplazamientoAcumulado;

            if (item.isChord) {
                const { transpuesto } = procesarAcorde(item.text, semitonos);
                
                docInstance.setFontSize(item.fontSize);
                const anchoOriginal = docInstance.getStringUnitWidth(item.text) * item.fontSize;
                const anchoTranspuesto = docInstance.getStringUnitWidth(transpuesto) * item.fontSize;
                
                const delta = anchoTranspuesto - anchoOriginal;
                desplazamientoAcumulado += delta;

                item.text = transpuesto;
            }
        });
    });

    Object.values(lineas).forEach(linea => {
        linea.forEach(item => {
            const esBold = item.isBoldSection;
            docInstance.setFont('helvetica', esBold ? 'bold' : 'normal');
            docInstance.setFontSize(item.fontSize);
            const yPos = item.y;
            docInstance.text(item.text, item.x, yPos);
        });
    });
}

function leerArchivo(archivo) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(archivo);
    });
}

async function procesarPDF() {
    const archivoInput = document.getElementById('pdfFile');
    if (!archivoInput.files || archivoInput.files.length === 0) {
        alert("Por favor selecciona un archivo PDF.");
        return;
    }
    
    const archivo = archivoInput.files[0];
    const semitonos = parseInt(document.getElementById('semitones').value, 10) || 0;
    
    document.getElementById('loading').style.display = 'block';
    document.getElementById('visorPDF').style.display = 'none';
    document.getElementById('descargarBtn').style.display = 'none';

    try {
        const arrayBuffer = await leerArchivo(archivo);
        
        // Verificar que pdfjsLib esté disponible
        if (typeof pdfjsLib === 'undefined') {
            throw new Error('PDF.js no está cargado correctamente');
        }
        
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const docInstance = new jspdf.jsPDF({ unit: 'pt', compress: true });

        for (let i = 1; i <= pdf.numPages; i++) {
            if (i > 1) docInstance.addPage();
            const page = await pdf.getPage(i);
            await procesarPagina(page, docInstance, semitonos);
        }
        
        const pdfOutput = docInstance.output('blob');
        const blobUrl = URL.createObjectURL(pdfOutput);
        
        const visor = document.getElementById('visorPDF');
        visor.src = blobUrl;
        visor.style.display = 'block';
        document.getElementById('loading').style.display = 'none';
        
        const btnDescarga = document.getElementById('descargarBtn');
        btnDescarga.style.display = 'inline-block';
        btnDescarga.onclick = () => {
            const nombreArchivo = `acordes_transpuestos_${semitonos > 0 ? '+' : ''}${semitonos}.pdf`;
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = nombreArchivo;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
        
    } catch (error) {
        console.error("Error al procesar PDF:", error);
        alert(`Se produjo un error: ${error.message}`);
        document.getElementById('loading').style.display = 'none';
    }
}

// ====================================================================
// SECCIÓN 4: FUNCIONALIDADES GENERALES DE LA PÁGINA
// ====================================================================

// Efecto de zoom en la imagen principal
function toggleZoom() {
    const imagen = document.querySelector('.imagen-about-us');
    if (imagen) {
        imagen.classList.toggle('zoom-effect');
        setTimeout(() => {
            imagen.classList.toggle('zoom-effect');
        }, 1000);
    }
}

// Menú responsive
function inicializarMenuResponsive() {
    const menuIcon = document.querySelector('.menu-icon');
    const menu = document.querySelector('.menu');
    
    if (menuIcon && menu) {
        menuIcon.addEventListener('click', function() {
            menu.classList.toggle('active');
        });
    }
}

// Funcionalidad para ampliar imágenes del portafolio
function inicializarModalImagenes() {
    const modal = document.getElementById('imagenModal');
    if (!modal) return;
    
    const modalImg = document.getElementById('imagenAmpliada');
    const pieFoto = document.getElementById('pieFoto');
    const spanCerrar = document.getElementsByClassName('cerrar')[0];
    
    // Crear botones de ampliar para cada imagen
    const pdfItems = document.querySelectorAll('.pdf-item');
    pdfItems.forEach(item => {
        const img = item.querySelector('img');
        if (!img) return;
        
        const altText = img.getAttribute('alt');
        const downloadLink = item.querySelector('a').getAttribute('href');
        
        // Crear botón de ampliar
        const ampliarBtn = document.createElement('button');
        ampliarBtn.className = 'ampliar-btn';
        ampliarBtn.innerHTML = '🔍';
        ampliarBtn.title = 'Ampliar imagen';
        item.prepend(ampliarBtn);
        
        // Evento para el botón de ampliar
        ampliarBtn.addEventListener('click', function() {
            modal.style.display = 'block';
            modalImg.src = img.src;
            pieFoto.textContent = altText + ' - ' + downloadLink.split('/').pop();
        });
        
        // También permitir hacer clic directamente en la imagen
        img.addEventListener('click', function() {
            modal.style.display = 'block';
            modalImg.src = img.src;
            pieFoto.textContent = altText + ' - ' + downloadLink.split('/').pop();
        });
    });
    
    // Cerrar modal al hacer clic en la X
    if (spanCerrar) {
        spanCerrar.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Cerrar modal al hacer clic fuera de la imagen
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
}

// Mostrar nombre del archivo seleccionado
function inicializarInputArchivo() {
    const pdfFileInput = document.getElementById('pdfFile');
    if (pdfFileInput) {
        pdfFileInput.addEventListener('change', function(e) {
            const fileName = e.target.files[0] ? e.target.files[0].name : "Ningún archivo seleccionado";
            const fileNameSpan = document.getElementById('file-name');
            if (fileNameSpan) {
                fileNameSpan.textContent = fileName;
            }
        });
    }
}

// ====================================================================
// SECCIÓN 5: INICIALIZACIÓN GENERAL
// ====================================================================

// Función principal de inicialización
function inicializarAplicacion() {
    // 1. Inicializar Firebase
    inicializarFirebase();
    
    // 2. Inicializar menú responsive
    inicializarMenuResponsive();
    
    // 3. Inicializar buscador cuando el DOM esté listo
    inicializarBuscador();
    
    // 4. Inicializar modal de imágenes
    inicializarModalImagenes();
    
    // 5. Inicializar input de archivo
    inicializarInputArchivo();
    
    // 6. Configurar PDF.js
    if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
    }
    
    // 7. Configurar botón de procesar PDF
    const procesarBtn = document.getElementById('procesarBtn');
    if (procesarBtn) {
        procesarBtn.addEventListener('click', procesarPDF);
    }
    
    // 8. Configurar efecto de zoom
    window.addEventListener('load', () => {
        setTimeout(toggleZoom, 1000);
    });
    
    // 9. Activar zoom cada 8 segundos
    setInterval(toggleZoom, 8000);
    
    // 10. Escuchar evento de Firebase para reinicializar buscador cuando se muestre la sección
    document.addEventListener('firebaseAuthChanged', inicializarBuscador);
}

// ====================================================================
// SECCIÓN 6: EJECUCIÓN CUANDO EL DOM ESTÉ LISTO
// ====================================================================

// Esperar a que el DOM esté completamente cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarAplicacion);
} else {
    // DOM ya cargado
    inicializarAplicacion();
}

// Exportar funciones importantes para uso externo si es necesario
window.AcordesApp = {
    procesarPDF,
    inicializarBuscador,
    toggleZoom
};