// Mapa de Eventos - AidSync
// Lógica: login, geolocalización, Leaflet, filtros, popups, modo claro/oscuro

// --- Configuración de categorías y colores ---
const CATEGORY_COLORS = {
  voluntariado: '#4caf50',
  donaciones: '#ff9800',
  eventos: '#1976d2',
  emergencia: '#e53935',
};

// --- Simulación de eventos (reemplazar por fetch a backend/Firebase en producción) ---
const EVENTS = [
  {
    id: 1,
    title: 'Jornada de Voluntariado en Comedor',
    category: 'voluntariado',
    lat: -34.6037,
    lng: -58.3816,
    date: '2024-07-10',
    description: 'Ayuda a servir alimentos en el comedor comunitario.',
    address: 'Av. Corrientes 1234, CABA',
  },
  {
    id: 2,
    title: 'Colecta de Ropa de Invierno',
    category: 'donaciones',
    lat: -34.6090,
    lng: -58.3845,
    date: '2024-07-12',
    description: 'Traé tu donación de ropa para personas en situación de calle.',
    address: 'Plaza Miserere, CABA',
  },
  {
    id: 3,
    title: 'Festival Solidario',
    category: 'eventos',
    lat: -34.6158,
    lng: -58.4333,
    date: '2024-07-15',
    description: 'Música, juegos y recaudación de fondos.',
    address: 'Parque Centenario, CABA',
  },
  {
    id: 4,
    title: 'Emergencia: Inundación',
    category: 'emergencia',
    lat: -34.6030,
    lng: -58.4100,
    date: '2024-07-09',
    description: 'Se necesitan voluntarios y donaciones para afectados.',
    address: 'Barrio La Boca, CABA',
  },
];

// --- NUEVO: Centros de voluntariado y donación con info realista y popups mejorados ---
const CENTROS = [
  {
    id: 'c1',
    nombre: 'Fundación Natura - Reforestación',
    fundacion: 'Fundación Natura',
    tipo: 'Medio Ambiente',
    lugar: 'Reserva Ecológica',
    fecha: '15/07/2025',
    categoria: 'voluntariado',
    lat: -34.6007,
    lng: -58.3700,
    descripcion: 'Jornada de reforestación y educación ambiental.',
    url: 'https://fundacionnatura.org',
    unirse: 'https://fundacionnatura.org/unirse'
  },
  {
    id: 'c2',
    nombre: 'Fundayuda - Tutorías',
    fundacion: 'Fundayuda',
    tipo: 'Educación',
    lugar: 'Centro Comunitario',
    fecha: '20/07/2025',
    categoria: 'voluntariado',
    lat: -34.6050,
    lng: -58.3800,
    descripcion: 'Tutorías para niños y jóvenes en situación vulnerable.',
    url: 'https://fundayuda.org',
    unirse: 'https://fundayuda.org/unirse'
  },
  {
    id: 'c3',
    nombre: 'Fundación Pro Niños del Darién',
    fundacion: 'Pro Niños del Darién',
    tipo: 'Educación',
    lugar: 'Darién',
    fecha: '20/07/2025',
    categoria: 'voluntariado',
    lat: -34.6100,
    lng: -58.4500,
    descripcion: 'Apoyo escolar y actividades recreativas.',
    url: 'https://proniñosdarien.org',
    unirse: 'https://proniñosdarien.org/unirse'
  }
];

// --- Verificación de login (simulada) ---
function isLoggedIn() {
  return localStorage.getItem('userLoggedIn') === 'true';
}

function redirectToLogin() {
  window.location.href = '/src/pages/login.html';
}

// --- Inicialización de la página ---
document.addEventListener('DOMContentLoaded', () => {
  if (!isLoggedIn()) {
    redirectToLogin();
    return;
  }
  loadHeaderFooter();
  initMap();
  setupFilters();
  renderEventList(EVENTS);
  setupThemeToggle();
});

// --- Cargar header y footer ---
function loadHeaderFooter() {
  fetch('/src/components/header.html').then(r => r.text()).then(html => {
    document.getElementById('header-container').innerHTML = html;
  });
  fetch('/src/components/footer.html').then(r => r.text()).then(html => {
    document.getElementById('footer-container').innerHTML = html;
  });
}

