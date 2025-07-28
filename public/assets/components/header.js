// header.js - Funcionalidad completa para el header de AidSync

// ================================
// 1. IMPORTACIÓN DE MÓDULOS DE FIREBASE
// ================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.x/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.x/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/9.x/firebase-firestore.js";

// ================================
// 2. INICIALIZACIÓN DE FIREBASE
// ================================
// Configuración de tu proyecto Firebase (reemplaza con tu propia config)
const firebaseConfig = {
  apiKey: "AIzaSyAJ395j9EL5Nv81Q70Csc4zRKNp5e1Xrjo",
  authDomain: "expo-project-1040e.firebaseapp.com",
  databaseURL: "https://expo-project-1040e-default-rtdb.firebaseio.com",
  projectId: "expo-project-1040e",
  storageBucket: "expo-project-1040e.firebasestorage.app",
  messagingSenderId: "813329495011",
  appId: "1:813329495011:web:931d42531c471fe3e2e6d6",
  measurementId: "G-QY0VQSB12F"
};

// Inicializa la app de Firebase
initializeApp(firebaseConfig);

// Crea instancias de Auth y Firestore
const auth     = getAuth();
const provider = new GoogleAuthProvider();
const db       = getFirestore();

// ================================
// 3. REFERENCIAS AL DOM
// ================================
// Elementos del menú hamburguesa
const hamburger       = document.getElementById('hamburger');
const menu            = document.getElementById('main-menu');
const header          = document.querySelector('.main-header');
const backdrop        = document.getElementById('menu-backdrop');

// Elementos de autenticación en el header
const loginBtn        = document.getElementById('login-btn');        // Botón "Login"
const registerBtn     = document.getElementById('register-btn');     // Botón "Register"
const profileContainer= document.getElementById('profile-container'); // Contenedor de perfil + logout
const profileLink     = document.getElementById('profile-link');     // Link al perfil de usuario
const profilePhoto    = document.getElementById('profile-photo');    // Imagen de perfil
const profileName     = document.getElementById('profile-name');     // Nombre a mostrar
const logoutBtn       = document.getElementById('logout-btn');       // Botón "Cerrar sesión"
const langBtn         = document.getElementById('lang-switch');      // Botón de cambio de idioma

// Estado actual del menú hamburguesa
let menuOpen = false;

// ================================
// 4. FUNCIÓN PARA ALTERNAR MENÚ
// ================================
/**
 * toggleMenu(forceState?)
 * @param {boolean} forceState - Estado a forzar (true=abrir, false=cerrar)
 */
function toggleMenu(forceState) {
  // Si recibimos booleano, lo usamos, si no invertimos
  menuOpen = typeof forceState === 'boolean' ? forceState : !menuOpen;

  if (menuOpen) {
    menu.classList.add('show');           // Muestra menú
    hamburger.classList.add('open');      // Animación icono
    backdrop?.classList.remove('hide');   // Muestra backdrop
    document.body.style.overflow = 'hidden'; // Bloquea scroll fondo
  } else {
    menu.classList.remove('show');
    hamburger.classList.remove('open');
    backdrop?.classList.add('hide');
    document.body.style.overflow = '';     // Restablece scroll
  }
}

// ================================
// 5. EVENTOS MENÚ HAMBURGUESA
// ================================
hamburger?.addEventListener('click', e => { e.stopPropagation(); toggleMenu(); });
hamburger?.addEventListener('mouseenter', () => !menuOpen && toggleMenu(true));
menu?.addEventListener('mouseleave', () => menuOpen && toggleMenu(false));
hamburger?.addEventListener('mouseleave', () => {
  setTimeout(() => {
    if (!menu.matches(':hover') && menuOpen) toggleMenu(false);
  }, 120);
});
backdrop?.addEventListener('click', () => menuOpen && toggleMenu(false));
window.addEventListener('click', e => {
  if (menuOpen && !menu.contains(e.target) && !hamburger.contains(e.target)) toggleMenu(false);
});
window.addEventListener('resize', () => menuOpen && toggleMenu(false));

