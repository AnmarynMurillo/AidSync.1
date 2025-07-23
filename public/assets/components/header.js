// header.js - Funcionalidad para el header de AidSync

// Script para abrir/cerrar el menú hamburguesa
// Selecciona el botón hamburguesa y el menú principal
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('main-menu');
const header = document.querySelector('.main-header');
const backdrop = document.getElementById('menu-backdrop');

// Estado del menú (abierto/cerrado)
let menuOpen = false;

function toggleMenu(forceState) {
  if (typeof forceState === 'boolean') menuOpen = forceState;
  else menuOpen = !menuOpen;
  if (menuOpen) {
    menu.classList.add('show');
    hamburger.classList.add('open');
    if (backdrop) backdrop.classList.remove('hide');
    document.body.style.overflow = 'hidden';
  } else {
    menu.classList.remove('show');
    hamburger.classList.remove('open');
    if (backdrop) backdrop.classList.add('hide');
    document.body.style.overflow = '';
  }
}

if (hamburger) {
  hamburger.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleMenu();
  });
  hamburger.addEventListener('mouseenter', function(e) {
    if (!menuOpen) toggleMenu(true);
  });
}
if (menu && hamburger) {
  menu.addEventListener('mouseleave', function(e) {
    if (menuOpen) toggleMenu(false);
  });
  hamburger.addEventListener('mouseleave', function(e) {
    setTimeout(function() {
      if (!menu.matches(':hover')) {
        if (menuOpen) toggleMenu(false);
      }
    }, 120);
  });
}
if (backdrop) {
  backdrop.addEventListener('click', function() {
    if (menuOpen) toggleMenu(false);
  });
}
window.addEventListener('click', function(event) {
  if (menuOpen && !menu.contains(event.target) && !hamburger.contains(event.target)) {
    toggleMenu(false);
  }
});
window.addEventListener('resize', function() {
  if (menuOpen) {
    toggleMenu(false);
  }
});
// Header sticky con transición de color al hacer scroll
window.addEventListener('scroll', function() {
  if (header) {
    if (window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
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
  if (Object.keys(user).length > 0) {
    // Usuario logueado
    if (profileLink) {
      profileLink.style.display = 'inline-flex';
      // Mostrar nombre del usuario en lugar del icono
      profileLink.innerHTML = `
        <span class="user-name">${user.name || user.email}</span>
        <img src="/public/assets/images/icons/user.svg" alt="Profile" class="profile-icon">
      `;
    }
    if (loginBtn) loginBtn.style.display = 'none';
    if (registerBtn) registerBtn.style.display = 'none';
  } else {
    // Usuario no logueado
    if (profileLink) profileLink.style.display = 'none';
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