// --- Inicializar Leaflet y marcadores ---
let map, markersLayer;
function initMap() {
  map = L.map('map', { zoomControl: false }).setView([-34.6037, -58.3816], 12);
  // Capas base
  const baseLayers = {
    'Mapa Claro': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }),
    'Satélite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles © Esri'
    })
  };
  baseLayers['Mapa Claro'].addTo(map);
  markersLayer = L.layerGroup().addTo(map);
  L.control.layers(baseLayers, null, { position: 'topright' }).addTo(map);
  L.control.zoom({ position: 'topright' }).addTo(map);
  // Intentar geolocalizar usuario
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      L.marker([latitude, longitude], { icon: userIcon() })
        .addTo(map)
        .bindPopup('Tu ubicación');
      map.setView([latitude, longitude], 13);
    });
  }
  renderMarkers(EVENTS);
}

function userIcon() {
  return L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

function markerIcon(category) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<span style="display:inline-block;width:22px;height:22px;background:${CATEGORY_COLORS[category]};border-radius:50%;border:2px solid #fff;"></span>`
  });
}

function renderMarkers(events) {
  markersLayer.clearLayers();
  // Eventos
  events.forEach(ev => {
    const marker = L.marker([ev.lat, ev.lng], { icon: markerIcon(ev.category) });
    marker.bindPopup(popupContent(ev));
    marker.on('click', () => highlightEventInList(ev.id));
    markersLayer.addLayer(marker);
  });
  // Centros
  CENTROS.forEach(centro => {
    const marker = L.marker([centro.lat, centro.lng], { icon: markerIcon(centro.categoria) });
    marker.bindPopup(centroPopupContent(centro));
    markersLayer.addLayer(marker);
  });
}

function popupContent(ev) {
  return `
    <strong>${ev.title}</strong><br>
    <span>${ev.date}</span><br>
    <span>${ev.address}</span><br>
    <p>${ev.description}</p>
    <button class="popup-btn" onclick="window.open('https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.address)}','_blank')">Ver en Google Maps</button>
  `;
}

function centroPopupContent(centro) {
  return `
    <strong>${centro.nombre}</strong><br>
    <span><b>Fundación:</b> ${centro.fundacion}</span><br>
    <span><b>Tipo:</b> ${centro.tipo}</span><br>
    <span><b>Lugar:</b> ${centro.lugar}</span><br>
    <span><b>Fecha:</b> ${centro.fecha}</span><br>
    <div style="margin-top:0.7em;display:flex;gap:0.5em;">
      <a href="${centro.unirse}" target="_blank" class="popup-btn" style="background:#16a085;color:#fff;padding:0.4em 1em;border-radius:6px;text-decoration:none;font-weight:600;">Unirse</a>
      <a href="${centro.url}" target="_blank" class="popup-btn" style="background:#1976d2;color:#fff;padding:0.4em 1em;border-radius:6px;text-decoration:none;font-weight:600;">Saber más</a>
    </div>
  `;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- Filtros ---
function setupFilters() {
  document.getElementById('filter-form').addEventListener('change', () => {
    const checked = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(i => i.value);
    const filtered = EVENTS.filter(ev => checked.includes(ev.category));
    renderMarkers(filtered);
    renderEventList(filtered);
  });
}

// --- Lista de eventos ---
function renderEventList(events) {
  const ul = document.getElementById('event-list');
  ul.innerHTML = '';
  if (events.length === 0) {
    ul.innerHTML = '<li>No hay eventos para mostrar.</li>';
    return;
  }
  events.forEach(ev => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${ev.title}</strong><br><span>${ev.date}</span> - <span>${ev.address}</span>`;
    li.style.borderLeft = `6px solid ${CATEGORY_COLORS[ev.category]}`;
    li.onclick = () => {
      map.setView([ev.lat, ev.lng], 15);
      // Abrir popup del marcador correspondiente
      markersLayer.eachLayer(marker => {
        if (marker.getLatLng().lat === ev.lat && marker.getLatLng().lng === ev.lng) {
          marker.openPopup();
        }
      });
    };
    ul.appendChild(li);
  });
}

function highlightEventInList(eventId) {
  const ul = document.getElementById('event-list');
  Array.from(ul.children).forEach(li => li.classList.remove('highlight'));
  const idx = EVENTS.findIndex(ev => ev.id === eventId);
  if (idx >= 0 && ul.children[idx]) {
    ul.children[idx].classList.add('highlight');
    ul.children[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// --- Modo claro/oscuro ---
function setupThemeToggle() {
  // Detecta y aplica el tema guardado
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  // Escucha cambios de tema global (por el botón del header)
  window.addEventListener('storage', (e) => {
    if (e.key === 'theme') {
      document.documentElement.setAttribute('data-theme', e.newValue || 'light');
    }
  });
}

// --- Estilo para resaltar evento seleccionado ---
const style = document.createElement('style');
style.innerHTML = `
#event-list li.highlight {
  background: var(--accent);
  color: #fff;
  font-weight: bold;
}`;
document.head.appendChild(style);