// header.js - Funcionalidad para el header de AidSync

// Script para abrir/cerrar el menú hamburguesa
// Selecciona el botón hamburguesa y el menú principal
const hamburger = document.getElementById('hamburger-menu');
const menu = document.getElementById('main-menu');

// Estado del menú (abierto/cerrado)
let menuOpen = false;

// Función para abrir/cerrar el menú
function toggleMenu() {
  menuOpen = !menuOpen;
  if (menuOpen) {
    menu.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Evita scroll en el fondo
  } else {
    menu.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// Evento click en el botón hamburguesa
hamburger.addEventListener('click', toggleMenu);

// Cierra el menú si se hace click fuera del menú (opcional)
document.addEventListener('click', function(event) {
  if (menuOpen && !menu.contains(event.target) && !hamburger.contains(event.target)) {
    toggleMenu();
  }
});

// Ajusta el menú al tamaño de la pantalla
window.addEventListener('resize', function() {
  if (window.innerWidth > 900) {
    menu.style.display = '';
    document.body.style.overflow = '';
    menuOpen = false;
  }
});

// --- Funcionalidad de sesión, traducción y logout ---
document.addEventListener('DOMContentLoaded', function() {
  // --- Manejo de sesión del usuario ---
  const profileLink = document.getElementById('profile-link');
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  const langBtn = document.getElementById('lang-btn');
  let lang = localStorage.getItem('lang') || 'en';
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Actualizar el header según el estado de sesión
  if (user) {
    // Usuario logueado
    if (profileLink) {
      profileLink.style.display = 'inline-flex';
      // Mostrar email del usuario
      profileLink.innerHTML = `
        <span class="user-name">${user.email || user.name}</span>
        <img src="/public/assets/images/icons/user.svg" alt="Profile" class="profile-icon">
      `;
    }
    if (loginBtn) loginBtn.style.display = 'none';
    if (registerBtn) registerBtn.style.display = 'none';
    // Crear botón de logout si no existe
    if (!document.getElementById('logout-btn')) {
      const logoutBtn = document.createElement('a');
      logoutBtn.href = '#';
      logoutBtn.className = 'btn logout';
      logoutBtn.id = 'logout-btn';
      logoutBtn.textContent = 'Cerrar sesión';
      logoutBtn.style.marginLeft = '10px';
      logoutBtn.onclick = function(e) {
        e.preventDefault();
        // Eliminar usuario del localStorage
        localStorage.removeItem('user');
        // Opcional: llamar al backend para cerrar sesión
        fetch('http://localhost:5000/logout', { method: 'POST', credentials: 'include' });
        // Recargar la página para actualizar el header
        window.location.reload();
      };
      document.querySelector('.header-right').appendChild(logoutBtn);
    }
  } else {
    // Usuario no logueado
    if (profileLink) profileLink.style.display = 'none';
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.remove();
    if (loginBtn) loginBtn.style.display = '';
    if (registerBtn) registerBtn.style.display = '';
  }

  // Event listener para el botón de perfil
  if (profileLink) {
    profileLink.addEventListener('click', (e) => {
      e.preventDefault();
      showLogoutPopup();
    });
  }

  // --- Traducción dinámica del header y menú ---
  const headerTranslations = {
    en: {
      home: 'Home', volunteer: 'Volunteer', donate: 'Donate', about: 'About us', contact: 'Contact', blog: 'Blog', calendar: 'Calendar', map: 'Map', login: 'Login', register: 'Register'
    },
    es: {
      home: 'Inicio', volunteer: 'Voluntariado', donate: 'Donaciones', about: 'Sobre nosotros', contact: 'Contacto', blog: 'Blog', calendar: 'Calendario', map: 'Mapa', login: 'Iniciar sesión', register: 'Registrarse'
    }
  };
  function translateHeader(lang) {
    const t = headerTranslations[lang] || headerTranslations.en;
    const mainMenu = document.querySelector('.main-menu');
    if (mainMenu) {
      const links = mainMenu.querySelectorAll('a');
      if (links.length >= 8) {
        links[0].textContent = t.home;
        links[1].textContent = t.volunteer;
        links[2].textContent = t.donate;
        links[3].textContent = t.about;
        links[4].textContent = t.contact;
        links[5].textContent = t.blog;
        links[6].textContent = t.calendar;
        links[7].textContent = t.map;
      }
    }
    const dropdown = document.getElementById('dropdown-menu');
    if (dropdown) {
      const dlinks = dropdown.querySelectorAll('a');
      if (dlinks.length >= 7) {
        dlinks[0].textContent = t.volunteer;
        dlinks[1].textContent = t.donate;
        dlinks[2].textContent = t.about;
        dlinks[3].textContent = t.contact;
        dlinks[4].textContent = t.blog;
        dlinks[5].textContent = t.calendar;
        dlinks[6].textContent = t.map;
      }
    }
    if (loginBtn) loginBtn.textContent = t.login;
    if (registerBtn) registerBtn.textContent = t.register;
  }

  // --- Función para mostrar popup de logout ---
  function showLogoutPopup() {
    const popup = document.createElement('div');
    popup.className = 'logout-popup';
    popup.innerHTML = `
      <div class="popup-content">
        <h3>¿Estás seguro de querer cerrar sesión?</h3>
        <div class="popup-buttons">
          <button id="confirm-logout">Sí, cerrar sesión</button>
          <button id="cancel-logout">Volver al inicio</button>
        </div>
      </div>
    `;
    document.body.appendChild(popup);

    // Event listeners para los botones
    popup.querySelector('#confirm-logout').addEventListener('click', async () => {
      try {
        const res = await fetch('/api/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (data.success) {
          // Eliminar información del usuario
          localStorage.removeItem('user');
          // Redirigir a index.html
          window.location.href = '/index.html';
        }
      } catch (err) {
        console.error('Error al cerrar sesión:', err);
      } finally {
        popup.remove();
      }
    });

    popup.querySelector('#cancel-logout').addEventListener('click', () => {
      popup.remove();
    });
  }

  // --- Idioma por defecto ---
  setLang(lang);
  translateHeader(lang);
  if (langBtn) {
    langBtn.onclick = () => {
      lang = lang === 'es' ? 'en' : 'es';
      setLang(lang);
      translateHeader(lang);
      // Cambia bandera
      const img = langBtn.querySelector('img');
      if (img) {
        img.src = lang === 'es' ? '/public/assets/images/icons/lang.svg' : '/public/assets/images/icons/lang-en.svg';
      }
    };
    // Cambia bandera al cargar
    const img = langBtn.querySelector('img');
    if (img) {
      img.src = lang === 'es' ? '/public/assets/images/icons/lang.svg' : '/public/assets/images/icons/lang-en.svg';
    }
  }

  function setLang(l) {
    localStorage.setItem('lang', l);
  }
});
// Fin del script para menú hamburguesa
