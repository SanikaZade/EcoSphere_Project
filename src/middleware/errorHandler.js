import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// PostgreSQL error codes or messages that indicate DB is unavailable or schema is missing
function isDbError(err) {
  if (!err) return false
  const code = err.code || ''
  const msg = err.message || ''
  return (
    code === 'ECONNREFUSED' ||
    code === '42P01' ||   // undefined_table
    code === '3D000' ||   // invalid_catalog_name (wrong db)
    code === '57P01' ||   // admin shutdown
    msg.includes('ECONNREFUSED') ||
    msg.includes('relation') ||
    msg.includes('does not exist') ||
    msg.includes('password authentication failed') ||
    msg.includes('connect ETIMEDOUT')
  )
}

export function errorHandler(err, req, res, next) {
  const label = `${req.method} ${req.originalUrl}`
  console.error(`[Error] ${label}:`, err.message)

  // Write to log file for debugging
  try {
    const logPath = path.join(__dirname, '../../error.log')
    const logMessage = `[${new Date().toISOString()}] ${label}\nError: ${err.stack || err.message || err}\n\n`
    fs.appendFileSync(logPath, logMessage, 'utf8')
  } catch (e) {
    // ignore log failures
  }

  // For DB errors on GET requests: return empty array so the UI stays functional
  if (isDbError(err) && req.method === 'GET') {
    return res.json([])
  }

  res.status(500).json({ error: err.message || 'Internal server error' })
}
