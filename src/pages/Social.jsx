import { useState } from 'react'
import { useEco } from '../context/EcoContext'
import { nextId } from '../context/EcoContext'
import { Pill, statusTone, Toggle } from '../components/UI'

export default function Social() {
  const {
    csrActivities, setCsrActivities, categories, employeeParticipation, employees,
    approveParticipation, settings, setSettings, trainingCompletions, addTrainingCompletion,
  } = useEco()
  const [tab, setTab] = useState('activities')
  const [form, setForm] = useState({ employeeId: employees[0]?.id || '', trainingName: '', completedDate: '', hours: '' })

  // Gap 5a — Add CSR Activity form
  const csrCategories = categories.filter((c) => c.type === 'CSR Activity')
  const blankActivity = { title: '', categoryId: csrCategories[0]?.id || '', date: '', location: '', status: 'Upcoming' }
  const [newActivity, setNewActivity] = useState(blankActivity)
  const [showActivityForm, setShowActivityForm] = useState(false)

  const submitActivity = (e) => {
    e.preventDefault()
    if (!newActivity.title) return
    const categoryVal = newActivity.categoryId || csrCategories[0]?.id || ''
    setCsrActivities((prev) => [...prev, { id: nextId('a'), ...newActivity, categoryId: categoryVal }])
    setNewActivity(blankActivity)
    setShowActivityForm(false)
  }

  const empName = (id) => employees.find((e) => e.id === id)?.name || id
  const actTitle = (id) => csrActivities.find((a) => a.id === id)?.title || id
  const catName = (id) => categories.find((c) => c.id === id)?.name || id

  const genderCounts = employees.reduce((acc, e) => { acc[e.gender] = (acc[e.gender] || 0) + 1; return acc }, {})
  const deptDist = employees.reduce((acc, e) => { acc[e.departmentId] = (acc[e.departmentId] || 0) + 1; return acc }, {})

  const emptyState = (
    <div style={{
      textAlign: 'center',
      padding: '48px 24px',
      color: 'var(--ink-soft)',
      fontSize: 14
    }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
      <div style={{ fontWeight: 500, marginBottom: 6 }}>No data yet</div>
      <div style={{ fontSize: 12.5 }}>Add your first entry using the form.</div>
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="page-eyebrow">Module 2</span>
          <h1 className="page-title">Social</h1>
          <p className="page-desc">CSR activities, employee participation, diversity metrics and training.</p>
        </div>
        <Toggle on={settings.evidenceRequired} onChange={(v) => setSettings((s) => ({ ...s, evidenceRequired: v }))} label="Evidence Required" />
      </div>

      <div className="tabs">
        {['activities', 'participation', 'diversity', 'training'].map((t) => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {{ activities: 'CSR Activities', participation: 'Employee Participation', diversity: 'Diversity Metrics', training: 'Training Completion' }[t]}
          </button>
        ))}
      </div>

      {tab === 'activities' && (
        <div>
          {/* Gap 5a — Add CSR Activity button + form */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <button className="btn btn-primary" onClick={() => setShowActivityForm((v) => !v)}>
              {showActivityForm ? '✕ Cancel' : '+ New Activity'}
            </button>
          </div>

          {showActivityForm && (
            <div className="card" style={{ marginBottom: 18 }}>
              <div className="section-title">Add CSR Activity</div>
              <form onSubmit={submitActivity}>
                <div className="grid grid-3">
                  <div className="form-row">
                    <label>Title *</label>
                    <input value={newActivity.title} onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })} required />
                  </div>
                  <div className="form-row">
                    <label>Category</label>
                    <select value={newActivity.categoryId} onChange={(e) => setNewActivity({ ...newActivity, categoryId: e.target.value })}>
                      <option value="" disabled={csrCategories.length > 0}>
                        {csrCategories.length === 0 ? '— Add entries in Settings first —' : '— Select —'}
                      </option>
                      {csrCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-row">
                    <label>Date</label>
                    <input type="date" value={newActivity.date} onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })} />
                  </div>
                  <div className="form-row">
                    <label>Location</label>
                    <input value={newActivity.location} onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })} />
                  </div>
                  <div className="form-row">
                    <label>Status</label>
                    <select value={newActivity.status} onChange={(e) => setNewActivity({ ...newActivity, status: e.target.value })}>
                      <option>Upcoming</option><option>Completed</option>
                    </select>
                  </div>
                </div>
                <button className="btn btn-primary" type="submit">Add Activity</button>
              </form>
            </div>
          )}

          <div className="card">
            {csrActivities.length === 0 ? emptyState : (
              <table>
                <thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Location</th><th>Status</th></tr></thead>
                <tbody>
                  {csrActivities.map((a) => (
                    <tr key={a.id}>
                      <td style={{ fontWeight: 500 }}>{a.title}</td>
                      <td>{catName(a.categoryId)}</td>
                      <td>{a.date}</td>
                      <td>{a.location}</td>
                      <td><Pill tone={statusTone(a.status)}>{a.status}</Pill></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {tab === 'participation' && (
        <div className="card">
          {settings.evidenceRequired && <div className="note-callout">Evidence Required is ON — participation cannot be approved without an attached proof file.</div>}
          {employeeParticipation.length === 0 ? emptyState : (
            <table>
              <thead><tr><th>Employee</th><th>Activity</th><th>Proof</th><th>Points</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {employeeParticipation.map((p) => (
                  <tr key={p.id}>
                    <td>{empName(p.employeeId)}</td>
                    <td>{actTitle(p.activityId)}</td>
                    <td>{p.proof ? <Pill tone="blue">attached</Pill> : <Pill tone="gray">none</Pill>}</td>
                    <td>{p.pointsEarned}</td>
                    <td><Pill tone={statusTone(p.approvalStatus)}>{p.approvalStatus}</Pill></td>
                    <td>
                      {p.approvalStatus === 'Pending' && (
                        <button className="btn btn-primary btn-sm" onClick={() => approveParticipation(p.id)}>Approve</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'training' && (
        <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', alignItems: 'start' }}>
          <div className="card">
            {trainingCompletions.length === 0 ? emptyState : (
              <table>
                <thead><tr><th>Employee</th><th>Training</th><th>Completed</th><th>Hours</th></tr></thead>
                <tbody>
                  {trainingCompletions.map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 500 }}>{empName(t.employeeId)}</td>
                      <td>{t.trainingName}</td>
                      <td>{t.completedDate}</td>
                      <td>{t.hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="card">
            <div className="section-title">Log Training Session</div>
            <form onSubmit={(e) => {
              e.preventDefault()
              if (!form.trainingName || !form.completedDate) return
              const targetEmpId = form.employeeId || employees[0]?.id
              if (!targetEmpId) {
                alert('Please select an employee.')
                return
              }
              addTrainingCompletion({ ...form, employeeId: targetEmpId, hours: Number(form.hours) || 0 })
              setForm({ ...form, trainingName: '', completedDate: '', hours: '' })
            }}>
              <div className="form-row">
                <label>Employee</label>
                <select value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
                  <option value="" disabled={employees.length > 0}>
                    {employees.length === 0 ? '— Add entries in Settings first —' : '— Select —'}
                  </option>
                  {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
              <div className="form-row"><label>Training Name</label><input value={form.trainingName} onChange={(e) => setForm({ ...form, trainingName: e.target.value })} /></div>
              <div className="form-row"><label>Completed Date</label><input type="date" value={form.completedDate} onChange={(e) => setForm({ ...form, completedDate: e.target.value })} /></div>
              <div className="form-row"><label>Hours</label><input type="number" step="0.5" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} /></div>
              <button className="btn btn-primary" type="submit">Log Session</button>
            </form>
          </div>
        </div>
      )}

      {tab === 'diversity' && (
        <div className="grid grid-2">
          <div className="card">
            <div className="section-title">Gender Distribution</div>
            {Object.keys(genderCounts).length === 0 ? emptyState : (
              Object.entries(genderCounts).map(([g, count]) => (
                <div key={g} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--paper-dim)' }}>
                  <span>{g}</span><strong>{count}</strong>
                </div>
              ))
            )}
          </div>
          <div className="card">
            <div className="section-title">Department Headcount</div>
            {Object.keys(deptDist).length === 0 ? emptyState : (
              Object.entries(deptDist).map(([d, count]) => {
                const name = departments.find(dept => dept.id === d)?.name || d
                return (
                  <div key={d} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--paper-dim)' }}>
                    <span>{name}</span><strong>{count}</strong>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
