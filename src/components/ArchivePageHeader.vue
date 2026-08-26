<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{
  meta: string
  kicker: string
}>()
</script>

<template>
  <header class="experience-page-header" v-bind="$attrs">
    <a href="/" class="back-link">← Back to portfolio</a>
    <p>{{ meta }}</p>
  </header>
  <section class="experience-page-title">
    <p class="page-kicker">{{ kicker }}</p>
    <h1><slot /></h1>
  </section>
</template>
