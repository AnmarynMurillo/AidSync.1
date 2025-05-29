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

  // --- Mostrar icono de perfil si logueado ---
  const profileLink = document.getElementById('profile-link');
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  if (localStorage.getItem('userLoggedIn') === 'true') {
    if (profileLink) profileLink.style.display = 'inline-flex';
    if (loginBtn) loginBtn.style.display = 'none';
    if (registerBtn) registerBtn.style.display = 'none';
  } else {
    if (profileLink) profileLink.style.display = 'none';
    if (loginBtn) loginBtn.style.display = '';
    if (registerBtn) registerBtn.style.display = '';
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
