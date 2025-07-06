// script.js - Adds simple fade-in animation

document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".card, .hero, .testimonials");
  elements.forEach(el => {
    el.style.opacity = 0;
    el.style.transition = "opacity 1s ease-in-out";
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
      }
    });
  }, {
    threshold: 0.1
  });

  elements.forEach(el => observer.observe(el));
});
