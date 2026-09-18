<script setup>
import { pricing } from '../../data/content.js'
</script>
<template>
  <section id="pricing" class="pricing">
    <div class="pricing-container">
      <h2>Вартість монтажу під ключ</h2>
      <p class="pricing-subtitle">Прозора система ціноутворення без прихованих платежів</p>
      <div class="pricing-items">
        <article v-for="item in pricing" :key="item.title" class="pricing-item">
          <div class="item-icon"><i :class="item.icon" aria-hidden="true"></i></div>
          <div class="item-content">
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </div>
          <div class="item-price">{{ item.price }}</div>
        </article>
      </div>
    </div>
  </section>
</template>
