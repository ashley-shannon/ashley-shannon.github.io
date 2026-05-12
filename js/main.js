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

  // ── HERO H1: WORD-BY-WORD SPLIT ──
  const heroH1 = document.querySelector('.hero h1');
  if (heroH1) {
    let counter = 0;
    (function walk(node) {
      Array.from(node.childNodes).forEach(function (child) {
        if (child.nodeType === Node.TEXT_NODE) {
          const parts = child.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(part));
            } else {
              const span = document.createElement('span');
              span.className = 'word';
              span.style.setProperty('--i', counter++);
              span.textContent = part;
              frag.appendChild(span);
            }
          });
          child.parentNode.replaceChild(frag, child);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
          walk(child);
        }
      });
    })(heroH1);
  }

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

  // ── SCROLL-SPY (highlight active nav link) ──
  const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const spyTargets = navAnchors
    .map(function (a) {
      const id = a.getAttribute('href').slice(1);
      if (!id) return null;
      const section = document.getElementById(id);
      return section ? { anchor: a, section: section } : null;
    })
    .filter(Boolean);

  if (spyTargets.length && 'IntersectionObserver' in window) {
    const visible = new Set();
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      let topMost = null;
      let topMostY = Infinity;
      visible.forEach(function (sec) {
        const y = sec.getBoundingClientRect().top;
        if (y < topMostY) { topMostY = y; topMost = sec; }
      });
      spyTargets.forEach(function (t) {
        t.anchor.classList.toggle('active', t.section === topMost);
      });
    }, { rootMargin: '-30% 0px -55% 0px', threshold: 0 });

    spyTargets.forEach(function (t) { spy.observe(t.section); });
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
