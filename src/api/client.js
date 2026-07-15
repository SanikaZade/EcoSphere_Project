const BASE = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:4000' 
    : window.location.origin)

// Retry helper — silently retries on network/server errors (handles cold-start on Render)
async function fetchWithRetry(url, fetchOptions, maxRetries = 3) {
  const delays = [1000, 2000, 3000]
  let lastErr
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, fetchOptions)
      return res  // always return the response, even error ones — let caller handle status
    } catch (err) {
      lastErr = err
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, delays[attempt] || 3000))
      }
    }
  }
  throw lastErr
}

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('eco_token')
  const fetchOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  }

  // Use retry only for auth/login to handle cold-start; other calls use single attempt
  const isLogin = path === '/api/auth/login'
  const res = isLogin
    ? await fetchWithRetry(`${BASE}${path}`, fetchOptions, 3)
    : await fetch(`${BASE}${path}`, fetchOptions)

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
