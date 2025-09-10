// public/assets/components/loadHeader.js
function loadHeader(containerId = 'header-container') {
    fetch('/public/assets/components/header.html')
        .then(response => response.text())
        .then(html => {
            let container = document.getElementById(containerId);
            if (!container) {
                container = document.createElement('div');
                container.id = containerId;
                document.body.insertBefore(container, document.body.firstChild);
            }
            container.innerHTML = html;
            // Cargar el script del header después de que se haya insertado el HTML
            const script = document.createElement('script');
            script.src = '/public/assets/components/header.js';
            script.onload = setupThemeToggle;
            document.head.appendChild(script);
        })
        .catch(error => {
            console.error('Error cargando el header:', error);
            let container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = '<p style="color: red;">Error cargando el header</p>';
            }
        });

    // --- Tema claro/oscuro ---
    function setupThemeToggle() {
        const themeSwitch = document.getElementById('theme-switch');
        const themeIcon = document.getElementById('theme-icon');
        const root = document.documentElement;
        const iconLight = '/public/assets/images/photos/Tema Claro Oscuro.png';
        const iconDark = '/public/assets/images/photos/Tema Claro Oscuro.png';

        let theme = localStorage.getItem('theme') || 'light';
        setTheme(theme);

        if (themeSwitch) {
            themeSwitch.onclick = () => {
                theme = (theme === 'light') ? 'dark' : 'light';
                setTheme(theme);
            };
        }

        function setTheme(t) {
            root.setAttribute('data-theme', t);
            localStorage.setItem('theme', t);
            if (themeIcon) {
                themeIcon.src = (t === 'dark') ? iconDark : iconLight;
            }
        }
    }
}