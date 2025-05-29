// about.js - Funcionalidad para la página Sobre Nosotros

// Datos de ejemplo para el equipo (11 miembros)
const TEAM = [
  {
    nombre: 'Juan Pérez',
    foto: '../../public/assets/images/team/juan.jpg',
    rol: 'Desarrollo',
    desc: 'Apasionado por la tecnología y el impacto social. Encargado del backend y la integración con Firebase.'
  },
  {
    nombre: 'María Gómez',
    foto: '../../public/assets/images/team/maria.jpg',
    rol: 'Diseño UX/UI',
    desc: 'Diseñadora creativa, responsable de la experiencia visual y la identidad de AidSync.'
  },
  {
    nombre: 'Carlos Ruiz',
    foto: '../../public/assets/images/team/carlos.jpg',
    rol: 'Contenido',
    desc: 'Redactor y comunicador. Se encarga de los textos y la estrategia de comunicación.'
  },
  {
    nombre: 'Ana Torres',
    foto: '../../public/assets/images/team/ana.jpg',
    rol: 'Gestión de Proyectos',
    desc: 'Organiza y coordina al equipo para que todo funcione en tiempo y forma.'
  },
  {
    nombre: 'Luis Fernández',
    foto: '../../public/assets/images/team/luis.jpg',
    rol: 'Frontend',
    desc: 'Desarrollador frontend, enfocado en la experiencia de usuario y accesibilidad.'
  },
  {
    nombre: 'Sofía Martínez',
    foto: '../../public/assets/images/team/sofia.jpg',
    rol: 'Marketing',
    desc: 'Estratega digital, encargada de la difusión y redes sociales de AidSync.'
  },
  {
    nombre: 'Pedro Castillo',
    foto: '../../public/assets/images/team/pedro.jpg',
    rol: 'QA & Testing',
    desc: 'Responsable de la calidad y pruebas de la plataforma.'
  },
  {
    nombre: 'Lucía Herrera',
    foto: '../../public/assets/images/team/lucia.jpg',
    rol: 'Soporte Técnico',
    desc: 'Brinda soporte y ayuda a los usuarios y fundaciones.'
  },
  {
    nombre: 'Miguel Ríos',
    foto: '../../public/assets/images/team/miguel.jpg',
    rol: 'DevOps',
    desc: 'Gestiona la infraestructura y el despliegue seguro de la plataforma.'
  },
  {
    nombre: 'Valentina Díaz',
    foto: '../../public/assets/images/team/valentina.jpg',
    rol: 'Legal',
    desc: 'Asegura el cumplimiento legal y la protección de datos en AidSync.'
  },
  {
    nombre: 'Andrés López',
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
