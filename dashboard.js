// dashboard.js — STACKLY Light Green Theme

(function() {
  'use strict';

  // ── User from localStorage ──
  const user = JSON.parse(localStorage.getItem('stackly_user') || '{}');
  const username = user.username || 'Viewer';
  const email = user.email || 'viewer@stackly.com';
  const initials = username.charAt(0).toUpperCase();

  document.getElementById('userName').textContent = username;
  document.getElementById('userEmail').textContent = email;
  document.getElementById('greetName').textContent = `Hello, ${username}!`;
  document.getElementById('greetEmail').textContent = `${email} · Viewer`;
  document.getElementById('userAvatar').textContent = initials;
  document.getElementById('profileAvatar').textContent = initials;
  document.getElementById('profileName').textContent = username;
  document.getElementById('profileEmail').textContent = email;

  // ── Navigation ──
  const navItems = document.querySelectorAll('.nav-item');
  const pages = document.querySelectorAll('.page');
  const pageTitle = document.getElementById('pageTitle');
  const titles = {
    overview: 'Overview',
    system: 'System Status',
    reports: 'Reports',
    gallery: 'Gallery',
    news: 'News',
    learn: 'Learn',
    profile: 'My Profile',
    settings: 'Settings'
  };

  function showPage(target) {
    navItems.forEach(n => n.classList.toggle('active', n.dataset.page === target));
    pages.forEach(p => p.classList.remove('active'));
    const pg = document.getElementById('page-' + target);
    if (pg) pg.classList.add('active');
    pageTitle.textContent = titles[target] || target;
  }

  // Restore the last open section from the URL hash
  // (e.g. dashboard.html#reports) so returning from another
  // page lands back on the section the user left.
  function pageFromHash() {
    const t = location.hash.replace('#', '');
    return Object.prototype.hasOwnProperty.call(titles, t) ? t : 'overview';
  }

  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.dataset.page;
      if (location.hash !== '#' + target) {
        location.hash = target;
      } else {
        showPage(target);
      }
      if (window.innerWidth <= 768) closeSidebar();
    });
  });

  window.addEventListener('hashchange', () => showPage(pageFromHash()));
  showPage(pageFromHash());

  // ── Back Button ──
  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      // Exit the dashboard: return to the last main-site page,
      // falling back to the homepage when there is nothing to go back to.
      if (document.referrer && !document.referrer.includes('dashboard.html')) {
        history.back();
      } else {
        window.location.href = 'index.html';
      }
    });
  }

  // ── Logout: clear session, go to login page ──
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('stackly_user');
      localStorage.removeItem('its_user');
      window.location.href = 'login.html';
    });
  }

  // ── Mobile Sidebar ──
  const sidebar = document.getElementById('sidebar');
  const hamburger = document.getElementById('hamburger');
  const overlay = document.getElementById('overlay');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (hamburger) {
      hamburger.classList.add('open');
      const icon = hamburger.querySelector('i');
      if (icon) icon.className = 'ph ph-x';
    }
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    if (hamburger) {
      hamburger.classList.remove('open');
      const icon = hamburger.querySelector('i');
      if (icon) icon.className = 'ph ph-list';
    }
  }

  hamburger?.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });

  overlay?.addEventListener('click', closeSidebar);
  sidebarCloseBtn?.addEventListener('click', closeSidebar);

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && sidebar.classList.contains('open')) closeSidebar();
  });

  // ── Live System Feed ──
  const feedData = [
    { name: 'US-East AWS Cluster', val: 'Telemetry normal', on: true },
    { name: 'EU-West GCP Cluster', val: 'Throughput steady', on: true },
    { name: 'US-West Azure Cluster', val: 'Drift check complete', on: true },
    { name: 'EU-Central GCP Cluster', val: 'Maintenance scheduled', on: true },
    { name: 'AP-South AWS Cluster', val: 'Uptime 99.99%', on: true },
    { name: 'AP-East AWS Cluster', val: 'VPC Peering verified', on: true },
    { name: 'Singapore GCP Cluster', val: 'Failover test completed', on: false }
  ];

  const feedEl = document.getElementById('systemFeed');

  function renderFeed() {
    if (!feedEl) return;
    const now = new Date();
    const t = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    feedEl.innerHTML = feedData.map(f => {
      return `<div class="feed-item">
        <div class="feed-dot ${f.on ? 'on' : 'off'}"></div>
        <span class="feed-label">${f.name}</span>
        <span class="feed-val">${f.val}</span>
        <span class="feed-time">${t}</span>
      </div>`;
    }).join('');
  }

  renderFeed();
  setInterval(renderFeed, 5000);

})();