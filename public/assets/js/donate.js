// donate.js: Lógica para galería de donaciones y modal

const CAUSES = [
  {
    id: 1,
    nombre: 'Fundación Casa Esperanza',
    categoria: 'bienestar',
    color: '#eab308',
    colorHover: '#ca8a04',
    img: '../../public/assets/images/hero/bienestar.jpg',
    desc: 'Mejorando la calidad de vida de niños y familias vulnerables en Panamá.',
    descLarga: 'Casa Esperanza trabaja para brindar apoyo integral a niños y familias en situación vulnerable, ofreciendo programas de educación, alimentación y salud.',
  },
  {
    id: 2,
    nombre: 'Salud para Todos',
    categoria: 'salud',
    color: '#dc2626',
    colorHover: '#b91c1c',
    img: '../../public/assets/images/hero/salud.jpg',
    desc: 'Campañas de salud y prevención en comunidades rurales.',
    descLarga: 'Salud para Todos lleva brigadas médicas, talleres de prevención y atención básica a comunidades rurales de difícil acceso.',
  },
  {
    id: 3,
    nombre: 'Educando Futuros',
    categoria: 'educacion',
    color: '#2563eb',
    colorHover: '#1d4ed8',
    img: '../../public/assets/images/hero/educacion.jpg',
    desc: 'Becas y tutorías para jóvenes de escasos recursos.',
    descLarga: 'Educando Futuros otorga becas, mentorías y apoyo escolar a jóvenes talentosos de bajos recursos para que continúen sus estudios.',
  },
  {
    id: 4,
    nombre: 'Verde Urbano',
    categoria: 'ambiente',
    color: '#16a34a',
    colorHover: '#15803d',
    img: '../../public/assets/images/hero/ambiente.jpg',
    desc: 'Reforestación y educación ambiental en ciudades.',
    descLarga: 'Verde Urbano promueve la plantación de árboles, talleres y campañas de concientización ambiental en zonas urbanas.',
  }
];

const gallery = document.getElementById('donate-gallery');
const modal = document.getElementById('donate-modal');
const modalBody = modal.querySelector('.modal-body');
const closeBtn = modal.querySelector('.modal-close');
const filterBtns = document.querySelectorAll('.filter-btn');

function renderCards(category = 'all') {
  gallery.innerHTML = '';
  CAUSES.filter(c => category === 'all' || c.categoria === category)
    .forEach(c => {
      const card = document.createElement('div');
      card.className = 'donate-card';
      card.style.setProperty('--cat-color', c.color);
      card.style.setProperty('--cat-color-hover', c.colorHover);
      card.innerHTML = `
        <img src="${c.img}" alt="${c.nombre}">
        <div class="card-content">
          <div class="card-title">${c.nombre}</div>
          <div class="card-desc">${c.desc}</div>
          <button class="donate-btn">Donar ahora</button>
        </div>
      `;
      card.querySelector('.donate-btn').addEventListener('click', e => {
        e.stopPropagation();
        openModal(c);
      });
      gallery.appendChild(card);
    });
}

function openModal(cause) {
  modalBody.innerHTML = `
    <img src="${cause.img}" alt="${cause.nombre}">
    <h2>${cause.nombre}</h2>
    <div class="modal-desc">${cause.descLarga}</div>
    <div class="modal-donate-options">
      <button class="donate-amount-btn" data-amount="5">$5</button>
      <button class="donate-amount-btn" data-amount="10">$10</button>
      <button class="donate-amount-btn" data-amount="25">$25</button>
      <input type="number" min="1" placeholder="Otro" class="donate-custom" aria-label="Otro monto">
    </div>
    <div class="donate-methods">
      <label class="donate-method"><input type="radio" name="method" value="tarjeta" checked> Tarjeta</label>
      <label class="donate-method"><input type="radio" name="method" value="transferencia"> Transferencia</label>
    </div>
    <button class="donate-confirm">Confirmar donación</button>
    <div class="donate-success" style="display:none;"></div>
  `;
  modal.setAttribute('aria-hidden', 'false');
  modal.focus();
  setupModalEvents();
}

function setupModalEvents() {
  // Selección de monto
  const amountBtns = modalBody.querySelectorAll('.donate-amount-btn');
  const customInput = modalBody.querySelector('.donate-custom');
  let selectedAmount = null;
  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedAmount = btn.dataset.amount;
      customInput.value = '';
    });
  });
  customInput.addEventListener('input', () => {
    amountBtns.forEach(b => b.classList.remove('selected'));
    selectedAmount = customInput.value;
  });
  // Confirmar donación
  const confirmBtn = modalBody.querySelector('.donate-confirm');
  const successMsg = modalBody.querySelector('.donate-success');
  confirmBtn.addEventListener('click', () => {
    const method = modalBody.querySelector('input[name="method"]:checked').value;
    const amount = selectedAmount || customInput.value;
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      successMsg.style.display = 'block';
      successMsg.textContent = 'Por favor, ingresa un monto válido.';
      successMsg.style.color = '#dc2626';
      return;
    }
    confirmBtn.disabled = true;
    successMsg.style.display = 'block';
    successMsg.style.color = '#16a34a';
    successMsg.textContent = `¡Gracias por tu donación de $${amount} por ${method}!`;
    setTimeout(() => {
      closeModal();
    }, 2000);
  });
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
document.addEventListener('DOMContentLoaded', () => {
  renderCards();
  filterBtns[0].classList.add('active');
});
