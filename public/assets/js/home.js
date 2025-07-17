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
// Ampliar el objeto de traducciones para todos los textos de la página principal
const translations = {
  es: {
    contacto: 'Contacto',
    nombre: 'Nombre',
    correo: 'Correo electrónico',
    mensaje: 'Mensaje',
    enviar: 'Enviar',
    organizaciones: 'Organizaciones Apoyadas',
    voluntariado: 'Voluntariado',
    donar: 'Donar',
    mapa: 'Mapa',
    sobre: 'Sobre nosotros',
    blog: 'Blog',
    inicio: 'Inicio',
    bienvenido: 'Bienvenido',
    descripcion: 'AidSync conecta voluntarios con quienes más lo necesitan.',
    mantra: '“Tu tiempo, su esperanza, a un sync de distancia”.',
    areas: 'Áreas de Voluntariado',
    educacion: 'Educación',
    salud: 'Salud',
    ambiente: 'Medio Ambiente',
    social: 'Bienestar Social',
    masinfo: 'Más información',
    gracias: '¡Gracias por tu mensaje! Pronto nos pondremos en contacto.',
    whatwedo: '¿Qué hace AidSync?',
    whatwedodesc: 'Conectamos personas dispuestas a ayudar con quienes necesitan apoyo, facilitando el voluntariado y la donación de manera sencilla y segura.',
    volunteerareas: 'Áreas de Voluntariado',
    supportedorgs: 'Organizaciones Apoyadas',
    orgs: [
      { name: 'EcoVida', btn: 'Más información' },
      { name: 'Educa Futuro', btn: 'Más información' },
      { name: 'Salud Para Todos', btn: 'Más información' },
      { name: 'Red Solidaria', btn: 'Más información' }
    ]
  },
  en: {
    contacto: 'Contact',
    nombre: 'Name',
    correo: 'Email',
    mensaje: 'Message',
    enviar: 'Send',
    organizaciones: 'Supported Organizations',
    voluntariado: 'Volunteer',
    donar: 'Donate',
    mapa: 'Map',
    sobre: 'About us',
    blog: 'Blog',
    inicio: 'Home',
    bienvenido: 'Welcome',
    descripcion: 'AidSync connects volunteers with those who need it most.',
    mantra: '“Your time, their hope, one sync away”.',
    areas: 'Volunteer Areas',
    educacion: 'Education',
    salud: 'Health',
    ambiente: 'Environment',
    social: 'Social Welfare',
    masinfo: 'More information',
    gracias: 'Thank you for your message! We will contact you soon.',
    whatwedo: 'What does AidSync do?',
    whatwedodesc: 'We connect people willing to help with those in need, making volunteering and donating easy and safe.',
    volunteerareas: 'Volunteer Areas',
    supportedorgs: 'Supported Organizations',
    orgs: [
      { name: 'EcoVida', btn: 'More information' },
      { name: 'Educa Futuro', btn: 'More information' },
      { name: 'Salud Para Todos', btn: 'More information' },
      { name: 'Red Solidaria', btn: 'More information' }
    ]
  }
};

// Mejorar setLang para traducir todos los textos dinámicos
function setLang(lang) {
  localStorage.setItem('lang', lang);
  // Contact form
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.querySelector('h2').textContent = translations[lang].contacto;
    contactForm.querySelector('input[name="name"]').placeholder = translations[lang].nombre;
    contactForm.querySelector('input[name="email"]').placeholder = translations[lang].correo;
    contactForm.querySelector('textarea[name="message"]').placeholder = translations[lang].mensaje;
    contactForm.querySelector('button[type="submit"]').textContent = translations[lang].enviar;
  }
  // What we do
  const whatWeDo = document.querySelector('.what-we-do');
  if (whatWeDo) {
    whatWeDo.querySelector('h2').textContent = translations[lang].whatwedo;
    whatWeDo.querySelector('p').textContent = translations[lang].whatwedodesc;
  }
  // Volunteer areas
  const volunteerCat = document.querySelector('.volunteer-categories');
  if (volunteerCat) {
    volunteerCat.querySelector('h2').textContent = translations[lang].volunteerareas;
    const catBtns = volunteerCat.querySelectorAll('.category-btn');
    if (catBtns.length === 4) {
      catBtns[0].textContent = translations[lang].educacion;
      catBtns[1].textContent = translations[lang].salud;
      catBtns[2].textContent = translations[lang].ambiente;
      catBtns[3].textContent = translations[lang].social;
    }
  }
  // Supported orgs
  const orgSection = document.querySelector('.supported-orgs');
  if (orgSection) {
    orgSection.querySelector('h2').textContent = translations[lang].supportedorgs;
    const orgCards = orgSection.querySelectorAll('.org-card');
    translations[lang].orgs.forEach((org, i) => {
      if (orgCards[i]) {
        orgCards[i].querySelector('.org-name').textContent = org.name;
        orgCards[i].querySelector('.org-info-btn').textContent = org.btn;
      }
    });
  }
  // Hero section (Welcome)
  const heroCaptions = document.querySelectorAll('.carousel-caption h1');
  heroCaptions.forEach(h1 => h1.textContent = translations[lang].bienvenido);
  // Carrusel frases
  updateCarouselCaption();
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
  interval = setInterval(nextSlide, 7000); // 7 segundos
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
  updateCarouselCaption();
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

const carouselPhrases = {
  en: [
    "Empowering education for a brighter future.",
    "Health and hope for every community.",
    "Protecting our environment, together.",
    "Caring for the wellbeing of all generations."
  ],
  es: [
    "Impulsando la educación para un futuro brillante.",
    "Salud y esperanza para cada comunidad.",
    "Protegiendo nuestro ambiente, juntos.",
    "Cuidando el bienestar de todas las generaciones."
  ]
};

function updateCarouselCaption() {
  const lang = localStorage.getItem('lang') || 'en';
  const captions = document.querySelectorAll('.carousel-caption .carousel-phrase');
  captions.forEach((el, idx) => {
    el.textContent = carouselPhrases[lang][idx];
  });
}

// ---- Modo claro/oscuro y cambio de idioma (unificado y funcional) ----
document.addEventListener('DOMContentLoaded', () => {
  // --- Tema claro/oscuro ---
  const themeBtn = document.getElementById('theme-switch');
  const themeIcon = document.getElementById('theme-icon');
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    // Si tienes dos iconos diferentes, pon aquí la lógica:
    // themeIcon.src = theme === 'dark' ? 'public/assets/images/icons/Tema Claro Oscuro.png' : 'public/assets/images/icons/Tema Claro Oscuro.png';
  }
  function toggleTheme() {
    const current = localStorage.getItem('theme') || 'light';
    setTheme(current === 'light' ? 'dark' : 'light');
  }
  if (themeBtn) themeBtn.onclick = toggleTheme;
  setTheme(localStorage.getItem('theme') || 'light');

  // --- Cambio de idioma ---
  const langBtn = document.getElementById('lang-switch');
  let lang = localStorage.getItem('lang') || 'en';
  function setLangAll(langCode) {
    localStorage.setItem('lang', langCode);
    lang = langCode;
    // Traduce toda la página
    if (typeof setLang === 'function') setLang(lang);
    if (typeof updateCarouselCaption === 'function') updateCarouselCaption();
  }
  if (langBtn) langBtn.onclick = () => {
    lang = lang === 'es' ? 'en' : 'es';
    setLangAll(lang);
  };
  setLangAll(lang);
});
