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
  updateAuthNav();
}

// ── Auth Nav 
function updateAuthNav() {
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
  
  if (token && user.role === 'admin' && isPublicPage) {
    console.log("👮 Admin detected on public page. Redirecting to Dashboard...");
    window.location.href = 'admin/dashboard.html';
  }
}

// ── Dark Mode 
function initDarkMode() {
  const toggle = document.getElementById('dark-toggle');
  if (!toggle) return;

  const isDark = localStorage.getItem('ht_dark') === 'true';
  if (isDark) document.body.classList.add('dark');
  updateDarkIcon(isDark);

  toggle.addEventListener('click', () => {
    const dark = document.body.classList.toggle('dark');
    localStorage.setItem('ht_dark', dark);
    updateDarkIcon(dark);
    showToast(dark ? 'Dark mode on 🌙' : 'Light mode on ☀️', 'info', 1800);
  });
}

function updateDarkIcon(isDark) {
  const icon = document.getElementById('dark-icon');
  if (icon) icon.textContent = isDark ? '☀️' : '🌙';
}

// ── Modal 
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
  if (localStorage.getItem('ht_dark') === 'true') document.body.classList.add('dark');

  // Page enter animation
  document.body.classList.add('page-enter');

  // Init navbar
  initNavbar();

  // Init dark mode toggle
  initDarkMode();

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
  animateCounter, initPage, updateAuthNav, goBack,
  formatINR, formatAdoptionFee
};

window.goBack = goBack;
