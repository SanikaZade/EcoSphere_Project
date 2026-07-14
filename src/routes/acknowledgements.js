import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM acknowledgements ORDER BY created_at ASC')
    res.json(result.rows)
  } catch (err) { next(err) }
})

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM acknowledgements WHERE id = $1', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { policy_id, employee_id, acknowledged_at } = req.body
    if (!policy_id || !employee_id) return res.status(400).json({ error: 'policy_id and employee_id are required' })
    const result = await pool.query(
      'INSERT INTO acknowledgements (policy_id, employee_id, acknowledged_at) VALUES ($1, $2, $3) RETURNING *',
      [policy_id, employee_id, acknowledged_at || new Date()]
    )
    res.status(201).json(result.rows[0])
  } catch (err) { next(err) }
})

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const { policy_id, employee_id, acknowledged_at } = req.body
    const result = await pool.query(
      `UPDATE acknowledgements SET
         policy_id = COALESCE($1, policy_id),
         employee_id = COALESCE($2, employee_id),
         acknowledged_at = COALESCE($3, acknowledged_at)
       WHERE id = $4 RETURNING *`,
      [policy_id, employee_id, acknowledged_at, req.params.id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM acknowledgements WHERE id = $1', [req.params.id])
    res.json({ deleted: true })
  } catch (err) { next(err) }
})

export default router
