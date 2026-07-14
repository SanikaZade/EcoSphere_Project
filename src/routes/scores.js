import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const settingsResult = await pool.query('SELECT * FROM settings LIMIT 1')
    const s = settingsResult.rows[0] || { weight_environmental: 40, weight_social: 30, weight_governance: 30 }
    const w = {
      environmental: s.weight_environmental,
      social: s.weight_social,
      governance: s.weight_governance
    }
    const depts = await pool.query('SELECT * FROM departments')
    const goals = await pool.query('SELECT * FROM goals')
    const employees = await pool.query('SELECT * FROM employees')
    const participation = await pool.query(
      "SELECT * FROM employee_participation WHERE approval_status = 'Approved'"
    )
    const training = await pool.query('SELECT DISTINCT employee_id FROM training_completions')
    const acks = await pool.query('SELECT * FROM acknowledgements')
    const issues = await pool.query(
      "SELECT * FROM compliance_issues WHERE status = 'Open' AND due_date < CURRENT_DATE"
    )

    const byDept = depts.rows.map(dept => {
      const deptGoals = goals.rows.filter(g => g.department_id === dept.id)
      let envScore = 70
      if (deptGoals.length) {
        const ratios = deptGoals.map(g => {
          return Math.max(0, 1 - Math.abs(g.actual - g.target) / (g.target || 1))
        })
        envScore = Math.round((ratios.reduce((a,b) => a+b, 0) / ratios.length) * 100)
      }

      const deptEmps = employees.rows.filter(e => e.department_id === dept.id)
      const empIds = deptEmps.map(e => e.id)
      const deptPart = participation.rows.filter(p => empIds.includes(p.employee_id))
      const csrRate = deptPart.length / (deptEmps.length || 1)
      const genderCounts = deptEmps.reduce((acc, e) => {
        acc[e.gender] = (acc[e.gender] || 0) + 1; return acc
      }, {})
      const gv = Object.values(genderCounts)
      const diversity = gv.length > 1
        ? 1 - Math.abs((gv[0] - (gv[1]||0)) / (deptEmps.length||1)) : 0.5
      const trainedCount = training.rows.filter(t => empIds.includes(t.employee_id)).length
      const trainingRate = deptEmps.length ? trainedCount / deptEmps.length : 0.5
      const socialScore = Math.round((csrRate*0.45 + diversity*0.25 + trainingRate*0.3) * 100)

      const deptAcks = acks.rows.filter(a => empIds.includes(a.employee_id))
      const ackRate = deptEmps.length ? deptAcks.length / deptEmps.length : 0.5
      const govScore = Math.max(0, Math.round(ackRate * 100 - issues.rows.length * 5))

      const total = Math.round(
        (envScore * w.environmental + socialScore * w.social + govScore * w.governance) / 100
      )
      return {
        departmentId: dept.id,
        departmentName: dept.name,
        environmental: envScore,
        social: socialScore,
        governance: govScore,
        total
      }
    })

    const org = byDept.length
      ? Math.round(byDept.reduce((a,b) => a+b.total, 0) / byDept.length) : 0

    res.json({ byDept, org })
  } catch (err) { next(err) }
})

export default router
