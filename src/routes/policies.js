import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM policies ORDER BY created_at ASC')
    res.json(result.rows)
  } catch (err) { next(err) }
})

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM policies WHERE id = $1', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { title, published_at, status } = req.body
    if (!title) return res.status(400).json({ error: 'title is required' })
    const result = await pool.query(
      'INSERT INTO policies (title, published_at, status) VALUES ($1, $2, $3) RETURNING *',
      [title, published_at || new Date(), status || 'Draft']
    )
    res.status(201).json(result.rows[0])
  } catch (err) { next(err) }
})

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const { title, published_at, status } = req.body
    const result = await pool.query(
      `UPDATE policies SET
         title = COALESCE($1, title),
         published_at = COALESCE($2, published_at),
         status = COALESCE($3, status)
       WHERE id = $4 RETURNING *`,
      [title, published_at, status, req.params.id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM policies WHERE id = $1', [req.params.id])
    res.json({ deleted: true })
  } catch (err) { next(err) }
})

export default router
