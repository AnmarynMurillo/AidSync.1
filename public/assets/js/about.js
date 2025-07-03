// about.js - Funcionalidad para la página Sobre Nosotros

// Datos de ejemplo para el equipo (11 miembros)
const TEAM = [
  {
    nombre: 'Juan Morales',
    foto: '../../public/assets/images/team/Juan.Morales.jpg',
    rol: 'Desarrollo',
    desc: 'Apasionado por la tecnología y el impacto social. Encargado del backend y la integración con Firebase.'
  },
  {
    nombre: 'Isaura Ríos',
    foto: '../../public/assets/images/team/maria.jpg',
    rol: 'Diseño UX/UI',
    desc: 'Diseñadora creativa, responsable de la experiencia visual y la identidad de AidSync.'
  },
  {
    nombre: 'Luis Camargo',
    foto: '../../public/assets/images/team/carlos.jpg',
    rol: 'Contenido',
    desc: 'Redactor y comunicador. Se encarga de los textos y la estrategia de comunicación.'
  },
  {
    nombre: 'Gilberto Rodriguez',
    foto: '../../public/assets/images/team/ana.jpg',
    rol: 'Gestión de Proyectos',
    desc: 'Organiza y coordina al equipo para que todo funcione en tiempo y forma.'
  },
  {
    nombre: 'Patricia Fernández',
    foto: '../../public/assets/images/team/luis.jpg',
    rol: 'Frontend',
    desc: 'Desarrollador frontend, enfocado en la experiencia de usuario y accesibilidad.'
  },
  {
    nombre: 'Emily Bulgin',
    foto: '../../public/assets/images/team/sofia.jpg',
    rol: 'Marketing',
    desc: 'Estratega digital, encargada de la difusión y redes sociales de AidSync.'
  },
  {
    nombre: 'Duska Jimenez',
    foto: '../../public/assets/images/team/pedro.jpg',
    rol: 'QA & Testing',
    desc: 'Responsable de la calidad y pruebas de la plataforma.'
  },
  {
    nombre: 'Anmaryn Murillo',
    foto: '../../public/assets/images/team/lucia.jpg',
    rol: 'Soporte Técnico',
    desc: 'Brinda soporte y ayuda a los usuarios y fundaciones.'
  },
  {
    nombre: 'Stephanie Dominguez',
    foto: '../../public/assets/images/team/miguel.jpg',
    rol: 'DevOps',
    desc: 'Gestiona la infraestructura y el despliegue seguro de la plataforma.'
  },
  {
    nombre: 'Elina Pérez',
    foto: '../../public/assets/images/team/valentina.jpg',
    rol: 'Legal',
    desc: 'Asegura el cumplimiento legal y la protección de datos en AidSync.'
  },
  {
    nombre: 'Jhostan Jimenez',
    foto: '../../public/assets/images/team/andres.jpg',
    rol: 'Voluntariado',
    desc: 'Enlace directo con fundaciones y voluntarios, promueve la participación activa.'
  }
];

const CAROUSEL_IMAGES = [
  '../../public/assets/images/team/momento1.jpg',
  '../../public/assets/images/team/momento2.jpg',
  '../../public/assets/images/team/momento3.jpg',
  '../../public/assets/images/team/momento4.jpg'
];

// Renderiza las tarjetas del equipo
document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.getElementById('team-gallery');
  if (gallery) {
    gallery.innerHTML = TEAM.map(m => `
      <div class="team-card">
        <img src="${m.foto}" alt="${m.nombre}" class="team-photo">
        <div class="team-name">${m.nombre}</div>
        <div class="team-role">${m.rol}</div>
        <div class="team-desc">${m.desc}</div>
      </div>
    `).join('');
  }
  renderCarousel();
});

// Carrusel de fotos
defaultCarouselIndex = 0;
let carouselIndex = 0;
let carouselInterval = null;

function renderCarousel() {
  const track = document.getElementById('carousel-track');
  if (!track) return;
  track.innerHTML = CAROUSEL_IMAGES.map(src => `<img src="${src}" class="carousel-img" draggable="false">`).join('');
  carouselIndex = 0;
  updateCarousel();
  startCarouselAuto();
  document.getElementById('carousel-prev').onclick = prevCarousel;
  document.getElementById('carousel-next').onclick = nextCarousel;
}

function updateCarousel() {
  const track = document.getElementById('carousel-track');
  if (!track) return;
  track.style.transform = `translateX(-${carouselIndex * 100}%)`;
}

function prevCarousel() {
  carouselIndex = (carouselIndex - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length;
  updateCarousel();
  restartCarouselAuto();
}

function nextCarousel() {
  carouselIndex = (carouselIndex + 1) % CAROUSEL_IMAGES.length;
  updateCarousel();
  restartCarouselAuto();
}

function startCarouselAuto() {
  if (carouselInterval) clearInterval(carouselInterval);
  carouselInterval = setInterval(() => {
    nextCarousel();
  }, 4500);
}
function restartCarouselAuto() {
  startCarouselAuto();
}

// Animaciones suaves al hacer scroll (valores, misión, visión)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.2 });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.mission, .vision, .value-card').forEach(el => {
    observer.observe(el);
  });
});
// about.js - Funcionalidad para la página Sobre Nosotros

