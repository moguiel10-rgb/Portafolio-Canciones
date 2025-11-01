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

// 🧭 Detectar si estamos en un WebView o navegador móvil
function isInWebView() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  return (
    ua.includes("wv") ||                      // Android WebView
    window.ReactNativeWebView ||              // React Native WebView
    ua.includes("Median") ||                  // Median usa su propio userAgent
    window.location.href.startsWith("file://") ||
    window.location.href.includes("median.run")
  );
}

const inWebView = isInWebView();
console.log("📱 WebView detectado:", inWebView);

// 🔑 Proveedores de autenticación
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// 📩 Función genérica de login
function loginWithProvider(providerName) {
  let provider;

  if (providerName === "google") provider = googleProvider;
  if (providerName === "facebook") provider = facebookProvider;

  // Detectar si es móvil o WebView
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile || inWebView) {
    console.log(`📱 Iniciando sesión con ${providerName} usando redirect`);
    signInWithRedirect(auth, provider);
  } else {
    console.log(`💻 Iniciando sesión con ${providerName} usando popup`);
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(`✅ Usuario autenticado con ${providerName}:`, user);
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error(`❌ Error con ${providerName}:`, error.message);
        alert(`Error con ${providerName}: ${error.message}`);
      });
  }
}

// 🖱️ Asignar eventos a los botones
document.getElementById("btn-google").addEventListener("click", () => loginWithProvider("google"));
document.getElementById("btn-facebook").addEventListener("click", () => loginWithProvider("facebook"));

// 📥 Procesar el resultado del redirect (cuando regresa del login)
getRedirectResult(auth)
  .then((result) => {
    if (result && result.user) {
      console.log("✅ Usuario autenticado tras redirect:", result.user);
      window.location.href = "index.html";
    }
  })
  .catch((error) => {
    console.error("❌ Error al procesar redirect:", error.message);
  });

console.log("✅ Autenticación Google + Facebook lista (popup/redirect automático).");
