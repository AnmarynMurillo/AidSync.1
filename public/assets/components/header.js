// header.js - Funcionalidad para el header de AidSync

document.addEventListener('DOMContentLoaded', () => {
  // Menú hamburguesa
  const hamburger = document.getElementById('hamburger-menu');
  const dropdown = document.getElementById('dropdown-menu');
  if (hamburger && dropdown) {
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.classList.toggle('show');
    });
    document.addEventListener('click', function(e) {
      if (!dropdown.contains(e.target) && !hamburger.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') dropdown.classList.remove('show');
    });
  }

  // Botón de tema (luna/sol)
  const btn = document.getElementById('theme-switch');
  const themeIcon = document.getElementById('theme-icon');
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeIcon) themeIcon.src = theme === 'dark' ? 'public/assets/images/icons/sun.svg' : 'public/assets/images/icons/moon.svg';
  }
  function toggleTheme() {
    const current = localStorage.getItem('theme') || 'light';
    setTheme(current === 'light' ? 'dark' : 'light');
  }
  if (btn) btn.onclick = toggleTheme;
  // Inicializa tema guardado
  const saved = localStorage.getItem('theme') || 'light';
  setTheme(saved);

  // --- Manejo de sesión del usuario ---
  const profileLink = document.getElementById('profile-link');
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
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
      links[0].textContent = t.home;
      links[1].textContent = t.volunteer;
      links[2].textContent = t.donate;
      links[3].textContent = t.about;
      links[4].textContent = t.contact;
      links[5].textContent = t.blog;
      links[6].textContent = t.calendar;
      links[7].textContent = t.map;
    }
    const dropdown = document.getElementById('dropdown-menu');
    if (dropdown) {
      const dlinks = dropdown.querySelectorAll('a');
      dlinks[0].textContent = t.volunteer;
      dlinks[1].textContent = t.donate;
      dlinks[2].textContent = t.about;
      dlinks[3].textContent = t.contact;
      dlinks[4].textContent = t.blog;
      dlinks[5].textContent = t.calendar;
      dlinks[6].textContent = t.map;
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

  // --- Idioma por defecto inglés ---
  lang = localStorage.getItem('lang') || 'en';
  setLang(lang);
  translateHeader(lang);
  if (langBtn) {
    langBtn.onclick = () => {
      lang = lang === 'es' ? 'en' : 'es';
      setLang(lang);
      translateHeader(lang);
    };
    // Cambia bandera
    langBtn.querySelector('img').src = lang === 'es' ? '/public/assets/images/icons/lang.svg' : '/public/assets/images/icons/lang-en.svg';
  }
});
