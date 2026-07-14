import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.join(__dirname, '../database.sqlite')

let db = null;

export async function initDb() {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })
    // Enable WAL and foreign‑keys
    await db.exec('PRAGMA journal_mode = WAL')
    await db.exec('PRAGMA foreign_keys = ON')
    console.log('[DB] Connected to SQLite database.')
  } catch (err) {
    console.error('[DB] Failed to open SQLite database:', err.message)
    return
  }

  // Schema and seed handling
  try {
    const tableCheck = await db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='users'`)
    if (!tableCheck) {
      console.log('[DB] Tables not found — running schema.sql ...')
      const schemaPath = path.join(__dirname, 'schema.sql')
      const schema = fs.readFileSync(schemaPath, 'utf8')
      await db.exec(schema)
      console.log('[DB] Schema applied.')
    }

    const userCount = await db.get('SELECT COUNT(*) as count FROM users')
    if (userCount.count === 0) {
      console.log('[DB] Seeding full ESG sample dataset from seed.sql ...')
      const seedPath = path.join(__dirname, 'seed.sql')
      const seedSql = fs.readFileSync(seedPath, 'utf8')
      await db.exec(seedSql)
      console.log('[DB] ESG sample data loaded ✓ (6 depts, 12 employees, full data set).')
    } else {
      console.log('[DB] Existing data found — skipping seed.')
    }
  } catch (err) {
    console.error('[DB] Schema / seed error:', err.message)
    logToFile(`SCHEMA/SEED ERROR: ${err.stack || err.message}`)
  }
}

function logToFile(message) {
  try {
    const logPath = path.join(__dirname, '../error.log')
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${message}\n`, 'utf8')
  } catch (_) {}
}

// ── Proxy Pool Object ────────────────────────────────────────────────────────
// This mimics the pg Pool interface so we don't have to rewrite 15 route files.
export const pool = {
  query: async (text, params = []) => {
    if (!db) throw new Error('Database not connected')
    const rows = await db.all(text, params)
    return { rows, rowCount: rows.length }
  },
  on: () => {}
}
