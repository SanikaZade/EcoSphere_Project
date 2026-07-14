import { HashRouter, Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom'
import { EcoProvider, useEco } from './context/EcoContext'
import Dashboard from './pages/Dashboard'
import Environmental from './pages/Environmental'
import Social from './pages/Social'
import Governance from './pages/Governance'
import Gamification from './pages/Gamification'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import MasterData from './pages/MasterData'
import Login from './pages/Login'

const NAV = [
  { group: 'Overview', items: [{ to: '/', label: 'Dashboard', icon: '◆' }] },
  {
    group: 'Modules',
    items: [
      { to: '/environmental', label: 'Environmental', icon: '🌿' },
      { to: '/social', label: 'Social', icon: '🤝' },
      { to: '/governance', label: 'Governance', icon: '⚖️' },
      { to: '/gamification', label: 'Gamification', icon: '🏅' },
    ],
  },
  {
    group: 'Data & Reports',
    items: [
      { to: '/master-data', label: 'Master Data', icon: '🗂️' },
      { to: '/reports', label: 'Reports', icon: '📄' },
    ],
  },
  { group: 'Admin', items: [{ to: '/settings', label: 'Settings', icon: '⚙️' }] },
]

// Gap 1 — ProtectedRoute
function ProtectedRoute({ children }) {
  const { currentUser } = useEco()
  if (!currentUser) return <Navigate to="/login" replace />
  return children
}

function NotificationBell() {
  const { notifications } = useEco()
  const unread = notifications.filter((n) => !n.read).length
  return (
    <div style={{ position: 'relative', fontSize: 12, color: 'rgba(246,244,238,0.7)', marginTop: 6 }}>
      🔔 {notifications.length} notifications {unread > 0 && <span className="badge-pill pill-amber" style={{ marginLeft: 4 }}>{unread} new</span>}
    </div>
  )
}

// Gap 1 — Sidebar with user info + logout
function Sidebar() {
  const { currentUser, logout } = useEco()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="sidebar">
      <div className="brand"><span className="leaf">◈</span> EcoSphere</div>
      <div className="brand-sub">ESG Management Platform</div>
      {NAV.map((g) => (
        <div key={g.group}>
          <div className="nav-group-label">{g.group}</div>
          {g.items.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">{item.icon}</span> {item.label}
            </NavLink>
          ))}
        </div>
      ))}
      <div style={{ marginTop: 'auto', paddingTop: 24 }}>
        <NotificationBell />
        {/* User info + logout */}
        {currentUser && (
          <div style={{ marginTop: 16, borderTop: '1px solid rgba(246,244,238,0.12)', paddingTop: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--paper)' }}>{currentUser.name}</div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase',
              letterSpacing: '0.1em', color: 'rgba(246,244,238,0.5)', marginBottom: 10,
            }}>
              {currentUser.role}
            </div>
            <button
              id="logout-btn"
              onClick={handleLogout}
              style={{
                background: 'rgba(246,244,238,0.08)', border: '1px solid rgba(246,244,238,0.15)',
                color: 'rgba(246,244,238,0.8)', borderRadius: 7, padding: '6px 12px',
                fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)', width: '100%',
                transition: 'background 0.15s',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(246,244,238,0.14)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(246,244,238,0.08)'}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

export default function App() {
  return (
    <EcoProvider>
      <HashRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* All other routes are protected */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="app-shell">
                  <Sidebar />
                  <main className="main">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/environmental" element={<Environmental />} />
                      <Route path="/social" element={<Social />} />
                      <Route path="/governance" element={<Governance />} />
                      <Route path="/gamification" element={<Gamification />} />
                      <Route path="/master-data" element={<MasterData />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </HashRouter>
    </EcoProvider>
  )
}
