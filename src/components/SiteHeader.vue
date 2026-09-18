<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { navigation } from '../data/content.js'
const menuOpen = ref(false)
function closeMenu() {
  menuOpen.value = false
}
function onKeydown(event) {
  if (event.key === 'Escape') closeMenu()
}
function onResize() {
  if (window.innerWidth > 768) closeMenu()
}
watch(menuOpen, (open) => document.body.classList.toggle('menu-open', open))
onMounted(() => {
  window.addEventListener('resize', onResize)
  window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('keydown', onKeydown)
  document.body.classList.remove('menu-open')
})
</script>
<template>
  <a class="skip-link" href="#main">Перейти до вмісту</a>
  <nav class="main-nav" aria-label="Головна навігація">
    <div class="nav-container">
      <a class="logo" href="#hero" @click="closeMenu"
        ><img
          :src="'./images/logo-removebg-preview.png'"
          alt=""
          class="logo-image"
          width="65"
          height="65"
        /><span>SUNITY</span></a
      >
      <ul id="main-navigation" class="nav-links" :class="{ 'is-open': menuOpen }">
        <li v-for="[id, label] in navigation" :key="id">
          <a :href="'#' + id" @click="closeMenu">{{ label }}</a>
        </li>
      </ul>
      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="main-navigation"
        :aria-label="menuOpen ? 'Закрити меню' : 'Відкрити меню'"
        @click="menuOpen = !menuOpen"
      >
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>
</template>
