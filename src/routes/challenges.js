import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM challenges ORDER BY created_at ASC')
    res.json(result.rows)
  } catch (err) { next(err) }
})

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM challenges WHERE id = $1', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { title, category_id, description, xp, difficulty, evidence_required, deadline, status } = req.body
    if (!title) return res.status(400).json({ error: 'title is required' })
    const result = await pool.query(
      `INSERT INTO challenges (title, category_id, description, xp, difficulty, evidence_required, deadline, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, category_id || null, description || '', xp || 0, difficulty || 'Medium', evidence_required || false, deadline || null, status || 'Draft']
    )
    res.status(201).json(result.rows[0])
  } catch (err) { next(err) }
})

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const { title, category_id, description, xp, difficulty, evidence_required, deadline, status } = req.body
    const result = await pool.query(
      `UPDATE challenges SET
         title = COALESCE($1, title),
         category_id = COALESCE($2, category_id),
         description = COALESCE($3, description),
         xp = COALESCE($4, xp),
         difficulty = COALESCE($5, difficulty),
         evidence_required = COALESCE($6, evidence_required),
         deadline = COALESCE($7, deadline),
         status = COALESCE($8, status)
       WHERE id = $9 RETURNING *`,
      [
        title,
        category_id,
        description,
        xp !== undefined ? Number(xp) : undefined,
        difficulty,
        evidence_required,
        deadline,
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
    await pool.query('DELETE FROM challenges WHERE id = $1', [req.params.id])
    res.json({ deleted: true })
  } catch (err) { next(err) }
})

export default router
