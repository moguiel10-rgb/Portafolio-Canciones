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

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// 🧭 Detectar si estamos en un WebView
function isInWebView() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  return (
    ua.includes("wv") ||
    window.ReactNativeWebView ||
    ua.includes("Median") ||
    window.location.href.startsWith("file://") ||
    window.location.href.includes("median.run")
  );
}

const inWebView = isInWebView();

// 🔑 Login con Google
function signInWithGoogle() {
  if (inWebView) {
    signInWithRedirect(auth, googleProvider);
  } else {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        console.log("✅ Google login:", user);
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error("❌ Error Google:", error.message);
        alert("Error al iniciar sesión con Google: " + error.message);
      });
  }
}

// 🔑 Login con Facebook
function signInWithFacebook() {
  if (inWebView) {
    signInWithRedirect(auth, facebookProvider);
  } else {
    signInWithPopup(auth, facebookProvider)
      .then((result) => {
        const user = result.user;
        console.log("✅ Facebook login:", user);
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error("❌ Error Facebook:", error.message);
        alert("Error al iniciar sesión con Facebook: " + error.message);
      });
  }
}

// 📩 Procesar redirect (para ambos)
getRedirectResult(auth)
  .then((result) => {
    if (result && result.user) {
      console.log("✅ Usuario autenticado (redirect):", result.user);
      window.location.href = "index.html";
    }
  })
  .catch((error) => {
    console.error("❌ Error redirect:", error.message);
  });

// 🖱️ Eventos de botones
document.getElementById("btn-google").addEventListener("click", signInWithGoogle);
document.getElementById("btn-facebook").addEventListener("click", signInWithFacebook);

console.log("✅ Autenticación con Google y Facebook habilitada.");
