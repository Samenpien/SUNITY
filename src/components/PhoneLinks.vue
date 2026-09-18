<script setup>
import { phones } from '../data/contacts.js'
</script>
<template>
  <a v-for="phone in phones" :key="phone.href" :href="phone.href" class="phone-link">
    <span aria-hidden="true">☎</span> {{ phone.label }}
  </a>
</template>