// Datos de ejemplo para el equipo (11 miembros)
const Team = [
  {
    nombre: 'Juan Morales',
    foto: '/public/assets/images/integrantes/Juan.Morales.png',
    rol: 'Desarrollo',
    desc: 'Apasionado por la tecnología y el impacto social. Encargado del backend y la integración con Firebase.'
  },
  {
    nombre: 'Isaura Ríos',
    foto: '/public/assets/images/integrantes/Isaura.Rios.png',
    rol: 'Diseño UX/UI',
    desc: 'Diseñadora creativa, responsable de la experiencia visual y la identidad de AidSync.'
  },
  {
    nombre: 'Patricia Fernández',
    foto: '/public/assets/images/integrantes/Patricia.Fernandez.png',
    rol: 'Contenido',
    desc: 'Redactor y comunicador. Se encarga de los textos y la estrategia de comunicación.'
  },
  {
    nombre: 'Anmaryn Murrillo',
    foto: '/public/assets/images/integrantes/Anmaryn.Murrillo.png',
    rol: 'Gestión de Proyectos',
    desc: 'Organiza y coordina al equipo para que todo funcione en tiempo y forma.'
  },
  {
    nombre: 'Jhostan Jiminez',
    foto: '../../public/assets/images/team/luis.jpg',
    rol: 'Frontend',
    desc: 'Desarrollador frontend, enfocado en la experiencia de usuario y accesibilidad.'
  },
  {
    nombre: 'Dushka Jimenez',
    foto: '/public/assets/images/integrantes/Dushka.Jimenez.png',
    rol: 'Marketing',
    desc: 'Estratega digital, encargada de la difusión y redes sociales de AidSync.'
  },
  {
    nombre: 'Emily Bulgin',
    foto: '/public/assets/images/integrantes/Emily.Bulgin.png',
    rol: 'QA & Testing',
    desc: 'Responsable de la calidad y pruebas de la plataforma.'
  },
  {
    nombre: 'Luis Camargo',
    foto: '/public/assets/images/integrantes/Luis.Camargo.png',
    rol: 'Soporte Técnico',
    desc: 'B.'
  },
  {
    nombre: 'Gilberto Rodriguez',
    foto: '/public/assets/images/integrantes/Gilberto.Rodriguez.png',
    rol: 'DevOps',
    desc: 'Gestiona la infraestructura y el despliegue seguro de la plataforma.'
  },
  {
    nombre: 'Stephany Dominguez',
    foto: '/public/assets/images/integrantes/Stephany.Dominguez.png',
    rol: '',
    desc: 'Asegura el cumplimiento legal y la protección de datos en AidSync.'
  },
  {
    nombre: 'Elina Pérez',
    foto: '/public/assets/images/integrantes/Elina.Perez.png',
    rol: 'JS Developer',
    desc: 'Funcialidad'
  }
];

const Carousel_Images = [
  '../../public/assets/images/team/momento1.jpg',
  '../../public/assets/images/team/momento2.jpg',
  '../../public/assets/images/team/momento3.jpg',
  '../../public/assets/images/team/momento4.jpg'
];

// Renderiza las tarjetas del equipo
document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.getElementById('team-gallery');
  if (gallery) {
    gallery.innerHTML = TEAM.map(m => `
      <div class="team-card">
        <img src="${m.foto}" alt="${m.nombre}" class="team-photo">
        <div class="team-name">${m.nombre}</div>
        <div class="team-role">${m.rol}</div>
        <div class="team-desc">${m.desc}</div>
      </div>
    `).join('');
  }
  renderCarousel();
});

// Carrusel de fotos
defaultCarouselIndex = 0;
let carouselIndex = 0;
let carouselInterval = null;

function renderCarousel() {
  const track = document.getElementById('carousel-track');
  if (!track) return;
  track.innerHTML = CAROUSEL_IMAGES.map(src => `<img src="${src}" class="carousel-img" draggable="false">`).join('');
  carouselIndex = 0;
  updateCarousel();
  startCarouselAuto();
  document.getElementById('carousel-prev').onclick = prevCarousel;
  document.getElementById('carousel-next').onclick = nextCarousel;
}

function updateCarousel() {
  const track = document.getElementById('carousel-track');
  if (!track) return;
  track.style.transform = `translateX(-${carouselIndex * 100}%)`;
}

function prevCarousel() {
  carouselIndex = (carouselIndex - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length;
  updateCarousel();
  restartCarouselAuto();
}

function nextCarousel() {
  carouselIndex = (carouselIndex + 1) % CAROUSEL_IMAGES.length;
  updateCarousel();
  restartCarouselAuto();
}

function startCarouselAuto() {
  if (carouselInterval) clearInterval(carouselInterval);
  carouselInterval = setInterval(() => {
    nextCarousel();
  }, 4500);
}
function restartCarouselAuto() {
  startCarouselAuto();
}

// Animaciones suaves al hacer scroll (valores, misión, visión)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.2 });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.mission, .vision, .value-card').forEach(el => {
    observer.observe(el);
  });
});
