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
  const langSwitch = document.getElementById('lang-switch');
  let lang = localStorage.getItem('lang') || 'en';
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Actualizar el header según el estado de sesión
  if (user && Object.keys(user).length > 0) {
    // Usuario logueado
    if (profileLink) {
      profileLink.style.display = 'inline-flex';
      // Mostrar email del usuario
      profileLink.innerHTML = `
        <span class="user-name">${user.email || user.name || 'Usuario'}</span>
        <img src="/public/assets/images/photos/idioma.png" alt="Profile" class="profile-icon">
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
        fetch('http://localhost:5000/logout', { method: 'POST', credentials: 'include' }).catch(err => {
          console.log('Error al cerrar sesión en backend:', err);
        });
        // Recargar la página para actualizar el header
        window.location.reload();
      };
      const headerActions = document.querySelector('.header-actions');
      if (headerActions) headerActions.appendChild(logoutBtn);
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
    
    // Traducir botones de login y register
    if (loginBtn) loginBtn.textContent = t.login;
    if (registerBtn) registerBtn.textContent = t.register;
  }

  // --- Función para mostrar popup de logout ---
  function showLogoutPopup() {
    const popup = document.createElement('div');
    popup.className = 'logout-popup';
    popup.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;
    popup.innerHTML = `
      <div class="popup-content" style="
        background: white;
        padding: 2rem;
        border-radius: 10px;
        text-align: center;
        max-width: 400px;
      ">
        <h3>¿Estás seguro de querer cerrar sesión?</h3>
        <div class="popup-buttons" style="margin-top: 1rem;">
          <button id="confirm-logout" style="
            background: #dc3545;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            margin: 0 0.5rem;
            border-radius: 5px;
            cursor: pointer;
          ">Sí, cerrar sesión</button>
          <button id="cancel-logout" style="
            background: #6c757d;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            margin: 0 0.5rem;
            border-radius: 5px;
            cursor: pointer;
          ">Cancelar</button>
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
        // Aún así eliminar del localStorage
        localStorage.removeItem('user');
        window.location.href = '/index.html';
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
  
  if (langSwitch) {
    langSwitch.onclick = () => {
      lang = lang === 'es' ? 'en' : 'es';
      setLang(lang);
      translateHeader(lang);
      // Cambia bandera
      const img = langSwitch.querySelector('img');
      if (img) {
        img.src = lang === 'es' ? '/public/assets/images/photos/idioma.png' : '/public/assets/images/photos/idioma.png';
      }
    };
  }

  function setLang(l) {
    localStorage.setItem('lang', l);
  }
});

// Fin del script para menú hamburguesa
