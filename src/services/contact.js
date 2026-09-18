// Public browser configuration recovered from the deployed application.
// These identifiers are public EmailJS identifiers, not a server-side secret.
export const emailConfig = {
  serviceId: 'service_uexs0jd',
  templateId: 'template_d50xe7a',
  publicKey: '41TalBZ5OdBWZh73q',
}
export async function sendContactRequest(data, request = fetch) {
  const response = await request('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: emailConfig.serviceId,
      template_id: emailConfig.templateId,
      user_id: emailConfig.publicKey,
      template_params: data,
    }),
    signal: AbortSignal.timeout(15000),
  })
  if (!response.ok) throw new Error('Contact service unavailable')
}
