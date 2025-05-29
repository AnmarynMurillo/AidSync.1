// Avatar upload preview
document.getElementById('edit-avatar-btn').onclick = () => {
  document.getElementById('avatar-upload').click();
};
document.getElementById('avatar-upload').onchange = function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (evt) {
      document.getElementById('profile-avatar').src = evt.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Edit bio
const bio = document.getElementById('user-bio');
const editBioBtn = document.getElementById('edit-bio-btn');
let editingBio = false;
editBioBtn.onclick = () => {
  if (!editingBio) {
    bio.removeAttribute('readonly');
    bio.focus();
    editBioBtn.textContent = 'Guardar';
    editingBio = true;
  } else {
    bio.setAttribute('readonly', true);
    editBioBtn.textContent = 'Editar perfil';
    // Aquí puedes guardar la bio en backend/localStorage
    editingBio = false;
  }
};

// Logout
document.getElementById('logout-btn').onclick = () => {
  // Limpia sesión (simulado)
  localStorage.clear();
  window.location.href = '/login.html';
};

// Simulación de datos de usuario (puedes reemplazar por fetch a backend)
window.onload = () => {
  document.getElementById('username').textContent = 'Juan Pérez';
  document.getElementById('user-bio').value = 'Voluntario apasionado por ayudar a la comunidad.';
  document.getElementById('volunteer-hours').textContent = '42';
  document.getElementById('completed-activities').textContent = '7';
  document.getElementById('streak').textContent = '5';
  // Si es empresa, muestra sección empresa
  const isCompany = false; // Cambia a true para probar
  document.getElementById('company-section').style.display = isCompany ? 'block' : 'none';
};

// Certificado (simulación)
document.getElementById('generate-certificate-btn').onclick = () => {
  alert('Certificado generado (simulación). Puedes integrar jsPDF aquí.');
};

// Publicación empresa (simulación)
document.getElementById('new-post-btn')?.addEventListener('click', () => {
  alert('Función para subir publicación (solo empresas).');
});