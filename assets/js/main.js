(function () {
  // ===== Mobile menu =====
  const menuBtn = document.querySelector('[data-menu-btn]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // ===== Active nav highlight =====
  const path = (location.pathname || '/').split('/').pop() || 'index.html';
  document.querySelectorAll('a[data-nav]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });

  // ===== Contact form (Formspree progressive UX) =====
  const form = document.querySelector('form[data-contact-form]');
  const notice = document.querySelector('[data-form-notice]');
  if (form && notice) {
    form.addEventListener('submit', async (e) => {
      const action = form.getAttribute('action') || '';
      if (!action || action.includes('YOUR_FORMSPREE_ID')) return;

      e.preventDefault();
      notice.classList.remove('show');
      notice.textContent = 'Отправляем…';

      const formData = new FormData(form);

      try {
        const res = await fetch(action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          form.reset();
          notice.textContent = 'Спасибо! Заявка отправлена. Мы свяжемся с вами в ближайшее время.';
          notice.classList.add('show');
        } else {
          notice.textContent = 'Не удалось отправить. Попробуйте ещё раз или напишите нам напрямую.';
          notice.classList.add('show');
        }
      } catch (err) {
        notice.textContent = 'Ошибка сети. Попробуйте ещё раз или напишите нам напрямую.';
        notice.classList.add('show');
      }
    });
  }

  // ===== Premium background parallax (desktop only) =====
  const root = document.documentElement;
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

  if (!prefersReduced && isFinePointer) {
    let raf = null;

    window.addEventListener('mousemove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;

        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx);
        const dy = (e.clientY - cy);

        root.style.setProperty('--mx', dx.toFixed(1) + 'px');
        root.style.setProperty('--my', dy.toFixed(1) + 'px');
      });
    }, { passive: true });
  } else {
    // Touch / no-mouse: do nothing heavy
    root.style.setProperty('--mx', '0px');
    root.style.setProperty('--my', '0px');

    // Optional: very soft auto-drift on touch (comment out if not needed)
    if (!prefersReduced) {
      let t = 0;
      const tick = () => {
        t += 0.010;
        const mx = Math.sin(t) * 28;
        const my = Math.cos(t * 0.8) * 22;
        root.style.setProperty('--mx', mx.toFixed(1) + 'px');
        root.style.setProperty('--my', my.toFixed(1) + 'px');
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }
})();
