import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

// GET all
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM departments ORDER BY created_at ASC'
    )
    res.json(result.rows)
  } catch (err) { next(err) }
})

// GET by id
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM departments WHERE id = $1', [req.params.id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

// POST create
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { name, code, head, parent_id, employee_count, status } = req.body
    if (!name) return res.status(400).json({ error: 'name is required' })
    const result = await pool.query(
      `INSERT INTO departments (name, code, head, parent_id, employee_count, status)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [name, code, head, parent_id || null, employee_count || 0, status || 'Active']
    )
    res.status(201).json(result.rows[0])
  } catch (err) { next(err) }
})

// PATCH update
router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const { name, code, head, parent_id, employee_count, status } = req.body
    const result = await pool.query(
      `UPDATE departments SET
         name = COALESCE($1, name),
         code = COALESCE($2, code),
         head = COALESCE($3, head),
         parent_id = COALESCE($4, parent_id),
         employee_count = COALESCE($5, employee_count),
         status = COALESCE($6, status)
       WHERE id = $7 RETURNING *`,
      [name, code, head, parent_id, employee_count, status, req.params.id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

// DELETE
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM departments WHERE id = $1', [req.params.id])
    res.json({ deleted: true })
  } catch (err) { next(err) }
})

export default router
