import { api } from './client.js'

const make = (base) => ({
  list:   ()         => api.get(base),
  get:    (id)       => api.get(`${base}/${id}`),
  create: (body)     => api.post(base, body),
  update: (id, body) => api.patch(`${base}/${id}`, body),
  remove: (id)       => api.delete(`${base}/${id}`),
})

export const departments           = make('/api/departments')
export const categories            = make('/api/categories')
export const emissionFactors       = make('/api/emission-factors')
export const productProfiles       = make('/api/product-profiles')
export const goals                 = make('/api/goals')
export const policies              = make('/api/policies')
export const badges                = make('/api/badges')
export const earnedBadges          = make('/api/earned-badges')
export const rewards               = make('/api/rewards')
export const employees             = make('/api/employees')
export const carbonTransactions    = make('/api/carbon-transactions')
export const csrActivities         = make('/api/csr-activities')
export const employeeParticipation = make('/api/employee-participation')
export const challenges            = make('/api/challenges')
export const challengeParticipation= make('/api/challenge-participation')
export const acknowledgements      = make('/api/acknowledgements')
export const audits                = make('/api/audits')
export const complianceIssues      = make('/api/compliance-issues')
export const trainingCompletions   = make('/api/training-completions')
export const notifications         = make('/api/notifications')

// settings is special (single row GET and PATCH)
export const settings = {
  get:    ()     => api.get('/api/settings'),
  update: (body) => api.patch('/api/settings', body)
}

export const scores                = { get: () => api.get('/api/scores') }

export const redeemReward = (id, employee_id) =>
  api.post(`/api/rewards/${id}/redeem`, { employee_id })
