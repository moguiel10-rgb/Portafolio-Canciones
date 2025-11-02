// 🔥 Importar SDKs de Firebase
import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";

import { 
  getAuth, 
  GoogleAuthProvider,
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

// ✅ Proveedor de autenticación de Google
const googleProvider = new GoogleAuthProvider();

// 🧠 Verificar si sessionStorage está disponible
function storageAvailable(type) {
  try {
    const storage = window[type];
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

// 🚪 Función para login con Google
function loginWithGoogle() {
  console.log("🔐 Iniciando sesión con Google");

  if (!storageAvailable('sessionStorage')) {
    alert("⚠️ Tu navegador o app no permite almacenamiento local. Abre esta página en Chrome o Safari fuera de la app.");
    return;
  }

  // 🧭 Si estamos dentro de un WebView, usamos redirect
  if (inWebView) {
    console.log("🌐 WebView detectado — usando redirect");
    signInWithRedirect(auth, googleProvider);
  } else {
    // 💨 En navegadores normales, usamos popup
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        console.log("✅ Usuario autenticado con Google:", user);
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error("❌ Error al iniciar sesión con Google:", error.message);
        alert(`Error al iniciar sesión con Google: ${error.message}`);
      });
  }
}

// 🖱️ Asignar evento al botón de Google
document.getElementById("btn-google").addEventListener("click", loginWithGoogle);

// 🔁 Procesar resultado del redirect (para WebViews)
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
    }
  });

console.log("✅ Autenticación Google lista (popup + fallback redirect).");