<script setup>
import { ref } from 'vue'
import SiteHeader from './components/SiteHeader.vue'
import HeroSection from './components/sections/HeroSection.vue'
import AboutSection from './components/sections/AboutSection.vue'
import PricingSection from './components/sections/PricingSection.vue'
import GallerySection from './components/sections/GallerySection.vue'
import ContactSection from './components/sections/ContactSection.vue'
import SolarCalculator from './components/SolarCalculator.vue'
import ContactFormModal from './components/ContactFormModal.vue'
const contactForm = ref(null)
</script>
<template>
  <SiteHeader />
  <main id="main">
    <HeroSection @consultation="contactForm?.open()" />
    <AboutSection /><PricingSection /><SolarCalculator /><GallerySection /><ContactSection />
  </main>
  <footer>© {{ new Date().getFullYear() }} SUNITY. Усі права захищені.</footer>
  <ContactFormModal ref="contactForm" />
</template>
