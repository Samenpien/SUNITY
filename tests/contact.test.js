import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { phones } from '../src/data/contacts.js'
import { normalizePhone, validateName, validatePhone } from '../src/utils/validation.js'
import { sendContactRequest } from '../src/services/contact.js'

test('approved phone numbers have correct click-to-call targets', () => {
  assert.deepEqual(phones, [
    { label: '093 025 23 00', href: 'tel:+380930252300' },
    { label: '095 556 67 67', href: 'tel:+380955566767' },
    { label: '097 810 67 67', href: 'tel:+380978106767' },
  ])
})
test('home and contacts both render the shared phone component', async () => {
  for (const file of ['HeroSection.vue', 'ContactSection.vue']) {
    const source = await readFile(new URL('../src/components/sections/' + file, import.meta.url), 'utf8')
    assert.match(source, /<PhoneLinks\s*\/>/)
  }
})
test('Ukrainian local and international phone input is accepted', () => {
  for (const value of ['095 556 67 67', '+380 (95) 556-67-67', '380955566767']) {
    assert.equal(normalizePhone(value), '+380955566767')
    assert.equal(validatePhone(value), '')
  }
  for (const value of ['', '+481234567890', 'abc380955566767', '095556676', '095556676777', '+380']) {
    assert.notEqual(validatePhone(value), '')
  }
})
test('Ukrainian names and apostrophes are supported', () => {
  for (const value of ['Мар’яна', 'Олександр', 'Лук’ян', 'Анна-Марія']) assert.equal(validateName(value), '')
  for (const value of ['', 'А', '1234', '<script>']) assert.notEqual(validateName(value), '')
})
test('contact service preserves the deployed template contract without sending mail', async () => {
  const data = { from_name: 'Test', phone: '+380955566767', question: 'Test', date: 'test', page_url: 'https://example.test' }
  let sent
  await sendContactRequest(data, async (url, options) => { sent = { url, options }; return { ok: true } })
  assert.equal(sent.url, 'https://api.emailjs.com/api/v1.0/email/send')
  assert.equal(sent.options.method, 'POST')
  const body = JSON.parse(sent.options.body)
  assert.equal(body.service_id, 'service_uexs0jd')
  assert.equal(body.template_id, 'template_d50xe7a')
  assert.deepEqual(body.template_params, data)
  await assert.rejects(sendContactRequest(data, async () => ({ ok: false })))
  await assert.rejects(sendContactRequest(data, async () => { throw new Error('offline') }))
})
