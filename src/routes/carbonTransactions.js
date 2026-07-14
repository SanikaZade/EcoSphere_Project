import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM carbon_transactions ORDER BY created_at ASC')
    res.json(result.rows)
  } catch (err) { next(err) }
})

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM carbon_transactions WHERE id = $1', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { department_id, source, emission_factor_id, quantity, emissions, date } = req.body
    if (!department_id || !source || quantity === undefined || emissions === undefined) {
      return res.status(400).json({ error: 'department_id, source, quantity, emissions are required' })
    }
    const result = await pool.query(
      `INSERT INTO carbon_transactions (department_id, source, emission_factor_id, quantity, emissions, date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [department_id, source, emission_factor_id || null, quantity, emissions, date || new Date()]
    )
    res.status(201).json(result.rows[0])
  } catch (err) { next(err) }
})

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const { department_id, source, emission_factor_id, quantity, emissions, date } = req.body
    const result = await pool.query(
      `UPDATE carbon_transactions SET
         department_id = COALESCE($1, department_id),
         source = COALESCE($2, source),
         emission_factor_id = COALESCE($3, emission_factor_id),
         quantity = COALESCE($4, quantity),
         emissions = COALESCE($5, emissions),
         date = COALESCE($6, date)
       WHERE id = $7 RETURNING *`,
      [
        department_id,
        source,
        emission_factor_id,
        quantity !== undefined ? Number(quantity) : undefined,
        emissions !== undefined ? Number(emissions) : undefined,
        date,
        req.params.id
      ]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM carbon_transactions WHERE id = $1', [req.params.id])
    res.json({ deleted: true })
  } catch (err) { next(err) }
})

export default router
