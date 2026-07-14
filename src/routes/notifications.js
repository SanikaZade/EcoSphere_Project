import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (err) { next(err) }
})

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM notifications WHERE id = $1', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { type, message, read } = req.body
    if (!type || !message) return res.status(400).json({ error: 'type and message are required' })
    const result = await pool.query(
      'INSERT INTO notifications (type, message, read) VALUES ($1, $2, $3) RETURNING *',
      [type, message, read || false]
    )
    res.status(201).json(result.rows[0])
  } catch (err) { next(err) }
})

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const { type, message, read } = req.body
    const result = await pool.query(
      `UPDATE notifications SET
         type = COALESCE($1, type),
         message = COALESCE($2, message),
         read = COALESCE($3, read)
       WHERE id = $4 RETURNING *`,
      [type, message, read, req.params.id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM notifications WHERE id = $1', [req.params.id])
    res.json({ deleted: true })
  } catch (err) { next(err) }
})

export default router
