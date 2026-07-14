import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM emission_factors ORDER BY created_at ASC')
    res.json(result.rows)
  } catch (err) { next(err) }
})

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM emission_factors WHERE id = $1', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { activity_type, unit, value, updated_at } = req.body
    if (!activity_type || !unit || value === undefined) {
      return res.status(400).json({ error: 'activity_type, unit, and value are required' })
    }
    const result = await pool.query(
      'INSERT INTO emission_factors (activity_type, unit, value, updated_at) VALUES ($1, $2, $3, $4) RETURNING *',
      [activity_type, unit, value, updated_at || new Date()]
    )
    res.status(201).json(result.rows[0])
  } catch (err) { next(err) }
})

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const { activity_type, unit, value, updated_at } = req.body
    const result = await pool.query(
      `UPDATE emission_factors SET
         activity_type = COALESCE($1, activity_type),
         unit = COALESCE($2, unit),
         value = COALESCE($3, value),
         updated_at = COALESCE($4, updated_at)
       WHERE id = $5 RETURNING *`,
      [activity_type, unit, value !== undefined ? Number(value) : undefined, updated_at, req.params.id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM emission_factors WHERE id = $1', [req.params.id])
    res.json({ deleted: true })
  } catch (err) { next(err) }
})

export default router
