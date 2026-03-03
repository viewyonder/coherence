// === Scroll Reveal ===
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
}

// === Typing Effect ===
const typedEl = document.getElementById('typed-subtitle');
if (typedEl) {
  const text = 'Stop AI-generated code from breaking your architecture.';

  if (prefersReducedMotion) {
    typedEl.textContent = text;
  } else {
    let i = 0;
    function type() {
      if (i < text.length) {
        typedEl.textContent += text.charAt(i);
        i++;
        setTimeout(type, 35);
      }
    }
    // Small delay before starting
    setTimeout(type, 800);
  }
}
