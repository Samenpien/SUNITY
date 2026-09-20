export const contactRecipient = 'oleksandr.sviderskyi@nure.ua'

export async function sendContactRequest(data, request = fetch) {
  const response = await request(`https://formsubmit.co/ajax/${contactRecipient}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      "Ім'я": data.from_name,
      Телефон: data.phone,
      Питання: data.question,
      Дата: data.date,
      Сторінка: data.page_url,
      _subject: 'Нова заявка з сайту SUNITY',
      _template: 'table',
    }),
    signal: AbortSignal.timeout(15000),
  })

  if (!response.ok) throw new Error('Contact service unavailable')

  const result = await response.json()
  if (result.success === false) throw new Error('Contact service unavailable')
}
