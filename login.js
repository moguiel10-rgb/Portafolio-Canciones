// 🔥 Importar SDKs de Firebase
import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";

import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

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

// ✅ Proveedor de Google
const googleProvider = new GoogleAuthProvider();

// 🚪 Función para login con Google
async function loginWithGoogle() {
  try {
    console.log("Intentando iniciar sesión con popup...");
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("✅ Usuario autenticado:", user);

    // 🔁 Redirige a la pantalla principal de tu app
    window.location.href = "/";  // o tu ruta interna principal
  } catch (error) {
    console.error("❌ Error al iniciar sesión con Google:", error.message);
    alert("Error al iniciar sesión con Google: " + error.message);
  }
}

// 🖱️ Asignar evento al botón
document.getElementById("btn-google").addEventListener("click", loginWithGoogle);
