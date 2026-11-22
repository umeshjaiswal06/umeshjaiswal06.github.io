document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Top bar: soft shadow once the page scrolls, and the prayer-flag strip fills as you read
  const bar = document.querySelector('.topbar');
  const flags = document.querySelector('.flags');
  let fill = null;
  if (flags) {
    fill = document.createElement('div');
    fill.className = 'flags-fill';
    fill.setAttribute('aria-hidden', 'true');
    fill.innerHTML = '<span></span><span></span><span></span><span></span><span></span>';
    flags.appendChild(fill);
  }
  const onScroll = () => {
    if (bar) bar.classList.toggle('scrolled', window.scrollY > 10);
    if (fill) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 100;
      fill.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // Phone menu: the Menu button opens and closes the page links
  const nav = document.getElementById('nav');
  const menuBtn = document.querySelector('.menu-btn');
  if (nav && menuBtn) {
    menuBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.textContent = open ? 'Close' : 'Menu';
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = 'Menu';
        menuBtn.focus();
      }
    });
  }

  // Following cursor: only for a mouse or trackpad, never on touch screens
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cur-dot';
    ring.className = 'cur-ring';
    dot.setAttribute('aria-hidden', 'true');
    ring.setAttribute('aria-hidden', 'true');
    document.body.append(dot, ring);
    let mx = -100, my = -100, rx = -100, ry = -100, started = false;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      if (!started) { rx = mx; ry = my; started = true; }
      root.classList.add('cur-on');
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
    });
    document.addEventListener('mouseover', e => {
      ring.classList.toggle('big', !!e.target.closest('a, button, label, .zoom'));
    });
    document.addEventListener('mouseout', e => { if (!e.relatedTarget) root.classList.remove('cur-on'); });
    const follow = () => {
      const k = reduceMotion ? 1 : 0.18;
      rx += (mx - rx) * k; ry += (my - ry) * k;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      requestAnimationFrame(follow);
    };
    follow();
  }

  // Trek photos: click to open large, Esc or Close to go back
  const zooms = document.querySelectorAll('a.zoom');
  if (zooms.length) {
    let box = null, lastLink = null;
    const close = () => {
      if (!box) return;
      box.remove(); box = null;
      document.body.style.overflow = '';
      root.classList.remove('lb-open');
      if (lastLink) lastLink.focus();
    };
    zooms.forEach(link => link.addEventListener('click', e => {
      e.preventDefault();
      lastLink = link;
      const img = link.querySelector('img');
      const cap = link.parentElement.querySelector('figcaption');
      box = document.createElement('div');
      box.className = 'lightbox';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');
      box.setAttribute('aria-label', cap ? cap.textContent : 'Photo');
      const fig = document.createElement('figure');
      const big = document.createElement('img');
      big.src = link.getAttribute('href');
      big.alt = img ? img.alt : '';
      fig.appendChild(big);
      if (cap) {
        const fc = document.createElement('figcaption');
        fc.textContent = cap.textContent;
        fig.appendChild(fc);
      }
      const btn = document.createElement('button');
      btn.className = 'lb-close';
      btn.type = 'button';
      btn.textContent = 'Close';
      btn.addEventListener('click', close);
      box.append(fig, btn);
      box.addEventListener('click', ev => { if (ev.target === box) close(); });
      document.body.appendChild(box);
      document.body.style.overflow = 'hidden';
      root.classList.add('lb-open');
      btn.focus();
    }));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  // Fade sections in as they scroll into view
  const items = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  items.forEach(el => obs.observe(el));
});
