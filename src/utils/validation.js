export function validateName(value) {
  const name = value.trim()
  if (!name) return "Ім'я обов'язкове для заповнення"
  if (!/^[\p{L}\s'’ʼ-]+$/u.test(name))
    return "Ім'я може містити тільки літери, пробіли, апострофи та дефіси"
  if (name.length < 2) return "Ім'я повинно містити мінімум 2 символи"
  if (name.length > 50) return "Ім'я занадто довге (макс. 50 символів)"
  return ''
}
export function normalizePhone(value) {
  if (!/^[+\d\s()-]+$/.test(value)) return ''
  let digits = value.replace(/\D/g, '')
  if (/^0\d{9}$/.test(digits)) digits = '38' + digits
  return /^380\d{9}$/.test(digits) ? '+' + digits : ''
}
export function validatePhone(value) {
  return normalizePhone(value) ? '' : 'Введіть номер у форматі 0XX XXX XX XX або +380 XX XXX XX XX'
}
export function validateQuestion(value) {
  return value.length > 500 ? 'Питання занадто довге (макс. 500 символів)' : ''
}
