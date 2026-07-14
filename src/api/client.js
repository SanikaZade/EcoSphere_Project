const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('eco_token')
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  if (res.status === 401) {
    localStorage.removeItem('eco_token')
    localStorage.removeItem('eco_user')
    // Avoid redirect loops if already on login
    if (!window.location.hash.includes('/login')) {
      window.location.href = '#/login'
    }
    return
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  get:    (path)         => apiFetch(path),
  post:   (path, body)   => apiFetch(path, { method: 'POST',   body }),
  patch:  (path, body)   => apiFetch(path, { method: 'PATCH',  body }),
  delete: (path)         => apiFetch(path, { method: 'DELETE' }),
}
