<script setup>
import { projects, videos } from '../../data/content.js'
</script>
<template>
  <section id="gallery" class="gallery">
    <h2>Наші проєкти</h2>
    <div class="grid">
      <div v-for="project in projects" :key="project.src" class="img-box">
        <img :src="project.src" :alt="project.alt" loading="lazy" decoding="async" />
      </div>
    </div>
  </section>
  <section id="video" class="video">
    <h2>Подивіться як ми працюємо</h2>
    <div class="video-grid">
      <div
        v-for="video in videos"
        :key="video.src"
        class="video-wrapper"
        :class="{ 'video-wrapper--vertical': video.vertical }"
      >
        <video controls playsinline preload="metadata" :aria-label="video.title">
          <source :src="video.src" type="video/mp4" />
          Ваш браузер не підтримує відео.
        </video>
      </div>
    </div>
  </section>
</template>
