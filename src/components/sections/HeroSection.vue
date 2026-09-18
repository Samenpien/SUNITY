<script setup>
import PhoneLinks from '../PhoneLinks.vue'
defineEmits(['consultation'])
</script>
<template>
  <section id="hero" class="hero">
    <div class="content">
      <h1>Сонячні панелі для вашого дому та бізнесу</h1>
      <button class="yellow order-btn" @click="$emit('consultation')">
        Замовити встановлення сонячних панелей
      </button>
      <div class="hero-phones" aria-label="Телефони SUNITY"><PhoneLinks /></div>
    </div>
  </section>
</template>
