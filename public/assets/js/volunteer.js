// volunteer.js: Lógica para galería de voluntariados y modal

// Datos de ejemplo (puedes reemplazar por fetch a backend/Firebase)
const VOLUNTEERS = [
  {
    id: 1,
    nombre: 'Casa Esperanza/ tutoring',
    categoria: 'Education',
    color: '#2563eb',
    colorHover: '#1d4ed8',
    img: '/public/assets/images/photos/tutorias.png',
    desc: 'Help children and young people improve their academic performance.',
    descLarga: 'Be part of our team of volunteers for the Casa Esperanza Summer School and together we help strengthen the learning of the children and adolescents in our programs.',
    ubicacion: 'C. la Esperanza 70, Aguadulce, Provincia de Coclé',
    mapa: '<iframe src="https://www.openstreetmap.org/?mlat=8.232854&mlon=-80.536808#map=17/8.232850/-80.536810" style="width:100%;height:180px;border:0;"></iframe>',
    requisitos: ['Over 16 years old',
    ' Knowledge in the subjects of: Spanish, mathematics, English, physics, chemistry and accounting.',
    ' Be responsible. committed and punctual.','- Reside in the provinces of Panama, Coclé, Colón, Herrera and Chiriquí.',
    'Have good management of a group of children from 6 to 11 years old and adolescents from 12 to 17 years old.'],
  },
  {
    id: 2,
    nombre: 'Brigada Médica',
    categoria: 'salud',
    color: '#dc2626',
    colorHover: '#b91c1c',
    img: '/public/assets/images/photos/BRIGADA-MEDICA.jpg',
    desc: 'Participa en jornadas de salud y prevención en comunidades vulnerables.',
    descLarga: 'Únete a la Brigada Médica y contribuye a mejorar la salud de comunidades con atención básica, talleres y campañas de prevención.',
    ubicacion: 'Guadalajara, Jalisco',
    mapa: '<iframe src="https://www.openstreetmap.org/export/embed.html?bbox=-103.3496%2C20.6597%2C-103.3496%2C20.6597&amp;layer=mapnik" style="width:100%;height:180px;border:0;"></iframe>',
    requisitos: ['Mayoría de edad', 'Experiencia en salud (deseable)', 'Actitud de servicio']
  },
  {
    id: 3,
    nombre: 'Reforestación Urbana',
    categoria: 'ambiente',
    color: '#16a34a',
    colorHover: '#15803d',
    img:'/public/assets/images/photos/refores.png',
    desc: 'Colabora en la plantación y cuidado de árboles en zonas urbanas.',
    descLarga: 'Participa en actividades de reforestación, talleres ambientales y campañas de concientización para mejorar el entorno urbano.',
    ubicacion: 'Monterrey, Nuevo León',
    mapa: '<iframe src="https://www.openstreetmap.org/export/embed.html?bbox=-100.3161%2C25.6866%2C-100.3161%2C25.6866&amp;layer=mapnik" style="width:100%;height:180px;border:0;"></iframe>',
    requisitos: ['Ser mayor de 15 años', 'Gusto por la naturaleza', 'Disponibilidad fines de semana']
  },
  {
    id: 4,
    nombre: 'Comedor Comunitario',
    categoria: 'bienestar',
    color: '#eab308',
    colorHover: '#ca8a04',
    img:  '/public/assets/images/photos/comedor.jpg',
    desc: 'Apoya en la preparación y entrega de alimentos a personas en situación vulnerable.',
    descLarga: 'Como voluntario en el Comedor Comunitario, ayudarás a preparar, servir y entregar alimentos, generando un impacto positivo en la comunidad.',
    ubicacion: 'Puebla, Puebla',
    mapa: '<iframe src="https://www.openstreetmap.org/export/embed.html?bbox=-98.2063%2C19.0414%2C-98.2063%2C19.0414&amp;layer=mapnik" style="width:100%;height:180px;border:0;"></iframe>',
    requisitos: ['Mayoría de edad', 'Empatía y responsabilidad', 'Trabajo en equipo']
  }
];

const gallery = document.getElementById('volunteer-gallerys');
const modal = document.getElementById('volunteer-modal');
const modalBody = modal.querySelector('.modal-body');
const closeBtn = modal.querySelector('.modal-close');
const filterBtns = document.querySelectorAll('.filter-btn');

function renderCards(category = 'all') {
  gallery.innerHTML = '';
  VOLUNTEERS.filter(v => category === 'all' || v.categoria === category)
    .forEach(v => {
      const card = document.createElement('div');
      card.className = 'volunteer-card';
      card.style.setProperty('--cat-color', v.color);
      card.style.setProperty('--cat-color-hover', v.colorHover);
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', v.nombre);
      card.innerHTML = `
        <img src="${v.img}" alt="${v.nombre}">
        <div class="card-content">
          <div class="card-title">${v.nombre}</div>
          <div class="card-desc">${v.desc}</div>
        </div>
      `;
      card.addEventListener('click', () => openModal(v));
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openModal(v); });
      gallery.appendChild(card);
    });
}

function openModal(vol) {
  modalBody.innerHTML = `
    <img src="${vol.img}" alt="${vol.nombre}">
    <h2>${vol.nombre}</h2>
    <div class="modal-desc">${vol.descLarga}</div>
    <div class="modal-map">${vol.mapa}</div>
    <ul class="modal-reqs">
      ${vol.requisitos.map(r => `<li>${r}</li>`).join('')}
    </ul>
    <button class="modal-signup">Inscribirse</button>
  `;
  modal.setAttribute('aria-hidden', 'false');
  modal.focus();
}

function closeModal() {
  modal.setAttribute('aria-hidden', 'true');
  modalBody.innerHTML = '';
}

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCards(btn.dataset.category);
  });
});

// Inicialización
renderCards();
filterBtns[0].classList.add('active');
