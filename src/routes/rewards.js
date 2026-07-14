import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM rewards ORDER BY created_at ASC')
    res.json(result.rows)
  } catch (err) { next(err) }
})

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM rewards WHERE id = $1', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { name, description, points_required, stock, status } = req.body
    if (!name || points_required === undefined) return res.status(400).json({ error: 'name and points_required are required' })
    const result = await pool.query(
      'INSERT INTO rewards (name, description, points_required, stock, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description || '', points_required, stock || 0, status || 'Active']
    )
    res.status(201).json(result.rows[0])
  } catch (err) { next(err) }
})

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const { name, description, points_required, stock, status } = req.body
    const result = await pool.query(
      `UPDATE rewards SET
         name = COALESCE($1, name),
         description = COALESCE($2, description),
         points_required = COALESCE($3, points_required),
         stock = COALESCE($4, stock),
         status = COALESCE($5, status)
       WHERE id = $6 RETURNING *`,
      [
        name,
        description,
        points_required !== undefined ? Number(points_required) : undefined,
        stock !== undefined ? Number(stock) : undefined,
        status,
        req.params.id
      ]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM rewards WHERE id = $1', [req.params.id])
    res.json({ deleted: true })
  } catch (err) { next(err) }
})

// Part 6 — Redemption endpoint
router.post('/:id/redeem', requireAuth, async (req, res, next) => {
  try {
    const { employee_id } = req.body
    if (!employee_id) return res.status(400).json({ error: 'employee_id is required' })
    const reward = await pool.query(
      'SELECT * FROM rewards WHERE id = $1', [req.params.id]
    )
    const r = reward.rows[0]
    if (!r) return res.status(404).json({ error: 'Reward not found' })
    if (r.stock <= 0) {
      return res.status(400).json({ error: 'Out of stock' })
    }
    const emp = await pool.query(
      'SELECT * FROM employees WHERE id = $1', [employee_id]
    )
    const e = emp.rows[0]
    if (!e) return res.status(404).json({ error: 'Employee not found' })
    if (e.points < r.points_required) {
      return res.status(400).json({ error: 'Insufficient points' })
    }
    await pool.query(
      'UPDATE rewards SET stock = stock - 1 WHERE id = $1', [req.params.id]
    )
    await pool.query(
      'UPDATE employees SET points = points - $1 WHERE id = $2',
      [r.points_required, employee_id]
    )
    res.json({ ok: true, message: `Redeemed ${r.name}` })
  } catch (err) { next(err) }
})

export default router
