import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM product_profiles ORDER BY created_at ASC')
    res.json(result.rows)
  } catch (err) { next(err) }
})

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM product_profiles WHERE id = $1', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { product_name, sustainable_material, recycled_content, carbon_footprint } = req.body
    if (!product_name) return res.status(400).json({ error: 'product_name is required' })
    const result = await pool.query(
      `INSERT INTO product_profiles (product_name, sustainable_material, recycled_content, carbon_footprint)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [product_name, sustainable_material || false, recycled_content || '', carbon_footprint || '']
    )
    res.status(201).json(result.rows[0])
  } catch (err) { next(err) }
})

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const { product_name, sustainable_material, recycled_content, carbon_footprint } = req.body
    const result = await pool.query(
      `UPDATE product_profiles SET
         product_name = COALESCE($1, product_name),
         sustainable_material = COALESCE($2, sustainable_material),
         recycled_content = COALESCE($3, recycled_content),
         carbon_footprint = COALESCE($4, carbon_footprint)
       WHERE id = $5 RETURNING *`,
      [product_name, sustainable_material, recycled_content, carbon_footprint, req.params.id]
    )
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' })
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM product_profiles WHERE id = $1', [req.params.id])
    res.json({ deleted: true })
  } catch (err) { next(err) }
})

export default router
