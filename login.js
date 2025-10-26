import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDbzwAI7OGNPSNMXqTDz5vJH1A-gE-VxKs",
  authDomain: "conexion-4-13.firebaseapp.com",
  projectId: "conexion-4-13",
  storageBucket: "conexion-4-13.firebasestorage.app",
  messagingSenderId: "508766935713",
  appId: "1:508766935713:web:318bc72eb805de3faceee0",
  measurementId: "G-HW8K01LJZQ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();

// Detectar si estamos en WebView
const isWebView = /file:\/\/|capacitor:\/\/localhost/.test(window.location.href);

// Función para iniciar sesión con Google
function signInWithGoogle() {
  if (isWebView) {
    // Para app híbrida: usar redirect
    signInWithRedirect(auth, provider);
  } else {
    // Para navegador: usar popup
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log('Usuario autenticado con Google (popup):', user);
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error("Error al iniciar sesión con Google (popup):", error.message);
        alert("Error al iniciar sesión con Google: " + error.message);
      });
  }
}

// Manejar resultado de redirect (cuando vuelve la app)
getRedirectResult(auth)
  .then((result) => {
    if (result) {
      const user = result.user;
      console.log('Usuario autenticado con Google (redirect):', user);
      window.location.href = "index.html";
    }
  })
  .catch((error) => {
    if (isWebView) {
      console.error("Error al iniciar sesión con Google (redirect):", error.message);
      alert("Error al iniciar sesión con Google: " + error.message);
    }
  });

// Asignar evento al botón
document.getElementById("btn-google").addEventListener("click", signInWithGoogle);

console.log('Autenticación con Google habilitada.');
