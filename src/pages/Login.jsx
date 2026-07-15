import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEco } from '../context/EcoContext'

export default function Login() {
  const { login } = useEco()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError('')
    try {
      const ok = await login(email.trim(), password)
      if (ok) {
        navigate('/', { replace: true })
      } else {
        setError('Invalid email or password. Please use the demo credentials below.')
      }
    } catch (err) {
      setError('Connection failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Pre-fill credentials on click
  const fillCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@ecosphere.com')
      setPassword('admin123')
    } else {
      setEmail('employee@ecosphere.com')
      setPassword('emp123')
    }
    setError('')
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bark)', fontFamily: 'var(--font-body)',
    }}>
      <div style={{
        background: 'var(--paper)', borderRadius: 16, padding: '48px 40px',
        width: '100%', maxWidth: 420, boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--bark)', letterSpacing: '-0.02em' }}>
            <span style={{ color: 'var(--moss)' }}>◈</span> EcoSphere
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink-soft)', marginTop: 4 }}>
            ESG Management Platform
          </div>
        </div>

        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--bark)', marginBottom: 24 }}>
          Sign in to your account
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Email Address</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              placeholder="you@ecosphere.com"
              autoComplete="email"
              autoFocus
              disabled={submitting}
            />
          </div>
          <div className="form-row">
            <label>Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={submitting}
            />
          </div>

          {error && (
            <div style={{
              background: '#f3dcd6', border: '1px solid #d9a59a', borderRadius: 7,
              padding: '9px 14px', fontSize: 13, color: 'var(--red)', marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          {/* Warm-up notice — shown while connecting (handles Render cold-start) */}
          {submitting && (
            <div style={{
              background: 'var(--paper-dim)', border: '1px solid var(--line)', borderRadius: 7,
              padding: '9px 14px', fontSize: 12.5, color: 'var(--ink-soft)', marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: 16 }}>⏳</span>
              <span>Connecting to server, please wait…</span>
            </div>
          )}

          <button id="login-submit" className="btn btn-primary" type="submit"
            style={{ width: '100%', padding: '10px 14px', fontSize: 14, marginTop: 4 }}
            disabled={submitting}>
            {submitting ? 'Signing In…' : 'Sign In'}
          </button>
        </form>

        {/* Quick-login buttons — click to auto-fill & sign in */}
        <div style={{ marginTop: 28, padding: '14px 16px', background: 'var(--paper-dim)', borderRadius: 8, fontSize: 12.5, color: 'var(--ink-soft)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, color: 'var(--ink-soft)' }}>
            Quick Access
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              id="quick-login-admin"
              type="button"
              onClick={() => fillCredentials('admin')}
              disabled={submitting}
              style={{
                flex: 1, padding: '7px 10px', fontSize: 12, border: '1px solid var(--moss)',
                background: 'transparent', color: 'var(--moss)', borderRadius: 6,
                cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500,
              }}>
              Admin Login
            </button>
            <button
              id="quick-login-employee"
              type="button"
              onClick={() => fillCredentials('employee')}
              disabled={submitting}
              style={{
                flex: 1, padding: '7px 10px', fontSize: 12, border: '1px solid var(--bark)',
                background: 'transparent', color: 'var(--bark)', borderRadius: 6,
                cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500,
              }}>
              Employee Login
            </button>
          </div>
          <div style={{ marginTop: 10, lineHeight: 1.6, color: 'var(--ink-soft)', fontSize: 12 }}>
            <div><strong style={{ color: 'var(--moss)' }}>Admin:</strong> admin@ecosphere.com / admin123</div>
            <div><strong style={{ color: 'var(--moss)' }}>Employee:</strong> employee@ecosphere.com / emp123</div>
          </div>
        </div>
      </div>
    </div>
  )
}
