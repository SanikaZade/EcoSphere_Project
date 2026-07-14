/**
 * Simulated email service for EcoSphere demo.
 * In production, replace the body of sendEmail with a call to an
 * email API such as SendGrid, Resend, AWS SES, etc.
 */

/**
 * @param {{ to: string, subject: string, body?: string }} params
 * @returns {{ sent: boolean, to: string, subject: string, timestamp: string }}
 */
export function sendEmail({ to, subject, body = '' }) {
  // In production this would call a real email API.
  // For demo: log to console so devs can verify the toggle is wired.
  console.log(`[EMAIL] To: ${to} | Subject: ${subject}${body ? ' | Body: ' + body : ''}`)
  return {
    sent: true,
    to,
    subject,
    timestamp: new Date().toISOString(),
  }
}
