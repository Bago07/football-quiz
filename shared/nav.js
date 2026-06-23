/* ============================================================
   FOOTBALL QUIZ PLATFORM — Shared Navigation
   ============================================================
   Usage: <script src="/shared/nav.js" data-active="home"></script>
   data-active: "home" | "career-path" | game slug
   ============================================================ */

(function () {
  const script = document.currentScript;
  const active = script ? script.getAttribute('data-active') || '' : '';

  const games = [
    { slug: 'career-path', label: 'Career Path', href: '/games/career-path/index.html' },
  ];

  const basePath = detectBasePath();

  function detectBasePath() {
    const el = document.querySelector('script[src*="shared/nav.js"]');
    if (el) {
      const src = el.getAttribute('src');
      const base = src.replace(/shared\/nav\.js.*$/, '').replace(/\/$/, '');
      return base || '.';
    }
    return '.';
  }

  function resolve(path) {
    if (path.startsWith('/')) return basePath + path;
    return path;
  }

  const logoSVG = `<svg width="20" height="20" viewBox="0 0 40 40" fill="none">
    <circle cx="8" cy="31" r="3" fill="#5A8A5C" opacity="0.7"/>
    <circle cx="20" cy="20" r="3" fill="#A8C5A0"/>
    <circle cx="32" cy="9" r="4.5" fill="#C9A84C"/>
    <line x1="10.5" y1="29" x2="17.5" y2="22" stroke="#5A8A5C" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
    <line x1="22.5" y1="18" x2="29" y2="11.5" stroke="#A8C5A0" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
    <text x="32" y="13" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="800" fill="#2B3F2C">?</text>
  </svg>`;

  const hamburgerSVG = `<svg viewBox="0 0 24 24" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;

  let navLinks = `<a class="nav-link ${active === 'home' ? 'active' : ''}" href="${resolve('/index.html')}">Home</a>`;
  games.forEach(g => {
    navLinks += `<a class="nav-link ${active === g.slug ? 'active' : ''}" href="${resolve(g.href)}">${g.label}</a>`;
  });

  const nav = document.createElement('nav');
  nav.className = 'platform-nav';
  nav.innerHTML = `
    <div class="nav-inner">
      <a class="nav-brand" href="${resolve('/index.html')}">
        <div class="nav-brand-icon">${logoSVG}</div>
        <div class="nav-brand-text">Football<span>Quiz</span></div>
      </a>
      <div class="nav-links" id="nav-links">${navLinks}</div>
      <button class="nav-hamburger" id="nav-hamburger" aria-label="Toggle menu">${hamburgerSVG}</button>
    </div>`;

  document.body.prepend(nav);

  const hamburger = document.getElementById('nav-hamburger');
  const linksEl = document.getElementById('nav-links');
  if (hamburger && linksEl) {
    hamburger.addEventListener('click', () => {
      linksEl.classList.toggle('open');
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('.platform-nav')) linksEl.classList.remove('open');
    });
  }

  const footer = document.createElement('footer');
  footer.className = 'platform-footer';
  footer.innerHTML = 'Football Quiz Platform &middot; World Cup 2026';
  document.body.appendChild(footer);
})();
