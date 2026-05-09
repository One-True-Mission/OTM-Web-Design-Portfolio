// HAMBURGER NAV
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.classList.toggle('nav-open', isOpen);
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    });
  });
}

// HERO WORD CYCLE
const cycleWords = ['Work.', 'Convert.', 'Perform.', 'Sell.'];
let cycleIndex = 0;
const cycleEl = document.getElementById('wordCycle');
const accentEl = document.getElementById('heroAccent');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (cycleEl && !reduceMotion) {
  setInterval(() => {
    cycleEl.style.transition = 'transform 0.45s cubic-bezier(0.7, 0, 0.3, 1), opacity 0.4s ease';
    cycleEl.style.transform = 'translateY(-55%)';
    cycleEl.style.opacity = '0';

    setTimeout(() => {
      cycleIndex = (cycleIndex + 1) % cycleWords.length;
      cycleEl.textContent = cycleWords[cycleIndex];
      cycleEl.style.transition = 'none';
      cycleEl.style.transform = 'translateY(55%)';
      void cycleEl.offsetWidth;

      cycleEl.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease 0.05s';
      cycleEl.style.transform = 'translateY(0)';
      cycleEl.style.opacity = '1';

      if (accentEl) {
        accentEl.style.animation = 'none';
        void accentEl.offsetWidth;
        accentEl.style.animation = 'accentGrow 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards';
      }
    }, 450);
  }, 4000);
}

// FAQ ACCORDION
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = answer.classList.contains('open');
  document.querySelectorAll('.faq-answer.open').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-question.open').forEach(b => b.classList.remove('open'));
  if (!isOpen) { answer.classList.add('open'); btn.classList.add('open'); }
}

// FLOAT CONTACT + BACK TOP visibility + scroll progress
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total = document.body.scrollHeight - window.innerHeight;
  document.getElementById('progress-bar').style.width = (scrolled / total * 100) + '%';
  document.getElementById('back-top').classList.toggle('visible', scrolled > 400);
  document.getElementById('float-contact').classList.toggle('visible', scrolled > 400);
  document.querySelector('nav').classList.toggle('scrolled', scrolled > 60);
});

// CURSOR (CSS transitions instead of RAF loop)
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');

if (cursor && ring) {
  ring.style.transition = 'left 0.12s ease-out, top 0.12s ease-out, transform 0.2s, width 0.25s, height 0.25s';

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    ring.style.left = e.clientX + 'px';
    ring.style.top = e.clientY + 'px';
  });

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
}

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

// FORM SUBMIT (Formspree)
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const form = this;
  const submitBtn = form.querySelector('.form-submit');
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  }).then(response => {
    if (response.ok) {
      form.style.display = 'none';
      document.getElementById('formSuccess').classList.add('show');
    } else {
      submitBtn.textContent = 'Send Request →';
      submitBtn.disabled = false;
      alert('Something went wrong. Please try again or email stevenhowell27@yahoo.com directly.');
    }
  }).catch(() => {
    submitBtn.textContent = 'Send Request →';
    submitBtn.disabled = false;
    alert('Something went wrong. Please try again or email stevenhowell27@yahoo.com directly.');
  });
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
function initBASlider(sliderId, handleId, afterImgId) {
  const slider   = document.getElementById(sliderId);
  const handle   = document.getElementById(handleId);
  const afterImg = document.getElementById(afterImgId);
  if (!slider || !handle || !afterImg) return;

  let dragging = false;

  function setPos(x) {
    const rect = slider.getBoundingClientRect();
    let pct = Math.min(Math.max((x - rect.left) / rect.width * 100, 1), 99);
    afterImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = pct + '%';
  }

  afterImg.style.clipPath = 'inset(0 50% 0 0)';
  handle.style.left = '50%';

  slider.addEventListener('mousedown', e => { dragging = true; setPos(e.clientX); e.preventDefault(); });
  window.addEventListener('mousemove', e => { if (dragging) setPos(e.clientX); });
  window.addEventListener('mouseup', () => { dragging = false; });
  slider.addEventListener('touchstart', e => { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchmove', e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend', () => { dragging = false; });
}

initBASlider('baSlider1', 'baHandle1', 'baAfterImg1');
initBASlider('baSlider2', 'baHandle2', 'baAfterImg2');