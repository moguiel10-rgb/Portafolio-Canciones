// Efecto de zoom en la imagen
function toggleZoom() {
    const imagen = document.querySelector('.imagen-about-us');
    imagen.classList.toggle('zoom-effect');
    
    setTimeout(() => {
        imagen.classList.toggle('zoom-effect');
    }, 1000);
}

// Activar cada 5 segundos
setInterval(toggleZoom, 8000);

// Ejecutar inmediatamente al cargar
window.addEventListener('load', () => {
    setTimeout(toggleZoom, 1000);
});

// Menu responsive
document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.querySelector('.menu-icon');
    const menu = document.querySelector('.menu');
    
    menuIcon.addEventListener('click', function() {
        menu.classList.toggle('active');
    });
});

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
const { jsPDF } = window.jspdf;
    
const notas = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const equivalencias = { "Db": "C#", "Eb": "D#", "Gb": "F#", "Ab": "G#", "Bb": "A#", "Cb": "B", "Fb": "E", "B#": "C", "E#": "F" };
const seccionesNegritas = new Set(["Intro","Intro:","//Intro//","//Intro//:","////Intro////:","////Intro////","Verso","//Verso//", "Verso I", "Verso II","//Verso I//","///Verso I///","////Verso I////", "//Verso II//", "Verso III","Verso IV","Verso V","I","II","III","IV","Pre", "Pre Coro","//Pre Coro//","//Pre", "Coro","Coro I","Coro II","//Coro I//","//Coro II//","////Coro II////","Coro III","//Coro//","///Coro///","////Coro////","Coro//", "Puente","//Puente//","//Puente I//","Puente I","Puente II","///Puente I///","////Puente I////","////Puente II////","//Puente II//","///Puente II///","///Puente///","////Puente////","Inter","Inter:","//Inter//","//Inter//:","////Inter////","////Inter////:","Intermedios", "Final","//Final//:", "Outro","Rap:","Rap",":","////Aplausos////:", "Espontaneo","Espontanea","Puente termina en:",  "Ultima vuelta para ir al coro"]);

