// LOADER
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1500);
});

// THEME TOGGLE
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  document.getElementById('theme-toggle').textContent =
    document.body.classList.contains('light-mode') ? '☾' : '☀';
  localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light-mode');
  document.getElementById('theme-toggle').textContent = '☾';
}

// COOKIE BANNER
function dismissCookie() {
  document.getElementById('cookie-banner').classList.remove('show');
  localStorage.setItem('cookie-dismissed', '1');
}
if (!localStorage.getItem('cookie-dismissed')) {
  setTimeout(() => document.getElementById('cookie-banner').classList.add('show'), 2200);
}

// FAQ ACCORDION
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = answer.classList.contains('open');
  document.querySelectorAll('.faq-answer.open').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-question.open').forEach(b => b.classList.remove('open'));
  if (!isOpen) { answer.classList.add('open'); btn.classList.add('open'); }
}

// FLOAT CONTACT + BACK TOP visibility
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total = document.body.scrollHeight - window.innerHeight;
  document.getElementById('progress-bar').style.width = (scrolled / total * 100) + '%';
  document.getElementById('back-top').classList.toggle('visible', scrolled > 400);
  document.getElementById('float-contact').classList.toggle('visible', scrolled > 400);
  document.querySelector('nav').style.padding = scrolled > 60 ? '1rem 4rem' : '1.5rem 4rem';
});

// CURSOR
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animCursor() {
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();

document.querySelectorAll('a, button, input, select, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1.8)';
    ring.style.transform = 'translate(-50%,-50%) scale(1.4)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});

// SCROLL REVEAL
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
reveals.forEach(r => io.observe(r));

// ANIMATED COUNTERS
function animateCounter(el, target, suffix='', duration=1800) {
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = Math.floor(ease * target);
    el.textContent = val + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(step);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// HERO PARALLAX
document.addEventListener('mousemove', e => {
  const hero = document.querySelector('.hero-content');
  if (!hero) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 10;
  const y = (e.clientY / window.innerHeight - 0.5) * 6;
  hero.style.transform = `translate(${x}px, ${y}px)`;
});

// FORM SUBMIT
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  this.style.display = 'none';
  document.getElementById('formSuccess').classList.add('show');
});

// CAROUSEL
let current = 0;
const total = 3;
const track = document.getElementById('carouselTrack');
const dots = document.querySelectorAll('.carousel-dot');
let autoTimer = setInterval(carouselNext, 5000);

function goTo(n) {
  current = (n + total) % total;
  track.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
  clearInterval(autoTimer);
  autoTimer = setInterval(carouselNext, 5000);
}
function carouselNext() { goTo(current + 1); }
function carouselPrev() { goTo(current - 1); }

let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
track.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 40) dx < 0 ? carouselNext() : carouselPrev();
});

// BEFORE / AFTER SLIDERS
function initBASlider(sliderId, clipId, handleId) {
  const slider = document.getElementById(sliderId);
  const clip = document.getElementById(clipId);
  const handle = document.getElementById(handleId);
  if (!slider || !clip || !handle) return;
  let dragging = false;

  function setPos(x) {
    const rect = slider.getBoundingClientRect();
    let pct = Math.min(Math.max((x - rect.left) / rect.width * 100, 2), 98);
    clip.style.width = pct + '%';
    handle.style.left = pct + '%';
  }

  slider.addEventListener('mousedown', e => { dragging = true; setPos(e.clientX); });
  window.addEventListener('mousemove', e => { if (dragging) setPos(e.clientX); });
  window.addEventListener('mouseup', () => { dragging = false; });
  slider.addEventListener('touchstart', e => { dragging = true; setPos(e.touches[0].clientX); });
  window.addEventListener('touchmove', e => { if (dragging) setPos(e.touches[0].clientX); });
  window.addEventListener('touchend', () => { dragging = false; });
}

initBASlider('baSlider1', 'baClip1', 'baHandle1');
initBASlider('baSlider2', 'baClip2', 'baHandle2');
