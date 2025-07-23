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
