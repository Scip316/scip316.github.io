<script setup lang="ts">
import CardActionLink from './CardActionLink.vue'

defineOptions({ inheritAttrs: false })

defineProps<{
  meta: string
  kicker: string
}>()
</script>

<template>
  <header class="experience-page-header" v-bind="$attrs">
    <CardActionLink href="/" :show-arrow="false">← Back to portfolio</CardActionLink>
    <p>{{ meta }}</p>
  </header>
  <section class="experience-page-title">
    <p class="page-kicker">{{ kicker }}</p>
    <h1><slot /></h1>
  </section>
</template>
