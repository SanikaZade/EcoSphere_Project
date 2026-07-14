import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM audits ORDER BY created_at ASC')
    res.json(result.rows)
  } catch (err) { next(err) }
})

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM audits WHERE id = $1', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { title, scope, date, status } = req.body
    if (!title) return res.status(400).json({ error: 'title is required' })
    const result = await pool.query(
      'INSERT INTO audits (title, scope, date, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, scope || '', date || null, status || 'Scheduled']
    )
    res.status(201).json(result.rows[0])
  } catch (err) { next(err) }
})

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const { title, scope, date, status } = req.body
    const result = await pool.query(
      `UPDATE audits SET
         title = COALESCE($1, title),
         scope = COALESCE($2, scope),
         date = COALESCE($3, date),
         status = COALESCE($4, status)
       WHERE id = $5 RETURNING *`,
      [title, scope, date, status, req.params.id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM audits WHERE id = $1', [req.params.id])
    res.json({ deleted: true })
  } catch (err) { next(err) }
})

export default router
