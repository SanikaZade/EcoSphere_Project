export function StatCard({ label, value, sub, accent }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={accent ? { color: accent } : undefined}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  )
}

export function Pill({ children, tone = 'gray' }) {
  return <span className={`badge-pill pill-${tone}`}>{children}</span>
}

export function statusTone(status) {
  const map = {
    Active: 'green', Approved: 'green', Completed: 'green', Published: 'green', Resolved: 'green',
    Pending: 'amber', 'Under Review': 'amber', Open: 'red', Upcoming: 'blue', Draft: 'gray',
    Scheduled: 'blue', Archived: 'gray',
  }
  return map[status] || 'gray'
}

export function Toggle({ on, onChange, label }) {
  return (
    <label className="toggle" onClick={() => onChange(!on)}>
      <div className={`toggle-track ${on ? 'on' : ''}`}><div className="toggle-thumb" /></div>
      {label && <span style={{ fontSize: 13 }}>{label}</span>}
    </label>
  )
}

export function ScoreRing({ value, size = 96, label, color = '#2f6b4f' }) {
  const stroke = 9
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (Math.min(100, Math.max(0, value)) / 100) * c
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#ece8dd" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x="50%" y="52%" textAnchor="middle" fontFamily="Fraunces, serif" fontSize={size * 0.26} fontWeight="600" fill="#1c2620">{value}</text>
      </svg>
      {label && <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#566056' }}>{label}</div>}
    </div>
  )
}

export function Bar({ pct, color = '#2f6b4f' }) {
  return <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: color }} /></div>
}
