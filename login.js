// 🔥 Importar SDKs de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";

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

// 🧭 Detectar si ya hay sesión activa
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "index.html";
  }
});

// 🎛️ Alternar entre login y registro
let isRegistering = false;
const btnAuth = document.getElementById('btn-auth');
const formTitle = document.getElementById('form-title');
const toggle = document.getElementById('toggle-mode');

toggle.addEventListener('click', () => {
  isRegistering = !isRegistering;
  formTitle.textContent = isRegistering ? 'Crear cuenta' : 'Iniciar sesión';
  btnAuth.textContent = isRegistering ? 'Registrarme' : 'Entrar';
  toggle.innerHTML = isRegistering
    ? '¿Ya tienes cuenta? <span>Inicia sesión</span>'
    : '¿No tienes cuenta? <span>Regístrate aquí</span>';
});

// 🔐 Acción principal (login / registro)
btnAuth.addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    alert("Por favor llena todos los campos.");
    return;
  }

  try {
    if (isRegistering) {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("✅ Cuenta creada con éxito. Redirigiendo...");
    } else {
      await signInWithEmailAndPassword(auth, email, password);
      alert("✅ Bienvenido de nuevo.");
    }
    window.location.href = "index.html";
  } catch (error) {
    alert(`❌ Error: ${error.message}`);
  }
});

// 🔵 Login con Google
document.getElementById('btn-google').addEventListener('click', async () => {
  try {
    await signInWithPopup(auth, provider);
    alert("✅ Inicio de sesión con Google exitoso.");
    window.location.href = "index.html";
  } catch (error) {
    alert(`❌ Error con Google: ${error.message}`);
  }
});
