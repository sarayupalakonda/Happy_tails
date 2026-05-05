/**
 * Happy Tails – App Utilities
 */

// ── Toast Notifications 
function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = { success: '✅', error: '❌', info: '🐾', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span style="font-size:1.1rem">${icons[type]}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hide');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

// ── Loading Spinner 
function showSpinner(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `
    <div class="flex flex-col items-center justify-center py-20 gap-4">
      <div class="spinner"></div>
      <p class="text-stone-500 text-sm font-medium">Loading...</p>
    </div>`;
}

function hideSpinner(containerId) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = '';
}

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

function formatAdoptionFee(amount) {
  const fee = Number(amount) || 0;
  return fee === 0 ? 'Free Adoption' : formatINR(fee);
}

// ── Skeleton Cards 
function renderSkeletons(containerId, count = 6) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = Array.from({ length: count }).map(() => `
    <div class="skeleton-card">
      <div class="skeleton" style="height:220px;border-radius:0"></div>
      <div style="padding:1.25rem">
        <div class="skeleton" style="height:20px;width:60%;margin-bottom:10px"></div>
        <div class="skeleton" style="height:14px;width:45%;margin-bottom:8px"></div>
        <div class="skeleton" style="height:14px;width:70%"></div>
      </div>
    </div>`).join('');
}

// ── Intersection Observer 
function initScrollAnimations() {
  const targets = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  targets.forEach(t => {
    observer.observe(t);
    // Fallback: If it doesn't show in 3 seconds, force show it
    setTimeout(() => t.classList.add('visible'), 3000);
  });
}

// ── Navbar Scroll Effect 
function initNavbar() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });

  // Hamburger toggle
  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  ensureMobileThemeToggle();
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
  }

  // Highlight active nav link
  const links = document.querySelectorAll('.nav-link');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) link.classList.add('active');
  });

  // Update auth nav items
  updateNavbarAuthState();
}

// ── Auth Nav 
function updateAuthNav() {
  return updateNavbarAuthState();
  const token = localStorage.getItem('ht_token');
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem('ht_user') || '{}');
  } catch (e) {
    console.error("Error parsing user from localStorage", e);
  }
  const authLinks = document.querySelectorAll('[data-auth-nav]');

  authLinks.forEach(el => {
    const mode = el.dataset.authNav;
    if (mode === 'logged-out') el.style.display = token ? 'none' : '';
    if (mode === 'logged-in') el.style.display = token ? '' : 'none';
    if (mode === 'admin-only') el.style.display = (token && user.role === 'admin') ? '' : 'none';
  });

  const userName = document.getElementById('nav-username');
  if (userName && user.name) userName.textContent = user.name.split(' ')[0];

  // Redirect admin if they land on ANY public page
  const path = window.location.pathname;
  const isPublicPage = !path.includes('admin/dashboard.html') && !path.includes('admin-login.html');
  
  if (false && token && user.role === 'admin' && isPublicPage) {
    console.log("👮 Admin detected on public page. Redirecting to Dashboard...");
    window.location.href = 'admin/dashboard.html';
  }
}

