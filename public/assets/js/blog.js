// blog.js - Blog AidSync moderno, moderado y funcional

// Datos de ejemplo para publicaciones
const BLOG_POSTS = [
  {
    id: 1,
    titulo: 'Voluntariado en Darién',
    imagen: '../../public/assets/images/hero/voluntariado.jpg',
    extracto: 'Una experiencia que cambió mi vida ayudando en comunidades rurales de Darién... ¡Lee la historia completa!',
    contenido: 'Texto completo de la experiencia en Darién. Mucho aprendizaje, trabajo en equipo y gratitud. Participé en la construcción de una escuela y en talleres de salud para niños y adultos. Recomiendo a todos vivir una experiencia así.',
    autor: 'Juan Pérez',
    fecha: '2025-05-10',
    destacado: true,
    video: '',
    comentarios: [
      { autor: 'María', texto: '¡Inspirador! ¿Cómo puedo participar?', fecha: '2025-05-11', aprobado: true }
    ]
  },
  {
    id: 2,
    titulo: 'Jornada de Salud en Chiriquí',
    imagen: '../../public/assets/images/hero/salud.jpg',
    extracto: 'Médicos y voluntarios llevaron atención a más de 200 personas en zonas rurales de Chiriquí.',
    contenido: 'Crónica de la jornada de salud: médicos, enfermeros y voluntarios de AidSync brindaron consultas, medicamentos y charlas de prevención a familias de comunidades apartadas. ¡Gracias a todos los que apoyaron!',
    autor: 'Ana Torres',
    fecha: '2025-04-28',
    destacado: true,
    video: 'https://www.youtube.com/embed/ScMzIvxBSi4',
    comentarios: []
  },
  {
    id: 3,
    titulo: 'Reforestación Urbana',
    imagen: '../../public/assets/images/hero/ambiente.jpg',
    extracto: 'Más de 500 árboles plantados en la ciudad gracias a voluntarios y empresas aliadas.',
    contenido: 'Detalles de la campaña: se plantaron especies nativas en parques y avenidas principales. Participaron estudiantes, empresas y familias. ¡Juntos por un aire más limpio!',
    autor: 'Carlos Ruiz',
    fecha: '2025-04-15',
    destacado: false,
    video: '',
    comentarios: []
  },
  {
    id: 4,
    titulo: 'Historias de Esperanza',
    imagen: '../../public/assets/images/hero/bienestar.jpg',
    extracto: 'Testimonios de personas beneficiadas por AidSync y sus programas sociales.',
    contenido: 'Historias reales de impacto social: entrevistas a familias que recibieron apoyo en salud, educación y vivienda. AidSync sigue transformando vidas con tu ayuda.',
    autor: 'Sofía Martínez',
    fecha: '2025-03-30',
    destacado: false,
    video: '',
    comentarios: []
  },
  {
    id: 5,
    titulo: 'Taller de Emprendimiento Juvenil',
    imagen: '../../public/assets/images/hero/voluntariado.jpg',
    extracto: 'Jóvenes de distintas provincias participaron en un taller para crear sus propios negocios.',
    contenido: 'El taller incluyó mentorías, charlas de empresarios y simulaciones de negocios. Varios proyectos recibieron capital semilla. ¡El futuro es de los jóvenes!',
    autor: 'Laura Gómez',
    fecha: '2025-03-15',
    destacado: false,
    video: '',
    comentarios: []
  },
  {
    id: 6,
    titulo: 'Alianza con Fundación Sonrisas',
    imagen: '../../public/assets/images/hero/salud.jpg',
    extracto: 'Nueva alianza para llevar atención odontológica gratuita a comunidades vulnerables.',
    contenido: 'AidSync y Fundación Sonrisas unen esfuerzos para realizar jornadas de salud bucal en escuelas rurales. Se entregaron kits de higiene y se atendieron a más de 300 niños.',
    autor: 'Equipo AidSync',
    fecha: '2025-02-28',
    destacado: false,
    video: '',
    comentarios: []
  }
];

const POSTS_PER_PAGE = 4;
let currentPage = 1;
let filteredPosts = BLOG_POSTS;

