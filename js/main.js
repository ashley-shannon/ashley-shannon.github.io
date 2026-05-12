(function () {
  'use strict';

  // ── MOBILE MENU ──
  const body = document.body;
  const toggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const backdrop = document.getElementById('menuBackdrop');

  function openMenu() {
    body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Menü schliessen');
    mobileMenu.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
  }

  function closeMenu() {
    body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menü öffnen');
    mobileMenu.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';
  }

  toggle.addEventListener('click', function () {
    if (body.classList.contains('menu-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  backdrop.addEventListener('click', closeMenu);

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && body.classList.contains('menu-open')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 950 && body.classList.contains('menu-open')) {
      closeMenu();
    }
  });

  // ── INTERSECTION OBSERVER (REVEAL) ──
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ── COUNT-UP ANIMATION (STATS) ──
  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      // easeOutCubic – startet schnell, läuft sanft aus
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(tick);
  }

  const statsSection = document.querySelector('.stats');
  if (statsSection && 'IntersectionObserver' in window) {
    const statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll('.stat-number[data-target]');
          counters.forEach(animateCount);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statObserver.observe(statsSection);
  } else if (statsSection) {
    // Fallback ohne IO: direkt Zielwerte setzen
    statsSection.querySelectorAll('.stat-number[data-target]').forEach(function (el) {
      el.textContent = el.dataset.target + (el.dataset.suffix || '');
    });
  }

  // ── PHASE CARDS (tap to toggle on touch devices) ──
  if (window.matchMedia('(hover: none)').matches) {
    const phaseCards = document.querySelectorAll('.phase-card');
    phaseCards.forEach(function (card) {
      card.addEventListener('click', function () {
        const wasOpen = card.classList.contains('is-open');
        phaseCards.forEach(function (other) { other.classList.remove('is-open'); });
        if (!wasOpen) card.classList.add('is-open');
      });
    });
  }

  // ── FAQ ACCORDION (single open) ──
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item && other.open) {
            other.open = false;
          }
        });
      }
    });
  });
})();
