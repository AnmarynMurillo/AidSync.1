document.getElementById('login-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  console.log("🔵 Formulario enviado");

  const email = document.getElementById('login-user').value;
  const password = document.getElementById('login-pass').value;
  const status = document.getElementById('login-status');

  console.log("📧 Email:", email);
  console.log("🔐 Password:", password);

  // Validar campos
  if (!email || !password) {
    status.textContent = 'Por favor, complete todos los campos';
    console.log("❌ Faltan campos");
    return;
  }

  status.textContent = 'Iniciando sesión...';
  console.log("⏳ Intentando login con backend...");

  // Intenta primero con backend Flask
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 segundos

    const res = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email, password }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const text = await res.text();
    console.log("📨 Respuesta cruda del backend:", text);

    try {
      const data = JSON.parse(text);
      console.log("🧾 Respuesta JSON parseada:", data);

      if (res.ok && data.success) {
        console.log("✅ Login exitoso vía backend:", data.user);
        localStorage.setItem('user', JSON.stringify({email: data.user}));
        window.location.href = '/index.html';
      } else {
        console.log("❌ Login fallido (backend):", data.message);
        status.textContent = data.message || 'Error al iniciar sesión';
      }
    } catch (parseError) {
      console.error("❗ Error al parsear respuesta del backend:", parseError);
      status.textContent = 'Respuesta inválida del servidor: ' + text;
    }

  } catch (err) {
    console.warn("⚠️ Backend no disponible. Error:", err);
    status.textContent = 'Servidor backend no disponible, intentando login directo con Firebase...';

    // Si el backend no responde, usa el SDK de Firebase
    try {
      await ensureFirebaseInit();
      console.log("📲 Firebase SDK cargado");

      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("✅ Login exitoso vía Firebase:", user.email);

      const remember = document.getElementById('login-remember').checked;
      if (remember) {
        localStorage.setItem('user', JSON.stringify({email: user.email}));
        sessionStorage.removeItem('user');
      } else {
        sessionStorage.setItem('user', JSON.stringify({email: user.email}));
        localStorage.removeItem('user');
      }

      window.location.href = '/index.html';

    } catch (firebaseError) {
      console.error("❌ Login fallido vía Firebase:", firebaseError);

      let msg = '';
      switch (firebaseError.code) {
        case 'auth/user-not-found':
          msg = 'No existe ninguna cuenta registrada con ese correo.';
          break;
        case 'auth/wrong-password':
          msg = 'La contraseña es incorrecta.';
          break;
        case 'auth/invalid-email':
          msg = 'El formato del correo es inválido.';
          break;
        case 'auth/user-disabled':
          msg = 'Esta cuenta ha sido deshabilitada.';
          break;
        case 'auth/too-many-requests':
          msg = 'Demasiados intentos fallidos. Intenta de nuevo más tarde.';
          break;
        case 'auth/network-request-failed':
          msg = 'Error de red. Revisa tu conexión a internet.';
          break;
        default:
          msg = 'Error al iniciar sesión: ' + (firebaseError.message || firebaseError.code);
      }
      status.textContent = msg;
    }
  }
});

// Función para mostrar el popup de confirmación de logout
function showLogoutPopup() {
  const popup = document.createElement('div');
  popup.className = 'logout-popup';
  popup.innerHTML = `
    <div class="popup-content">
      <h3>¿Estás seguro de querer cerrar sesión?</h3>
      <div class="popup-buttons">
        <button id="confirm-logout">Sí, cerrar sesión</button>
        <button id="cancel-logout">Volver al inicio</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  // Event listeners para los botones
  popup.querySelector('#confirm-logout').addEventListener('click', async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await res.json();
      if (data.success) {
        // Eliminar información del usuario
        localStorage.removeItem('user');
        // Redirigir a index.html
        window.location.href = '/index.html';
      }
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    } finally {
      popup.remove();
    }
  });

  popup.querySelector('#cancel-logout').addEventListener('click', () => {
    popup.remove();
  });
}

// Estilos CSS para el popup
const style = document.createElement('style');
style.textContent = `
  .logout-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .popup-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
  }

  .popup-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1rem;
  }

  .popup-buttons button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  #confirm-logout {
    background-color: #dc3545;
    color: white;
  }

  #cancel-logout {
    background-color: #6c757d;
    color: white;
  }
`;
document.head.appendChild(style);