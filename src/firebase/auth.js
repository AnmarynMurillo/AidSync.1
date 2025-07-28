// auth.js

import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  
  onAuthStateChanged, 
  signOut 
} from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";

// ————— Inicialización de Firebase Auth y Firestore —————
const auth     = getAuth();
const provider = new GoogleAuthProvider();
const db       = getFirestore();

// ————— Referencias al DOM (header) —————
const loginContainer   = document.getElementById('login-container');
const btnLogin         = document.getElementById('btn-login');
const profileContainer = document.getElementById('profile-container');
const profilePhoto     = document.getElementById('profile-photo');
const profileName      = document.getElementById('profile-name');
const btnLogout        = document.getElementById('btn-logout');

// ————— Función de inicio de sesión con Google —————
const signInWithGoogle = async () => {
  try {
    const { user } = await signInWithPopup(auth, provider);
    console.log("✅ Usuario autenticado:", user);

    // Guardar/actualizar datos del usuario en Firestore
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      displayName:    user.displayName,
      email:          user.email,
      photoURL:       user.photoURL,
      lastSignInTime: new Date(),
    }, { merge: true });
    console.log("✅ Datos guardados en Firestore para UID:", user.uid);

    // (Opcional) Redirigir tras login
    // window.location.href = '/dashboard.html';

  } catch (error) {
    // Manejo de errores de autenticación
    console.error("❌ Error en login:", error.code, error.message);
    // Aquí podrías mostrar una alerta al usuario, ej:
    // alert("Falló el inicio de sesión. Intenta de nuevo.");
  }
};

// ————— Observador de estado de autenticación —————
onAuthStateChanged(auth, user => {
  if (user) {
    // Si hay usuario → ocultar botón login y mostrar perfil
    loginContainer.style.display   = 'none';
    profileContainer.style.display = 'flex';
    profileName.textContent        = user.displayName || 'Usuario';
    profilePhoto.src               = user.photoURL || profilePhoto.src;
  } else {
    // Si NO hay usuario → mostrar botón login y ocultar perfil
    profileContainer.style.display = 'none';
    loginContainer.style.display   = 'block';
  }
});

// ————— Evento: click en “Iniciar sesión” —————
btnLogin?.addEventListener('click', signInWithGoogle);

// ————— Evento: click en “Cerrar sesión” —————
btnLogout?.addEventListener('click', async () => {
  try {
    await signOut(auth);
    console.log("🔒 Sesión cerrada correctamente");
    // Redirigir al index principal
    window.location.href = '/index.html';
  } catch (error) {
    console.error("❌ Error al cerrar sesión:", error);
  }
});