// Lista de palabras comunes que NO deben ser interpretadas como acordes
const palabrasExcluidas = new Set([
    "Dios", "Digno","Coro", "El", "En", "Es","De","Caen", "Fe", "Gloria", "Gracia", "Amor", "Alabanza","Gozo","Fuente",
    "Fluye","Cristo", "Jesús", "Señor", "Rey", "Padre", "Espíritu", "Santo", "Cielo", "Tierra",
    "Corazón", "Alma", "Vida", "Luz", "Paz", "Gozo", "Esperanza", "Salvación", "Eternidad",
    "Adoración", "Bendición", "Misericordia", "Perdón", "Redención", "Santidad", "Poder",
    "Fuerza", "Refugio", "Fortaleza", "Protección", "Guía", "Camino", "Verdad", "Justicia",
    "Bondad", "Fidelidad", "Compasión", "Ternura", "Dulzura", "Hermosura", "Majestad",
    "Grandeza", "Infinito", "Eterno", "Perfecto", "Puro", "Limpio", "Nuevo", "Viejo",
    "Grande", "Pequeño", "Alto", "Bajo", "Cerca", "Lejos", "Aquí", "Allí", "Ahora",
    "Siempre", "Nunca", "Todo", "Nada", "Algo", "Alguien", "Nadie", "Todos", "Ninguno",
    "Uno", "Dos", "Tres", "Cuatro", "Cinco", "Seis", "Siete", "Ocho", "Nueve", "Diez",
    "Primero", "Segundo", "Tercero", "Último", "Final", "Inicio", "Principio", "Fin",
    "Día", "Noche", "Mañana", "Tarde", "Hora", "Tiempo", "Momento", "Instante", "Segundo",
    "Minuto", "Año", "Mes", "Semana", "Hoy", "Ayer", "Mañana", "Antes", "Después", "Durante",
    "Casa", "Hogar", "Familia", "Hermano", "Hermana", "Hijo", "Hija", "Madre", "Padre",
    "Abuelo", "Abuela", "Tío", "Tía", "Primo", "Prima", "Esposo", "Esposa", "Amigo", "Amiga",
    "Pueblo", "Ciudad", "País", "Mundo", "Universo", "Creación", "Naturaleza", "Mar", "Río",
    "Monte", "Valle", "Cielo", "Estrella", "Sol", "Luna", "Viento", "Lluvia", "Fuego", "Agua",
    "Aire", "Tierra", "Piedra", "Arena", "Hierba", "Árbol", "Flor", "Fruto", "Semilla", "Raíz"
]);

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
    
    // Verificar longitud máxima (acordes no suelen ser muy largos)
    if (t.length > 8) return false;
    
    // Verificar que empiece con una nota válida (A-G)
    if (!/^[A-G]/.test(t)) return false;
    
    // Excluir palabras comunes que empiezan con A-G
    if (palabrasExcluidas.has(t)) return false;
    
    // Excluir palabras que claramente son secciones de canciones
    if (t.toLowerCase().startsWith("verso") || 
        t.toLowerCase().startsWith("coro") || 
        t.toLowerCase().startsWith("puente") ||
        t.toLowerCase().startsWith("intro") ||
        t.toLowerCase().startsWith("final") ||
        t.toLowerCase().startsWith("outro")) return false;
    
    // Patrón más estricto para acordes
    // Debe empezar con nota (A-G), opcionalmente seguida de # o b,
    // luego opcionalmente modificadores de acorde válidos
    const patronAcorde = /^[A-G][b#]?(m|maj|dim|aug|sus[24]?|add[0-9]+|alt|M|[0-9]+)*(\/[A-G][b#]?)?$/;
    
    // Verificar que coincida con el patrón
    if (!patronAcorde.test(t)) return false;
    
    // Verificaciones adicionales para evitar falsos positivos
    
    // Si tiene solo una letra (A, B, C, D, E, F, G), verificar contexto
    if (t.length === 1) {
        // Solo aceptar si es una nota sola (muy común en acordes)
        return true;
    }
    
    // Si tiene dos caracteres, verificar que el segundo sea # o b
    if (t.length === 2) {
        return /^[A-G][#b]$/.test(t);
    }
    
    // Para acordes más largos, verificar que tengan modificadores válidos
    const modificadoresValidos = ['m', 'maj', 'dim', 'aug', 'sus', 'add', 'alt', 'M'];
    const tieneModificadorValido = modificadoresValidos.some(mod => t.includes(mod));
    const tieneNumero = /\d/.test(t);
    const tieneBarra = t.includes('/');
    
    // Si es más largo que 2 caracteres, debe tener al menos un modificador válido, número o barra
    if (t.length > 2) {
        return tieneModificadorValido || tieneNumero || tieneBarra;
    }
    
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
    if (bajoTranspuesto) {
        acordeTranspuesto += "/" + bajoTranspuesto;
    }
    return { original: acorde, transpuesto: acordeTranspuesto };
}

async function procesarPagina(page, docInstance, semitonos) {
    const content = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1.0 });
    
    // Ajustar el tamaño de la página en jsPDF para que coincida con el del PDF original
    docInstance.internal.pageSize.width = viewport.width;
    docInstance.internal.pageSize.height = viewport.height;

    // Configurar y dibujar el borde de página
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
        reader.onload = (event) => {
            resolve(event.target.result);
        };
        reader.onerror = (error) => {
            reject(error);
        };
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
        
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const docInstance = new jsPDF({ unit: 'pt', compress: true });

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

document.getElementById('procesarBtn').addEventListener('click', procesarPDF);

// Mostrar nombre del archivo seleccionado
document.getElementById('pdfFile').addEventListener('change', function(e) {
    const fileName = e.target.files[0] ? e.target.files[0].name : "Ningún archivo seleccionado";
    document.getElementById('file-name').textContent = fileName;
});

// Funcionalidad para ampliar imágenes del portafolio
document.addEventListener('DOMContentLoaded', function() {
  // Obtener el modal
  const modal = document.getElementById('imagenModal');
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
  spanCerrar.addEventListener('click', function() {
    modal.style.display = 'none';
  });
  
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
});