// ── Dark Mode 
function parseStoredJSON(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function getStoredAuthToken() {
  return localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("ht_token");
}

function getStoredAuthUser() {
  return parseStoredJSON(localStorage.getItem("user")) ||
    parseStoredJSON(localStorage.getItem("userInfo")) ||
    parseStoredJSON(localStorage.getItem("ht_user"));
}

function clearAuthStorage() {
  ["token", "authToken", "user", "userInfo", "ht_token", "ht_user"].forEach(key => {
    localStorage.removeItem(key);
  });
}

function requireLogin(redirectUrl = window.location.href) {
  if (getStoredAuthToken()) return true;

  localStorage.setItem("redirectAfterLogin", redirectUrl);
  window.location.href = "login.html";
  return false;
}

function setDisplay(el, show) {
  if (!el) return;
  el.style.display = show ? '' : 'none';
}

function updateNavbarAuthState() {
  const token = getStoredAuthToken();
  const user = getStoredAuthUser();
  const isLoggedIn = Boolean(token && user);
  const nav = document.querySelector('nav');

  if (nav) {
    nav.querySelectorAll('a[href="login.html"]').forEach(el => setDisplay(el, !isLoggedIn));
    nav.querySelectorAll('a[href="register.html"]').forEach(el => setDisplay(el, !isLoggedIn));
    ensureMobileAuthControls(nav);
    ensureLoggedInNavContent(nav);
  }

  document.querySelectorAll('[data-auth-nav]').forEach(el => {
    const mode = el.dataset.authNav;
    if (mode === 'logged-out') setDisplay(el, !isLoggedIn);
    if (mode === 'logged-in') setDisplay(el, isLoggedIn);
    if (mode === 'admin-only') setDisplay(el, isLoggedIn && user.role === 'admin');
  });

  document.querySelectorAll('[data-nav-username], #nav-username').forEach(el => {
    el.textContent = isLoggedIn ? (user.name || user.email || 'User').split(' ')[0] : '';
  });
}

function ensureMobileAuthControls(nav) {
  const mobileMenu = document.getElementById('mobile-menu');
  if (!mobileMenu || mobileMenu.querySelector('[data-mobile-auth-generated]')) return;

  const menuBody = mobileMenu.firstElementChild || mobileMenu;
  const panel = document.createElement('div');
  panel.dataset.mobileAuthGenerated = 'true';
  panel.dataset.authNav = 'logged-in';
  panel.className = 'flex flex-col gap-2 pt-2';
  panel.style.display = 'none';
  panel.innerHTML = `
    <span class="text-sm text-stone-600">Hi, <span data-nav-username class="font-semibold text-orange-500"></span>!</span>
    <a href="admin/dashboard.html" data-auth-nav="admin-only" class="btn-primary justify-center" style="padding:0.6rem;font-size:0.85rem;display:none">Admin Panel</a>
    <button onclick="API.logoutUser()" class="btn-secondary justify-center" style="padding:0.6rem;font-size:0.85rem">Logout</button>
  `;
  menuBody.appendChild(panel);
}

function ensureLoggedInNavContent(nav) {
  nav.querySelectorAll('[data-auth-nav="logged-in"]').forEach(container => {
    if (!container.querySelector('[data-nav-username], #nav-username')) {
      const greeting = document.createElement('span');
      greeting.className = 'text-sm text-stone-600';
      greeting.innerHTML = 'Hi, <span data-nav-username class="font-semibold text-orange-500"></span>!';
      container.insertBefore(greeting, container.firstChild);
    }

    if (!container.querySelector('[data-auth-nav="admin-only"]')) {
      const logoutButton = Array.from(container.querySelectorAll('button')).find(btn => btn.textContent.trim().toLowerCase().includes('logout'));
      const adminLink = document.createElement('a');
      adminLink.href = 'admin/dashboard.html';
      adminLink.dataset.authNav = 'admin-only';
      adminLink.className = 'btn-primary';
      adminLink.style.cssText = 'padding:0.55rem 1.3rem;font-size:0.85rem;display:none';
      adminLink.textContent = 'Admin Panel';
      container.insertBefore(adminLink, logoutButton || null);
    }
  });
}

function ensureMobileThemeToggle() {
  const hamburger = document.getElementById('hamburger-btn');
  if (!hamburger) return;

  const nav = hamburger.closest('nav');
  if (nav) nav.classList.add('has-mobile-actions');

  const desktopThemeToggle = nav ? nav.querySelector('#dark-toggle') : null;
  const desktopActions = desktopThemeToggle ? desktopThemeToggle.closest('.flex.items-center.gap-3') : null;
  if (desktopActions) desktopActions.classList.add('desktop-nav-actions');

  let actions = hamburger.closest('.mobile-nav-actions');
  if (!actions) {
    actions = document.createElement('div');
    actions.className = 'mobile-nav-actions md:hidden';
    hamburger.parentNode.insertBefore(actions, hamburger);
    actions.appendChild(hamburger);
  }

  if (document.getElementById('mobile-theme-toggle')) return;

  const btn = document.createElement('button');
  btn.id = 'mobile-theme-toggle';
  btn.dataset.themeToggle = 'true';
  btn.className = 'md:hidden w-9 h-9 rounded-full bg-orange-100 hover:bg-orange-200 flex items-center justify-center transition-all';
  btn.type = 'button';
  btn.title = 'Toggle theme';
  btn.innerHTML = '<span data-theme-icon>🌙</span>';
  actions.insertBefore(btn, hamburger);
}

updateAuthNav = updateNavbarAuthState;

function initDarkMode() {
  const toggles = document.querySelectorAll('#dark-toggle, [data-theme-toggle]');
  if (!toggles.length) return;

  const savedTheme = localStorage.getItem('theme');
  const isDark = savedTheme ? savedTheme === 'dark' : localStorage.getItem('ht_dark') === 'true';
  document.body.classList.toggle('dark', isDark);
  updateDarkIcon(isDark);

  toggles.forEach(toggle => toggle.addEventListener('click', () => {
    const dark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    localStorage.setItem('ht_dark', String(dark));
    updateDarkIcon(dark);
    showToast(dark ? 'Dark mode on 🌙' : 'Light mode on ☀️', 'info', 1800);
  }));
}

function updateDarkIcon(isDark) {
  const icon = document.getElementById('dark-icon');
  if (icon) icon.textContent = isDark ? '☀️' : '🌙';
}

// ── Modal 
function updateDarkIcon(isDark) {
  document.querySelectorAll('#dark-icon, [data-theme-icon]').forEach(icon => {
    icon.textContent = isDark ? '☀️' : '🌙';
  });
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('open');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');
}

// ── Empty State
function renderEmpty(containerId, message = "No dogs found 🐶") {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `
    <div class="empty-state col-span-full">
      <div style="font-size:4rem;margin-bottom:1rem">🐶</div>
      <h3 class="text-xl font-semibold text-stone-700 mb-2">${message}</h3>
      <p class="text-stone-500 text-sm">Try adjusting your filters or check back soon!</p>
      <a href="dogs.html" class="btn-primary mt-6" style="margin-top:1.5rem">Browse All Dogs</a>
    </div>`;
}

// ── Dog Card HTML 
function dogCardHTML(dog) {
  const image = dog.image || dog.imageUrl || '';
  const tags = (dog.personalityTags || dog.traits || dog.tags || []).slice(0, 2);
  const dogId = dog._id || dog.id;
  const isStreet = dog.type === 'street';
  const isRescue = dog.type === 'rescue';
  const isUrgent = (dog.urgencyLabel && dog.urgencyLabel.toLowerCase().includes('urgent')) || isRescue;
  const imagePosition = dog.imagePosition || 'center';
  const imageHtml = `<img src="${image || '/assets/default-dog.jpg'}" alt="${dog.name}" style="object-position:${imagePosition}" onerror="this.src='/assets/default-dog.jpg'">`;
  
  return `
    <div class="dog-card fade-in relative flex flex-col h-full">
      <div class="flex flex-col gap-2 absolute top-4 right-4 z-10 items-end">
        ${isRescue ? `<div class="available-badge" style="background:linear-gradient(135deg, #8b5cf6, #7c3aed);box-shadow:0 4px 12px rgba(139,92,246,0.3)">Rescue Hero 🐾</div>` : ''}
        ${isStreet && !isRescue ? `<div class="available-badge" style="background:linear-gradient(135deg, #06b6d4, #0891b2);box-shadow:0 4px 12px rgba(6,182,212,0.3)">Street Dog 🐾</div>` : ''}
        ${isUrgent ? `<div class="available-badge" style="background:linear-gradient(135deg, #ef4444, #dc2626);box-shadow:0 4px 12px rgba(239,68,68,0.3)">Urgent</div>` : 
         `<div class="available-badge">${dog.availabilityStatus || 'Available'}</div>`}
      </div>
      <a href="dog.html?id=${dogId}" class="dog-image-wrapper dog-card-image">
        ${imageHtml}
      </a>
      <div class="flex flex-col flex-1 p-6">
        <div class="flex items-center justify-between mb-1">
          <h3 class="font-bold text-xl text-stone-800">${dog.name}</h3>
          <span class="text-orange-500 hover:scale-125 transition-transform cursor-pointer">❤️</span>
        </div>
        <p class="text-stone-500 text-sm font-medium mb-1">${dog.breed || 'Mixed Breed'}</p>
        <p class="text-stone-400 text-xs flex items-center gap-1 mb-4">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${dog.location || 'Unknown'}
        </p>
        
        ${(isStreet || isRescue) ? `
          <div class="flex flex-col gap-2 mb-4">
            <div class="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              <span>🩺</span> ${dog.healthStatus || 'Healthy'}
            </div>
            <div class="flex items-center gap-2 text-xs font-semibold text-sky-600 bg-sky-50 px-2 py-1 rounded-md">
              <span>💉</span> ${dog.vaccinationStatus || 'Vaccinated'}
            </div>
          </div>
        ` : ''}

        <div class="mt-auto">
          <div class="flex items-center justify-between mb-6">
            <div class="flex gap-1">
              ${tags.map(t => `<span class="tag" style="padding:2px 8px;font-size:0.65rem">${t}</span>`).join('')}
            </div>
            <span class="text-xs font-bold text-stone-500">Fee: ${formatAdoptionFee(dog.adoptionFee)}</span>
          </div>
          <a href="dog.html?id=${dogId}" class="btn-primary w-full justify-center py-3 text-sm tracking-wide uppercase">
            View Profile
          </a>
        </div>
      </div>
    </div>`;
}

// ── Counter Animation ──────────────────────────────────────
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start).toLocaleString() + (el.dataset.suffix || '');
    if (start >= target) clearInterval(timer);
  }, 16);
}

