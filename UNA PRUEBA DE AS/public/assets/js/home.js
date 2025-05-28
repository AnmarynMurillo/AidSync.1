// AidSync - Funcionalidades JS globales
// 1. Modo claro/oscuro con CSS variables y localStorage
// 2. Carrusel automático y manual
// 3. Validación de formulario de contacto
// 4. (Preparado) Traducción EN/ES

// ---- Modo claro/oscuro ----
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  // Cambia el icono
  const icon = document.getElementById('theme-icon');
  if (icon) icon.className = theme === 'dark' ? 'icon-moon' : 'icon-moon';
}
function toggleTheme() {
  const current = localStorage.getItem('theme') || 'light';
  setTheme(current === 'light' ? 'dark' : 'light');
}
// Inicializa tema guardado
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
  // Botón de tema
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
  // Botón de idioma
  const langBtn = document.getElementById('lang-switch');
  let lang = localStorage.getItem('lang') || 'es';
  function setLang(langCode) {
    localStorage.setItem('lang', langCode);
    // Aquí puedes agregar lógica para cambiar textos si lo deseas
  }
  if (langBtn) {
    langBtn.onclick = () => {
      lang = lang === 'es' ? 'en' : 'es';
      setLang(lang);
    };
  }
});

// ---- Cambio de idioma EN/ES ----
const translations = {
  es: {
    contacto: 'Contacto', nombre: 'Nombre', correo: 'Correo electrónico', mensaje: 'Mensaje', enviar: 'Enviar', organizaciones: 'Organizaciones Apoyadas', voluntariado: 'Voluntariado', donar: 'Donar', mapa: 'Mapa', sobre: 'Sobre nosotros', blog: 'Blog', inicio: 'Inicio', bienvenido: 'Bienvenido', descripcion: 'AidSync conecta voluntarios con quienes más lo necesitan.', mantra: '“Tu tiempo, su esperanza, a un sync de distancia”.', areas: 'Áreas de Voluntariado', educacion: 'Educación', salud: 'Salud', ambiente: 'Medio Ambiente', social: 'Bienestar Social', masinfo: 'Más información', gracias: '¡Gracias por tu mensaje! Pronto nos pondremos en contacto.'
  },
  en: {
    contacto: 'Contact', nombre: 'Name', correo: 'Email', mensaje: 'Message', enviar: 'Send', organizaciones: 'Supported Organizations', voluntariado: 'Volunteer', donar: 'Donate', mapa: 'Map', sobre: 'About us', blog: 'Blog', inicio: 'Home', bienvenido: 'Welcome', descripcion: 'AidSync connects volunteers with those who need it most.', mantra: '“Your time, their hope, one sync away”.', areas: 'Volunteer Areas', educacion: 'Education', salud: 'Health', ambiente: 'Environment', social: 'Social Welfare', masinfo: 'More info', gracias: 'Thank you for your message! We will contact you soon.'
  }
};
function setLang(lang) {
  localStorage.setItem('lang', lang);
  // Header y menú traducidos por header.js
  // Traducción de secciones principales
  document.querySelector('.contact-form h2').textContent = translations[lang].contacto;
  document.querySelector('input[name="name"]').placeholder = translations[lang].nombre;
  document.querySelector('input[name="email"]').placeholder = translations[lang].correo;
  document.querySelector('textarea[name="message"]').placeholder = translations[lang].mensaje;
  document.querySelector('.contact-form button[type="submit"]').textContent = translations[lang].enviar;
  document.querySelector('.supported-orgs h2').textContent = translations[lang].organizaciones;
  document.querySelector('.what-we-do h2').textContent = lang === 'es' ? '¿Qué hace AidSync?' : 'What does AidSync do?';
  document.querySelector('.what-we-do p').textContent = lang === 'es' ? 'Conectamos personas dispuestas a ayudar con quienes necesitan apoyo, facilitando el voluntariado y la donación de manera sencilla y segura.' : 'We connect people willing to help with those in need, making volunteering and donating easy and safe.';
  document.querySelector('.volunteer-categories h2').textContent = translations[lang].areas;
  const catBtns = document.querySelectorAll('.category-btn');
  if (catBtns.length === 4) {
    catBtns[0].textContent = translations[lang].educacion;
    catBtns[1].textContent = translations[lang].salud;
    catBtns[2].textContent = translations[lang].ambiente;
    catBtns[3].textContent = translations[lang].social;
  }
  document.querySelector('.hero .carousel-caption h1').textContent = translations[lang].bienvenido;
  document.querySelector('.hero .carousel-caption p').textContent = translations[lang].descripcion;
  document.querySelector('.hero .carousel-caption .mantra').textContent = translations[lang].mantra;
}

// --- Idioma por defecto inglés ---
document.addEventListener('DOMContentLoaded', () => {
  let lang = localStorage.getItem('lang') || 'en';
  setLang(lang);
  const langBtn = document.getElementById('lang-switch');
  if (langBtn) {
    langBtn.querySelector('img').src = lang === 'es' ? 'public/assets/images/icons/lang.svg' : 'public/assets/images/icons/lang-en.svg';
    langBtn.onclick = () => {
      lang = lang === 'es' ? 'en' : 'es';
      setLang(lang);
      langBtn.querySelector('img').src = lang === 'es' ? 'public/assets/images/icons/lang.svg' : 'public/assets/images/icons/lang-en.svg';
    };
  }
});

// ---- Carrusel automático y manual ----
let slides, prevBtn, nextBtn, currentSlide = 0, interval;
function showSlide(idx) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === idx);
  });
}
function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}
function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}
function startCarousel() {
  interval = setInterval(nextSlide, 4000);
}
function stopCarousel() {
  clearInterval(interval);
}
document.addEventListener('DOMContentLoaded', () => {
  slides = document.querySelectorAll('.carousel-slide');
  prevBtn = document.querySelector('.carousel-btn.prev');
  nextBtn = document.querySelector('.carousel-btn.next');
  if (slides.length) {
    showSlide(currentSlide);
    nextBtn.addEventListener('click', () => { stopCarousel(); nextSlide(); startCarousel(); });
    prevBtn.addEventListener('click', () => { stopCarousel(); prevSlide(); startCarousel(); });
    startCarousel();
  }
});

// ---- Formulario de contacto ----
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      // Validación básica
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      if (!name || !email || !message) {
        alert('Por favor, completa todos los campos.');
        return;
      }
      alert('¡Gracias por tu mensaje! Pronto nos pondremos en contacto.');
      form.reset();
    });
  }
});

// ---- (Preparado) Traducción EN/ES ----
// Aquí se puede cargar un archivo JSON de traducciones y cambiar el texto dinámicamente según el idioma seleccionado.

// Menú hamburguesa responsive y accesible
function setupHamburgerMenu() {
  const hamburger = document.getElementById('hamburger-menu');
  const dropdown = document.getElementById('dropdown-menu');
  if (hamburger && dropdown) {
    hamburger.onclick = (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('show');
    };
    // Cierra el menú al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && !hamburger.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
    // Accesibilidad: cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') dropdown.classList.remove('show');
    });
  }
}
document.addEventListener('DOMContentLoaded', setupHamburgerMenu);
