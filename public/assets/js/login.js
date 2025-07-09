document.getElementById('login-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = document.getElementById('login-user').value;
  const password = document.getElementById('login-pass').value;
  const status = document.getElementById('login-status');
  
  // Validar campos
  if (!email || !password) {
    status.textContent = 'Por favor, complete todos los campos';
    return;
  }

  status.textContent = 'Iniciando sesión...';

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    // Leer la respuesta como texto primero
    const text = await res.text();
    
    try {
      // Intentar parsear como JSON
      const data = JSON.parse(text);
      
      if (res.ok) {
        if (data.success) {
          // Guardar información del usuario en localStorage
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Redirigir a index.html
          window.location.href = '/index.html';
        } else {
          status.textContent = data.message || 'Error al iniciar sesión';
        }
      } else {
        status.textContent = data.message || 'Error del servidor: ' + text;
      }
    } catch (parseError) {
      // Si no se puede parsear como JSON
      status.textContent = 'Respuesta inválida del servidor: ' + text;
    }
  } catch (err) {
    status.textContent = 'Error de red: ' + err.message;
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