// ── Page Init ──────────────────────────────────────────────
function initPage() {
  // Apply dark mode on load
  const savedTheme = localStorage.getItem('theme');
  const isDark = savedTheme ? savedTheme === 'dark' : localStorage.getItem('ht_dark') === 'true';
  document.body.classList.toggle('dark', isDark);

  // Page enter animation
  document.body.classList.add('page-enter');

  // Init navbar
  initNavbar();

  // Init dark mode toggle
  initDarkMode();

  updateNavbarAuthState();

  // Init scroll animations
  setTimeout(initScrollAnimations, 100);

  // Init smart back button
  initBackButton();
}

// ── Navigation ─────────────────────────────────────────────
function initBackButton() {
  const path = window.location.pathname;
  // DO NOT show on index.html (home page) or root
  if (path.includes("index.html") || path.endsWith("/")) return;

  // Find the logo link to inject the button next to it
  const logoLink = document.querySelector('a[href="index.html"].font-bold');
  if (!logoLink) return;

  // Create a flex wrapper to hold both the back button and the logo
  const wrapper = document.createElement('div');
  wrapper.className = 'flex items-center gap-3';

  // Create back button dynamically
  const btn = document.createElement('button');
  btn.id = 'backBtn';
  btn.onclick = goBack;
  btn.title = "Go Back";
  // Remove fixed positioning, use clean inline styles requested
  btn.className = "p-2 rounded-full hover:bg-orange-100 hover:scale-105 transition-all duration-200 flex items-center justify-center text-stone-600 cursor-pointer";
  btn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  `;
  
  // Replace logo with the new flex wrapper containing the button and logo
  logoLink.parentNode.insertBefore(wrapper, logoLink);
  wrapper.appendChild(btn);
  wrapper.appendChild(logoLink);
}

function goBack() {
  if (document.referrer && document.referrer !== "") {
    window.history.back();
  } else {
    window.location.href = "index.html";
  }
}

// Expose globally
window.Utils = {
  showToast, showSpinner, hideSpinner, renderSkeletons,
  initScrollAnimations, initNavbar, initDarkMode,
  openModal, closeModal, renderEmpty, dogCardHTML,
  animateCounter, initPage, updateAuthNav, updateNavbarAuthState, clearAuthStorage, requireLogin, goBack,
  formatINR, formatAdoptionFee
};

window.goBack = goBack;
window.updateNavbarAuthState = updateNavbarAuthState;
window.requireLogin = requireLogin;
