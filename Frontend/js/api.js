/**
 * Happy Tails – API Module
 * All backend communication via fetch API
 * Uses localhost for local development and Render for deployed pages.
 */

const API_BASE_URL =
  window.HAPPY_TAILS_API_BASE ||
  (window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === ''
    ? 'http://localhost:5000/api'
    : 'https://happy-tails-0opo.onrender.com/api');

const API_BASE = API_BASE_URL.replace(/\/$/, '');

// ── Helpers ──────────────────────────────────────────────
function getToken() {
  return localStorage.getItem('ht_token');
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('ht_user'));
  } catch {
    return null;
  }
}

function authHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || data.error || `HTTP ${res.status}`);
  }
  return data;
}

// ── Dogs ──────────────────────────────────────────────────
async function fetchDogs(params = {}) {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v))
  ).toString();
  const url = `${API_BASE}/dogs${query ? '?' + query : ''}`;
  console.log("Dogs API URL:", url);
  const res = await fetch(url, { headers: authHeaders() });
  const data = await handleResponse(res);
  const dogs = Array.isArray(data) ? data : (data.data || data.dogs || data.data?.dogs || data.data?.data || []);
  console.log("Dogs loaded:", dogs);
  return data;
}

async function fetchDog(id) {
  const res = await fetch(`${API_BASE}/dogs/${id}`, { headers: authHeaders() });
  return handleResponse(res);
}

async function addDog(dogData) {
  const res = await fetch(`${API_BASE}/dogs/admin`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(dogData)
  });
  return handleResponse(res);
}

async function updateDog(id, dogData) {
  const res = await fetch(`${API_BASE}/dogs/admin/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(dogData)
  });
  return handleResponse(res);
}

async function deleteDog(id) {
  const res = await fetch(`${API_BASE}/dogs/admin/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  return handleResponse(res);
}

// â”€â”€ Contacts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function submitContact(contactData) {
  const res = await fetch(`${API_BASE}/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactData)
  });
  return handleResponse(res);
}

async function fetchAdminContacts() {
  const res = await fetch(`${API_BASE}/contacts/admin`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

async function deleteContact(id) {
  const res = await fetch(`${API_BASE}/contacts/admin/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  return handleResponse(res);
}

// ── Auth ──────────────────────────────────────────────────
async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await handleResponse(res);
  if (data.token) {
    localStorage.setItem('ht_token', data.token);
    localStorage.setItem('ht_user', JSON.stringify(data.user || {}));
  }
  return data;
}

async function registerUser(payload) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await handleResponse(res);
  if (data.token) {
    localStorage.setItem('ht_token', data.token);
    localStorage.setItem('ht_user', JSON.stringify(data.user || {}));
  }
  return data;
}

function logoutUser() {
  localStorage.removeItem('ht_token');
  localStorage.removeItem('ht_user');
  window.location.href = 'index.html';
}

// ── Adoption ───────────────────────────────────────────────
async function submitAdoption(formData) {
  const res = await fetch(`${API_BASE}/adoption`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(formData)
  });
  return handleResponse(res);
}

// ── Admin ──────────────────────────────────────────────────
async function fetchAdminAdoptions() {
  const res = await fetch(`${API_BASE}/adoptions/admin`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

async function updateAdoptionStatus(id, status) {
  const res = await fetch(`${API_BASE}/adoptions/admin/${id}/status`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status })
  });
  return handleResponse(res);
}

async function deleteAdoption(id) {
  const res = await fetch(`${API_BASE}/adoptions/admin/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  return handleResponse(res);
}

async function fetchAdminStats() {
  const res = await fetch(`${API_BASE}/admin/stats`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

async function fetchAdminUsers() {
  const res = await fetch(`${API_BASE}/admin/users`, {
    headers: authHeaders()
  });
  return handleResponse(res);
}

// ── Export ─────────────────────────────────────────────────
window.API = {
  fetchDogs,
  fetchDog,
  addDog,
  updateDog,
  deleteDog,
  submitContact,
  fetchAdminContacts,
  deleteContact,
  loginUser,
  registerUser,
  logoutUser,
  getToken,
  getUser,
  submitAdoption,
  fetchAdminAdoptions,
  updateAdoptionStatus,
  deleteAdoption,
  fetchAdminStats,
  fetchAdminUsers
};

window.API_BASE_URL = API_BASE;
