import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

// GET overdue route (registered before GET /:id so it doesn't conflict)
router.get('/overdue', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM compliance_issues 
       WHERE status = 'Open' AND due_date < CURRENT_DATE
       ORDER BY due_date ASC`
    )
    res.json(result.rows)
  } catch (err) { next(err) }
})

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM compliance_issues ORDER BY created_at ASC')
    res.json(result.rows)
  } catch (err) { next(err) }
})

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM compliance_issues WHERE id = $1', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { audit_id, severity, description, owner, due_date, status } = req.body
    // Part 6 validation
    if (!owner || !due_date) {
      return res.status(400).json({ 
        error: 'owner and due_date are mandatory for compliance issues' 
      })
    }
    const result = await pool.query(
      `INSERT INTO compliance_issues (audit_id, severity, description, owner, due_date, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [audit_id || null, severity || 'Medium', description || '', owner, due_date, status || 'Open']
    )
    res.status(201).json(result.rows[0])
  } catch (err) { next(err) }
})

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const { audit_id, severity, description, owner, due_date, status } = req.body
    const result = await pool.query(
      `UPDATE compliance_issues SET
         audit_id = COALESCE($1, audit_id),
         severity = COALESCE($2, severity),
         description = COALESCE($3, description),
         owner = COALESCE($4, owner),
         due_date = COALESCE($5, due_date),
         status = COALESCE($6, status)
       WHERE id = $7 RETURNING *`,
      [audit_id, severity, description, owner, due_date, status, req.params.id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM compliance_issues WHERE id = $1', [req.params.id])
    res.json({ deleted: true })
  } catch (err) { next(err) }
})

export default router
