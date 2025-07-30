// Splash Screen + Skip Button
window.addEventListener('load', () => {
  const splash = document.getElementById('splashScreen');
  const skipBtn = document.getElementById('skipSplash');
  setTimeout(() => skipBtn.classList.add('show'), 1000);
  const splashTimeout = setTimeout(() => {
    splash.style.display = 'none';
  }, 4000);
  skipBtn.addEventListener('click', () => {
    clearTimeout(splashTimeout);
    splash.style.display = 'none';
  });
});

// Typing Effect
const typingText = document.querySelector('.typing-text');
const words = ["I am Developer", "I am Designer", "I am Learner"];
let wordIndex = 0, charIndex = 0, deleting = false;
function typeEffect() {
  const currentWord = words[wordIndex];
  typingText.textContent = currentWord.substring(0, charIndex);
  if (!deleting && charIndex < currentWord.length) charIndex++;
  else if (deleting && charIndex > 0) charIndex--;
  else {
    deleting = !deleting;
    if (!deleting) wordIndex = (wordIndex + 1) % words.length;
  }
  setTimeout(typeEffect, deleting ? 80 : 120);
}
typeEffect();

// Testimonials Slider
const testimonials = document.querySelectorAll('.testimonial');
let testimonialIndex = 0;
setInterval(() => {
  testimonials[testimonialIndex].classList.remove('active');
  testimonialIndex = (testimonialIndex + 1) % testimonials.length;
  testimonials[testimonialIndex].classList.add('active');
}, 3000);

// Scroll To Top Button
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  scrollTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
});
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Contact Form Validation
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');
  if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
    alert("Please fill all fields!");
    return;
  }
  alert('Message Sent Successfully!');
});

// Smooth Page Transitions
document.querySelectorAll('a[href$=".html"], a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) return; 
    e.preventDefault();
    document.body.classList.remove('fade-in');
    setTimeout(() => { window.location.href = href; }, 300);
  });
});
