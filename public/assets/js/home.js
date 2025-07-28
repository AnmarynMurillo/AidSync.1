// AidSync - Home Page JS (Optimized for Professional, Dynamic, Friendly UX)

// ---- Carousel ----
let slides, prevBtn, nextBtn, currentSlide = 0, interval;
function showSlide(idx) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === idx);
  });
}
function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}
function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}
function startCarousel() {
  interval = setInterval(nextSlide, 7000);
}
function stopCarousel() {
  clearInterval(interval);
}
document.addEventListener('DOMContentLoaded', () => {
  slides = document.querySelectorAll('.carousel-slide');
  prevBtn = document.querySelector('.carousel-btn.prev');
  nextBtn = document.querySelector('.carousel-btn.next');
  if (slides.length) {
    showSlide(currentSlide);
    nextBtn.addEventListener('click', () => { stopCarousel(); nextSlide(); startCarousel(); });
    prevBtn.addEventListener('click', () => { stopCarousel(); prevSlide(); startCarousel(); });
    startCarousel();
  }
});

// ---- Contact Form ----
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
      }
      alert('Thank you for your message! We will contact you soon.');
      form.reset();
    });
  }
});

// ---- Remove unused translation and hamburger menu code for index ----
// (All visible text is in English by default)

// ---- Modal para áreas de ayuda ----
const categoryDescriptions = {
  education: {
    title: 'Education',
    text: 'Education is the foundation for a brighter future. By supporting education, we empower individuals to reach their full potential and transform communities.'
  },
  health: {
    title: 'Health',
    text: 'Health is the cornerstone of well-being. Together, we bring hope and care to those who need it most, building healthier and happier lives.'
  },
  environment: {
    title: 'Environment',
    text: 'Protecting our environment means protecting our future. Every action counts in preserving the beauty and resources of our planet.'
  },
  social: {
    title: 'Social Welfare',
    text: 'Social Welfare is about caring for every generation. We foster inclusion, dignity, and support for all, creating a more compassionate world.'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Modal de áreas de ayuda
  const modalBackdrop = document.getElementById('category-modal-backdrop');
  const modalBody = modalBackdrop?.querySelector('.modal-body');
  const closeBtn = modalBackdrop?.querySelector('.modal-close');
  const categoryBtns = document.querySelectorAll('.category-btn');
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const area = btn.classList.contains('blue') ? 'education'
        : btn.classList.contains('red') ? 'health'
        : btn.classList.contains('green') ? 'environment'
        : btn.classList.contains('yellow') ? 'social' : null;
      if (area && categoryDescriptions[area]) {
        modalBody.innerHTML = `<h3>${categoryDescriptions[area].title}</h3><p>${categoryDescriptions[area].text}</p>`;
        modalBackdrop.classList.add('active');
        modalBackdrop.setAttribute('aria-hidden', 'false');
      }
    });
  });
  closeBtn?.addEventListener('click', () => {
    modalBackdrop.classList.remove('active');
    modalBackdrop.setAttribute('aria-hidden', 'true');
  });
  modalBackdrop?.addEventListener('click', e => {
    if (e.target === modalBackdrop) {
      modalBackdrop.classList.remove('active');
      modalBackdrop.setAttribute('aria-hidden', 'true');
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      modalBackdrop.classList.remove('active');
      modalBackdrop.setAttribute('aria-hidden', 'true');
    }
  });

  // ---- Carrusel de organizaciones con flechas y auto-scroll ----
  const orgCarousel = document.getElementById('org-carousel');
  const orgPrevBtn = document.querySelector('.org-carousel-btn.prev');
  const orgNextBtn = document.querySelector('.org-carousel-btn.next');
  let orgAutoScroll;
  let orgUserInteracted = false;
  const orgScrollAmount = 350;
  function scrollOrgs(dir) {
    if (!orgCarousel) return;
    orgCarousel.scrollBy({ left: dir * orgScrollAmount, behavior: 'smooth' });
  }
  function startOrgAutoScroll() {
    if (orgAutoScroll) clearInterval(orgAutoScroll);
    orgAutoScroll = setInterval(() => {
      if (!orgUserInteracted) scrollOrgs(1);
    }, 4000);
  }
  function stopOrgAutoScroll() {
    if (orgAutoScroll) clearInterval(orgAutoScroll);
  }
  if (orgCarousel && orgPrevBtn && orgNextBtn) {
    orgPrevBtn.onclick = () => { orgUserInteracted = true; scrollOrgs(-1); stopOrgAutoScroll(); setTimeout(() => { orgUserInteracted = false; startOrgAutoScroll(); }, 8000); };
    orgNextBtn.onclick = () => { orgUserInteracted = true; scrollOrgs(1); stopOrgAutoScroll(); setTimeout(() => { orgUserInteracted = false; startOrgAutoScroll(); }, 8000); };
    orgCarousel.addEventListener('mouseenter', stopOrgAutoScroll);
    orgCarousel.addEventListener('mouseleave', () => { if (!orgUserInteracted) startOrgAutoScroll(); });
    startOrgAutoScroll();
  }
});
