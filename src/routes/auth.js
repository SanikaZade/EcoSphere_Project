import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../db.js'

const router = express.Router()

// Always fall back to a dev secret so jwt.sign() never throws when JWT_SECRET is missing
const JWT_SECRET = process.env.JWT_SECRET || 'ecosphere_dev_jwt_secret_2024'

// Hardcoded demo users — used when DB is unavailable so login never hard-fails
const DEMO_USERS = [
  { id: 'demo-admin-001', name: 'Admin User', email: 'admin@ecosphere.com', password: 'admin123', role: 'Admin' },
  { id: 'demo-emp-001', name: 'Employee User', email: 'employee@ecosphere.com', password: 'emp123', role: 'Employee' },
]

// POST /api/auth/register — DISABLED: This platform uses fixed demo credentials only
router.post('/register', (req, res) => {
  res.status(403).json({ error: 'Registration is disabled. Please use the provided demo credentials.' })
})


// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }
    // ── Guaranteed Demo Login ─────────────────────────────────────────────
    const demo = DEMO_USERS.find(u => u.email === email && u.password === password)
    if (demo) {
      const token = jwt.sign(
        { id: demo.id, email: demo.email, role: demo.role },
        JWT_SECRET, { expiresIn: '7d' }
      )
      return res.json({
        token,
        user: { id: demo.id, name: demo.name, email: demo.email, role: demo.role }
      })
    }

    // ── Try database authentication ───────────────────────────────────────
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
      const dbUser = result.rows[0]

      if (dbUser && (await bcrypt.compare(password, dbUser.password_hash))) {
        const token = jwt.sign(
          { id: dbUser.id, email: dbUser.email, role: dbUser.role },
          JWT_SECRET, { expiresIn: '7d' }
        )
        return res.json({
          token,
          user: { id: dbUser.id, name: dbUser.name, email: dbUser.email, role: dbUser.role }
        })
      }

      // DB is reachable but credentials were wrong — do NOT fall back to demo
      return res.status(401).json({ error: 'Invalid email or password' })

    } catch (dbErr) {
      // ── DB unavailable — fall back to hardcoded demo credentials ─────────
      console.warn('[Auth] DB unavailable, checking demo credentials. Reason:', dbErr.message)

      const demo = DEMO_USERS.find(u => u.email === email && u.password === password)
      if (!demo) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }

      const token = jwt.sign(
        { id: demo.id, email: demo.email, role: demo.role },
        JWT_SECRET, { expiresIn: '7d' }
      )
      return res.json({
        token,
        user: { id: demo.id, name: demo.name, email: demo.email, role: demo.role }
      })
    }

  } catch (err) { next(err) }
})

export default router
