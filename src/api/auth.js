import { api } from './client.js'
export const login    = (body) => api.post('/api/auth/login', body)
export const register = (body) => api.post('/api/auth/register', body)
