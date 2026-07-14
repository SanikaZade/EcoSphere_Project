import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import * as API from '../api/index.js'
import * as API_AUTH from '../api/auth.js'
import { sendEmail } from '../utils/emailService'

const EcoCtx = createContext(null)

let idCounter = 1000
export const nextId = (prefix) => `${prefix}${idCounter++}`

export function EcoProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(
    () => JSON.parse(localStorage.getItem('eco_user')) ?? null
  )

  const [departments, setDepartmentsState] = useState([])
  const [categories, setCategoriesState] = useState([])
  const [emissionFactors, setEmissionFactorsState] = useState([])
  const [productProfiles, setProductProfilesState] = useState([])
  const [goals, setGoalsState] = useState([])
  const [policies, setPoliciesState] = useState([])
  const [badges, setBadgesState] = useState([])
  const [rewards, setRewardsState] = useState([])
  const [employees, setEmployeesState] = useState([])
  const [carbonTransactions, setCarbonTransactionsState] = useState([])
  const [csrActivities, setCsrActivitiesState] = useState([])
  const [employeeParticipation, setEmployeeParticipationState] = useState([])
  const [challenges, setChallengesState] = useState([])
  const [challengeParticipation, setChallengeParticipationState] = useState([])
  const [acknowledgements, setAcknowledgementsState] = useState([])
  const [audits, setAuditsState] = useState([])
  const [complianceIssues, setComplianceIssuesState] = useState([])
  const [trainingCompletions, setTrainingCompletionsState] = useState([])
  const [notifications, setNotificationsState] = useState([])
  const [earnedBadges, setEarnedBadgesState] = useState([])
  const [emailLog, setEmailLog] = useState(() => JSON.parse(localStorage.getItem('eco_emailLog')) ?? [])
  
  const [settings, setSettingsState] = useState({
    autoEmissionCalculation: true,
    evidenceRequired: true,
    badgeAutoAward: true,
    weights: { environmental: 40, social: 30, governance: 30 },
    notifications: {
      newComplianceIssue: { inApp: true, email: true },
      approvalDecision:   { inApp: true, email: false },
      policyReminder:     { inApp: true, email: true },
      badgeUnlock:        { inApp: true, email: false },
    },
  })
  
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState({ byDept: [], org: 0 })

  // Safe fetch helper — never throws, always returns a fallback value
  const safeFetch = async (fn, fallback) => {
    try {
      const result = await fn()
      // If we expected an array but got something else, return fallback
      if (Array.isArray(fallback) && !Array.isArray(result)) return fallback
      // If we expected an object but got an array, return fallback
      if (!Array.isArray(fallback) && Array.isArray(result)) return fallback
      return result ?? fallback
    } catch {
      return fallback
    }
  }

  const loadAll = useCallback(async () => {
    if (!currentUser) {
      setLoading(false)
      return
    }
    try {
      const [
        depts, cats, efs, prods, goalsData, policiesData, badgesData, rewardsData,
        employeesData, carbonTx, csrActs, empPart, challengesData, challPart,
        acks, auditsData, issues, trainings, notifs, earnedBadgesData, settingsRow, scoresData
      ] = await Promise.all([
        safeFetch(() => API.departments.list(), []),
        safeFetch(() => API.categories.list(), []),
        safeFetch(() => API.emissionFactors.list(), []),
        safeFetch(() => API.productProfiles.list(), []),
        safeFetch(() => API.goals.list(), []),
        safeFetch(() => API.policies.list(), []),
        safeFetch(() => API.badges.list(), []),
        safeFetch(() => API.rewards.list(), []),
        safeFetch(() => API.employees.list(), []),
        safeFetch(() => API.carbonTransactions.list(), []),
        safeFetch(() => API.csrActivities.list(), []),
        safeFetch(() => API.employeeParticipation.list(), []),
        safeFetch(() => API.challenges.list(), []),
        safeFetch(() => API.challengeParticipation.list(), []),
        safeFetch(() => API.acknowledgements.list(), []),
        safeFetch(() => API.audits.list(), []),
        safeFetch(() => API.complianceIssues.list(), []),
        safeFetch(() => API.trainingCompletions.list(), []),
        safeFetch(() => API.notifications.list(), []),
        safeFetch(() => API.earnedBadges.list(), []),
        safeFetch(() => API.settings.get(), null),
        safeFetch(() => API.scores.get(), { byDept: [], org: 0 }),
      ])

      // Map snake_case to camelCase
      setDepartmentsState(Array.isArray(depts) ? depts.map(d => ({ ...d, parentId: d.parent_id, employeeCount: d.employee_count })) : [])
      setCategoriesState(Array.isArray(cats) ? cats : [])
      setEmissionFactorsState(Array.isArray(efs) ? efs.map(f => ({ ...f, activityType: f.activity_type, updatedAt: f.updated_at })) : [])
      setProductProfilesState(Array.isArray(prods) ? prods.map(p => ({ ...p, productName: p.product_name, sustainableMaterial: p.sustainable_material, recycledContent: p.recycled_content, carbonFootprint: p.carbon_footprint })) : [])
      setGoalsState(Array.isArray(goalsData) ? goalsData.map(g => ({ ...g, departmentId: g.department_id, dueDate: g.due_date, actual: Number(g.actual), target: Number(g.target) })) : [])
      setPoliciesState(Array.isArray(policiesData) ? policiesData.map(p => ({ ...p, publishedAt: p.published_at })) : [])
      setBadgesState(Array.isArray(badgesData) ? badgesData.map(b => ({ ...b, unlockRule: typeof b.unlock_rule === 'string' ? JSON.parse(b.unlock_rule) : b.unlock_rule })) : [])
      setRewardsState(Array.isArray(rewardsData) ? rewardsData.map(r => ({ ...r, pointsRequired: r.points_required })) : [])
      setEmployeesState(Array.isArray(employeesData) ? employeesData.map(e => ({ ...e, departmentId: e.department_id })) : [])
      setCarbonTransactionsState(Array.isArray(carbonTx) ? carbonTx.map(t => ({ ...t, departmentId: t.department_id, emissions: Number(t.emissions), quantity: Number(t.quantity), emissionFactorId: t.emission_factor_id })) : [])
      setCsrActivitiesState(Array.isArray(csrActs) ? csrActs.map(a => ({ ...a, categoryId: a.category_id })) : [])
      setEmployeeParticipationState(Array.isArray(empPart) ? empPart.map(p => ({ ...p, employeeId: p.employee_id, activityId: p.activity_id, approvalStatus: p.approval_status, pointsEarned: p.points_earned, completionDate: p.completion_date })) : [])
      setChallengesState(Array.isArray(challengesData) ? challengesData.map(c => ({ ...c, categoryId: c.category_id, evidenceRequired: c.evidence_required })) : [])
      setChallengeParticipationState(Array.isArray(challPart) ? challPart.map(p => ({ ...p, challengeId: p.challenge_id, employeeId: p.employee_id, xpAwarded: p.xp_awarded })) : [])
      setAcknowledgementsState(Array.isArray(acks) ? acks.map(a => ({ ...a, policyId: a.policy_id, employeeId: a.employee_id, acknowledgedAt: a.acknowledged_at })) : [])
      setAuditsState(Array.isArray(auditsData) ? auditsData : [])
      setComplianceIssuesState(Array.isArray(issues) ? issues.map(ci => ({ ...ci, auditId: ci.audit_id, dueDate: ci.due_date })) : [])
      setTrainingCompletionsState(Array.isArray(trainings) ? trainings.map(t => ({ ...t, employeeId: t.employee_id, trainingName: t.training_name, completedDate: t.completed_date, hours: Number(t.hours) })) : [])
      setNotificationsState(Array.isArray(notifs) ? notifs : [])
      setEarnedBadgesState(Array.isArray(earnedBadgesData) ? earnedBadgesData.map(eb => ({ ...eb, employeeId: eb.employee_id, badgeId: eb.badge_id, unlockedAt: eb.unlocked_at })) : [])

      // scores — guard against array fallback
      if (scoresData && !Array.isArray(scoresData)) {
        setScores(scoresData)
      }

      // settings — guard against null/array fallback
      if (settingsRow && !Array.isArray(settingsRow)) {
        setSettingsState({
          autoEmissionCalculation: settingsRow.auto_emission_calculation ?? true,
          evidenceRequired: settingsRow.evidence_required ?? true,
          badgeAutoAward: settingsRow.badge_auto_award ?? true,
          weights: {
            environmental: settingsRow.weight_environmental ?? 40,
            social: settingsRow.weight_social ?? 30,
            governance: settingsRow.weight_governance ?? 30
          },
          notifications: typeof settingsRow.notification_config === 'string'
            ? JSON.parse(settingsRow.notification_config)
            : (settingsRow.notification_config ?? {
                newComplianceIssue: { inApp: true, email: true },
                approvalDecision:   { inApp: true, email: false },
                policyReminder:     { inApp: true, email: true },
                badgeUnlock:        { inApp: true, email: false },
              })
        })
      }
    } catch (err) {
      console.error('loadAll error:', err)
    } finally {
      setLoading(false)
    }
  }, [currentUser])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const login = async (email, password) => {
    const res = await API_AUTH.login({ email, password })
    if (res && res.token) {
      localStorage.setItem('eco_token', res.token)
      localStorage.setItem('eco_user', JSON.stringify(res.user))
      setCurrentUser(res.user)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('eco_token')
    localStorage.removeItem('eco_user')
    setCurrentUser(null)
  }

  // ---------- localStorage sync for emailLog (Gap 6) ----------
  useEffect(() => {
    localStorage.setItem('eco_emailLog', JSON.stringify(emailLog))
  }, [emailLog])

  // ---------- Proxy state update handlers (intercept page changes) ----------
  const setDepartments = async (updater) => {
    const nextVal = typeof updater === 'function' ? updater(departments) : updater
    const added = nextVal.find(x => !departments.some(d => d.id === x.id))
    if (added) {
      await API.departments.create({
        name: added.name,
        code: added.code,
        head: added.head,
        parent_id: added.parentId,
        employee_count: added.employeeCount,
        status: added.status
      })
      await loadAll()
    }
  }

  const setEmployees = async (updater) => {
    const nextVal = typeof updater === 'function' ? updater(employees) : updater
    const added = nextVal.find(x => !employees.some(e => e.id === x.id))
    if (added) {
      await API.employees.create({
        name: added.name,
        department_id: added.departmentId,
        gender: added.gender,
        xp: added.xp,
        points: added.points
      })
      await loadAll()
    }
  }

  const setCategories = async (updater) => {
    const nextVal = typeof updater === 'function' ? updater(categories) : updater
    const added = nextVal.find(x => !categories.some(c => c.id === x.id))
    if (added) {
      await API.categories.create({
        name: added.name,
        type: added.type,
        status: added.status
      })
      await loadAll()
    }
  }

  const setSettings = async (updater) => {
    const nextVal = typeof updater === 'function' ? updater(settings) : updater
    await API.settings.update({
      auto_emission_calculation: nextVal.autoEmissionCalculation,
      evidence_required: nextVal.evidenceRequired,
      badge_auto_award: nextVal.badgeAutoAward,
      weight_environmental: nextVal.weights.environmental,
      weight_social: nextVal.weights.social,
      weight_governance: nextVal.weights.governance,
      notification_config: nextVal.notifications
    })
    await loadAll()
  }

  const setChallenges = async (updater) => {
    const nextVal = typeof updater === 'function' ? updater(challenges) : updater
    const added = nextVal.find(x => !challenges.some(c => c.id === x.id))
    if (added) {
      await API.challenges.create({
        title: added.title,
        category_id: added.categoryId,
        description: added.description,
        xp: added.xp,
        difficulty: added.difficulty,
        evidence_required: added.evidenceRequired,
        deadline: added.deadline,
        status: added.status
      })
      await loadAll()
    }
  }

  const setChallengeParticipation = async (updater) => {
    const nextVal = typeof updater === 'function' ? updater(challengeParticipation) : updater
    const added = nextVal.find(x => !challengeParticipation.some(c => c.id === x.id))
    if (added) {
      await API.challengeParticipation.create({
        challenge_id: added.challengeId,
        employee_id: added.employeeId,
        progress: added.progress,
        proof: added.proof,
        approval: added.approval,
        xp_awarded: added.xpAwarded
      })
      await loadAll()
    }
  }

  const setCsrActivities = async (updater) => {
    const nextVal = typeof updater === 'function' ? updater(csrActivities) : updater
    const added = nextVal.find(x => !csrActivities.some(c => c.id === x.id))
    if (added) {
      await API.csrActivities.create({
        category_id: added.categoryId,
        title: added.title,
        date: added.date,
        location: added.location,
        status: added.status
      })
      await loadAll()
    }
  }

  // ---------- Notifications + Email (Gap 6) ----------
  const pushNotification = async (type, message) => {
    await API.notifications.create({ type, message })
    const notifConfig = settings.notifications[type]
    if (notifConfig?.email) {
      const recipient = currentUser?.email || 'admin@ecosphere.com'
      const result = sendEmail({ to: recipient, subject: `[EcoSphere] ${message}`, body: message })
      setEmailLog((prev) => [result, ...prev])
    }
    await loadAll()
  }

  // ---------- Compliance auto-flagging ----------
  const today = new Date('2026-07-12')
  const flaggedComplianceIssues = useMemo(() => {
    return complianceIssues.map((ci) => {
      const overdue = ci.status === 'Open' && new Date(ci.dueDate) < today
      return { ...ci, overdue }
    })
  }, [complianceIssues])

  // ---------- Badge Auto-Award check ----------
  const checkBadgeUnlocks = async (employeeId, xp, points, completedChallengeCount) => {
    if (!settings.badgeAutoAward) return
    for (const b of badges) {
      const already = earnedBadges.find((eb) => eb.employeeId === employeeId && eb.badgeId === b.id)
      if (already) continue
      let unlocked = false
      if (b.unlockRule?.type === 'xp' && xp >= b.unlockRule.value) unlocked = true
      if (b.unlockRule?.type === 'points' && points >= b.unlockRule.value) unlocked = true
      if (b.unlockRule?.type === 'challengesCompleted' && completedChallengeCount >= b.unlockRule.value) unlocked = true
      if (unlocked) {
        await API.earnedBadges.create({
          employee_id: employeeId,
          badge_id: b.id,
          unlocked_at: today.toISOString().slice(0, 10)
        })
        const emp = employees.find((e) => e.id === employeeId)
        await pushNotification('badgeUnlock', `${emp ? emp.name : employeeId} unlocked "${b.name}"`)
      }
    }
  }

  // ---------- Employee Participation actions ----------
  const approveParticipation = async (id) => {
    const ep = employeeParticipation.find((p) => p.id === id)
    if (!ep) return
    if (settings.evidenceRequired && !ep.proof) {
      alert('Evidence Required is ON: cannot approve without proof file attached.')
      return
    }
    const points = 40
    await API.employeeParticipation.update(id, {
      approval_status: 'Approved',
      points_earned: points,
      completion_date: today.toISOString().slice(0, 10)
    })
    const emp = employees.find((e) => e.id === ep.employeeId)
    if (emp) {
      await API.employees.update(ep.employeeId, {
        points: emp.points + points
      })
    }
    await pushNotification('approvalDecision', `CSR participation approved for ${ep.employeeId}`)
    await loadAll()
  }

  // ---------- Challenge Participation actions ----------
  const approveChallengeParticipation = async (id) => {
    const cp = challengeParticipation.find((p) => p.id === id)
    if (!cp) return
    const challenge = challenges.find((c) => c.id === cp.challengeId)
    if (challenge?.evidenceRequired && !cp.proof) {
      alert('This challenge requires evidence: cannot approve without proof file.')
      return
    }
    const xp = challenge ? challenge.xp : 0
    await API.challengeParticipation.update(id, {
      approval: 'Approved',
      xp_awarded: xp
    })
    const emp = employees.find((e) => e.id === cp.employeeId)
    if (emp) {
      const newXp = emp.xp + xp
      await API.employees.update(cp.employeeId, {
        xp: newXp
      })
      const completedCount = challengeParticipation.filter((x) => x.employeeId === emp.id && x.approval === 'Approved').length + 1
      await checkBadgeUnlocks(emp.id, newXp, emp.points, completedCount)
    }
    await pushNotification('approvalDecision', `Challenge participation approved (+${xp} XP)`)
    await loadAll()
  }

  // ---------- Challenge Status Transition ----------
  const updateChallengeStatus = async (id, newStatus) => {
    await API.challenges.update(id, { status: newStatus })
    await loadAll()
  }

  // ---------- Reward Redemption ----------
  const redeemReward = (rewardId, employeeId) => {
    const reward = rewards.find((r) => r.id === rewardId)
    const employee = employees.find((e) => e.id === employeeId)
    if (!reward || !employee) return { ok: false, message: 'Not found' }
    if (reward.stock <= 0) return { ok: false, message: 'Out of stock' }
    if (employee.points < reward.pointsRequired) return { ok: false, message: 'Insufficient points' }
    
    // Call background API
    API.redeemReward(rewardId, employeeId)
      .then(() => loadAll())
      .catch(err => console.error('Redeem failed:', err))

    return { ok: true, message: `Redeemed ${reward.name}` }
  }

  // ---------- Auto Emission Calculation ----------
  const addBusinessOperation = (departmentId, source, quantity) => {
    if (!settings.autoEmissionCalculation) return null
    const factorMap = { Purchase: 'ef1', Manufacturing: 'ef2', Expense: 'ef3', Fleet: 'ef4' }
    const factor = emissionFactors.find((f) => f.id === factorMap[source])
    if (!factor) return null
    const emissions = source === 'Manufacturing' || source === 'Fleet' ? quantity * factor.value : (quantity / 1000) * factor.value
    
    API.carbonTransactions.create({
      department_id: departmentId,
      source,
      emission_factor_id: factor.id,
      quantity,
      emissions,
      date: today.toISOString().slice(0, 10)
    }).then(() => loadAll())

    return { id: 'temp-tx', departmentId, source, quantity, emissions }
  }

  // ---------- Compliance Issue creation ----------
  const addComplianceIssue = (issue) => {
    if (!issue.owner || !issue.dueDate) {
      alert('Owner and Due Date are mandatory for every Compliance Issue.')
      return null
    }
    
    API.complianceIssues.create({
      audit_id: issue.auditId,
      severity: issue.severity,
      description: issue.description,
      owner: issue.owner,
      due_date: issue.dueDate,
      status: issue.status || 'Open'
    }).then(() => {
      pushNotification('newComplianceIssue', `New compliance issue raised: ${issue.description}`)
      loadAll()
    })

    return { id: 'temp-ci', ...issue }
  }

  const totalCarbonEmissions = useMemo(() => carbonTransactions.reduce((a, t) => a + t.emissions, 0), [carbonTransactions])

  // ---------- Department Carbon Tracking ----------
  const carbonByDepartment = useMemo(() => {
    return departments.map((dept) => {
      const txs = carbonTransactions.filter((t) => t.departmentId === dept.id)
      const total = txs.reduce((a, t) => a + t.emissions, 0)
      const bySource = txs.reduce((acc, t) => { acc[t.source] = (acc[t.source] || 0) + t.emissions; return acc }, {})
      return { departmentId: dept.id, departmentName: dept.name, total, bySource, txCount: txs.length }
    }).sort((a, b) => b.total - a.total)
  }, [departments, carbonTransactions])

  const addTrainingCompletion = async (record) => {
    await API.trainingCompletions.create({
      employee_id: record.employeeId,
      training_name: record.trainingName,
      completed_date: record.completedDate,
      hours: record.hours
    })
    await loadAll()
  }

  if (loading && currentUser) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', color: 'var(--ink-soft)', fontSize: 14, background: 'var(--paper)'
      }}>
        Loading EcoSphere...
      </div>
    )
  }

  return (
    <EcoCtx.Provider value={{
      currentUser, login, logout,
      departments, setDepartments,
      categories, setCategories,
      emissionFactors,
      productProfiles,
      goals,
      policies,
      badges, earnedBadges,
      rewards,
      employees, setEmployees,
      carbonTransactions, addBusinessOperation, carbonByDepartment,
      trainingCompletions, addTrainingCompletion,
      csrActivities, setCsrActivities,
      employeeParticipation, approveParticipation,
      challenges, setChallenges,
      challengeParticipation, setChallengeParticipation, approveChallengeParticipation,
      updateChallengeStatus,
      acknowledgements,
      audits,
      complianceIssues: flaggedComplianceIssues, addComplianceIssue,
      settings, setSettings,
      notifications,
      redeemReward,
      scores,
      totalCarbonEmissions,
      today,
      emailLog,
    }}>
      {children}
    </EcoCtx.Provider>
  )
}

export const useEco = () => useContext(EcoCtx)