// Simulación de moderación de comentarios y publicaciones
let PENDING_COMMENTS = [];
let PENDING_POSTS = [];

// Simulación de usuario autenticado
let USER_LOGGED_IN = false; // Cambia a true para simular usuario logueado
let IS_AIDSYNC_TEAM = false; // Cambia a true para simular equipo AidSync

// Render destacados (solo aprobados)
function renderFeatured() {
  const featured = BLOG_POSTS.filter(p => p.destacado && (p.aprobado !== false || p.aprobado === undefined));
  const container = document.getElementById('featured-posts');
  container.innerHTML = featured.map(post => `
    <div class="featured-card" data-id="${post.id}">
      <img src="${post.imagen}" alt="${post.titulo}">
      <div class="card-content">
        <div class="card-title">${post.titulo}</div>
        <div class="card-excerpt">${post.extracto}</div>
        <button class="read-more">Leer más</button>
      </div>
    </div>
  `).join('');
  container.querySelectorAll('.featured-card .read-more').forEach(btn => {
    btn.onclick = e => openModal(featured.find(p => p.id == btn.closest('.featured-card').dataset.id));
  });
}

// Render lista (solo aprobados)
function renderList(page = 1) {
  const list = document.getElementById('blog-list');
  const start = (page-1)*POSTS_PER_PAGE;
  const end = start+POSTS_PER_PAGE;
  // Mostrar todos los posts aprobados o los que no tienen campo aprobado (posts originales)
  const posts = filteredPosts.filter(p => (p.aprobado !== false && p.aprobado !== undefined) || p.aprobado === undefined).slice(start, end);
  list.innerHTML = posts.map(post => `
    <div class="blog-card" data-id="${post.id}">
      <img src="${post.imagen}" alt="${post.titulo}">
      <div class="card-content">
        <div class="card-title">${post.titulo}</div>
        <div class="card-excerpt">${post.extracto}</div>
        <button class="read-more">Leer más</button>
      </div>
    </div>
  `).join('');
  renderPagination();
}

// Render paginación con solo 3 botones visibles
function renderPagination() {
  const pag = document.getElementById('blog-pagination');
  const total = Math.ceil(filteredPosts.length/POSTS_PER_PAGE);
  pag.innerHTML = '';
  // Si no hay páginas, no mostrar nada
  if (total < 2) return;
  for(let i=1;i<=total;i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if(i===currentPage) btn.classList.add('active');
    // Mostrar solo el actual y los adyacentes
    if (Math.abs(i-currentPage) <= 1) {
      btn.setAttribute('data-visible','true');
    }
    btn.onclick = () => { currentPage = i; renderList(i); };
    pag.appendChild(btn);
  }
}

// Animación suave al cargar entradas
function animateCards() {
  document.querySelectorAll('.blog-card, .featured-card').forEach(card => {
    card.classList.remove('visible');
    setTimeout(() => {
      card.classList.add('visible');
    }, 100);
  });
}

// Llamar animación después de renderizar
const oldRenderList = renderList;
renderList = function(page = 1) {
  oldRenderList(page);
  animateCards();
  addReadMoreListeners();
};
const oldRenderFeatured = renderFeatured;
renderFeatured = function() {
  oldRenderFeatured();
  animateCards();
  addReadMoreListeners();
};

// Modal de entrada (solo comentarios aprobados)
const modal = document.getElementById('blog-modal');
const modalBody = modal.querySelector('.modal-body');
const closeBtn = modal.querySelector('.modal-close');

