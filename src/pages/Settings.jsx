import { useState } from 'react'
import { useEco } from '../context/EcoContext'
import { Toggle, Pill } from '../components/UI'

export default function Settings() {
  const { departments, setDepartments, categories, setCategories, employees, setEmployees, settings, setSettings, emailLog } = useEco()
  const [tab, setTab] = useState('departments')
  const [newDept, setNewDept] = useState({ name: '', code: '', head: '', employeeCount: '', status: 'Active' })
  const [newCat, setNewCat] = useState({ name: '', type: 'CSR Activity', status: 'Active' })
  const [newEmp, setNewEmp] = useState({ name: '', departmentId: '', gender: 'Male', xp: 0, points: 0 })

  const addDept = (e) => {
    e.preventDefault()
    if (!newDept.name) return
    setDepartments((prev) => [...prev, { id: `d${Date.now()}`, parentId: null, ...newDept, employeeCount: Number(newDept.employeeCount) || 0 }])
    setNewDept({ name: '', code: '', head: '', employeeCount: '', status: 'Active' })
  }

  const addEmp = (e) => {
    e.preventDefault()
    if (!newEmp.name || !newEmp.departmentId) return
    setEmployees((prev) => [...prev, { id: `e${Date.now()}`, ...newEmp, xp: Number(newEmp.xp), points: Number(newEmp.points) }])
    setNewEmp({ name: '', departmentId: '', gender: 'Male', xp: 0, points: 0 })
  }

  const addCat = (e) => {
    e.preventDefault()
    if (!newCat.name) return
    setCategories((prev) => [...prev, { id: `c${Date.now()}`, ...newCat }])
    setNewCat({ name: '', type: 'CSR Activity', status: 'Active' })
  }

  const setWeight = (key, value) => {
    setSettings((s) => ({ ...s, weights: { ...s.weights, [key]: Number(value) } }))
  }

  const weightSum = settings.weights.environmental + settings.weights.social + settings.weights.governance

  // Gap 2 — Reset to Demo Data
  const resetToDemo = () => {
    if (!window.confirm('This will clear ALL saved data and reload the app with demo data. Continue?')) return
    Object.keys(localStorage)
      .filter((k) => k.startsWith('eco_'))
      .forEach((k) => localStorage.removeItem(k))
    window.location.reload()
  }

  const TABS = ['departments', 'employees', 'categories', 'esg', 'notifications', 'emaillog', 'toggles']
  const TAB_LABELS = {
    departments: 'Departments',
    employees: 'Employees',
    categories: 'Categories',
    esg: 'ESG Configuration',
    notifications: 'Notification Settings',
    emaillog: 'Email Log',
    toggles: 'Feature Toggles',
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="page-eyebrow">Administration</span>
          <h1 className="page-title">Settings</h1>
          <p className="page-desc">Master data management, ESG configuration, notifications and feature toggles.</p>
        </div>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {tab === 'departments' && (
        <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', alignItems: 'start' }}>
          <div className="card">
            <table>
              <thead><tr><th>Name</th><th>Code</th><th>Head</th><th>Employees</th><th>Status</th></tr></thead>
              <tbody>
                {departments.map((d) => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 500 }}>{d.name}</td>
                    <td>{d.code}</td>
                    <td>{d.head}</td>
                    <td>{d.employeeCount}</td>
                    <td><Pill tone="green">{d.status}</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card">
            <div className="section-title">Add Department</div>
            <form onSubmit={addDept}>
              <div className="form-row"><label>Name</label><input value={newDept.name} onChange={(e) => setNewDept({ ...newDept, name: e.target.value })} /></div>
              <div className="form-row"><label>Code</label><input value={newDept.code} onChange={(e) => setNewDept({ ...newDept, code: e.target.value })} /></div>
              <div className="form-row"><label>Head</label><input value={newDept.head} onChange={(e) => setNewDept({ ...newDept, head: e.target.value })} /></div>
              <div className="form-row"><label>Employee Count</label><input type="number" value={newDept.employeeCount} onChange={(e) => setNewDept({ ...newDept, employeeCount: e.target.value })} /></div>
              <button className="btn btn-primary" type="submit">Add Department</button>
            </form>
          </div>
        </div>
      )}

      {tab === 'employees' && (
        <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', alignItems: 'start' }}>
          <div className="card">
            <table>
              <thead><tr><th>Name</th><th>Department</th><th>Gender</th><th>XP</th><th>Points</th></tr></thead>
              <tbody>
                {employees.map((e) => (
                  <tr key={e.id}>
                    <td style={{ fontWeight: 500 }}>{e.name}</td>
                    <td>{departments.find(d => d.id === e.departmentId)?.name || 'N/A'}</td>
                    <td>{e.gender}</td>
                    <td>{e.xp}</td>
                    <td>{e.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card">
            <div className="section-title">Add Employee</div>
            <form onSubmit={addEmp}>
              <div className="form-row">
                <label>Name</label>
                <input value={newEmp.name} onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })} required />
              </div>
              <div className="form-row">
                <label>Department</label>
                <select value={newEmp.departmentId} onChange={(e) => setNewEmp({ ...newEmp, departmentId: e.target.value })} required>
                  <option value="">-- Select Department --</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label>Gender</label>
                <select value={newEmp.gender} onChange={(e) => setNewEmp({ ...newEmp, gender: e.target.value })}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div className="form-row">
                <label>XP</label>
                <input type="number" value={newEmp.xp} onChange={(e) => setNewEmp({ ...newEmp, xp: e.target.value })} />
              </div>
              <div className="form-row">
                <label>Points</label>
                <input type="number" value={newEmp.points} onChange={(e) => setNewEmp({ ...newEmp, points: e.target.value })} />
              </div>
              <button className="btn btn-primary" type="submit">Add Employee</button>
            </form>
          </div>
        </div>
      )}

      {tab === 'categories' && (
        <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', alignItems: 'start' }}>
          <div className="card">
            <table>
              <thead><tr><th>Name</th><th>Type</th><th>Status</th></tr></thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.name}</td>
                    <td><Pill tone={c.type === 'CSR Activity' ? 'blue' : 'amber'}>{c.type}</Pill></td>
                    <td><Pill tone="green">{c.status}</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card">
            <div className="section-title">Add Category</div>
            <form onSubmit={addCat}>
              <div className="form-row"><label>Name</label><input value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} /></div>
              <div className="form-row">
                <label>Type</label>
                <select value={newCat.type} onChange={(e) => setNewCat({ ...newCat, type: e.target.value })}>
                  <option>CSR Activity</option><option>Challenge</option>
                </select>
              </div>
              <button className="btn btn-primary" type="submit">Add Category</button>
            </form>
          </div>
        </div>
      )}

      {tab === 'esg' && (
        <div className="card" style={{ maxWidth: 460 }}>
          <div className="section-title">ESG Weight Configuration</div>
          {weightSum !== 100 && <div className="note-callout">Weights currently sum to {weightSum}%. They should total 100%.</div>}
          {['environmental', 'social', 'governance'].map((k) => (
            <div className="form-row" key={k}>
              <label style={{ textTransform: 'capitalize' }}>{k} weight (%)</label>
              <input type="number" value={settings.weights[k]} onChange={(e) => setWeight(k, e.target.value)} />
            </div>
          ))}
          <div style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>Default: Environmental 40 / Social 30 / Governance 30, per PDF Section 5.</div>
        </div>
      )}

      {tab === 'notifications' && (
        <div className="card" style={{ maxWidth: 520 }}>
          <div className="section-title">Notification Settings</div>
          <table>
            <thead><tr><th>Event</th><th>In-App</th><th>Email</th></tr></thead>
            <tbody>
              {Object.entries(settings.notifications).map(([key, val]) => (
                <tr key={key}>
                  <td style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</td>
                  <td><Toggle on={val.inApp} onChange={(v) => setSettings((s) => ({ ...s, notifications: { ...s.notifications, [key]: { ...s.notifications[key], inApp: v } } }))} /></td>
                  <td><Toggle on={val.email} onChange={(v) => setSettings((s) => ({ ...s, notifications: { ...s.notifications, [key]: { ...s.notifications[key], email: v } } }))} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Gap 6 — Email Log tab */}
      {tab === 'emaillog' && (
        <div className="card">
          <div className="section-title">Email Log</div>
          {emailLog.length === 0 ? (
            <div className="empty-state">No emails sent yet. Enable email toggles in Notification Settings and trigger events (e.g. approve a participation, create a compliance issue) to see entries here.</div>
          ) : (
            <table>
              <thead><tr><th>To</th><th>Subject</th><th>Timestamp</th></tr></thead>
              <tbody>
                {emailLog.map((entry, i) => (
                  <tr key={i}>
                    <td>{entry.to}</td>
                    <td style={{ maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.subject}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{new Date(entry.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'toggles' && (
        <div className="card" style={{ maxWidth: 460 }}>
          <div className="section-title">Feature Toggles</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 500 }}>Auto Emission Calculation</div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Auto-calculate Carbon Transactions from ERP operations.</div>
              </div>
              <Toggle on={settings.autoEmissionCalculation} onChange={(v) => setSettings((s) => ({ ...s, autoEmissionCalculation: v }))} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 500 }}>Evidence Required</div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>CSR participation cannot be approved without proof.</div>
              </div>
              <Toggle on={settings.evidenceRequired} onChange={(v) => setSettings((s) => ({ ...s, evidenceRequired: v }))} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 500 }}>Badge Auto-Award</div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Badges assigned automatically when unlock rules are met.</div>
              </div>
              <Toggle on={settings.badgeAutoAward} onChange={(v) => setSettings((s) => ({ ...s, badgeAutoAward: v }))} />
            </div>
          </div>

          {/* Gap 2 — Reset to Demo Data */}
          <div style={{ marginTop: 28, borderTop: '1px solid var(--line)', paddingTop: 20 }}>
            <div style={{ fontWeight: 500, marginBottom: 6 }}>Reset to Demo Data</div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 12 }}>
              Clears all saved data from this browser and restores the original seed data. This cannot be undone.
            </div>
            <button
              id="reset-demo-data-btn"
              className="btn btn-clay"
              onClick={resetToDemo}
            >
              Reset to Demo Data
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
