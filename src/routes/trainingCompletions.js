import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM training_completions ORDER BY created_at ASC')
    res.json(result.rows)
  } catch (err) { next(err) }
})

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM training_completions WHERE id = $1', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { employee_id, training_name, completed_date, hours } = req.body
    if (!employee_id || !training_name) return res.status(400).json({ error: 'employee_id and training_name are required' })
    const result = await pool.query(
      `INSERT INTO training_completions (employee_id, training_name, completed_date, hours)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [employee_id, training_name, completed_date || null, hours || 0]
    )
    res.status(201).json(result.rows[0])
  } catch (err) { next(err) }
})

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const { employee_id, training_name, completed_date, hours } = req.body
    const result = await pool.query(
      `UPDATE training_completions SET
         employee_id = COALESCE($1, employee_id),
         training_name = COALESCE($2, training_name),
         completed_date = COALESCE($3, completed_date),
         hours = COALESCE($4, hours)
       WHERE id = $5 RETURNING *`,
      [employee_id, training_name, completed_date, hours !== undefined ? Number(hours) : undefined, req.params.id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM training_completions WHERE id = $1', [req.params.id])
    res.json({ deleted: true })
  } catch (err) { next(err) }
})

export default router
