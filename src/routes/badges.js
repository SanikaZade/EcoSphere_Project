import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM badges ORDER BY created_at ASC')
    res.json(result.rows)
  } catch (err) { next(err) }
})

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM badges WHERE id = $1', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { name, description, unlock_rule, icon } = req.body
    if (!name || !unlock_rule) return res.status(400).json({ error: 'name and unlock_rule are required' })
    const result = await pool.query(
      'INSERT INTO badges (name, description, unlock_rule, icon) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description || '', typeof unlock_rule === 'string' ? unlock_rule : JSON.stringify(unlock_rule), icon || '']
    )
    res.status(201).json(result.rows[0])
  } catch (err) { next(err) }
})

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const { name, description, unlock_rule, icon } = req.body
    const result = await pool.query(
      `UPDATE badges SET
         name = COALESCE($1, name),
         description = COALESCE($2, description),
         unlock_rule = COALESCE($3, unlock_rule),
         icon = COALESCE($4, icon)
       WHERE id = $5 RETURNING *`,
      [
        name,
        description,
        unlock_rule ? (typeof unlock_rule === 'string' ? unlock_rule : JSON.stringify(unlock_rule)) : undefined,
        icon,
        req.params.id
      ]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM badges WHERE id = $1', [req.params.id])
    res.json({ deleted: true })
  } catch (err) { next(err) }
})

export default router