function openModal(post) {
  let videoEmbed = post.video ? `<iframe width="100%" height="320" src="${post.video}" frameborder="0" allowfullscreen style="margin-bottom:1.2rem;"></iframe>` : '';
  modalBody.innerHTML = `
    <img src="${post.imagen}" alt="${post.titulo}">
    <h2>${post.titulo}</h2>
    <div class="modal-meta">${post.autor} | ${new Date(post.fecha).toLocaleDateString()}</div>
    <div class="modal-content-text">${post.contenido}</div>
    ${videoEmbed}
    <div class="comments-section">
      <h3>Comentarios</h3>
      <div class="comments-list">
        ${post.comentarios.filter(c=>c.aprobado).map(c=>`<div class="comment"><div class="comment-meta">${c.autor} | ${new Date(c.fecha).toLocaleDateString()}</div>${c.texto}</div>`).join('')}
      </div>
      ${USER_LOGGED_IN ? `<form class="add-comment-form">
        <textarea required placeholder="Escribe tu comentario..."></textarea>
        <button type="submit">Enviar comentario</button>
      </form>` : `<div class="comment-login-msg">Inicia sesión para comentar.</div>`}
      <div class="comment-msg" style="color:#16a34a;margin-top:0.5rem;"></div>
    </div>
  `;
  modal.setAttribute('aria-hidden','false');
  modal.focus();
  if(USER_LOGGED_IN) setupCommentForm(post);
}

function closeModal() {
  modal.setAttribute('aria-hidden','true');
  modalBody.innerHTML = '';
}
closeBtn.onclick = closeModal;
modal.onclick = e => { if(e.target===modal) closeModal(); };
document.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });

// Comentarios: simula moderación (no aparecen hasta ser "aprobados")
function setupCommentForm(post) {
  const form = modalBody.querySelector('.add-comment-form');
  const msg = modalBody.querySelector('.comment-msg');
  form.onsubmit = e => {
    e.preventDefault();
    const texto = form.querySelector('textarea').value;
    PENDING_COMMENTS.push({postId: post.id, autor: 'Usuario', texto, fecha: new Date().toISOString(), aprobado: false});
    msg.textContent = 'Tu comentario fue enviado para revisión.';
    form.reset();
  };
}

// Interfaz para enviar nueva publicación (solo si logueado)
function renderNewPostForm() {
  const container = document.createElement('section');
  container.className = 'new-post-section';
  container.style.display = USER_LOGGED_IN ? 'block' : 'none';
  container.innerHTML = `
    <h2>Enviar nueva publicación</h2>
    <form id="new-post-form" class="new-post-form">
      <input type="text" name="titulo" placeholder="Título" required maxlength="80">
      <input type="text" name="autor" placeholder="Tu nombre o empresa" required maxlength="40">
      <input type="url" name="imagen" placeholder="URL de imagen (opcional)">
      <textarea name="extracto" placeholder="Extracto breve (máx 120 caracteres)" maxlength="120" required></textarea>
      <textarea name="contenido" placeholder="Contenido completo" required></textarea>
      <label><input type="checkbox" name="destacado"> Marcar como destacado</label>
      <button type="submit">Enviar publicación</button>
      <div class="post-msg" style="color:#16a34a;margin-top:0.5rem;"></div>
    </form>
    ${!USER_LOGGED_IN ? '<div class="comment-login-msg">Inicia sesión para enviar publicaciones.</div>' : ''}
  `;
  document.querySelector('.blog-main').insertBefore(container, document.querySelector('.featured-section'));
  if(USER_LOGGED_IN) {
    document.getElementById('new-post-form').onsubmit = function(e) {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(this));
      PENDING_POSTS.push({
        id: Date.now(),
        titulo: data.titulo,
        imagen: data.imagen || '../../public/assets/images/hero/voluntariado.jpg',
        extracto: data.extracto,
        contenido: data.contenido,
        autor: data.autor,
        fecha: new Date().toISOString(),
        destacado: !!data.destacado,
        video: '',
        comentarios: [],
        aprobado: false
      });
      this.querySelector('.post-msg').textContent = 'Tu publicación fue enviada para revisión.';
      this.reset();
    };
  }
}

// Interfaz de moderación para el equipo AidSync (solo si es equipo)
function renderModerationPanel() {
  if (!IS_AIDSYNC_TEAM) return;
  const panel = document.createElement('section');
  panel.className = 'moderation-section';
  panel.innerHTML = `
    <h2>Moderación (Equipo AidSync)</h2>
    <div class="moderation-posts">
      <h3>Publicaciones pendientes</h3>
      <div id="pending-posts"></div>
    </div>
    <div class="moderation-comments">
      <h3>Comentarios pendientes</h3>
      <div id="pending-comments"></div>
    </div>
  `;
  document.querySelector('.blog-main').appendChild(panel);
  updateModerationPanel();
}

