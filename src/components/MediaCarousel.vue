<script setup lang="ts">
import { onUnmounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    media: string[]
    title: string
    pdfLinkLabel?: string
  }>(),
  { pdfLinkLabel: 'Open PDF document' },
)

const activeIndex = ref(0)
const touchStartPosition = ref<number | null>(null)
let suppressLinkNavigation = false
let suppressNavigationTimer: number | undefined

const isPdf = (path: string) => path.toLowerCase().endsWith('.pdf')

const changeMedia = (direction: 'next' | 'previous') => {
  if (props.media.length < 2) return

  const change = direction === 'next' ? 1 : -1
  activeIndex.value = (activeIndex.value + change + props.media.length) % props.media.length
}

const selectMedia = (index: number) => {
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
  changeMedia(endPosition < startPosition ? 'next' : 'previous')
}

const handleMediaClick = (event: MouseEvent) => {
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
    class="media-carousel"
    @touchstart.passive="startSwipe"
    @touchend="endSwipe"
    @click="handleMediaClick"
  >
    <div class="media-carousel-track" :style="{ transform: `translateX(-${activeIndex * 100}%)` }">
      <div v-for="(item, index) in media" :key="item" class="media-carousel-slide">
        <img v-if="!isPdf(item)" :src="item" :alt="`${title} image ${index + 1}`" />
        <object v-else :data="item" type="application/pdf" :aria-label="title">
          <a :href="item" target="_blank" rel="noreferrer">{{ pdfLinkLabel }}</a>
        </object>
      </div>
    </div>

    <div v-if="media.length > 1" class="media-carousel-controls">
      <button
        type="button"
        :aria-label="`Previous ${title} image`"
        @click.stop.prevent="changeMedia('previous')"
      >
        ←
      </button>
      <button
        type="button"
        :aria-label="`Next ${title} image`"
        @click.stop.prevent="changeMedia('next')"
      >
        →
      </button>
    </div>

    <div v-if="media.length > 1" class="media-carousel-dots">
      <button
        v-for="(_, index) in media"
        :key="index"
        type="button"
        :class="{ 'is-active-media': index === activeIndex }"
        :aria-label="`Show ${title} image ${index + 1}`"
        @click.stop.prevent="selectMedia(index)"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.media-carousel {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: #151515;
  touch-action: pan-y;
}

.media-carousel-track {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.35s ease;
}

.media-carousel-slide {
  flex: 0 0 100%;
  height: 100%;
}

.media-carousel-slide img,
.media-carousel-slide object {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}

.media-carousel-slide img {
  object-fit: cover;
}

.media-carousel-slide object {
  background: #f7f7f4;
}

.media-carousel-controls {
  position: absolute;
  top: 50%;
  right: 10px;
  left: 10px;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  pointer-events: none;
}

.media-carousel-controls button {
  width: 30px;
  height: 30px;
  border: 1px solid #ffffff8a;
  background: #151515c9;
  color: #fff;
  cursor: pointer;
  pointer-events: auto;
}

.media-carousel-dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  display: flex;
  gap: 6px;
  transform: translateX(-50%);
}

.media-carousel-dots button {
  width: 6px;
  height: 6px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #ffffff85;
  cursor: pointer;
}

.media-carousel-dots button.is-active-media {
  background: #fff;
}
</style>
