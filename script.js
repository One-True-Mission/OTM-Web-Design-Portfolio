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
const cycleWordsByLang = {
  en: ['Work.', 'Convert.', 'Perform.', 'Sell.'],
  es: ['Funcionan.', 'Convierten.', 'Rinden.', 'Venden.']
};
let cycleIndex = 0;
const cycleEl = document.getElementById('wordCycle');
const accentEl = document.getElementById('heroAccent');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function getCycleWords() {
  const lang = document.body.dataset.lang || 'en';
  return cycleWordsByLang[lang] || cycleWordsByLang.en;
}

if (cycleEl && !reduceMotion) {
  setInterval(() => {
    cycleEl.style.transition = 'transform 0.45s cubic-bezier(0.7, 0, 0.3, 1), opacity 0.4s ease';
    cycleEl.style.transform = 'translateY(-55%)';
    cycleEl.style.opacity = '0';

    setTimeout(() => {
      const words = getCycleWords();
      cycleIndex = (cycleIndex + 1) % words.length;
      cycleEl.textContent = words[cycleIndex];
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
  const progressBar = document.getElementById('progress-bar');
  const backTop = document.getElementById('back-top');
  const floatContact = document.getElementById('float-contact');
  const navEl = document.querySelector('nav');
  if (progressBar) progressBar.style.width = (scrolled / total * 100) + '%';
  if (backTop) backTop.classList.toggle('visible', scrolled > 400);
  if (floatContact) floatContact.classList.toggle('visible', scrolled > 400);
  if (navEl) navEl.classList.toggle('scrolled', scrolled > 60);
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
const contactFormEl = document.getElementById('contactForm');
if (contactFormEl) {
  contactFormEl.addEventListener('submit', function(e) {
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
        alert('Something went wrong. Please try again.');
      }
    }).catch(() => {
      submitBtn.textContent = 'Send Request →';
      submitBtn.disabled = false;
      alert('Something went wrong. Please try again.');
    });
  });
}

// CAROUSEL
let current = 0;
const track = document.getElementById('carouselTrack');
const dots = document.querySelectorAll('.carousel-dot');
const total = track ? track.children.length : 0;
let autoTimer = total > 0 ? setInterval(carouselNext, 6000) : null;

function goTo(n) {
  if (total === 0) return;
  current = (n + total) % total;
  track.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
  clearInterval(autoTimer);
  autoTimer = setInterval(carouselNext, 6000);
}
function carouselNext() { goTo(current + 1); }
function carouselPrev() { goTo(current - 1); }

let touchStartX = 0;
let didSwipe = false;
if (track) {
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    didSwipe = false;
  });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      didSwipe = true;
      dx < 0 ? carouselNext() : carouselPrev();
    }
  });
  // Prevent link navigation if user was swiping the carousel
  track.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', e => {
      if (didSwipe) {
        e.preventDefault();
        didSwipe = false;
      }
    });
  });
  // Pause auto-advance while hovering the carousel
  const carouselWrap = track.closest('.carousel-wrap');
  if (carouselWrap) {
    carouselWrap.addEventListener('mouseenter', () => clearInterval(autoTimer));
    carouselWrap.addEventListener('mouseleave', () => {
      autoTimer = setInterval(carouselNext, 6000);
    });
  }
}

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

// LANGUAGE TOGGLE (English / Spanish)
(function() {
  const STORAGE_KEY = 'otm-lang';
  const SUPPORTED = ['en', 'es'];

  function getSavedLang() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.includes(saved)) return saved;
    } catch (e) { /* private mode etc */ }
    return 'en';
  }

  function saveLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
  }

  // Cache English source content from the live DOM on first run, so we can
  // restore it later without storing duplicate data-en attributes everywhere.
  let cached = false;
  function cacheEnglish() {
    if (cached) return;
    document.querySelectorAll('[data-es]').forEach(el => {
      if (!el.dataset.en) el.dataset.en = el.innerHTML;
    });
    document.querySelectorAll('[data-es-placeholder]').forEach(el => {
      if (el.dataset.enPlaceholder === undefined) el.dataset.enPlaceholder = el.placeholder || '';
    });
    document.querySelectorAll('[data-es-aria-label]').forEach(el => {
      if (el.dataset.enAriaLabel === undefined) el.dataset.enAriaLabel = el.getAttribute('aria-label') || '';
    });
    cached = true;
  }

  function applyLanguage(lang) {
    cacheEnglish();
    const useEs = (lang === 'es');

    document.querySelectorAll('[data-es]').forEach(el => {
      const next = useEs ? el.dataset.es : el.dataset.en;
      if (next !== undefined && el.innerHTML !== next) el.innerHTML = next;
    });
    document.querySelectorAll('[data-es-placeholder]').forEach(el => {
      const next = useEs ? el.dataset.esPlaceholder : el.dataset.enPlaceholder;
      if (next !== undefined) el.placeholder = next;
    });
    document.querySelectorAll('[data-es-aria-label]').forEach(el => {
      const next = useEs ? el.dataset.esAriaLabel : el.dataset.enAriaLabel;
      if (next !== undefined) el.setAttribute('aria-label', next);
    });

    document.documentElement.lang = lang;
    document.body.dataset.lang = lang;
    saveLang(lang);

    // Reset hero word cycle so the right language word shows immediately
    if (typeof cycleEl !== 'undefined' && cycleEl) {
      cycleIndex = 0;
      cycleEl.textContent = (typeof getCycleWords === 'function')
        ? getCycleWords()[0]
        : cycleEl.textContent;
    }
  }

  function toggleLanguage() {
    const cur = document.body.dataset.lang === 'es' ? 'es' : 'en';
    applyLanguage(cur === 'en' ? 'es' : 'en');
  }

  // Apply saved language on load
  applyLanguage(getSavedLang());

  // Wire up the toggle button
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', toggleLanguage);
  }
})();