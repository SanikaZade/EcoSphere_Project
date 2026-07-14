import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM employee_participation ORDER BY created_at ASC')
    res.json(result.rows)
  } catch (err) { next(err) }
})

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM employee_participation WHERE id = $1', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { employee_id, activity_id, proof, approval_status, points_earned, completion_date } = req.body
    if (!employee_id || !activity_id) return res.status(400).json({ error: 'employee_id and activity_id are required' })
    const result = await pool.query(
      `INSERT INTO employee_participation (employee_id, activity_id, proof, approval_status, points_earned, completion_date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [employee_id, activity_id, proof || null, approval_status || 'Pending', points_earned || 0, completion_date || null]
    )
    res.status(201).json(result.rows[0])
  } catch (err) { next(err) }
})

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const { employee_id, activity_id, proof, approval_status, points_earned, completion_date } = req.body
    const result = await pool.query(
      `UPDATE employee_participation SET
         employee_id = COALESCE($1, employee_id),
         activity_id = COALESCE($2, activity_id),
         proof = COALESCE($3, proof),
         approval_status = COALESCE($4, approval_status),
         points_earned = COALESCE($5, points_earned),
         completion_date = COALESCE($6, completion_date)
       WHERE id = $7 RETURNING *`,
      [
        employee_id,
        activity_id,
        proof,
        approval_status,
        points_earned !== undefined ? Number(points_earned) : undefined,
        completion_date,
        req.params.id
      ]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM employee_participation WHERE id = $1', [req.params.id])
    res.json({ deleted: true })
  } catch (err) { next(err) }
})

export default router
