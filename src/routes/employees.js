import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM employees ORDER BY created_at ASC')
    res.json(result.rows)
  } catch (err) { next(err) }
})

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM employees WHERE id = $1', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { name, department_id, gender, xp, points } = req.body
    if (!name) return res.status(400).json({ error: 'name is required' })
    const result = await pool.query(
      'INSERT INTO employees (name, department_id, gender, xp, points) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, department_id || null, gender || '', xp || 0, points || 0]
    )
    res.status(201).json(result.rows[0])
  } catch (err) { next(err) }
})

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const { name, department_id, gender, xp, points } = req.body
    const result = await pool.query(
      `UPDATE employees SET
         name = COALESCE($1, name),
         department_id = COALESCE($2, department_id),
         gender = COALESCE($3, gender),
         xp = COALESCE($4, xp),
         points = COALESCE($5, points)
       WHERE id = $6 RETURNING *`,
      [
        name,
        department_id,
        gender,
        xp !== undefined ? Number(xp) : undefined,
        points !== undefined ? Number(points) : undefined,
        req.params.id
      ]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM employees WHERE id = $1', [req.params.id])
    res.json({ deleted: true })
  } catch (err) { next(err) }
})

export default router
