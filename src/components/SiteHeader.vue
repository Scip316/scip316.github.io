<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
  defineProps<{
    home?: boolean
  }>(),
  { home: false },
)

const menuOpen = ref(false)
const closeMenu = () => {
  menuOpen.value = false
}
</script>

<template>
  <header class="site-header">
    <a class="brand" :href="home ? '#intro' : '/'" aria-label="SCIP — back to top">
      <span class="brand-symbol" aria-hidden="true">S</span>
      <span class="brand-copy">SCIP316<b>/</b>DARREL LIM</span>
    </a>
    <nav class="desktop-nav" aria-label="Main navigation">
      <a href="/">Home</a><a href="/experience">Work Experience</a><a href="/projects">Projects</a
      ><a href="/certificates">Credentials</a><a href="/about">About Me</a>
    </nav>
    <button
      class="menu-button"
      type="button"
      :aria-expanded="menuOpen"
      aria-controls="mobile-nav"
      @click="menuOpen = !menuOpen"
    >
      <span class="sr-only">Toggle menu</span>☰
    </button>
    <nav v-if="menuOpen" id="mobile-nav" class="mobile-nav" aria-label="Mobile navigation">
      <a href="/" @click="closeMenu">Home</a>
      <a href="/experience" @click="closeMenu">Work Experience</a>
      <a href="/projects" @click="closeMenu">Projects</a>
      <a href="/certificates" @click="closeMenu">Credentials</a>
      <a href="/about" @click="closeMenu">About Me</a>
    </nav>
  </header>
</template>
