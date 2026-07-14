import { useState } from 'react'
import { BarChart, Bar as RBar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useEco } from '../context/EcoContext'
import { Pill, Bar } from '../components/UI'

export default function Environmental() {
  const { emissionFactors, carbonTransactions, goals, departments, settings, addBusinessOperation, carbonByDepartment } = useEco()
  const [tab, setTab] = useState('factors')
  const [form, setForm] = useState({ departmentId: departments[0]?.id || '', source: 'Manufacturing', quantity: '' })

  const deptName = (id) => departments.find((d) => d.id === id)?.name || id

  const submitOp = (e) => {
    e.preventDefault()
    if (!form.quantity) return
    const targetDeptId = form.departmentId || departments[0]?.id
    if (!targetDeptId) {
      alert('Please select a department.')
      return
    }
    const tx = addBusinessOperation(targetDeptId, form.source, Number(form.quantity))
    if (!tx) alert('Auto Emission Calculation is OFF in Settings — enable it, or record manually.')
    setForm({ ...form, quantity: '' })
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

  const isCarbonByDeptEmpty = !carbonByDepartment || carbonByDepartment.every(d => d.total === 0)

  return (
    <div>
      <div className="page-header">
        <div>
          <span className="page-eyebrow">Module 1</span>
          <h1 className="page-title">Environmental</h1>
          <p className="page-desc">Emission factors, carbon accounting, department tracking and sustainability goals.</p>
        </div>
      </div>

      <div className="tabs">
        {['factors', 'tracking', 'transactions', 'goals', 'record'].map((t) => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {{ factors: 'Emission Factors', tracking: 'Department Carbon Tracking', transactions: 'Carbon Transactions', goals: 'Sustainability Goals', record: 'Record Operation' }[t]}
          </button>
        ))}
      </div>

      {tab === 'factors' && (
        <div className="card">
          {emissionFactors.length === 0 ? emptyState : (
            <table>
              <thead><tr><th>Activity Type</th><th>Unit</th><th>Value</th><th>Updated</th></tr></thead>
              <tbody>
                {emissionFactors.map((f) => (
                  <tr key={f.id}><td style={{ fontWeight: 500 }}>{f.activityType}</td><td>{f.unit}</td><td>{f.value}</td><td>{f.updatedAt}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'tracking' && (
        <div className="card">
          <div className="section-title">Emissions by Department</div>
          {isCarbonByDeptEmpty ? emptyState : (
            <>
              <div style={{ width: '100%', height: 260, marginBottom: 20 }}>
                {carbonByDepartment.length > 0 && (
                  <ResponsiveContainer>
                    <BarChart data={carbonByDepartment} margin={{ left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ece8dd" />
                      <XAxis dataKey="departmentName" tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono, monospace' }} />
                      <YAxis tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono, monospace' }} />
                      <Tooltip formatter={(v) => `${Math.round(v).toLocaleString()} kg CO2e`} contentStyle={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12.5, borderRadius: 8 }} />
                      <RBar dataKey="total" fill="#2f6b4f" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
              <table>
                <thead><tr><th>Department</th><th>Total Emissions (kg CO2e)</th><th>Transactions</th><th>By Source</th></tr></thead>
                <tbody>
                  {carbonByDepartment.map((d) => (
                    <tr key={d.departmentId}>
                      <td style={{ fontWeight: 500 }}>{d.departmentName}</td>
                      <td style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{Math.round(d.total).toLocaleString()}</td>
                      <td>{d.txCount}</td>
                      <td>
                        {Object.keys(d.bySource).length > 0 ? (
                          Object.entries(d.bySource).map(([s, v]) => <Pill key={s} tone="blue">{s}: {Math.round(v).toLocaleString()}</Pill>).reduce((prev, curr) => [prev, ' ', curr])
                        ) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      {tab === 'transactions' && (
        <div className="card">
          {!settings.autoEmissionCalculation && <div className="note-callout">Auto Emission Calculation is OFF — new transactions must be entered manually via Settings → Feature Toggles.</div>}
          {carbonTransactions.length === 0 ? emptyState : (
            <table>
              <thead><tr><th>Department</th><th>Source</th><th>Quantity</th><th>Emissions (kg CO2e)</th><th>Date</th></tr></thead>
              <tbody>
                {carbonTransactions.map((t) => (
                  <tr key={t.id}>
                    <td>{deptName(t.departmentId)}</td>
                    <td><Pill tone="blue">{t.source}</Pill></td>
                    <td>{t.quantity.toLocaleString()}</td>
                    <td style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{Math.round(t.emissions).toLocaleString()}</td>
                    <td>{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'goals' && (
        <div className="grid grid-2">
          {goals.length === 0 ? (
            <div className="card" style={{ gridColumn: 'span 2' }}>{emptyState}</div>
          ) : (
            goals.map((g) => {
              const pct = Math.round((g.actual / g.target) * 100)
              const good = g.actual <= g.target
              return (
                <div className="card" key={g.id}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{g.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 10 }}>{deptName(g.departmentId)} · due {g.dueDate}</div>
                  <Bar pct={pct} color={good ? '#2f6b4f' : '#c96f4a'} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12.5 }}>
                    <span>Actual: <strong>{g.actual.toLocaleString()}</strong> {g.unit}</span>
                    <span>Target: {g.target.toLocaleString()}</span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {tab === 'record' && (
        <div className="card" style={{ maxWidth: 420 }}>
          <div className="section-title">Record Business Operation</div>
          <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: -6, marginBottom: 16 }}>
            Demonstrates the Auto Emission Calculation toggle: when ON, submitting an operation auto-creates a Carbon Transaction using the linked Emission Factor.
          </p>
          <form onSubmit={submitOp}>
            <div className="form-row">
              <label>Department</label>
              <select value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })}>
                <option value="" disabled={departments.length > 0}>
                  {departments.length === 0 ? '— Add entries in Settings first —' : '— Select —'}
                </option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label>Operation Type</label>
              <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
                {['Purchase', 'Manufacturing', 'Expense', 'Fleet'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label>Quantity (units / INR / km as applicable)</label>
              <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="e.g. 1200" />
            </div>
            <button className="btn btn-primary" type="submit">Submit Operation</button>
          </form>
        </div>
      )}
    </div>
  )
}
