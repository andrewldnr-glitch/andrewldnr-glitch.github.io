(function () {
  const menuBtn = document.querySelector('[data-menu-btn]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  const path = (location.pathname || '/').split('/').pop() || 'index.html';
  document.querySelectorAll('a[data-nav]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });

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
})();