<script setup lang="ts">
import { onUnmounted, ref } from 'vue'

const props = defineProps<{
  photos: string[]
  title: string
}>()

const activeIndex = ref(0)
const touchStartPosition = ref<number | null>(null)
let suppressLinkNavigation = false
let suppressNavigationTimer: number | undefined

const changePhoto = (direction: 'next' | 'previous') => {
  if (props.photos.length < 2) return

  const change = direction === 'next' ? 1 : -1
  activeIndex.value = (activeIndex.value + change + props.photos.length) % props.photos.length
}

const selectPhoto = (index: number) => {
  activeIndex.value = index
}

const startSwipe = (event: TouchEvent) => {
  touchStartPosition.value = event.touches[0]?.clientX ?? null
}

const endSwipe = (event: TouchEvent) => {
  const startPosition = touchStartPosition.value
  const endPosition = event.changedTouches[0]?.clientX
  touchStartPosition.value = null

  if (
    startPosition === null ||
    endPosition === undefined ||
    Math.abs(endPosition - startPosition) < 36
  ) {
    return
  }

  suppressLinkNavigation = true
  window.clearTimeout(suppressNavigationTimer)
  suppressNavigationTimer = window.setTimeout(() => {
    suppressLinkNavigation = false
  }, 600)
  changePhoto(endPosition < startPosition ? 'next' : 'previous')
}

const handleGalleryClick = (event: MouseEvent) => {
  if (!suppressLinkNavigation) return

  suppressLinkNavigation = false
  window.clearTimeout(suppressNavigationTimer)
  event.preventDefault()
  event.stopPropagation()
}

onUnmounted(() => {
  window.clearTimeout(suppressNavigationTimer)
})
</script>

<template>
  <div
    class="work-media-gallery"
    @touchstart.passive="startSwipe"
    @touchend="endSwipe"
    @click="handleGalleryClick"
  >
    <div
      class="work-media-gallery-track"
      :style="{ transform: `translateX(-${activeIndex * 100}%)` }"
    >
      <div v-for="(photo, index) in photos" :key="photo" class="work-media-gallery-slide">
        <img :src="photo" :alt="`${title} image ${index + 1}`" />
      </div>
    </div>
    <div v-if="photos.length > 1" class="work-media-gallery-controls">
      <button type="button" aria-label="Previous work image" @click.stop.prevent="changePhoto('previous')">
        ←
      </button>
      <button type="button" aria-label="Next work image" @click.stop.prevent="changePhoto('next')">
        →
      </button>
    </div>
    <div v-if="photos.length > 1" class="work-media-gallery-dots">
      <button
        v-for="(_, index) in photos"
        :key="index"
        type="button"
        :class="{ 'is-active-work-media': index === activeIndex }"
        :aria-label="`Show work image ${index + 1}`"
        @click.stop.prevent="selectPhoto(index)"
      ></button>
    </div>
  </div>
</template>
