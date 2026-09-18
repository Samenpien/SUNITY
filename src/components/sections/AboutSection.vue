<script setup>
import { features } from '../../data/content.js'
</script>
<template>
  <section id="about" class="about">
    <h2>Чому саме ми?</h2>
    <p>
      Ми встановлюємо сучасні сонячні панелі та системи зберігання енергії.<br />Маємо філії у
      Києві, Київській області, Полтаві та Харкові.
    </p>
    <div class="features">
      <article v-for="feature in features" :key="feature.title" class="card">
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.text }}</p>
      </article>
    </div>
  </section>
</template>
