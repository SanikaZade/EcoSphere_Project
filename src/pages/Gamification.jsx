import { useState } from 'react'
import { useEco } from '../context/EcoContext'
import { nextId } from '../context/EcoContext'
import { Pill, statusTone, Toggle } from '../components/UI'

export default function Gamification() {
  const {
    challenges, setChallenges, categories, challengeParticipation, setChallengeParticipation,
    employees, approveChallengeParticipation, badges, earnedBadges, rewards, redeemReward,
    settings, setSettings, updateChallengeStatus,
  } = useEco()
  const [tab, setTab] = useState('challenges')
  const [redeemEmployee, setRedeemEmployee] = useState(employees[0]?.id || '')
  const [msg, setMsg] = useState('')

  // Gap 5b — New Challenge form
  const [showNewChallenge, setShowNewChallenge] = useState(false)
  const challengeCategories = categories.filter((c) => c.type === 'Challenge')
  const blankChallenge = { title: '', categoryId: challengeCategories[0]?.id || '', description: '', xp: 100, difficulty: 'Medium', evidenceRequired: false, deadline: '' }
  const [newChallenge, setNewChallenge] = useState(blankChallenge)

  // Gap 5c — Join Challenge form (one per challenge row)
  const [joinTarget, setJoinTarget] = useState(null) // challengeId being joined
  const [joinForm, setJoinForm] = useState({ employeeId: employees[0]?.id || '', progress: 0 })

  const empName = (id) => employees.find((e) => e.id === id)?.name || id
  const challengeTitle = (id) => challenges.find((c) => c.id === id)?.title || id
  const catName = (id) => categories.find((c) => c.id === id)?.name || id

  const doRedeem = (rewardId) => {
    const targetEmpId = redeemEmployee || employees[0]?.id
    if (!targetEmpId) {
      alert('Please select an employee first.')
      return
    }
    const res = redeemReward(rewardId, targetEmpId)
    setMsg(res.message)
    setTimeout(() => setMsg(''), 2500)
  }

  const leaderboard = [...employees].sort((a, b) => b.xp - a.xp)

  // Gap 5b — Submit new challenge
  const submitNewChallenge = (e) => {
    e.preventDefault()
    if (!newChallenge.title) return
    const catVal = newChallenge.categoryId || challengeCategories[0]?.id || ''
    setChallenges((prev) => [...prev, { id: nextId('ch'), ...newChallenge, categoryId: catVal, xp: Number(newChallenge.xp) || 0, status: 'Draft' }])
    setNewChallenge(blankChallenge)
    setShowNewChallenge(false)
  }

  // Gap 5c — Submit join challenge
  const submitJoin = (e, challengeId) => {
    e.preventDefault()
    const targetEmpId = joinForm.employeeId || employees[0]?.id
    if (!targetEmpId) {
      alert('Please select an employee.')
      return
    }
    setChallengeParticipation((prev) => [
      ...prev,
      {
        id: nextId('cp'),
        challengeId,
        employeeId: targetEmpId,
        progress: Number(joinForm.progress) || 0,
        proof: null,
        approval: 'Pending',
        xpAwarded: 0,
      },
    ])
    setJoinTarget(null)
    setJoinForm({ employeeId: employees[0]?.id || '', progress: 0 })
  }

  // Check if employee already joined a challenge
  const alreadyJoined = (challengeId, employeeId) =>
    challengeParticipation.some((cp) => cp.challengeId === challengeId && cp.employeeId === employeeId)

  // Gap 4 — Action buttons for challenge lifecycle
  const ChallengeActions = ({ c }) => {
    const btns = []
    if (c.status === 'Draft') {
      btns.push(
        <button key="activate" className="btn btn-primary btn-sm" onClick={() => updateChallengeStatus(c.id, 'Active')}>Activate</button>
      )
    }
    if (c.status === 'Active') {
      btns.push(
        <button key="review" className="btn btn-outline btn-sm" onClick={() => updateChallengeStatus(c.id, 'Under Review')}>Send for Review</button>
      )
    }
    if (c.status === 'Under Review') {
      btns.push(
        <button key="complete" className="btn btn-primary btn-sm" onClick={() => updateChallengeStatus(c.id, 'Completed')}>Complete</button>,
        <button key="reactivate" className="btn btn-outline btn-sm" onClick={() => updateChallengeStatus(c.id, 'Active')}>Reactivate</button>
      )
    }
    if (!['Archived', 'Completed'].includes(c.status)) {
      btns.push(
        <button key="archive" className="btn btn-sm" style={{ background: 'var(--paper-dim)', color: 'var(--ink-soft)' }} onClick={() => updateChallengeStatus(c.id, 'Archived')}>Archive</button>
      )
    }
    return <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{btns.length ? btns : <span style={{ color: 'var(--ink-soft)' }}>—</span>}</div>
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
          <span className="page-eyebrow">Module 4</span>
          <h1 className="page-title">Gamification</h1>
          <p className="page-desc">Challenges, XP, badges, rewards and leaderboards.</p>
        </div>
        <Toggle on={settings.badgeAutoAward} onChange={(v) => setSettings((s) => ({ ...s, badgeAutoAward: v }))} label="Badge Auto-Award" />
      </div>

      <div className="tabs">
        {['challenges', 'participation', 'badges', 'rewards', 'leaderboard'].map((t) => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {{ challenges: 'Challenges', participation: 'Participation', badges: 'Badges', rewards: 'Rewards', leaderboard: 'Leaderboard' }[t]}
          </button>
        ))}
      </div>

      {tab === 'challenges' && (
        <div>
          {/* Gap 5b — New Challenge button + form */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
            <button className="btn btn-primary" onClick={() => setShowNewChallenge((v) => !v)}>
              {showNewChallenge ? '✕ Cancel' : '+ New Challenge'}
            </button>
          </div>

          {showNewChallenge && (
            <div className="card" style={{ marginBottom: 18 }}>
              <div className="section-title">New Challenge</div>
              <form onSubmit={submitNewChallenge}>
                <div className="grid grid-3">
                  <div className="form-row">
                    <label>Title *</label>
                    <input value={newChallenge.title} onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })} required />
                  </div>
                  <div className="form-row">
                    <label>Category</label>
                    <select value={newChallenge.categoryId} onChange={(e) => setNewChallenge({ ...newChallenge, categoryId: e.target.value })}>
                      <option value="" disabled={challengeCategories.length > 0}>
                        {challengeCategories.length === 0 ? '— Add entries in Settings first —' : '— Select —'}
                      </option>
                      {challengeCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-row">
                    <label>XP</label>
                    <input type="number" value={newChallenge.xp} onChange={(e) => setNewChallenge({ ...newChallenge, xp: e.target.value })} />
                  </div>
                  <div className="form-row">
                    <label>Difficulty</label>
                    <select value={newChallenge.difficulty} onChange={(e) => setNewChallenge({ ...newChallenge, difficulty: e.target.value })}>
                      <option>Easy</option><option>Medium</option><option>Hard</option>
                    </select>
                  </div>
                  <div className="form-row">
                    <label>Deadline</label>
                    <input type="date" value={newChallenge.deadline} onChange={(e) => setNewChallenge({ ...newChallenge, deadline: e.target.value })} />
                  </div>
                  <div className="form-row" style={{ justifyContent: 'flex-end' }}>
                    <label>Evidence Required</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <input type="checkbox" checked={newChallenge.evidenceRequired} onChange={(e) => setNewChallenge({ ...newChallenge, evidenceRequired: e.target.checked })} />
                      <span style={{ fontSize: 13 }}>Yes</span>
                    </label>
                  </div>
                </div>
                <div className="form-row">
                  <label>Description</label>
                  <textarea rows={2} style={{ border: '1px solid var(--line)', borderRadius: 6, padding: '8px 10px', fontSize: 13.5, fontFamily: 'var(--font-body)', background: 'white', color: 'var(--ink)' }} value={newChallenge.description} onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })} />
                </div>
                <button className="btn btn-primary" type="submit">Create Challenge (Draft)</button>
              </form>
            </div>
          )}

          <div className="card">
            {challenges.length === 0 ? emptyState : (
              <table>
                <thead>
                  <tr>
                    <th>Title</th><th>Category</th><th>XP</th><th>Difficulty</th>
                    <th>Evidence Req.</th><th>Deadline</th><th>Status</th><th>Actions</th><th>Join</th>
                  </tr>
                </thead>
                <tbody>
                  {challenges.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 500 }}>{c.title}</td>
                      <td>{catName(c.categoryId)}</td>
                      <td>{c.xp}</td>
                      <td>{c.difficulty}</td>
                      <td>{c.evidenceRequired ? <Pill tone="amber">Yes</Pill> : <Pill tone="gray">No</Pill>}</td>
                      <td>{c.deadline}</td>
                      <td><Pill tone={statusTone(c.status)}>{c.status}</Pill></td>
                      <td><ChallengeActions c={c} /></td>
                      <td>
                        {/* Gap 5c — Join button only on Active challenges */}
                        {c.status === 'Active' ? (
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setJoinTarget(joinTarget === c.id ? null : c.id)}
                          >
                            {joinTarget === c.id ? 'Cancel' : 'Join'}
                          </button>
                        ) : <span style={{ color: 'var(--ink-soft)' }}>—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Separate container/modal style for Join if active */}
          {joinTarget && (
            <div className="card" style={{ marginTop: 14, background: 'var(--paper)', padding: '12px 16px' }}>
              <div className="section-title">Join Challenge: {challengeTitle(joinTarget)}</div>
              <form onSubmit={(e) => submitJoin(e, joinTarget)} style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div className="form-row" style={{ marginBottom: 0 }}>
                  <label>Employee</label>
                  <select value={joinForm.employeeId} onChange={(e) => setJoinForm({ ...joinForm, employeeId: e.target.value })}>
                    <option value="" disabled={employees.length > 0}>
                      {employees.length === 0 ? '— Add entries in Settings first —' : '— Select —'}
                    </option>
                    {employees.map((e) => (
                      <option key={e.id} value={e.id} disabled={alreadyJoined(joinTarget, e.id)}>
                        {e.name}{alreadyJoined(joinTarget, e.id) ? ' (already joined)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-row" style={{ marginBottom: 0 }}>
                  <label>Progress (0–100)</label>
                  <input type="number" min={0} max={100} value={joinForm.progress} onChange={(e) => setJoinForm({ ...joinForm, progress: e.target.value })} style={{ width: 80 }} />
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  type="submit"
                  disabled={alreadyJoined(joinTarget, joinForm.employeeId)}
                >
                  Submit
                </button>
              </form>
              {alreadyJoined(joinTarget, joinForm.employeeId) && (
                <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 6 }}>
                  This employee already has a participation record for this challenge.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {tab === 'participation' && (
        <div className="card">
          {challengeParticipation.length === 0 ? emptyState : (
            <table>
              <thead><tr><th>Employee</th><th>Challenge</th><th>Progress</th><th>Proof</th><th>XP Awarded</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {challengeParticipation.map((p) => (
                  <tr key={p.id}>
                    <td>{empName(p.employeeId)}</td>
                    <td>{challengeTitle(p.challengeId)}</td>
                    <td>{p.progress}%</td>
                    <td>{p.proof ? <Pill tone="blue">attached</Pill> : <Pill tone="gray">none</Pill>}</td>
                    <td>{p.xpAwarded}</td>
                    <td><Pill tone={statusTone(p.approval)}>{p.approval}</Pill></td>
                    <td>{p.approval === 'Pending' && <button className="btn btn-primary btn-sm" onClick={() => approveChallengeParticipation(p.id)}>Approve</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'badges' && (
        <div className="grid grid-3">
          {badges.length === 0 ? (
            <div className="card" style={{ gridColumn: 'span 3' }}>{emptyState}</div>
          ) : (
            badges.map((b) => (
              <div className="card" key={b.id}>
                <div style={{ fontSize: 30, marginBottom: 8 }}>{b.icon}</div>
                <div style={{ fontWeight: 600 }}>{b.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', margin: '4px 0 10px' }}>{b.description}</div>
                <Pill tone="gray">{earnedBadges.filter((eb) => eb.badgeId === b.id).length} earned</Pill>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'rewards' && (
        <div>
          <div className="form-row" style={{ maxWidth: 280, marginBottom: 16 }}>
            <label>Redeeming as</label>
            <select value={redeemEmployee} onChange={(e) => setRedeemEmployee(e.target.value)}>
              <option value="" disabled={employees.length > 0}>
                {employees.length === 0 ? '— Add entries in Settings first —' : '— Select —'}
              </option>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.name} — {e.points} pts</option>)}
            </select>
          </div>
          {msg && <div className="note-callout">{msg}</div>}
          {rewards.length === 0 ? emptyState : (
            <div className="grid grid-3">
              {rewards.map((r) => (
                <div className="card" key={r.id}>
                  <div style={{ fontWeight: 600 }}>{r.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', margin: '4px 0 10px' }}>{r.description}</div>
                  <div style={{ fontSize: 13, marginBottom: 10 }}>
                    <Pill tone="blue">{r.pointsRequired} pts</Pill>{' '}
                    <Pill tone={r.stock > 0 ? 'green' : 'red'}>{r.stock > 0 ? `${r.stock} in stock` : 'Out of stock'}</Pill>
                  </div>
                  <button className="btn btn-primary btn-sm" disabled={r.stock <= 0} onClick={() => doRedeem(r.id)}>Redeem</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'leaderboard' && (
        <div className="card">
          {employees.length === 0 ? emptyState : (
            leaderboard.map((e, i) => (
              <div className="leaderboard-row" key={e.id}>
                <div className="rank-medal">#{i + 1}</div>
                <div style={{ fontWeight: 500 }}>{e.name}</div>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{e.xp} XP</div>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', color: 'var(--ink-soft)' }}>{e.points} pts</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
