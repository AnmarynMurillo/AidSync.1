// header-loader.js
// Este script asegura que el header y footer se carguen dinámicamente en cualquier página
(function() {
  function loadHeaderFooter() {
    // Cargar header
    fetch('public/assets/components/header.html')
      .then(r => r.text())
      .then(html => {
        const hc = document.getElementById('header-container');
        if (hc) hc.innerHTML = html;
        // Cargar el script del header después de insertar el HTML
        const script = document.createElement('script');
        script.src = 'public/assets/js/header.js';
        document.body.appendChild(script);
      });
    // Cargar footer
    fetch('public/assets/components/footer.html')
      .then(r => r.text())
      .then(html => {
        const fc = document.getElementById('footer-container');
        if (fc) fc.innerHTML = html;
      });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHeaderFooter);
  } else {
    loadHeaderFooter();
  }
})();