function updateModerationPanel() {
  // Publicaciones
  const postsDiv = document.getElementById('pending-posts');
  postsDiv.innerHTML = PENDING_POSTS.length ? PENDING_POSTS.map(post => {
    return `<div class="pending-item">
      <b>${post.titulo}</b> por ${post.autor}<br />
      <button onclick="approvePost(${post.id})">Aprobar</button>
      <button onclick="rejectPost(${post.id})">Rechazar</button>
    </div>`;
  }).join('') : '<em>No hay publicaciones pendientes.</em>';
  // Comentarios
  const commDiv = document.getElementById('pending-comments');
  commDiv.innerHTML = PENDING_COMMENTS.length ? PENDING_COMMENTS.map((c,i) => {
    return `<div class="pending-item">
      <b>${c.autor}</b>: ${c.texto}<br />
      <button onclick="approveComment(${i})">Aprobar</button>
      <button onclick="rejectComment(${i})">Rechazar</button>
    </div>`;
  }).join('') : '<em>No hay comentarios pendientes.</em>';
}

window.approvePost = function(id) {
  const idx = PENDING_POSTS.findIndex(p=>p.id==id);
  if(idx>-1) {
    const post = PENDING_POSTS.splice(idx,1)[0];
    post.aprobado = true;
    BLOG_POSTS.push(post);
    filteredPosts = BLOG_POSTS;
    renderList();
    renderFeatured();
    updateModerationPanel();
  }
};
window.rejectPost = function(id) {
  const idx = PENDING_POSTS.findIndex(p=>p.id==id);
  if(idx>-1) {
    PENDING_POSTS.splice(idx,1);
    updateModerationPanel();
  }
};
window.approveComment = function(i) {
  const c = PENDING_COMMENTS[i];
  if(c) {
    const post = BLOG_POSTS.find(p=>p.id==c.postId);
    if(post) post.comentarios.push({...c, aprobado:true});
    PENDING_COMMENTS.splice(i,1);
    updateModerationPanel();
    if(document.getElementById('blog-modal').getAttribute('aria-hidden')==='false') openModal(post);
  }
};
window.rejectComment = function(i) {
  PENDING_COMMENTS.splice(i,1);
  updateModerationPanel();
};

// Corregir botón Leer más para que funcione en todas las tarjetas
function addReadMoreListeners() {
  // Featured
  document.querySelectorAll('.featured-card .read-more').forEach(btn => {
    btn.onclick = e => {
      const card = btn.closest('.featured-card');
      const id = card ? card.dataset.id : null;
      const post = BLOG_POSTS.find(p => p.id == id);
      if(post) openModal(post);
    };
  });
  // Blog list
  document.querySelectorAll('.blog-card .read-more').forEach(btn => {
    btn.onclick = e => {
      const card = btn.closest('.blog-card');
      const id = card ? card.dataset.id : null;
      const post = BLOG_POSTS.find(p => p.id == id);
      if(post) openModal(post);
    };
  });
}

// Modifica renderFeatured y renderList para llamar addReadMoreListeners
const oldRenderList2 = renderList;
renderList = function(page = 1) {
  oldRenderList2(page);
  animateCards();
  addReadMoreListeners();
};
const oldRenderFeatured2 = renderFeatured;
renderFeatured = function() {
  oldRenderFeatured2();
  animateCards();
  addReadMoreListeners();
};

// Inicialización
function initBlog() {
  renderNewPostForm();
  renderFeatured();
  renderList();
  renderModerationPanel();
  // Buscador
  const searchInput = document.getElementById('blog-search');
  if(searchInput) {
    searchInput.addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      filteredPosts = BLOG_POSTS.filter(p => p.titulo.toLowerCase().includes(q) || p.extracto.toLowerCase().includes(q) || p.contenido.toLowerCase().includes(q));
      currentPage = 1;
      renderList();
    });
  }
}

document.addEventListener('DOMContentLoaded', initBlog);
