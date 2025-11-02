// -------------------------------------------------------------------
// 1. INICIALIZACIÓN DE FIREBASE Y PROVEEDORES
// -------------------------------------------------------------------
// ASEGÚRATE DE QUE ESTAS VARIABLES ESTÉN DEFINIDAS EN ALGÚN LUGAR DE TU PROYECTO
// (Normalmente en un archivo de configuración de Firebase que se carga antes de este script)
// Ejemplo:
// var providerFacebook = new firebase.auth.FacebookAuthProvider();
// providerFacebook.addScope('email');
// var providerGoogle = new firebase.auth.GoogleAuthProvider();
// -------------------------------------------------------------------


// -------------------------------------------------------------------
// 2. FUNCIONES DE INICIO DE SESIÓN CON POPUP (SOLUCIÓN MÓVIL)
// -------------------------------------------------------------------

function loginFacebook() {
    firebase.auth().signInWithPopup(providerFacebook)
        .then(function(result) {
            var token = result.credential.accessToken;
            var user = result.user;
            
            console.log("Inicio de sesión con Facebook exitoso:", user);
            window.location.href = "home.html"; 

        })
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error("Error al iniciar sesión con Facebook:", errorMessage);
            alert("Error al iniciar sesión con Facebook: " + errorMessage);
        });
}

function loginGoogle() {
    firebase.auth().signInWithPopup(providerGoogle)
        .then(function(result) {
            var token = result.credential.accessToken;
            var user = result.user;
            
            console.log("Inicio de sesión con Google exitoso:", user);
            window.location.href = "home.html"; 
        })
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error("Error al iniciar sesión con Google:", errorMessage);
            alert("Error al iniciar sesión con Google: " + errorMessage);
        });
}

// ... (Añade aquí tus otras funciones de login: loginTwitter, loginGithub, etc.) ...


// -------------------------------------------------------------------
// 3. VERIFICACIÓN DE ESTADO DE AUTENTICACIÓN
// -------------------------------------------------------------------

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // El usuario está conectado.
    } else {
        // El usuario no está conectado.
    }
});


// -------------------------------------------------------------------
// 4. VINCULACIÓN DE BOTONES (SOLUCIÓN BOTONES MÓVILES)
// -------------------------------------------------------------------

// Esta sección asegura que los botones llamen a las funciones de login.
document.addEventListener('DOMContentLoaded', function() {
    const btnGoogle = document.getElementById('btn-google');
    const btnFacebook = document.getElementById('btn-facebook');

    if (btnGoogle) {
        btnGoogle.addEventListener('click', loginGoogle);
    }

    if (btnFacebook) {
        btnFacebook.addEventListener('click', loginFacebook);
    }
});
