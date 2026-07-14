import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM csr_activities ORDER BY created_at ASC')
    res.json(result.rows)
  } catch (err) { next(err) }
})

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM csr_activities WHERE id = $1', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { category_id, title, date, location, status } = req.body
    if (!title) return res.status(400).json({ error: 'title is required' })
    const result = await pool.query(
      'INSERT INTO csr_activities (category_id, title, date, location, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [category_id || null, title, date || null, location || '', status || 'Upcoming']
    )
    res.status(201).json(result.rows[0])
  } catch (err) { next(err) }
})

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const { category_id, title, date, location, status } = req.body
    const result = await pool.query(
      `UPDATE csr_activities SET
         category_id = COALESCE($1, category_id),
         title = COALESCE($2, title),
         date = COALESCE($3, date),
         location = COALESCE($4, location),
         status = COALESCE($5, status)
       WHERE id = $6 RETURNING *`,
      [category_id, title, date, location, status, req.params.id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM csr_activities WHERE id = $1', [req.params.id])
    res.json({ deleted: true })
  } catch (err) { next(err) }
})

export default router
