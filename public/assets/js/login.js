// login.js - Login de usuarios AidSync

document.getElementById('login-form').onsubmit = async function(e) {
  e.preventDefault();
  const user = document.getElementById('login-user').value.trim();
  const pass = document.getElementById('login-pass').value;
  const status = document.getElementById('login-status');
  status.className = 'login-status';

  if (!user || !pass) {
    status.textContent = 'Por favor, completa todos los campos.';
    status.classList.add('error');
    return;
  }

  status.textContent = 'Verificando...';
  status.classList.remove('error', 'success');
  status.style.color = '#888';

  // --- NUEVO: Verificar usuarios registrados en localStorage ---
  let users = JSON.parse(localStorage.getItem('aidsync_users') || '[]');
  const found = users.find(u => (u.usuario === user || u.email === user) && u.password === pass);
  // Simulación de credenciales válidas
  const validUser = found || user === 'voluntario' || user === 'empresa' || user === 'test@aidsync.org';
  const validPass = found ? true : pass === '123456';

  setTimeout(() => {
    if (!validUser) {
      status.textContent = 'El usuario no existe.';
      status.classList.add('error');
      return;
    }
    if (!validPass) {
      status.textContent = 'Contraseña incorrecta.';
      status.classList.add('error');
      return;
    }
    // Geolocalización obligatoria
    status.textContent = 'Solicitando ubicación...';
    if (!navigator.geolocation) {
      status.textContent = 'La geolocalización no es compatible con tu navegador.';
      status.classList.add('error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        status.textContent = '¡Bienvenido! Redirigiendo...';
        status.classList.add('success');
        // Guardar login
        localStorage.setItem('userLoggedIn', 'true');
        setTimeout(() => {
          window.location.href = 'map.html';
        }, 1200);
      },
      err => {
        status.textContent = 'Debes activar la ubicación para continuar.';
        status.classList.add('error');
      }
    );
  }, 1000);
};
