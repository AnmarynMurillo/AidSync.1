// contact.js - Validación y envío de formulario de contacto AidSync

document.getElementById('contact-form').onsubmit = async function(e) {
  e.preventDefault();
  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const subject = document.getElementById('contact-subject').value.trim();
  const message = document.getElementById('contact-message').value.trim();
  const status = document.getElementById('contact-status');

  // Validación básica
  if (!name) {
    status.textContent = 'Por favor, ingresa tu nombre.';
    return;
  }
  if (!validateEmail(email)) {
    status.textContent = 'Correo electrónico no válido.';
    return;
  }
  if (!message) {
    status.textContent = 'Por favor, escribe tu mensaje.';
    return;
  }

  status.textContent = 'Enviando...';
  status.style.color = '#888';

  // Simulación de envío (puedes cambiar por fetch a backend)
  setTimeout(() => {
    // Simula éxito
    status.textContent = '✔️ Tu mensaje ha sido enviado correctamente.';
    status.style.color = '#16a085';
    document.getElementById('contact-form').reset();
  }, 1200);

  // Si quieres usar mailto (opcional):
  // window.location.href = `mailto:info@aidsync.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Nombre: '+name+'\nCorreo: '+email+'\nMensaje: '+message)}`;
};

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
