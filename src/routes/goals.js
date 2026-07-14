import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM goals ORDER BY created_at ASC')
    res.json(result.rows)
  } catch (err) { next(err) }
})

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM goals WHERE id = $1', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { department_id, title, target, actual, unit, due_date } = req.body
    if (!title || target === undefined) return res.status(400).json({ error: 'title and target are required' })
    const result = await pool.query(
      `INSERT INTO goals (department_id, title, target, actual, unit, due_date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [department_id || null, title, target, actual || 0, unit || '', due_date || null]
    )
    res.status(201).json(result.rows[0])
  } catch (err) { next(err) }
})

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const { department_id, title, target, actual, unit, due_date } = req.body
    const result = await pool.query(
      `UPDATE goals SET
         department_id = COALESCE($1, department_id),
         title = COALESCE($2, title),
         target = COALESCE($3, target),
         actual = COALESCE($4, actual),
         unit = COALESCE($5, unit),
         due_date = COALESCE($6, due_date)
       WHERE id = $7 RETURNING *`,
      [
        department_id,
        title,
        target !== undefined ? Number(target) : undefined,
        actual !== undefined ? Number(actual) : undefined,
        unit,
        due_date,
        req.params.id
      ]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM goals WHERE id = $1', [req.params.id])
    res.json({ deleted: true })
  } catch (err) { next(err) }
})

export default router
