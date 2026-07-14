import { useState } from 'react'
import { useEco } from '../context/EcoContext'
import { Pill, statusTone } from '../components/UI'

export default function Governance() {
  const { policies, acknowledgements, employees, audits, complianceIssues, addComplianceIssue } = useEco()
  const [tab, setTab] = useState('policies')
  const [form, setForm] = useState({ auditId: audits[0]?.id || '', severity: 'Medium', description: '', owner: '', dueDate: '' })

  const ackCountFor = (policyId) => acknowledgements.filter((a) => a.policyId === policyId).length
  const auditTitle = (id) => audits.find((a) => a.id === id)?.title || id

  const submit = (e) => {
    e.preventDefault()
    if (!form.description) return
    const targetAuditId = form.auditId || audits[0]?.id
    if (!targetAuditId) {
      alert('Please select an audit.')
      return
    }
    const res = addComplianceIssue({ ...form, auditId: targetAuditId })
    if (res) setForm({ ...form, description: '', owner: '', dueDate: '' })
  }

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
          <span className="page-eyebrow">Module 3</span>
          <h1 className="page-title">Governance</h1>
          <p className="page-desc">Policies, acknowledgements, audits and compliance issue tracking.</p>
        </div>
      </div>

      <div className="tabs">
        {['policies', 'audits', 'issues', 'new'].map((t) => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {{ policies: 'Policies & Acknowledgements', audits: 'Audits', issues: 'Compliance Issues', new: 'Raise Issue' }[t]}
          </button>
        ))}
      </div>

      {tab === 'policies' && (
        <div className="card">
          {policies.length === 0 ? emptyState : (
            <table>
              <thead><tr><th>Policy</th><th>Published</th><th>Status</th><th>Acknowledged</th></tr></thead>
              <tbody>
                {policies.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500 }}>{p.title}</td>
                    <td>{p.publishedAt}</td>
                    <td><Pill tone={statusTone(p.status)}>{p.status}</Pill></td>
                    <td>{ackCountFor(p.id)} / {employees.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'audits' && (
        <div className="card">
          {audits.length === 0 ? emptyState : (
            <table>
              <thead><tr><th>Title</th><th>Scope</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {audits.map((a) => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 500 }}>{a.title}</td>
                    <td>{a.scope}</td>
                    <td>{a.date}</td>
                    <td><Pill tone={statusTone(a.status)}>{a.status}</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'issues' && (
        <div className="card">
          {complianceIssues.length === 0 ? emptyState : (
            <table>
              <thead><tr><th>Audit</th><th>Severity</th><th>Description</th><th>Owner</th><th>Due Date</th><th>Status</th></tr></thead>
              <tbody>
                {complianceIssues.map((ci) => (
                  <tr key={ci.id}>
                    <td>{auditTitle(ci.auditId)}</td>
                    <td><Pill tone={ci.severity === 'High' ? 'red' : ci.severity === 'Medium' ? 'amber' : 'gray'}>{ci.severity}</Pill></td>
                    <td>{ci.description}</td>
                    <td>{ci.owner}</td>
                    <td>{ci.dueDate}</td>
                    <td>
                      {ci.overdue ? <Pill tone="red">Overdue</Pill> : <Pill tone={statusTone(ci.status)}>{ci.status}</Pill>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'new' && (
        <div className="card" style={{ maxWidth: 460 }}>
          <div className="section-title">Raise Compliance Issue</div>
          <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: -6, marginBottom: 16 }}>Owner and Due Date are mandatory per Section 8 business rules.</p>
          <form onSubmit={submit}>
            <div className="form-row">
              <label>Audit</label>
              <select value={form.auditId} onChange={(e) => setForm({ ...form, auditId: e.target.value })}>
                <option value="" disabled={audits.length > 0}>
                  {audits.length === 0 ? '— Add entries in Settings first —' : '— Select —'}
                </option>
                {audits.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label>Severity</label>
              <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
                {['Low', 'Medium', 'High'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label>Description</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the issue" />
            </div>
            <div className="form-row">
              <label>Owner (mandatory)</label>
              <input value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} placeholder="Assigned owner" />
            </div>
            <div className="form-row">
              <label>Due Date (mandatory)</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <button className="btn btn-primary" type="submit">Raise Issue</button>
          </form>
        </div>
      )}
    </div>
  )
}
