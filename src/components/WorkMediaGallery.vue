<script setup lang="ts">
import MediaCarousel from './MediaCarousel.vue'

defineProps<{
  photos: string[]
  title: string
}>()
</script>

<template>
  <MediaCarousel :media="photos" :title="title" />
</template>
