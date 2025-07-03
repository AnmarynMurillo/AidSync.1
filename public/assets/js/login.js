document.getElementById('login-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = document.getElementById('login-user').value;
  const password = document.getElementById('login-pass').value;
  const status = document.getElementById('login-status');
  status.textContent = 'Iniciando sesión...';

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      status.textContent = 'Respuesta inesperada del servidor: ' + text;
      return;
    }

    if (res.ok) {
      localStorage.setItem('token', data.token);
      status.textContent = '¡Inicio de sesión exitoso!';
      window.location.href = 'index.html';
    } else {
      status.textContent = data.message || 'Error al iniciar sesión';
    }
  } catch (err) {
    status.textContent = 'Error de red: ' + err.message;
  }
});