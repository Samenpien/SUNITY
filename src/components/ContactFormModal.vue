<script setup>
import { computed, nextTick, onUnmounted, reactive, ref } from 'vue'
import { email } from '../data/contacts.js'
import {
  normalizePhone,
  validateName,
  validatePhone,
  validateQuestion,
} from '../utils/validation.js'
import { sendContactRequest } from '../services/contact.js'
const dialog = ref(null)
const submitting = ref(false)
const status = ref('')
const form = reactive({ name: '', phone: '', question: '' })
const errors = reactive({ name: '', phone: '', question: '' })
let returnFocus
let previousOverflow = ''
const fallbackHref = computed(
  () =>
    'mailto:' +
    email +
    '?subject=' +
    encodeURIComponent('Нова заявка з сайту SUNITY') +
    '&body=' +
    encodeURIComponent(
      'Ім’я: ' + form.name + '\nТелефон: ' + form.phone + '\nПитання: ' + form.question,
    ),
)
async function open() {
  returnFocus = document.activeElement
  previousOverflow = document.body.style.overflow
  status.value = ''
  dialog.value.showModal()
  document.body.style.overflow = 'hidden'
  await nextTick()
  dialog.value.querySelector('input').focus()
}
function restorePage() {
  document.body.style.overflow = previousOverflow
  returnFocus?.focus()
}
function close() {
  if (!submitting.value) dialog.value.close()
}
function validate(field) {
  const validators = { name: validateName, phone: validatePhone, question: validateQuestion }
  errors[field] = validators[field](form[field])
}
async function submit() {
  if (submitting.value) return
  for (const field of Object.keys(errors)) validate(field)
  if (Object.values(errors).some(Boolean)) {
    await nextTick()
    dialog.value.querySelector('[aria-invalid="true"]')?.focus()
    return
  }
  submitting.value = true
  status.value = ''
  try {
    await sendContactRequest({
      from_name: form.name.trim(),
      phone: normalizePhone(form.phone),
      question: form.question.trim() || 'Не вказано',
      date: new Date().toLocaleString('uk-UA'),
      page_url: window.location.href,
    })
    status.value = 'success'
    Object.assign(form, { name: '', phone: '', question: '' })
  } catch {
    status.value = 'error'
  } finally {
    submitting.value = false
  }
}
onUnmounted(() => {
  if (dialog.value?.open) restorePage()
})
defineExpose({ open })
</script>
<template>
  <dialog
    ref="dialog"
    class="contact-dialog"
    aria-labelledby="consultation-title"
    @close="restorePage"
    @cancel="submitting && $event.preventDefault()"
    @click="$event.target === dialog && close()"
  >
    <div class="modal-content">
      <button
        class="close-btn"
        type="button"
        aria-label="Закрити форму"
        :disabled="submitting"
        @click="close"
      >
        ×
      </button>
      <h2 id="consultation-title">Замовити консультацію</h2>
      <p class="modal-subtitle">Залиште свої контакти і ми зв'яжемося з вами найближчим часом</p>
      <div v-if="status === 'success'" class="form-success" role="status">
        Дякуємо! Ваша заявка успішно відправлена. Ми зв'яжемося з вами найближчим часом.
      </div>
      <form v-else class="order-form" novalidate @submit.prevent="submit">
        <div class="form-group">
          <label for="contact-name">Ім'я *</label
          ><input
            id="contact-name"
            v-model="form.name"
            type="text"
            autocomplete="name"
            required
            maxlength="50"
            placeholder="Введіть ваше ім'я"
            :disabled="submitting"
            :aria-invalid="!!errors.name"
            :aria-describedby="errors.name ? 'name-error' : undefined"
            :class="{ error: errors.name }"
            @blur="validate('name')"
            @input="errors.name = ''"
          />
          <p v-if="errors.name" id="name-error" class="error-message">{{ errors.name }}</p>
        </div>
        <div class="form-group">
          <label for="contact-phone">Номер телефону *</label
          ><input
            id="contact-phone"
            v-model="form.phone"
            type="tel"
            autocomplete="tel"
            required
            placeholder="0XX XXX XX XX"
            :disabled="submitting"
            :aria-invalid="!!errors.phone"
            :aria-describedby="errors.phone ? 'phone-error' : 'phone-hint'"
            :class="{ error: errors.phone }"
            @blur="validate('phone')"
            @input="errors.phone = ''"
          />
          <p v-if="errors.phone" id="phone-error" class="error-message">{{ errors.phone }}</p>
          <p v-else id="phone-hint" class="hint">Формат: 0XX XXX XX XX або +380 XX XXX XX XX</p>
        </div>
        <div class="form-group">
          <label for="contact-question">Ваше питання (необов'язково)</label
          ><textarea
            id="contact-question"
            v-model="form.question"
            rows="4"
            placeholder="Опишіть ваше питання або побажання..."
            :disabled="submitting"
            maxlength="500"
            :aria-invalid="!!errors.question"
            @blur="validate('question')"
          ></textarea>
          <p v-if="errors.question" class="error-message">{{ errors.question }}</p>
          <p class="char-counter">{{ form.question.length }}/500 символів</p>
        </div>
        <div v-if="status === 'error'" role="alert" class="error-message">
          Не вдалося відправити заявку. Спробуйте ще раз або
          <a :href="fallbackHref">напишіть нам електронною поштою</a>.
        </div>
        <button type="submit" class="submit-btn" :disabled="submitting">
          {{ submitting ? 'Відправка...' : 'Надіслати заявку' }}
        </button>
      </form>
    </div>
  </dialog>
</template>
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000000b3;
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}
.modal-overlay.active {
  opacity: 1;
  visibility: visible;
}
.modal-content {
  background: #fff;
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  transform: scale(0.9);
  transition: transform 0.3s ease;
}
.modal-overlay.active .modal-content {
  transform: scale(1);
}
.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}
.close-btn:hover {
  color: #374151;
  background: #f3f4f6;
}
.modal-content h2 {
  color: #1f2937;
  font-size: 2rem;
  margin-bottom: 0.5rem;
  text-align: center;
}
.modal-subtitle {
  color: #6b7280;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1rem;
}
.order-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group label {
  color: #374151;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}
.form-group input,
.form-group textarea {
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
}
.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #facc15;
  box-shadow: 0 0 0 3px #facc151a;
}
.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #9ca3af;
}
.form-group input:disabled,
.form-group textarea:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
}
.submit-btn {
  padding: 1.2rem 2rem;
  background: linear-gradient(135deg, #facc15, #eab308);
  color: #1f2937;
  border: none;
  border-radius: 15px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}
.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px #facc154d;
}
.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}
.modal-content {
  animation: modalSlideIn-d53b988d 0.3s ease-out;
}
@keyframes modalSlideIn-d53b988d {
  0% {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@media (max-width: 768px) {
  .modal-content {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }
  .modal-content h2 {
    font-size: 1.5rem;
  }
}
.form-group input.error,
.form-group textarea.error {
  border-color: #ef4444;
  background-color: #fef2f2;
}
.error-message {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.hint {
  color: #6b7280;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}
.char-counter {
  color: #6b7280;
  font-size: 0.8rem;
  text-align: right;
  margin-top: 0.5rem;
}
.char-counter.warning {
  color: #f59e0b;
}
.char-counter.error {
  color: #ef4444;
}
.contact-dialog {
  margin: auto;
  border: 0;
  padding: 0;
  background: transparent;
  max-width: min(540px, calc(100% - 2rem));
  max-height: 90dvh;
  border-radius: 20px;
}
.contact-dialog::backdrop {
  background: #000b;
  backdrop-filter: blur(5px);
}
.modal-content {
  width: 100%;
  max-width: none;
  max-height: none;
  transform: none;
  margin: 0;
  animation: none;
}
.close-btn {
  line-height: 1;
}
.form-success {
  padding: 1rem;
  color: #166534;
  background: #f0fdf4;
  border-radius: 10px;
}
@media (max-width: 768px) {
  .modal-content {
    margin: 0;
  }
}
</style>
