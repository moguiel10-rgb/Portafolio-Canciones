// 🔥 Importar SDKs de Firebase
import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";

import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

import { 
  getAnalytics 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";

// 🔧 Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDbzwAI7OGNPSNMXqTDz5vJH1A-gE-VxKs",
  authDomain: "conexion-4-13.firebaseapp.com",
  projectId: "conexion-4-13",
  storageBucket: "conexion-4-13.firebasestorage.app",
  messagingSenderId: "508766935713",
  appId: "1:508766935713:web:318bc72eb805de3faceee0",
  measurementId: "G-HW8K01LJZQ"
};

// 🚀 Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

// 🔄 CONFIGURACIÓN CRÍTICA: Usar localStorage en lugar de sessionStorage
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("✅ Persistencia configurada a localStorage");
  })
  .catch((error) => {
    console.error("❌ Error configurando persistencia:", error);
  });

// 🧭 Detectar si estamos dentro de un WebView
function isInWebView() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  return (
    ua.includes("wv") ||                      // Android WebView
    window.ReactNativeWebView ||              // React Native
    ua.includes("Median") ||                  // WebView de Median
    window.location.href.startsWith("file://") ||
    window.location.href.includes("median.run")
  );
}

// 🧭 Detectar si es dispositivo móvil
function isMobileDevice() {
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

const inWebView = isInWebView();
const isMobile = isMobileDevice();

console.log("📱 WebView detectado:", inWebView);
console.log("📱 Dispositivo móvil detectado:", isMobile);

// ✅ Proveedores de autenticación
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// 🛠️ SOLUCIÓN: Configurar parámetros para evitar pérdida de estado
facebookProvider.setCustomParameters({
  display: 'touch', // Mejor para móviles
  state: 'facebook_direct' // Estado personalizado
});

googleProvider.setCustomParameters({
  state: 'google_direct'
});

// 🧠 Sistema de almacenamiento robusto
const storageManager = {
  set: (key, value) => {
    try {
      // Intentar con localStorage primero (más persistente)
      localStorage.setItem(key, value);
      // Backup en sessionStorage
      sessionStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn("Almacenamiento no disponible, usando memoria:", e);
      // Fallback a variable en memoria
      window.__authState = window.__authState || {};
      window.__authState[key] = value;
      return false;
    }
  },
  
  get: (key) => {
    try {
      return localStorage.getItem(key) || sessionStorage.getItem(key) || (window.__authState && window.__authState[key]);
    } catch (e) {
      return window.__authState && window.__authState[key];
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch (e) {
      // Ignorar errores de storage
    }
    if (window.__authState) {
      delete window.__authState[key];
    }
  }
};

// 🚪 Función genérica para login
function loginWithProvider(providerName) {
  let provider;

  if (providerName === "google") provider = googleProvider;
  if (providerName === "facebook") provider = facebookProvider;

  console.log(`🔐 Iniciando sesión con ${providerName}`);
  console.log(`📱 Contexto: Mobile=${isMobile}, WebView=${inWebView}`);

  // 🔄 Guardar estado antes de la autenticación
  storageManager.set('auth_provider', providerName);
  storageManager.set('auth_timestamp', Date.now().toString());

  // 📱 Estrategia basada en dispositivo
  if (inWebView || isMobile) {
    console.log("📱 Usando flujo de redirección para móvil/WebView");
    
    // Limpiar estados previos antes de redirección
    storageManager.remove('facebook_state');
    storageManager.remove('google_state');
    
    signInWithRedirect(auth, provider)
      .then(() => {
        console.log("✅ Redirección iniciada correctamente");
        // La redirección ocurrirá automáticamente
      })
      .catch((error) => {
        console.error(`❌ Error en redirección con ${providerName}:`, error);
        
        // 🔁 Reintentar con popup si falla la redirección
        if (error.code === 'auth/internal-error' || error.message.includes('state')) {
          console.log("🔄 Fallback a popup después de error de redirección");
          signInWithPopup(auth, provider)
            .then((result) => {
              const user = result.user;
              console.log(`✅ Usuario autenticado con ${providerName} (fallback popup):`, user);
              window.location.href = "index.html";
            })
            .catch((popupError) => {
              console.error(`❌ Error en popup fallback:`, popupError);
              handleAuthError(popupError, providerName);
            });
        } else {
          handleAuthError(error, providerName);
        }
      });
  } else {
    // 💻 En desktop, usar popup
    console.log("💻 Usando flujo de popup para desktop");
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(`✅ Usuario autenticado con ${providerName}:`, user);
        // Limpiar storage después de éxito
        storageManager.remove('auth_provider');
        storageManager.remove('auth_timestamp');
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error(`❌ Error al iniciar sesión con ${providerName}:`, error);
        handleAuthError(error, providerName);
      });
  }
}

// 🎯 Manejo centralizado de errores
function handleAuthError(error, providerName) {
  let errorMessage = `Error al iniciar sesión con ${providerName}: `;
  
  switch (error.code) {
    case 'auth/account-exists-with-different-credential':
      errorMessage = "⚠️ Este email ya está registrado con otro método. Intenta con Google o email.";
      break;
    case 'auth/popup-blocked':
      errorMessage = "⚠️ El popup fue bloqueado. Permite popups para este sitio.";
      break;
    case 'auth/popup-closed-by-user':
      errorMessage = "⚠️ La ventana de autenticación fue cerrada. Intenta de nuevo.";
      break;
    case 'auth/unauthorized-domain':
      errorMessage = "⚠️ Dominio no autorizado. Contacta al administrador.";
      break;
    default:
      errorMessage += error.message;
  }
  
  alert(errorMessage);
}

// 🖱️ Asignar eventos a los botones (con verificación)
function initializeAuthButtons() {
  const googleBtn = document.getElementById("btn-google");
  const facebookBtn = document.getElementById("btn-facebook");
  
  if (googleBtn) {
    googleBtn.addEventListener("click", () => loginWithProvider("google"));
  } else {
    console.warn("❌ Botón de Google no encontrado");
  }
  
  if (facebookBtn) {
    facebookBtn.addEventListener("click", () => loginWithProvider("facebook"));
  } else {
    console.warn("❌ Botón de Facebook no encontrado");
  }
}

// 🔁 Procesar resultado del redirect (MEJORADO)
getRedirectResult(auth)
  .then((result) => {
    if (result && result.user) {
      console.log("✅ Usuario autenticado correctamente (redirect):", result.user);
      // Limpiar storage después de éxito
      storageManager.remove('auth_provider');
      storageManager.remove('auth_timestamp');
      window.location.href = "index.html";
    } else {
      console.log("ℹ️ No hay resultado de redirect o usuario canceló");
    }
  })
  .catch((error) => {
    console.error("❌ Error al procesar redirect:", error);
    
    // No mostrar alerta si el usuario canceló manualmente
    if (error.code !== 'auth/user-cancelled' && 
        !error.message.includes('popup') &&
        !error.message.includes('closed')) {
      handleAuthError(error, 'redirect');
    }
  });

// 🏁 Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAuthButtons);
} else {
  initializeAuthButtons();
}

console.log("✅ Auth system inicializado - Estrategia:", isMobile ? "Móvil (Redirect)" : "Desktop (Popup)");