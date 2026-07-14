import express from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

// GET settings (returns single row)
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM settings LIMIT 1')
    if (result.rows.length === 0) {
      // Create default if not exists
      const insertResult = await pool.query('INSERT INTO settings DEFAULT VALUES RETURNING *')
      return res.json(insertResult.rows[0])
    }
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

// PATCH settings
router.patch('/', requireAuth, async (req, res, next) => {
  try {
    const { auto_emission_calculation, evidence_required, badge_auto_award, weight_environmental, weight_social, weight_governance, notification_config } = req.body
    
    // Get first settings row ID
    let settingsRow = await pool.query('SELECT id FROM settings LIMIT 1')
    if (settingsRow.rows.length === 0) {
      await pool.query('INSERT INTO settings DEFAULT VALUES')
      settingsRow = await pool.query('SELECT id FROM settings LIMIT 1')
    }
    const id = settingsRow.rows[0].id

    const result = await pool.query(
      `UPDATE settings SET
         auto_emission_calculation = COALESCE($1, auto_emission_calculation),
         evidence_required = COALESCE($2, evidence_required),
         badge_auto_award = COALESCE($3, badge_auto_award),
         weight_environmental = COALESCE($4, weight_environmental),
         weight_social = COALESCE($5, weight_social),
         weight_governance = COALESCE($6, weight_governance),
         notification_config = COALESCE($7, notification_config)
       WHERE id = $8 RETURNING *`,
      [
        auto_emission_calculation,
        evidence_required,
        badge_auto_award,
        weight_environmental !== undefined ? Number(weight_environmental) : undefined,
        weight_social !== undefined ? Number(weight_social) : undefined,
        weight_governance !== undefined ? Number(weight_governance) : undefined,
        notification_config ? (typeof notification_config === 'string' ? notification_config : JSON.stringify(notification_config)) : undefined,
        id
      ]
    )
    res.json(result.rows[0])
  } catch (err) { next(err) }
})

export default router
