// --- Login híbrido: backend Flask o Firebase SDK ---

// Configuración de tu proyecto Firebase (ajusta estos valores)
const firebaseConfig = {
  apiKey: "AIzaSyAJ395j9EL5Nv81Q70Csc4zRKNp5e1Xrjo",
  authDomain: "expo-project-1040e.firebaseapp.com",
  databaseURL: "https://expo-project-1040e-default-rtdb.firebaseio.com",
  projectId: "expo-project-1040e",
  storageBucket: "expo-project-1040e.firebasestorage.app",
  messagingSenderId: "813329495011",
  appId: "1:813329495011:web:931d42531c471fe3e2e6d6",
  measurementId: "G-QY0VQSB12F"
};
  // Puedes agregar storageBucket, messagingSenderId, appId s los tienes
// Inicializador dinámico para el SDK de Firebase (usando módulos ES6, sin objeto global)
let firebaseInitialized = false;
let app, getAuth, signInWithEmailAndPassword;
async function ensureFirebaseInit() {
  if (firebaseInitialized) return;
  const appModule = await import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js');
  const authModule = await import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js');
  app = appModule.initializeApp(firebaseConfig);
  getAuth = authModule.getAuth;
  signInWithEmailAndPassword = authModule.signInWithEmailAndPassword;
  firebaseInitialized = true;
}

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
    try {
      const data = JSON.parse(text);
      if (res.ok && data.success) {
        localStorage.setItem('user', JSON.stringify({email: data.user}));
        window.location.href = '/index.html';
      } else {
        status.textContent = data.message || 'Error al iniciar sesión';
      }
    } catch (parseError) {
      status.textContent = 'Respuesta inválida del servidor: ' + text;
    }
  } catch (err) {
    // Si el backend no responde, usa el SDK de Firebase
    status.textContent = 'Servidor backend no disponible, intentando login directo con Firebase...';
    try {
      await ensureFirebaseInit();
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
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
      // Manejo detallado de errores de Firebase Auth
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