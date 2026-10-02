<script setup lang="ts">
import SiteHeader from './SiteHeader.vue'
defineProps<{ error?: Error }>()
const reload = () => window.location.reload()
</script>

<template>
  <SiteHeader />
  <main class="experience-page" :aria-busy="!error">
    <p v-if="error" role="alert">Unable to load this page. Please try again.</p>
    <p v-else role="status">Loading page?</p>
    <button v-if="error" class="card-action-link" type="button" @click="reload">Reload page</button>
  </main>
</template>
