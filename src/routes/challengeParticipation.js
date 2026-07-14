import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM challenge_participation ORDER BY created_at ASC')
    res.json(result.rows)
  } catch (err) { next(err) }
})

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM challenge_participation WHERE id = $1', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { challenge_id, employee_id, progress, proof, approval, xp_awarded } = req.body
    if (!challenge_id || !employee_id) return res.status(400).json({ error: 'challenge_id and employee_id are required' })
    const result = await pool.query(
      `INSERT INTO challenge_participation (challenge_id, employee_id, progress, proof, approval, xp_awarded)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [challenge_id, employee_id, progress || 0, proof || null, approval || 'Pending', xp_awarded || 0]
    )
    res.status(201).json(result.rows[0])
  } catch (err) { next(err) }
})

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const { challenge_id, employee_id, progress, proof, approval, xp_awarded } = req.body
    const result = await pool.query(
      `UPDATE challenge_participation SET
         challenge_id = COALESCE($1, challenge_id),
         employee_id = COALESCE($2, employee_id),
         progress = COALESCE($3, progress),
         proof = COALESCE($4, proof),
         approval = COALESCE($5, approval),
         xp_awarded = COALESCE($6, xp_awarded)
       WHERE id = $7 RETURNING *`,
      [
        challenge_id,
        employee_id,
        progress !== undefined ? Number(progress) : undefined,
        proof,
        approval,
        xp_awarded !== undefined ? Number(xp_awarded) : undefined,
        req.params.id
      ]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM challenge_participation WHERE id = $1', [req.params.id])
    res.json({ deleted: true })
  } catch (err) { next(err) }
})

export default router
