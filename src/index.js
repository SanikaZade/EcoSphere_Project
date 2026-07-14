import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import authRouter from './routes/auth.js'
import departmentsRouter from './routes/departments.js'
import categoriesRouter from './routes/categories.js'
import emissionFactorsRouter from './routes/emissionFactors.js'
import productProfilesRouter from './routes/productProfiles.js'
import goalsRouter from './routes/goals.js'
import policiesRouter from './routes/policies.js'
import badgesRouter from './routes/badges.js'
import earnedBadgesRouter from './routes/earnedBadges.js'
import rewardsRouter from './routes/rewards.js'
import employeesRouter from './routes/employees.js'
import carbonTransactionsRouter from './routes/carbonTransactions.js'
import csrActivitiesRouter from './routes/csrActivities.js'
import employeeParticipationRouter from './routes/employeeParticipation.js'
import challengesRouter from './routes/challenges.js'
import challengeParticipationRouter from './routes/challengeParticipation.js'
import acknowledgementsRouter from './routes/acknowledgements.js'
import auditsRouter from './routes/audits.js'
import complianceIssuesRouter from './routes/complianceIssues.js'
import trainingCompletionsRouter from './routes/trainingCompletions.js'
import notificationsRouter from './routes/notifications.js'
import settingsRouter from './routes/settings.js'
import scoresRouter from './routes/scores.js'
import { errorHandler } from './middleware/errorHandler.js'
import { initDb } from './db.js'

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))
app.use(express.json())
// Serve built frontend assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'))
  // All unknown routes should serve index.html (for React Router)
  app.get('*', (req, res) => {
    res.sendFile('index.html', { root: 'dist' })
  })
}

// Health endpoint
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRouter)
app.use('/api/departments', departmentsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/emission-factors', emissionFactorsRouter)
app.use('/api/product-profiles', productProfilesRouter)
app.use('/api/goals', goalsRouter)
app.use('/api/policies', policiesRouter)
app.use('/api/badges', badgesRouter)
app.use('/api/earned-badges', earnedBadgesRouter)
app.use('/api/rewards', rewardsRouter)
app.use('/api/employees', employeesRouter)
app.use('/api/carbon-transactions', carbonTransactionsRouter)
app.use('/api/csr-activities', csrActivitiesRouter)
app.use('/api/employee-participation', employeeParticipationRouter)
app.use('/api/challenges', challengesRouter)
app.use('/api/challenge-participation', challengeParticipationRouter)
app.use('/api/acknowledgements', acknowledgementsRouter)
app.use('/api/audits', auditsRouter)
app.use('/api/compliance-issues', complianceIssuesRouter)
app.use('/api/training-completions', trainingCompletionsRouter)
app.use('/api/notifications', notificationsRouter)
app.use('/api/settings', settingsRouter)
app.use('/api/scores', scoresRouter)

app.use(errorHandler)

// Initialize Database schema and seed default users on startup
await initDb()

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`EcoSphere API running on port ${PORT}`))
