const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(chemin, options = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}${chemin}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  let data = null;
  try { data = await res.json(); } catch { /* pas de corps JSON */ }

  if (!res.ok) {
    const err = new Error((data && data.message) || 'Une erreur est survenue.');
    err.status = res.status;
    throw err;
  }
  return data;
}

const json = (body) => JSON.stringify(body);

export const authApi = {
  login: (payload) => request('/auth/login', { method: 'POST', body: json(payload) }),
};

export const faculteApi = {
  lister: () => request('/facultes'),
  obtenir: (id) => request(`/facultes/${id}`),
  coursDe: (id) => request(`/facultes/${id}/cours`),
  creer: (payload) => request('/facultes', { method: 'POST', body: json(payload) }),
  modifier: (id, payload) => request(`/facultes/${id}`, { method: 'PUT', body: json(payload) }),
  supprimer: (id) => request(`/facultes/${id}`, { method: 'DELETE' }),
};

const qs = (params = {}) => {
  const p = Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null);
  return p.length ? '?' + p.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&') : '';
};

export const coursApi = {
  lister: (params) => request(`/cours${qs(params)}`),
  obtenir: (id) => request(`/cours/${id}`),
  creer: (payload) => request('/cours', { method: 'POST', body: json(payload) }),
  modifier: (id, payload) => request(`/cours/${id}`, { method: 'PUT', body: json(payload) }),
  supprimer: (id) => request(`/cours/${id}`, { method: 'DELETE' }),
};

export { API_URL };
