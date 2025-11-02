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
  getRedirectResult 
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
const inWebView = isInWebView();
console.log("📱 WebView detectado:", inWebView);

// 🧭 Detectar si es dispositivo móvil
function isMobileDevice() {
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ✅ Proveedores de autenticación
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// 🧠 Verificar si sessionStorage está disponible (evita error "missing initial state")
function storageAvailable(type) {
  try {
    const storage = window[type];
    const testKey = '__storage_test__';
    storage.setItem(testKey, 'test');
    const retrieved = storage.getItem(testKey);
    storage.removeItem(testKey);
    return retrieved === 'test';
  } catch (e) {
    console.warn(`${type} no disponible:`, e.message);
    return false;
  }
}

// 🚪 Función genérica para login
function loginWithProvider(providerName) {
  let provider;

  if (providerName === "google") provider = googleProvider;
  if (providerName === "facebook") provider = facebookProvider;

  console.log(`🔐 Iniciando sesión con ${providerName}`);

  if (!storageAvailable('sessionStorage')) {
    alert("⚠️ Tu navegador o app no permite almacenamiento local. Abre esta página en Chrome o Safari fuera de la app.");
    return;
  }

  // 🧭 Detectar si es móvil o WebView
  const isMobile = isMobileDevice();
  
  // 📱 Usar redirect para móviles y WebViews, popup para desktop
  if (inWebView || isMobile) {
    console.log("📱 Móvil/WebView detectado — usando redirect");
    signInWithRedirect(auth, provider)
      .catch((error) => {
        console.error(`❌ Error al iniciar redirect con ${providerName}:`, error.message);
        alert(`Error al iniciar sesión con ${providerName}: ${error.message}`);
      });
  } else {
    // 💻 En desktop, usar popup
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(`✅ Usuario autenticado con ${providerName}:`, user);
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error(`❌ Error al iniciar sesión con ${providerName}:`, error.message);
        
        // Manejar errores específicos
        if (error.code === 'auth/account-exists-with-different-credential') {
          alert("⚠️ Este email ya está registrado con otro método de autenticación. Intenta con Google o email.");
        } else {
          alert(`Error al iniciar sesión con ${providerName}: ${error.message}`);
        }
      });
  }
}

// 🖱️ Asignar eventos a los botones
document.getElementById("btn-google").addEventListener("click", () => loginWithProvider("google"));
document.getElementById("btn-facebook").addEventListener("click", () => loginWithProvider("facebook"));

// 🔁 Procesar resultado del redirect (para WebViews y móviles)
getRedirectResult(auth)
  .then((result) => {
    if (result && result.user) {
      console.log("✅ Usuario autenticado (redirect):", result.user);
      window.location.href = "index.html";
    }
  })
  .catch((error) => {
    if (error && error.message) {
      console.error("❌ Error al procesar redirect:", error.message);
      
      // Manejar errores específicos de redirect
      if (error.code === 'auth/account-exists-with-different-credential') {
        alert("⚠️ Este email ya está registrado con Google. Usa ese método para iniciar sesión.");
      } else if (error.code !== 'auth/user-cancelled') {
        // No mostrar error si el usuario canceló manualmente
        alert(`Error de autenticación: ${error.message}`);
      }
    }
  });

console.log("✅ Autenticación Google + Facebook lista (popup para desktop, redirect para móviles).");
console.log("📱 Dispositivo móvil detectado:", isMobileDevice());