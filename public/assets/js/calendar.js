// calendar.js - Calendario interactivo AidSync

// Simulación de usuario autenticado
let USER_LOGGED_IN = false; // Cambia a true para simular usuario logueado

// Eventos de ejemplo
const CALENDAR_EVENTS = [
  {
    date: '2025-05-10',
    title: 'Reforestación comunitaria',
    category: 'environment',
    place: 'Parque Natural',
    time: '9:00am',
    description: 'Jornada de plantación de árboles y limpieza de senderos.',
  },
  {
    date: '2025-05-15',
    title: 'Taller de Educación Financiera',
    category: 'education',
    place: 'Centro Comunitario',
    time: '3:00pm',
    description: 'Capacitación gratuita para jóvenes y adultos.',
  },
  {
    date: '2025-05-20',
    title: 'Campaña de Donación de Sangre',
    category: 'health',
    place: 'Hospital Central',
    time: '8:00am',
    description: 'Participa y salva vidas. Donantes recibirán certificado.',
  },
  {
    date: '2025-05-25',
    title: 'Feria de Bienestar Social',
    category: 'social',
    place: 'Plaza Principal',
    time: '10:00am',
    description: 'Actividades recreativas, salud y servicios sociales.',
  }
];

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function renderCalendar(month, year) {
  const monthName = MONTHS[month] + ' ' + year;
  document.getElementById('calendar-month').textContent = monthName;
  const datesGrid = document.getElementById('calendar-dates');
  datesGrid.innerHTML = '';

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  let startDay = firstDay.getDay();
  if (startDay === 0) startDay = 7; // Domingo como 7

  // Días en blanco antes del 1er día
  for (let i = 1; i < startDay; i++) {
    datesGrid.innerHTML += '<div></div>';
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const event = CALENDAR_EVENTS.find(ev => ev.date === dateStr);
    const isPast = new Date(year, month, d) < new Date(new Date().setHours(0,0,0,0));
    let classes = 'calendar-date';
    if (event) classes += ' has-event';
    if (isPast) classes += ' past';
    let dot = '';
    if (event) dot = `<span class="event-dot ${event.category}"></span>`;
    datesGrid.innerHTML += `<button class="${classes}" data-date="${dateStr}" ${isPast ? 'disabled' : ''}>${d}${dot}</button>`;
  }

  // Listeners para días con evento
  document.querySelectorAll('.calendar-date.has-event:not([disabled])').forEach(btn => {
    btn.onclick = () => openEventModal(btn.dataset.date);
  });
}

document.getElementById('prev-month').onclick = () => {
  if (currentMonth === 0) {
    currentMonth = 11;
    currentYear--;
  } else {
    currentMonth--;
  }
  renderCalendar(currentMonth, currentYear);
};
document.getElementById('next-month').onclick = () => {
  if (currentMonth === 11) {
    currentMonth = 0;
    currentYear++;
  } else {
    currentMonth++;
  }
  renderCalendar(currentMonth, currentYear);
};

function openEventModal(dateStr) {
  const event = CALENDAR_EVENTS.find(ev => ev.date === dateStr);
  if (!event) return;
  const modal = document.getElementById('calendar-modal');
  const modalBody = modal.querySelector('.modal-body');
  modalBody.innerHTML = `
    <span class="event-category ${event.category}">${categoriaNombre(event.category)}</span>
    <h3>${event.title}</h3>
    <div class="event-info"><b>Lugar:</b> ${event.place}</div>
    <div class="event-info"><b>Hora:</b> ${event.time}</div>
    <div class="event-info">${event.description}</div>
    ${USER_LOGGED_IN ? `<div class="event-action"><button onclick="alert('¡Te has inscrito!')">Participar</button></div>` : `<div class="comment-login-msg">Inicia sesión para participar.</div>`}
  `;
  modal.setAttribute('aria-hidden','false');
  modal.focus();
}

document.querySelector('.calendar-modal .modal-close').onclick = closeEventModal;
document.getElementById('calendar-modal').onclick = e => { if(e.target.id==='calendar-modal') closeEventModal(); };
document.addEventListener('keydown', e => { if(e.key==='Escape') closeEventModal(); });

function closeEventModal() {
  const modal = document.getElementById('calendar-modal');
  modal.setAttribute('aria-hidden','true');
  modal.querySelector('.modal-body').innerHTML = '';
}

function categoriaNombre(cat) {
  switch(cat) {
    case 'education': return 'Educación';
    case 'health': return 'Salud';
    case 'environment': return 'Medio ambiente';
    case 'social': return 'Bienestar social';
    default: return '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderCalendar(currentMonth, currentYear);
});