// ================================
// 6. STICKY HEADER AL SCROLL
// ================================
window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 10);
});

// ================================
// 7. AUTENTICACIÓN: INICIO DE SESIÓN
// ================================
/**
 * signInWithGoogle()
 * Inicia sesión con Google en un popup y guarda datos en Firestore
 */
const signInWithGoogle = async () => {
  try {
    const { user } = await signInWithPopup(auth, provider);
    console.log('✅ Usuario autenticado:', user.uid);

    // Referencia al documento del usuario
    const userRef = doc(db, 'users', user.uid);
    // Guarda/actualiza datos básicos
    await setDoc(userRef, {
      displayName:    user.displayName,
      email:          user.email,
      photoURL:       user.photoURL,
      lastSignInTime: new Date()
    }, { merge: true });
    console.log('✅ Datos guardados para:', user.uid);

  } catch (err) {
    console.error('❌ Error login:', err.code, err.message);
    alert('Error al iniciar sesión. Por favor intenta nuevamente.');
  }
};

// ================================
// 8. OBSERVADOR DE ESTADO DE SESIÓN
// ================================
/**
 * onAuthStateChanged - Ajusta UI según estado de sesión
 */
onAuthStateChanged(auth, user => {
  if (user) {
    // Usuario conectado
    loginBtn.style.display         = 'none';
    registerBtn.style.display      = 'none';
    profileContainer.style.display = 'inline-flex';
    profileName.textContent        = user.displayName || 'Usuario';
    profilePhoto.src               = user.photoURL    || profilePhoto.src;
  } else {
    // Usuario desconectado
    profileContainer.style.display = 'none';
    loginBtn.style.display         = '';
    registerBtn.style.display      = '';
  }
});

// ================================
// 9. EVENTOS LOGIN / LOGOUT
// ================================
loginBtn?.addEventListener('click', e => { e.preventDefault(); signInWithGoogle(); });
logoutBtn?.addEventListener('click', async e => {
  e.preventDefault();
  try {
    await signOut(auth);
    console.log('🔒 Sesión cerrada');
    window.location.href = '/index.html';
  } catch (err) {
    console.error('❌ Error logout:', err);
  }
});

// ================================
// 10. TRADUCCIÓN DINÁMICA
// ================================
const headerTranslations = {
  en: { home: 'Home', volunteer: 'Volunteer', donate: 'Donate', about: 'About us', contact: 'Contact', blog: 'Blog', calendar: 'Calendar', map: 'Map', login: 'Login', register: 'Register' },
  es: { home: 'Inicio', volunteer: 'Voluntariado', donate: 'Donaciones', about: 'Sobre nosotros', contact: 'Contacto', blog: 'Blog', calendar: 'Calendario', map: 'Mapa', login: 'Iniciar sesión', register: 'Registrarse' }
};
let lang = localStorage.getItem('lang') || 'en';

/**
 * translateHeader(l)
 * Cambia textos del header según idioma (desktop + móvil)
 */
function translateHeader(l) {
  const t = headerTranslations[l] || headerTranslations.en;
  document.querySelectorAll('.desktop-nav a').forEach((link, i) => link.textContent = Object.values(t)[i]);
  document.querySelectorAll('#main-menu a').forEach((link, i) => link.textContent = Object.values(t)[i]);
  loginBtn.textContent    = t.login;
  registerBtn.textContent = t.register;
}

// Event listener para cambiar idioma y guardar en localStorage
langBtn?.addEventListener('click', () => {
  lang = lang === 'es' ? 'en' : 'es';
  localStorage.setItem('lang', lang);
  translateHeader(lang);
  const img = langBtn.querySelector('img');
  if (img) img.src = lang === 'es' ? '/public/assets/images/icons/lang.svg' : '/public/assets/images/icons/lang-en.svg';
});

// Traduce header en carga inicial
translateHeader(lang);

// ================================
// FIN de header.js
// ================================
