/**
 * Happy Tails – Admin Panel Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check if we are on the admin page
  if (document.getElementById('sec-dashboard')) {
    initAdmin();
  }
});

Object.assign(window, {
  showSection,
  loadAdoptions,
  loadDogs,
  loadContacts,
  updateStatus,
  deleteApplication,
  toggleDogModal,
  toggleRescueFields,
  editDog,
  confirmDeleteDog,
  openContactModal,
  confirmDeleteContact,
  adminLogout,
  openProfileModal,
  closeProfileModal,
  handleProfileSubmit,
  openModal,
  closeModal
});

async function initAdmin() {
  const user = API.getUser();
  if (document.getElementById('admin-name')) {
    document.getElementById('admin-name').textContent = user.name || 'Admin';
  }

  // Load initial data
  loadStats();
  loadAdoptions();
  loadDogs();
  loadContacts();

  // Handle Dog Form
  const dogForm = document.getElementById('dog-form');
  if (dogForm) {
    dogForm.onsubmit = handleDogSubmit;
  }
}

// ── Sections Management ─────────────────────────────────────
function showSection(sectionId) {
  const sections = ['dashboard', 'adoptions', 'dogs', 'contacts'];
  sections.forEach(s => {
    const el = document.getElementById(`sec-${s}`);
    const btn = document.getElementById(`btn-${s}`);
    if (el) el.classList.add('hidden');
    if (btn) btn.classList.remove('active');
  });

  const titles = {
    dashboard: 'Overview Dashboard',
    adoptions: 'Adoption Applications',
    dogs: 'Manage Pet Inventory',
    contacts: 'Contact Messages'
  };
  document.getElementById('section-title').textContent = titles[sectionId];

  const activeSection = document.getElementById(`sec-${sectionId}`);
  const activeBtn = document.getElementById(`btn-${sectionId}`);
  if (activeSection) activeSection.classList.remove('hidden');
  if (activeBtn) activeBtn.classList.add('active');

  const sidebar = document.getElementById('sidebar');
  if (sidebar && window.innerWidth < 768) sidebar.classList.add('hidden');

  if (sectionId === 'dashboard') {
    loadStats();
    loadAdoptions();
  }
  if (sectionId === 'dogs') loadDogs();
  if (sectionId === 'contacts') loadContacts();
}

// ── Stats ──────────────────────────────────────────────────
async function loadStats() {
  try {
    const res = await API.fetchAdminStats();
    if (res.success) {
      document.getElementById('stat-dogs').textContent = res.data.dogs || '0';
      // User count might not exist depending on the backend, default to 0 if missing
      if(document.getElementById('stat-users')) {
        document.getElementById('stat-users').textContent = res.data.users || '0';
      }
    }
  } catch (err) {
    console.error('Stats error:', err);
  }
}

function updateAdoptionStats(applications) {
  const total = applications.length;
  const approved = applications.filter(app => app.status?.toLowerCase() === "approved").length;
  const pending = applications.filter(app => app.status?.toLowerCase() === "pending").length;
  const rejected = applications.filter(app => app.status?.toLowerCase() === "rejected").length;

  document.getElementById('stat-adoptions').textContent = total;
  document.getElementById('stat-approved').textContent = approved;
  document.getElementById('stat-pending').textContent = pending;
  document.getElementById('stat-rejected').textContent = rejected;
}

// ── Adoptions ──────────────────────────────────────────────
async function loadAdoptions() {
  try {
    const res = await API.fetchAdminAdoptions();
    const apps = res.data?.data || res.data?.applications || res.data || [];
    
    window.adoptionsData = apps; // Store globally
    
    updateAdoptionStats(apps);
    renderAdoptionsTable(apps);
    renderRecentAdoptions(apps.slice(0, 5));
    
  } catch (err) {
    console.error('Adoptions error:', err);
    Utils.showToast('Failed to load adoptions', 'error');
  }
}

function renderAdoptionsTable(adoptions) {
  const container = document.getElementById('adoptions-table-body');
  if (!container) return;

  if (adoptions.length === 0) {
    container.innerHTML = '<tr><td colspan="5" class="admin-empty-cell py-10">No applications found.</td></tr>';
    return;
  }

  container.innerHTML = adoptions.map(app => {
    const st = app.status?.toLowerCase() || 'pending';
    return `
    <tr class="hover:bg-orange-50/50 transition-all duration-300 border-b border-stone-50 last:border-0 hover:shadow-sm hover:-translate-y-0.5 relative group">
      <td class="py-4 px-4">
        <p class="font-bold text-stone-800">${app.userId?.name || 'Not Provided'}</p>
        <p class="text-xs text-stone-400">${app.userId?.email || ''}</p>
      </td>
      <td class="py-4 px-4">
        <p class="font-medium text-stone-700">${app.dogId?.name || 'Not Provided'}</p>
        <p class="text-xs text-stone-400">${app.dogId?.breed || ''}</p>
      </td>
      <td class="py-4 px-4 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-sm text-stone-500">
        ${app.message || '-'}
      </td>
      <td class="py-4 px-4">
        <span class="status-badge status-${st}">${st}</span>
      </td>
      <td class="py-4 px-4 text-right space-x-2 whitespace-nowrap">
        <button onclick="openModal('${app._id}')" class="bg-stone-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md hover:shadow-lg hover:bg-stone-600 hover:scale-105 transition-all inline-flex items-center gap-1"><span>👁️</span> View</button>
        ${st !== 'approved' ? `<button onclick="updateStatus('${app._id}', 'approved', this)" class="bg-green-500 text-white hover:bg-green-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all inline-flex items-center gap-1"><span>✅</span> Approve</button>` : ''}
        ${st !== 'rejected' ? `<button onclick="updateStatus('${app._id}', 'rejected', this)" class="bg-red-500 text-white hover:bg-red-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all inline-flex items-center gap-1"><span>❌</span> Reject</button>` : ''}
        ${st === 'rejected' ? `<button onclick="deleteApplication('${app._id}')" class="bg-red-500 text-white hover:bg-red-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all inline-flex items-center gap-1"><span>🗑️</span> Delete</button>` : ''}
      </td>
    </tr>
    `;
  }).join('');
}

function renderRecentAdoptions(adoptions) {
  const container = document.getElementById('recent-adoptions-body');
  if (!container) return;

  if (!adoptions.length) {
    container.innerHTML = '<tr><td colspan="4" class="admin-empty-cell py-10">No recent applications yet.</td></tr>';
    return;
  }

  container.innerHTML = adoptions.map(app => {
    const st = (app.status || 'pending').toLowerCase();
    return `
    <tr class="hover:bg-orange-50/50 transition-all duration-300 border-b border-stone-50 last:border-0">
      <td class="py-4 text-sm font-medium">${app.userId?.name || 'Not Provided'}</td>
      <td class="py-4 text-sm text-stone-500">${app.dogId?.name || 'Not Provided'}</td>
      <td class="py-4"><span class="status-badge status-${st}">${st}</span></td>
      <td class="py-4 text-sm text-stone-400">${new Date(app.createdAt || Date.now()).toLocaleDateString()}</td>
    </tr>
    `;
  }).join('');
}

async function updateStatus(id, status, btn) {
  let originalText = btn ? btn.textContent : '';
  try {
    if (btn) {
      btn.disabled = true;
      btn.textContent = '...';
    }

    const res = await API.updateAdoptionStatus(id, status);
    if (res.success || res.status === 'approved' || res.status === 'rejected' || res._id) {
      Utils.showToast(`Application ${status}!`, 'success');
      await loadAdoptions(); // Refetches and recalculates stats
    }
  } catch (err) {
    if (btn) {
      btn.disabled = false;
      btn.textContent = originalText;
    }
    Utils.showToast(err.message, 'error');
  }
}

async function deleteApplication(id, closeAfterDelete = false) {
  const confirmDelete = confirm("Are you sure you want to delete this rejected application?");
  if (!confirmDelete) return;

  try {
    await API.deleteAdoption(id);
    Utils.showToast("Rejected application deleted successfully", "success");
    await loadAdoptions();
    if (closeAfterDelete) closeModal();
  } catch (err) {
    Utils.showToast(err.message || "Failed to delete application", "error");
  }
}

// ── Dogs Management ─────────────────────────────────────────
async function loadDogs() {
  try {
    console.log("📡 Admin: Fetching all dogs...");
    const res = await API.fetchDogs();
    console.log("Dogs API response:", res); // Mandatory debug log

    const container = document.getElementById('dogs-grid');
    if (!container) return;

    // Extremely robust parsing to handle any API shape
    let dogs = [];
    if (Array.isArray(res)) {
      dogs = res;
    } else if (res && res.data && Array.isArray(res.data)) {
      dogs = res.data;
    } else if (res && res.dogs && Array.isArray(res.dogs)) {
      dogs = res.dogs;
    } else if (res && res.data && res.data.data && Array.isArray(res.data.data)) {
      dogs = res.data.data;
    } else if (res && res.data && res.data.dogs && Array.isArray(res.data.dogs)) {
      dogs = res.data.dogs;
    } else {
      dogs = res || [];
    }
    
    if (!Array.isArray(dogs) || dogs.length === 0) {
      console.warn("⚠️ No dogs found in the parsed response:", dogs);
      container.innerHTML = '<div class="admin-empty-state col-span-full">No dogs in inventory.</div>';
      return;
    }

    const fixImg = (path) => {
      if (!path) return '/assets/default-dog.jpg';
      if (path.startsWith('http') || path.startsWith('/')) return path;
      return '../' + path;
    };

    console.log(`✅ Rendering ${dogs.length} dogs in Admin Panel.`);
    container.innerHTML = dogs.map(dog => {
      const img = fixImg(dog.image || dog.imageUrl);
      const imagePosition = dog.imagePosition || 'center';
      const st = (dog.availabilityStatus || 'Available').toLowerCase();
      const dogId = dog._id || dog.id;
      
      return `
      <div class="admin-dog-card group flex flex-col h-full">
        <div class="admin-dog-image">
          <img src="${img}" alt="${dog.name}" style="object-position:${imagePosition}" class="transition-opacity duration-300" 
               onerror="this.src='/assets/default-dog.jpg'"/>
          <div class="absolute top-3 right-3 flex gap-2 z-20">
            <button onclick="editDog('${dogId}')" class="w-9 h-9 rounded-xl bg-white/95 backdrop-blur shadow-sm flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all transform hover:scale-110">✏️</button>
            <button onclick="confirmDeleteDog('${dogId}', '${dog.name}')" class="w-9 h-9 rounded-xl bg-white/95 backdrop-blur shadow-sm flex items-center justify-center hover:bg-red-500 hover:text-white transition-all transform hover:scale-110">🗑️</button>
          </div>
          <div class="absolute bottom-3 left-3 z-10">
             <span class="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-wider text-stone-700 shadow-sm">
               ${dog.availabilityStatus || 'Available'}
             </span>
          </div>
        </div>
        <div class="p-5 flex flex-col flex-1">
          <div class="flex justify-between items-start mb-2">
            <div class="flex-1">
              <h4 class="font-black text-stone-800 text-lg">${dog.name}</h4>
              <p class="text-stone-500 text-xs font-bold uppercase tracking-widest">${dog.breed}</p>
            </div>
            <span class="text-orange-500 font-bold text-sm">${Utils.formatAdoptionFee(dog.adoptionFee)}</span>
          </div>
          <p class="text-stone-500 text-sm line-clamp-2 mb-4">${dog.description || 'No description available.'}</p>
          
          <div class="mt-auto pt-4 border-t border-stone-50 flex items-center justify-between">
            <span class="text-[10px] font-bold text-stone-400 uppercase tracking-tighter flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              ${dog.location}
            </span>
            <span class="text-[10px] font-black ${dog.type === 'street' || dog.type === 'rescue' ? 'text-orange-500' : 'text-stone-400'} uppercase tracking-widest">
              ${dog.type || 'pet'}
            </span>
          </div>
        </div>
      </div>`;
    }).join('');
  } catch (err) {
    console.error('❌ Dogs load error:', err);
    const container = document.getElementById('dogs-grid');
    if (container) {
      container.innerHTML = `<div class="admin-empty-state col-span-full text-red-500">Error loading dogs: ${err.message}</div>`;
    }
  }
}


function toggleDogModal() {
  const modal = document.getElementById('dog-modal');
  const shouldOpen = modal.classList.contains('hidden');
  modal.classList.toggle('hidden', !shouldOpen);
  modal.classList.toggle('flex', shouldOpen);
  if (!shouldOpen) {
    document.getElementById('dog-form').reset();
    document.getElementById('edit-id').value = '';
    document.getElementById('modal-title').textContent = 'Add New Dog 🐾';
    document.getElementById('rescue-fields').classList.add('hidden');
  }
}

function toggleRescueFields() {
  const type = document.getElementById('d-type').value;
  const rescueFields = document.getElementById('rescue-fields');
  if (type === 'street' || type === 'rescue') {
    rescueFields.classList.remove('hidden');
  } else {
    rescueFields.classList.add('hidden');
  }
}

async function handleDogSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('edit-id').value;
  const btn = document.getElementById('dog-submit-btn');

  const tagsRaw = document.getElementById('d-tags').value;
  const personalityTags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()) : [];

  const payload = {
    name: document.getElementById('d-name').value,
    breed: document.getElementById('d-breed').value,
    age: document.getElementById('d-age').value,
    gender: document.getElementById('d-gender').value,
    size: document.getElementById('d-size').value,
    location: document.getElementById('d-location').value,
    adoptionFee: document.getElementById('d-adoptionFee').value,
    vaccinationStatus: document.getElementById('d-vaccinationStatus').value,
    urgencyLabel: document.getElementById('d-urgencyLabel').value,
    availabilityStatus: document.getElementById('d-availabilityStatus').value,
    type: document.getElementById('d-type').value,
    rescueLocation: document.getElementById('d-rescueLocation').value,
    healthStatus: document.getElementById('d-healthStatus').value,
    rescueStory: document.getElementById('d-rescueStory').value,
    videoUrl: document.getElementById('d-videoUrl').value,
    image: document.getElementById('d-image').value,
    imagePosition: document.getElementById('d-imagePosition').value || 'center',
    personalityTags: personalityTags,
    description: document.getElementById('d-desc').value
  };

  try {
    btn.disabled = true;
    btn.textContent = 'Saving...';

    let res;
    if (id) {
      res = await API.updateDog(id, payload);
      Utils.showToast('Pet profile updated successfully! ✨', 'success');
    } else {
      res = await API.addDog(payload);
      Utils.showToast('New pet successfully added to inventory! 🐶', 'success');
    }

    if (res.success || res._id || res.name) {
      toggleDogModal();
      loadDogs();
      loadStats();
    }
  } catch (err) {
    Utils.showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Save Pet Profile ✨';
  }
}

async function editDog(id) {
  try {
    const res = await API.fetchDog(id);
    const dog = res.data || res;
    
    document.getElementById('edit-id').value = dog._id;
    document.getElementById('d-name').value = dog.name || '';
    document.getElementById('d-breed').value = dog.breed || '';
    document.getElementById('d-age').value = dog.age || '';
    if (dog.gender) document.getElementById('d-gender').value = dog.gender;
    if (dog.size) document.getElementById('d-size').value = dog.size;
    document.getElementById('d-location').value = dog.location || '';
    document.getElementById('d-adoptionFee').value = dog.adoptionFee || '';
    if (dog.vaccinationStatus) document.getElementById('d-vaccinationStatus').value = dog.vaccinationStatus;
    document.getElementById('d-urgencyLabel').value = dog.urgencyLabel || '';
    if (dog.availabilityStatus) document.getElementById('d-availabilityStatus').value = dog.availabilityStatus;
    if (dog.type) {
      document.getElementById('d-type').value = dog.type;
      toggleRescueFields();
    }
    document.getElementById('d-rescueLocation').value = dog.rescueLocation || '';
    document.getElementById('d-healthStatus').value = dog.healthStatus || '';
    document.getElementById('d-rescueStory').value = dog.rescueStory || '';
    document.getElementById('d-videoUrl').value = dog.videoUrl || '';
    document.getElementById('d-image').value = dog.image || '';
    document.getElementById('d-imagePosition').value = dog.imagePosition || 'center';
    document.getElementById('d-tags').value = (dog.personalityTags || dog.tags || []).join(', ');
    document.getElementById('d-desc').value = dog.description || '';

    document.getElementById('modal-title').textContent = 'Edit Pet Profile 🐾';
    
    const modal = document.getElementById('dog-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  } catch (err) {
    Utils.showToast('Failed to fetch dog details', 'error');
  }
}

async function confirmDeleteDog(id, name) {
  if (confirm(`Are you sure you want to delete ${name} from the inventory? This action cannot be undone.`)) {
    try {
      const res = await API.deleteDog(id);
      if (res.success || res.message === 'Deleted') {
        Utils.showToast(`${name} has been removed.`, 'success');
        loadDogs();
        loadStats();
      }
    } catch (err) {
      Utils.showToast(err.message, 'error');
    }
  }
}


// ── Contacts Management ──────────────────────────────────────
async function loadContacts() {
  try {
    const res = await API.fetchAdminContacts();
    if (res.success) {
      window.contactsData = res.data || [];
      renderContactsTable(window.contactsData);
    }
  } catch (err) {
    console.error('Contacts load error:', err);
    const container = document.getElementById('contacts-table-body');
    if (container) {
      container.innerHTML = '<tr><td colspan="7" class="admin-empty-cell py-10 text-red-500">Failed to load contact messages.</td></tr>';
    }
  }
}

function renderContactsTable(contacts) {
  const container = document.getElementById('contacts-table-body');
  if (!container) return;

  if (!contacts.length) {
    container.innerHTML = '<tr><td colspan="7" class="admin-empty-cell py-10">No contact messages yet.</td></tr>';
    return;
  }

  container.innerHTML = contacts.map(contact => {
    const date = new Date(contact.createdAt || Date.now()).toLocaleDateString();
    const shortMessage = (contact.message || '').length > 80 ? `${contact.message.slice(0, 80)}...` : (contact.message || '-');
    const safeName = (contact.name || 'this contact').replace(/'/g, "\\'");
    return `
    <tr class="hover:bg-orange-50/50 transition-colors border-b border-stone-50 last:border-0">
      <td class="py-4 px-4 font-bold text-stone-800">${contact.name || '-'}</td>
      <td class="py-4 px-4 text-stone-500">${contact.email || '-'}</td>
      <td class="py-4 px-4 text-stone-500">${contact.phone || '-'}</td>
      <td class="py-4 px-4">
        <span class="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-orange-100 text-orange-600">
          ${contact.subject || 'General Inquiry'}
        </span>
      </td>
      <td class="py-4 px-4 text-stone-500 max-w-xs truncate">${shortMessage}</td>
      <td class="py-4 px-4 text-stone-400 text-sm">${date}</td>
      <td class="py-4 px-4 text-right whitespace-nowrap">
        <button onclick="openContactModal('${contact._id}')" class="admin-btn bg-stone-100 text-stone-600 hover:bg-stone-200 mr-2">View</button>
        <button onclick="confirmDeleteContact('${contact._id}', '${safeName}')" class="admin-btn admin-btn-danger">Delete</button>
      </td>
    </tr>
  `;
  }).join('');
}

function openContactModal(id) {
  const contact = (window.contactsData || []).find(c => c._id === id);
  if (!contact) return;

  const modal = document.getElementById("viewModal");
  const modalBox = document.getElementById("viewModalBox");
  const content = document.getElementById("modalContent");
  const title = modal.querySelector("h2");
  if (title) title.textContent = "Contact Details";
  const date = new Date(contact.createdAt || Date.now()).toLocaleString();
  const safeName = (contact.name || 'this contact').replace(/'/g, "\\'");

  content.innerHTML = `
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-6">
      <p class="text-xs text-stone-400 font-bold uppercase tracking-widest mb-1">Contact Message</p>
      <h3 class="text-2xl font-extrabold text-stone-800 mb-2">${contact.subject || 'General Inquiry'}</h3>
      <p class="text-sm text-stone-500">Submitted: ${date}</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
        <h4 class="text-[11px] text-stone-400 font-bold uppercase tracking-widest mb-4 border-b border-stone-50 pb-2">Sender</h4>
        <div class="space-y-3">
          <p class="text-sm flex"><strong class="w-20 shrink-0 text-stone-500">Name:</strong><span class="text-stone-800 font-medium">${contact.name || '-'}</span></p>
          <p class="text-sm flex"><strong class="w-20 shrink-0 text-stone-500">Email:</strong><span class="text-stone-800 font-medium">${contact.email || '-'}</span></p>
          <p class="text-sm flex"><strong class="w-20 shrink-0 text-stone-500">Phone:</strong><span class="text-stone-800 font-medium">${contact.phone || '-'}</span></p>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
        <h4 class="text-[11px] text-stone-400 font-bold uppercase tracking-widest mb-4 border-b border-stone-50 pb-2">Subject</h4>
        <p class="text-sm text-stone-700 bg-orange-50/50 p-4 rounded-xl border border-orange-100">${contact.subject || 'General Inquiry'}</p>
      </div>
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 md:col-span-2">
        <h4 class="text-[11px] text-stone-400 font-bold uppercase tracking-widest mb-4 border-b border-stone-50 pb-2">Message</h4>
        <p class="text-sm text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-100 leading-relaxed whitespace-pre-wrap">${contact.message || '-'}</p>
      </div>
    </div>
    <div class="mt-6 flex justify-end gap-3 bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
      <button onclick="closeModal()" class="admin-btn bg-stone-100 text-stone-600 hover:bg-stone-200">Close</button>
      <button onclick="confirmDeleteContact('${id}', '${safeName}'); closeModal();" class="admin-btn admin-btn-danger">Delete</button>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  setTimeout(() => {
    modal.classList.remove("opacity-0");
    modalBox.classList.remove("scale-95");
    modalBox.classList.add("scale-100");
  }, 10);
}

async function confirmDeleteContact(id, name) {
  if (!confirm(`Delete contact message from ${name}?`)) return;

  try {
    await API.deleteContact(id);
    Utils.showToast('Contact message deleted', 'success');
    await loadContacts();
  } catch (err) {
    Utils.showToast(err.message || 'Failed to delete contact message', 'error');
  }
}

function adminLogout() {
  ['token', 'authToken', 'user', 'userInfo', 'ht_token', 'ht_user'].forEach(key => {
    localStorage.removeItem(key);
  });
  window.location.href = '../admin-login.html';
}

function openProfileModal() {
  const modal = document.getElementById('profileModal');
  const modalBox = document.getElementById('profileModalBox');
  if (!modal || !modalBox) return;

  const user = API.getUser() || {};
  const name = user.name || 'Admin Hub';
  const email = user.email || 'admin@happytails.com';
  const role = user.role || 'admin';

  document.getElementById('p-name').value = name;
  document.getElementById('p-email').value = email;
  document.getElementById('p-password').value = '';
  document.getElementById('profile-display-name').textContent = name;
  document.getElementById('profile-display-email').textContent = email;
  document.getElementById('profile-info-name').textContent = name;
  document.getElementById('profile-info-email').textContent = email;
  document.getElementById('profile-info-role').textContent = role.charAt(0).toUpperCase() + role.slice(1);

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  setTimeout(() => {
    modal.classList.remove('opacity-0');
    modalBox.classList.remove('scale-95');
    modalBox.classList.add('scale-100');
  }, 10);
}

function closeProfileModal() {
  const modal = document.getElementById('profileModal');
  const modalBox = document.getElementById('profileModalBox');
  if (!modal || !modalBox) return;

  modal.classList.add('opacity-0');
  modalBox.classList.remove('scale-100');
  modalBox.classList.add('scale-95');

  setTimeout(() => {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
  }, 300);
}

function handleProfileSubmit(event) {
  event.preventDefault();

  const existing = API.getUser() || {};
  const updated = {
    ...existing,
    name: document.getElementById('p-name').value.trim(),
    email: document.getElementById('p-email').value.trim(),
    role: existing.role || 'admin'
  };

  localStorage.setItem('user', JSON.stringify(updated));
  localStorage.setItem('userInfo', JSON.stringify(updated));
  localStorage.setItem('ht_user', JSON.stringify(updated));
  const adminName = document.getElementById('admin-name');
  if (adminName) adminName.textContent = updated.name || 'Admin';
  Utils.showToast('Profile updated locally', 'success');
  closeProfileModal();
}

// ── View Application Modal ──────────────────────────────────
// ── View Application Modal ──────────────────────────────────
function openModal(id) {
  const app = window.adoptionsData.find(a => a._id === id);
  if (!app) return;

  const modal = document.getElementById("viewModal");
  const modalBox = document.getElementById("viewModalBox");
  const content = document.getElementById("modalContent");
  const title = modal.querySelector("h2");
  if (title) title.textContent = "Application Details";

  // Safe extraction supporting old direct fields and new nested formData fields
  const firstName = app.firstName || app.personalInfo?.firstName || app.formData?.personalInfo?.firstName || "Not Provided";
  const lastName = app.lastName || app.personalInfo?.lastName || app.formData?.personalInfo?.lastName || "Not Provided";
  const fullName = `${firstName} ${lastName}`.trim() || "Not Provided";
  
  const email = app.email || app.userId?.email || app.personalInfo?.email || app.formData?.personalInfo?.email || "Not Provided";
  const phone = app.phoneNumber || app.phone || app.personalInfo?.phoneNumber || app.formData?.personalInfo?.phoneNumber || app.userId?.phone || "Not Provided";
  const address = app.homeAddress || app.address || app.personalInfo?.homeAddress || app.formData?.personalInfo?.homeAddress || app.userId?.address || "Not Provided";
  const city = app.city || app.personalInfo?.city || app.formData?.personalInfo?.city || "Not Provided";
  const zipCode = app.zipCode || app.zip || app.personalInfo?.zipCode || app.formData?.personalInfo?.zipCode || "Not Provided";

  const homeType = app.homeType || app.homeAndLiving?.homeType || app.formData?.homeAndLiving?.homeType || "Not Provided";
  const ownOrRent = app.ownOrRent || app.ownRent || app.homeAndLiving?.ownOrRent || app.formData?.homeAndLiving?.ownOrRent || "Not Provided";
  const adultsInHome = app.adultsInHome || app.adults || app.homeAndLiving?.adultsInHome || app.formData?.homeAndLiving?.adultsInHome || "Not Provided";
  const childrenInHome = app.childrenInHome || app.children || app.homeAndLiving?.childrenInHome || app.formData?.homeAndLiving?.childrenInHome || "Not Provided";
  
  let currentPetsRaw = app.currentPets || app.otherPets || app.homeAndLiving?.currentPets || app.formData?.homeAndLiving?.currentPets || [];
  if (typeof currentPetsRaw === 'object' && !Array.isArray(currentPetsRaw)) {
    // Checkbox object fallback
    currentPetsRaw = Object.keys(currentPetsRaw).filter(k => currentPetsRaw[k]);
  }
  const currentPets = Array.isArray(currentPetsRaw) && currentPetsRaw.length > 0 ? currentPetsRaw.join(', ') : (typeof currentPetsRaw === 'string' ? currentPetsRaw : "Not Provided");

  const dogExp = app.dogExperience || app.experience || app.lifestyle?.dogExperience || app.formData?.lifestyle?.dogExperience || "Not Provided";
  const activityLevel = app.activityLevel || app.lifestyle?.activityLevel || app.formData?.lifestyle?.activityLevel || "Not Provided";
  const hoursAlone = app.hoursDogWouldBeAlone || app.hoursAlone || app.lifestyle?.hoursDogWouldBeAlone || app.formData?.lifestyle?.hoursDogWouldBeAlone || "Not Provided";
  const whyAdopt = app.whyDoYouWantToAdoptThisDog || app.reasonToAdopt || app.lifestyle?.whyDoYouWantToAdoptThisDog || app.formData?.lifestyle?.whyDoYouWantToAdoptThisDog || app.message || "Not Provided";
  const additionalNotes = app.additionalNotes || app.notes || app.lifestyle?.additionalNotes || app.formData?.lifestyle?.additionalNotes || "Not Provided";

  const dogName = app.dogId?.name || app.dogName || "Not Provided";
  const dogImageRaw = app.dogId?.image || app.dogId?.imageUrl || app.dogImage;
  const dogImage = (dogImageRaw && (dogImageRaw.startsWith('http') || dogImageRaw.startsWith('/'))) ? dogImageRaw : (dogImageRaw ? '../' + dogImageRaw : '');
  const submitDate = new Date(app.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const status = (app.status || "pending").toLowerCase();
  const statusHtml = `<span class="status-badge status-${status}">${status}</span>`;

  content.innerHTML = `
    <!-- Summary Section -->
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-6 flex items-center gap-6">
      <div class="w-24 h-24 rounded-xl overflow-hidden shrink-0 shadow-inner bg-stone-100 relative ${dogImage ? '' : 'image-thumb-missing'}">
        ${dogImage ? `<img src="${dogImage}" alt="${dogName}" class="w-full h-full object-cover" onerror="this.closest('div').classList.add('image-thumb-missing'); this.remove();">` : ''}
      </div>
      <div class="flex-1">
        <p class="text-xs text-stone-400 font-bold uppercase tracking-widest mb-1">Adoption Application</p>
        <h3 class="text-2xl font-extrabold text-stone-800 mb-2">${dogName} <span class="text-stone-400 font-medium text-lg mx-2">for</span> ${fullName}</h3>
        <div class="flex items-center gap-4 text-sm">
          ${statusHtml}
          <span class="text-stone-500">Submitted: ${submitDate}</span>
        </div>
      </div>
    </div>

    <!-- Details Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Personal Info -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
        <h4 class="flex items-center gap-2 text-[11px] text-stone-400 font-bold uppercase tracking-widest mb-4 border-b border-stone-50 pb-2">
          <span>👤</span> Personal Information
        </h4>
        <div class="space-y-3">
          <p class="text-sm flex"><strong class="w-24 shrink-0 text-stone-500">First Name:</strong> <span class="text-stone-800 font-medium">${firstName}</span></p>
          <p class="text-sm flex"><strong class="w-24 shrink-0 text-stone-500">Last Name:</strong> <span class="text-stone-800 font-medium">${lastName}</span></p>
          <p class="text-sm flex"><strong class="w-24 shrink-0 text-stone-500">Email:</strong> <span class="text-stone-800 font-medium">${email}</span></p>
          <p class="text-sm flex"><strong class="w-24 shrink-0 text-stone-500">Phone:</strong> <span class="text-stone-800 font-medium">${phone}</span></p>
          <p class="text-sm flex"><strong class="w-24 shrink-0 text-stone-500">Address:</strong> <span class="text-stone-800 font-medium">${address}</span></p>
          <p class="text-sm flex"><strong class="w-24 shrink-0 text-stone-500">City:</strong> <span class="text-stone-800 font-medium">${city}</span></p>
          <p class="text-sm flex"><strong class="w-24 shrink-0 text-stone-500">ZIP Code:</strong> <span class="text-stone-800 font-medium">${zipCode}</span></p>
        </div>
      </div>

      <!-- Home & Living -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
        <h4 class="flex items-center gap-2 text-[11px] text-stone-400 font-bold uppercase tracking-widest mb-4 border-b border-stone-50 pb-2">
          <span>🏠</span> Home & Living Situation
        </h4>
        <div class="space-y-3">
          <p class="text-sm flex"><strong class="w-32 shrink-0 text-stone-500">Home Type:</strong> <span class="text-stone-800 font-medium">${homeType}</span></p>
          <p class="text-sm flex"><strong class="w-32 shrink-0 text-stone-500">Own or Rent:</strong> <span class="text-stone-800 font-medium">${ownOrRent}</span></p>
          <p class="text-sm flex"><strong class="w-32 shrink-0 text-stone-500">Adults in Home:</strong> <span class="text-stone-800 font-medium">${adultsInHome}</span></p>
          <p class="text-sm flex"><strong class="w-32 shrink-0 text-stone-500">Children:</strong> <span class="text-stone-800 font-medium">${childrenInHome}</span></p>
          <p class="text-sm flex"><strong class="w-32 shrink-0 text-stone-500">Current Pets:</strong> <span class="text-stone-800 font-medium">${currentPets}</span></p>
        </div>
      </div>

      <!-- Lifestyle & Experience -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 lg:col-span-2">
        <h4 class="flex items-center gap-2 text-[11px] text-stone-400 font-bold uppercase tracking-widest mb-4 border-b border-stone-50 pb-2">
          <span>🏃</span> Lifestyle & Experience
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <p class="text-sm flex flex-col"><strong class="text-stone-500 mb-1">Dog Experience:</strong> <span class="text-stone-800 font-medium bg-stone-50 p-3 rounded-xl border border-stone-100">${dogExp}</span></p>
          <p class="text-sm flex flex-col"><strong class="text-stone-500 mb-1">Activity Level:</strong> <span class="text-stone-800 font-medium bg-stone-50 p-3 rounded-xl border border-stone-100">${activityLevel}</span></p>
          <p class="text-sm flex flex-col md:col-span-2"><strong class="text-stone-500 mb-1">Hours dog would be alone:</strong> <span class="text-stone-800 font-medium bg-stone-50 p-3 rounded-xl border border-stone-100">${hoursAlone}</span></p>
        </div>
        
        <div class="space-y-4">
          <div>
            <strong class="block text-sm text-stone-500 mb-2">Why do you want to adopt this dog?</strong>
            <p class="text-sm text-stone-700 bg-orange-50/50 p-4 rounded-xl border border-orange-100 leading-relaxed">${whyAdopt}</p>
          </div>
          <div>
            <strong class="block text-sm text-stone-500 mb-2">Additional Notes:</strong>
            <p class="text-sm text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-100 leading-relaxed">${additionalNotes}</p>
          </div>
        </div>
      </div>
      
    </div>
    
    <!-- Admin Actions -->
    <div class="mt-6 flex justify-end gap-3 bg-white p-4 rounded-2xl shadow-sm border border-stone-100 sticky bottom-0">
      <button onclick="closeModal()" class="admin-btn bg-stone-100 text-stone-600 hover:bg-stone-200">Close</button>
      ${status !== 'rejected' ? `<button onclick="updateStatus('${id}', 'rejected', this); closeModal();" class="admin-btn bg-red-500 text-white hover:bg-red-600 flex items-center gap-2"><span>❌</span> Reject</button>` : ''}
      ${status !== 'approved' ? `<button onclick="updateStatus('${id}', 'approved', this); closeModal();" class="admin-btn bg-green-500 text-white hover:bg-green-600 flex items-center gap-2"><span>✅</span> Approve</button>` : ''}
      ${status === 'rejected' ? `<button onclick="deleteApplication('${id}', true)" class="admin-btn bg-red-500 text-white hover:bg-red-600 flex items-center gap-2"><span>🗑️</span> Delete</button>` : ''}
    </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");

  // Trigger animation after slightly delaying
  setTimeout(() => {
    modal.classList.remove("opacity-0");
    modalBox.classList.remove("scale-95");
    modalBox.classList.add("scale-100");
  }, 10);
}

function closeModal() {
  const modal = document.getElementById("viewModal");
  const modalBox = document.getElementById("viewModalBox");

  modal.classList.add("opacity-0");
  modalBox.classList.remove("scale-100");
  modalBox.classList.add("scale-95");

  setTimeout(() => {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
  }, 300); // Wait for transition
}

// ── Dropdown & Logo Interactions ────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Logo Click
  const adminLogo = document.getElementById("adminLogo");
  if (adminLogo) {
    adminLogo.onclick = () => {
      window.location.href = "/admin/dashboard.html";
    };
  }

  // Profile Dropdown Toggle
  const profileContainer = document.getElementById("profileDropdownContainer");
  const profileDropdown = document.getElementById("profileDropdown");
  const profileAvatar = document.getElementById("profileAvatar");

  if (profileContainer && profileDropdown && profileAvatar) {
    profileAvatar.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = profileDropdown.classList.contains("opacity-100");
      if (isVisible) {
        profileDropdown.classList.remove("opacity-100", "visible", "scale-100");
        profileDropdown.classList.add("opacity-0", "invisible", "scale-95");
      } else {
        profileDropdown.classList.remove("opacity-0", "invisible", "scale-95");
        profileDropdown.classList.add("opacity-100", "visible", "scale-100");
      }
    });

    document.addEventListener('click', (e) => {
      if (!profileContainer.contains(e.target)) {
        profileDropdown.classList.remove("opacity-100", "visible", "scale-100");
        profileDropdown.classList.add("opacity-0", "invisible", "scale-95");
      }
    });
  }
});
