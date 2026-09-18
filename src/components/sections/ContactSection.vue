<script setup>
import PhoneLinks from '../PhoneLinks.vue'
import { email, socialLinks } from '../../data/contacts.js'
</script>
<template>
  <section id="contacts" class="contacts">
    <h2>Зв’яжіться з нами</h2>
    <div class="contact-grid">
      <PhoneLinks /><a :href="'mailto:' + email"><span aria-hidden="true">✉</span> {{ email }}</a>
    </div>
    <h3 class="social-heading">Слідкуйте за нами в соціальних мережах</h3>
    <div class="social-links">
      <a
        v-for="social in socialLinks"
        :key="social.name"
        :href="social.href"
        class="social-link"
        :class="social.className"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="social.name"
        ><i :class="social.icon" aria-hidden="true"></i
      ></a>
    </div>
  </section>
</template>
