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
const provider = new GoogleAuthProvider();

// 🧭 Detectar si estamos en un WebView (incluye Median)
function isInWebView() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  return (
    ua.includes("wv") ||                      // Android WebView
    window.ReactNativeWebView ||              // React Native WebView
    ua.includes("Median") ||                  // Median usa su propio userAgent
    window.location.href.startsWith("file://") ||
    window.location.href.includes("median.run") // Median usa dominios *.median.run
  );
}

const inWebView = isInWebView();

// 🔑 Función de login con Google
function signInWithGoogle() {
  if (inWebView) {
    console.log("Iniciando sesión con redirect (WebView detectado)");
    signInWithRedirect(auth, provider);
  } else {
    console.log("Iniciando sesión con popup (navegador detectado)");
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("✅ Usuario autenticado (popup):", user);
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error("❌ Error en login con popup:", error.message);
        alert("Error al iniciar sesión con Google: " + error.message);
      });
  }
}

// 📩 Procesar el resultado del redirect
getRedirectResult(auth)
  .then((result) => {
    if (result && result.user) {
      console.log("✅ Usuario autenticado (redirect):", result.user);
      window.location.href = "index.html";
    }
  })
  .catch((error) => {
    if (inWebView) {
      console.error("❌ Error en login con redirect:", error.message);
      alert("Error al iniciar sesión con Google: " + error.message);
    }
  });

// 🖱️ Asignar evento al botón
document.getElementById("btn-google").addEventListener("click", signInWithGoogle);

console.log("✅ Autenticación con Google habilitada.");
