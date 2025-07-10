// header.js - Funcionalidad para el header de AidSync

// Script para abrir/cerrar el menú hamburguesa
// Selecciona el botón hamburguesa y el menú principal
const hamburger = document.getElementById('hamburger-menu');
const menu = document.getElementById('main-menu');

// Estado del menú (abierto/cerrado)
let menuOpen = false;

// Función para abrir/cerrar el menú
function toggleMenu() {
  menuOpen = !menuOpen;
  if (menuOpen) {
    menu.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Evita scroll en el fondo
  } else {
    menu.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// Evento click en el botón hamburguesa
hamburger.addEventListener('click', toggleMenu);

// Cierra el menú si se hace click fuera del menú (opcional)
document.addEventListener('click', function(event) {
  if (menuOpen && !menu.contains(event.target) && !hamburger.contains(event.target)) {
    toggleMenu();
  }
});

// Ajusta el menú al tamaño de la pantalla
window.addEventListener('resize', function() {
  if (window.innerWidth > 900) {
    menu.style.display = '';
    document.body.style.overflow = '';
    menuOpen = false;
  }
});

// Fin del script para menú hamburguesa
