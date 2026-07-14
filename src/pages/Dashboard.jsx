import { useEco } from '../context/EcoContext'
import { StatCard, ScoreRing, Pill } from '../components/UI'

export default function Dashboard() {
  const { scores, totalCarbonEmissions, challenges, challengeParticipation, employees, complianceIssues, acknowledgements, departments } = useEco()

  const activeChallenges = challenges.filter((c) => c.status === 'Active')
  const overdueIssues = complianceIssues.filter((c) => c.overdue)
  const ackPct = employees.length === 0 ? 0 : Math.round((acknowledgements.length / employees.length) * 100)
  const topEmployees = [...employees].sort((a, b) => b.xp - a.xp).slice(0, 5)

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
          <span className="page-eyebrow">Organization Overview</span>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-desc">Unified view across Environmental, Social, Governance and Gamification data.</p>
        </div>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        <StatCard label="Total Carbon Emissions" value={`${Math.round(totalCarbonEmissions).toLocaleString()} kg`} sub="CO2e, all recorded transactions" />
        <StatCard label="Active Challenges" value={activeChallenges.length} sub={`${challengeParticipation.length} total participations`} />
        <StatCard label="Overdue Compliance" value={overdueIssues.length} sub="Open issues past due date" accent={overdueIssues.length ? '#b34a3c' : undefined} />
        <StatCard label="Policy Acknowledgement" value={`${Math.min(ackPct, 100)}%`} sub="of employees, all policies" />
      </div>

      <div className="grid grid-2" style={{ alignItems: 'stretch', marginBottom: 20 }}>
        <div className="card">
          <div className="section-title">Overall Org ESG Score</div>
          <div className="score-ring-wrap">
            <ScoreRing value={scores.org} size={120} label="Org Total" />
            <div style={{ display: 'flex', gap: 18 }}>
              <ScoreRing value={Math.round(scores.byDept.reduce((a, b) => a + b.environmental, 0) / (scores.byDept.length || 1))} size={72} label="Environmental" color="#4f9772" />
              <ScoreRing value={Math.round(scores.byDept.reduce((a, b) => a + b.social, 0) / (scores.byDept.length || 1))} size={72} label="Social" color="#c96f4a" />
              <ScoreRing value={Math.round(scores.byDept.reduce((a, b) => a + b.governance, 0) / (scores.byDept.length || 1))} size={72} label="Governance" color="#d69a2d" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-title">Leaderboard — Top 5 by XP</div>
          {employees.length === 0 ? emptyState : (
            topEmployees.map((e, i) => {
              const dept = departments.find((d) => d.id === e.departmentId)
              return (
                <div className="leaderboard-row" key={e.id}>
                  <div className="rank-medal">#{i + 1}</div>
                  <div>
                    <div style={{ fontWeight: 500 }}>{e.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>{dept?.name ?? '—'}</div>
                  </div>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13 }}>{e.xp} XP</div>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, color: 'var(--ink-soft)' }}>{e.points} pts</div>
                </div>
              )
            })
          )}
        </div>
      </div>

      <div className="card">
        <div className="section-title">Department ESG Rankings</div>
        {scores.byDept.length === 0 ? emptyState : (
          <table>
            <thead><tr><th>Rank</th><th>Department</th><th>Environmental</th><th>Social</th><th>Governance</th><th>Total</th></tr></thead>
            <tbody>
              {[...scores.byDept].sort((a, b) => b.total - a.total).map((d, i) => (
                <tr key={d.departmentId}>
                  <td className="rank-medal">#{i + 1}</td>
                  <td style={{ fontWeight: 500 }}>{d.departmentName}</td>
                  <td>{d.environmental}</td>
                  <td>{d.social}</td>
                  <td>{d.governance}</td>
                  <td><Pill tone={d.total >= 70 ? 'green' : d.total >= 50 ? 'amber' : 'red'}>{d.total}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
