// register.js - Registro de usuarios AidSync

document.getElementById('register-form').onsubmit = async function(e) {
  e.preventDefault();
  const nombre = document.getElementById('reg-nombre').value.trim();
  const edad = parseInt(document.getElementById('reg-edad').value, 10);
  const email = document.getElementById('reg-email').value.trim();
  const usuario = document.getElementById('reg-usuario').value.trim();
  const pass = document.getElementById('reg-pass').value;
  const pass2 = document.getElementById('reg-pass2').value;
  const area = document.getElementById('reg-area').value;
  const tipo = document.querySelector('input[name="tipo"]:checked');
  const status = document.getElementById('register-status');

  // Validaciones
  if (!nombre || !edad || !email || !usuario || !pass || !pass2 || !area || !tipo) {
    status.textContent = 'Por favor, completa todos los campos.';
    return;
  }
  if (!validateEmail(email)) {
    status.textContent = 'Correo electrónico no válido.';
    return;
  }
  if (pass.length < 6) {
    status.textContent = 'La contraseña debe tener al menos 6 caracteres.';
    return;
  }
  if (pass !== pass2) {
    status.textContent = 'Las contraseñas no coinciden.';
    return;
  }
  if (edad < 16) {
    status.textContent = 'Debes tener al menos 16 años para registrarte.';
    return;
  }

  status.textContent = 'Registrando...';
  status.style.color = '#888';

  // Simulación de guardado
  // --- NUEVO: Guardar usuario en localStorage ---
  let users = JSON.parse(localStorage.getItem('aidsync_users') || '[]');
  if (users.some(u => u.usuario === usuario)) {
    status.textContent = 'El nombre de usuario ya está registrado.';
    status.style.color = '#dc3545';
    return;
  }
  if (users.some(u => u.email === email)) {
    status.textContent = 'El correo electrónico ya está registrado.';
    status.style.color = '#dc3545';
    return;
  }
  users.push({
    nombre,
    edad,
    email,
    usuario,
    password: pass,
    area,
    tipo: tipo.value
  });
  localStorage.setItem('aidsync_users', JSON.stringify(users));
  status.textContent = '¡Registro exitoso! Redirigiendo al login...';
  status.style.color = '#16a085';
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1200);
};

document.querySelectorAll('input[name="tipo"]').forEach(radio => {
  radio.onchange = function() {
    const extra = document.getElementById('empresa-extra');
    if (this.value === 'empresa') {
      extra.style.display = 'block';
    } else {
      extra.style.display = 'none';
    }
  };
});

document.getElementById('btn-geo').onclick = function(e) {
  e.preventDefault();
  const geoStatus = document.getElementById('geo-status');
  geoStatus.textContent = 'Solicitando ubicación...';
  if (!navigator.geolocation) {
    geoStatus.textContent = 'La geolocalización no es compatible con tu navegador.';
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => {
      geoStatus.textContent = 'Ubicación activada ✔️';
      geoStatus.style.color = '#16a085';
    },
    err => {
      geoStatus.textContent = 'No se pudo obtener la ubicación.';
      geoStatus.style.color = '#dc3545';
    }
  );
};

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
