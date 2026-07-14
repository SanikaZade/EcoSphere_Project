import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM earned_badges ORDER BY created_at ASC')
    res.json(result.rows)
  } catch (err) { next(err) }
})

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM earned_badges WHERE id = $1', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { employee_id, badge_id, unlocked_at } = req.body
    if (!employee_id || !badge_id) return res.status(400).json({ error: 'employee_id and badge_id are required' })
    const result = await pool.query(
      'INSERT INTO earned_badges (employee_id, badge_id, unlocked_at) VALUES ($1, $2, $3) RETURNING *',
      [employee_id, badge_id, unlocked_at || new Date()]
    )
    res.status(201).json(result.rows[0])
  } catch (err) { next(err) }
})

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const { employee_id, badge_id, unlocked_at } = req.body
    const result = await pool.query(
      `UPDATE earned_badges SET
         employee_id = COALESCE($1, employee_id),
         badge_id = COALESCE($2, badge_id),
         unlocked_at = COALESCE($3, unlocked_at)
       WHERE id = $4 RETURNING *`,
      [employee_id, badge_id, unlocked_at, req.params.id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM earned_badges WHERE id = $1', [req.params.id])
    res.json({ deleted: true })
  } catch (err) { next(err) }
})

export default router
