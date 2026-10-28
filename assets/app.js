(() => {
  'use strict';
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const closeMenu = () => {
    nav?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Abrir menú');
  };
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    nav?.classList.toggle('open', open);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
      closeMenu(); toggle.focus();
    }
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.site-header')) closeMenu();
  });

  const filters = [...document.querySelectorAll('[data-filter]')];
  const posts = [...document.querySelectorAll('[data-category]')];
  filters.forEach(filter => filter.addEventListener('click', () => {
    filters.forEach(b => {
      const selected = b === filter;
      b.classList.toggle('active', selected);
      b.setAttribute('aria-pressed', String(selected));
    });
    let count = 0;
    posts.forEach(post => {
      post.hidden = filter.dataset.filter !== 'todas' && post.dataset.category !== filter.dataset.filter;
      if (!post.hidden) count++;
    });
    const status = document.getElementById('filter-status');
    if (status) status.textContent = `${count} ${count === 1 ? 'entrada visible' : 'entradas visibles'}.`;
  }));

  const systems = {
    riego: {step:'01',title:'El suelo indica cuándo regar.',copy:'Los sensores de humedad del suelo aportan información al ESP32. En modo automático, el programa utiliza esa lectura para decidir la activación de la bomba.',input:'Humedad del suelo',output:'Bomba de agua'},
    aire: {step:'02',title:'La temperatura orienta la ventilación.',copy:'El DHT22 permite observar la temperatura y la humedad del ambiente. El ESP32 utiliza la temperatura dentro de la lógica que controla el ventilador.',input:'Temperatura',output:'Ventilador'},
    luz: {step:'03',title:'La luz se mide antes de actuar.',copy:'El BH1750 proporciona información sobre la iluminación. El programa relaciona esa lectura con las condiciones definidas para encender o apagar las luces LED.',input:'Iluminación',output:'Luces LED'}
  };
  document.querySelectorAll('.system-tab').forEach(button => button.addEventListener('click', () => {
    const system = systems[button.dataset.system];
    if (!system) return;
    document.querySelectorAll('.system-tab').forEach(b => {
      b.classList.toggle('active', b === button);
      b.setAttribute('aria-pressed', String(b === button));
    });
    document.querySelector('.system-demo').dataset.system = button.dataset.system;
    document.querySelector('.step-number').textContent = system.step;
    document.getElementById('system-title').textContent = system.title;
    document.getElementById('system-copy').textContent = system.copy;
    document.getElementById('signal-input').textContent = system.input;
    document.getElementById('signal-output').textContent = system.output;
    document.querySelector('.signal-path').setAttribute('aria-label', `Secuencia: ${system.input}, ESP32, ${system.output}`);
  }));

  const dialog = document.querySelector('.lightbox');
  const gallery = [...document.querySelectorAll('[data-gallery]')];
  let current = 0;
  if (dialog && typeof dialog.showModal === 'function') {
    const displayImage = index => {
      current = (index + gallery.length) % gallery.length;
      const link = gallery[current];
      const img = document.getElementById('lightbox-image');
      img.src = link.href;
      img.alt = link.querySelector('img').alt;
      document.getElementById('lightbox-caption').textContent = link.dataset.caption;
      document.getElementById('lightbox-count').textContent = `${current + 1} / ${gallery.length}`;
    };
    gallery.forEach((link, index) => link.addEventListener('click', e => {
      e.preventDefault(); displayImage(index); dialog.showModal();
    }));
    const closeDialog = () => dialog.close();
    dialog.querySelector('.lightbox-close').addEventListener('click', closeDialog);
    dialog.querySelector('.lightbox-prev').addEventListener('click', () => displayImage(current - 1));
    dialog.querySelector('.lightbox-next').addEventListener('click', () => displayImage(current + 1));
    dialog.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); displayImage(current - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); displayImage(current + 1); }
    });
    dialog.addEventListener('click', e => {
      if (e.target === dialog) {
        const bounds = dialog.getBoundingClientRect();
        if (e.clientX < bounds.left || e.clientX > bounds.right || e.clientY < bounds.top || e.clientY > bounds.bottom) closeDialog();
      }
    });
    dialog.addEventListener('close', () => gallery[current]?.focus());
  }
})();
