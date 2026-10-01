<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { getPdfPreview } from '../utils/pdfPreview'
import { useSwipe } from '../composables/useSwipe'

const props = withDefaults(
  defineProps<{
    media: string[]
    title: string
    pdfLinkLabel?: string
  }>(),
  { pdfLinkLabel: 'Open PDF document' },
)

const activeIndex = ref(0)
const trackIndex = ref(1)
const isSnappingTrack = ref(false)
const isTransitioning = ref(false)
const pdfPreviews = ref<Record<string, string>>({})
const unavailablePdfPreviews = ref<Set<string>>(new Set())
const isPdf = (path: string) => path.toLowerCase().endsWith('.pdf')
const renderedMedia = computed(() => {
  if (props.media.length < 2) return props.media

  return [props.media[props.media.length - 1], ...props.media, props.media[0]]
})
const displayTrackIndex = computed(() => (props.media.length > 1 ? trackIndex.value : 0))

const carouselElement = ref<HTMLElement | null>(null)
const nearViewport = ref(false)
const requestedPreviews = new Set<string>()
let previewObserver: IntersectionObserver | undefined
let disposed = false

const renderPdfPreview = async (path: string) => {
  if (requestedPreviews.has(path)) return
  requestedPreviews.add(path)
  try {
    const preview = await getPdfPreview(path)
    if (!disposed) pdfPreviews.value = { ...pdfPreviews.value, [path]: preview }
  } catch (error) {
    console.error(`Unable to render PDF preview: ${path}`, error)
    if (!disposed) unavailablePdfPreviews.value = new Set([...unavailablePdfPreviews.value, path])
  }
}

watch(
  [nearViewport, () => props.media[activeIndex.value]],
  ([nearby, path]) => {
    if (nearby && path && isPdf(path)) void renderPdfPreview(path)
  },
)

const changeMedia = (direction: 'next' | 'previous') => {
  if (props.media.length < 2 || isTransitioning.value || isSnappingTrack.value) return

  const change = direction === 'next' ? 1 : -1
  activeIndex.value = (activeIndex.value + change + props.media.length) % props.media.length
  trackIndex.value += change
  isTransitioning.value = true
}

const selectMedia = (index: number) => {
  if (index === activeIndex.value) return

  isSnappingTrack.value = true
  isTransitioning.value = false
  activeIndex.value = index
  trackIndex.value = index + 1
  window.requestAnimationFrame(() => {
    isSnappingTrack.value = false
  })
}

const handleTrackTransitionEnd = (event: TransitionEvent) => {
  if (event.target !== event.currentTarget || event.propertyName !== 'transform') return

  if (trackIndex.value === 0) {
    isSnappingTrack.value = true
    trackIndex.value = props.media.length
  } else if (trackIndex.value === props.media.length + 1) {
    isSnappingTrack.value = true
    trackIndex.value = 1
  }

  window.requestAnimationFrame(() => {
    isSnappingTrack.value = false
    isTransitioning.value = false
  })
}

const { startSwipe, endSwipe, cancelSwipe, handleSwipeClick, mouseEvents, dragging, dragOffset } =
  useSwipe(changeMedia, (event) => event.type === 'touchstart' || props.media.length > 1)

onMounted(() => {
  previewObserver = new IntersectionObserver(
    ([entry]) => {
      nearViewport.value = Boolean(entry?.isIntersecting)
    },
    { rootMargin: '200px 0px' },
  )
  if (carouselElement.value) previewObserver.observe(carouselElement.value)
})
onUnmounted(() => {
  disposed = true
  previewObserver?.disconnect()
})
</script>

<template>
  <div
    ref="carouselElement"
    class="media-carousel"
    :data-media-count="media.length"
    v-on="mouseEvents"
    :class="{ 'is-dragging': dragging }"
    :style="{ '--swipe-offset': `${dragOffset}px` }"
    @touchstart.passive="startSwipe"
    @touchend="endSwipe"
    @touchcancel="cancelSwipe"
    @click.capture="handleSwipeClick"
  >
    <div
      class="media-carousel-track"
      :class="{ 'is-snapping-track': isSnappingTrack }"
      :style="{
        transform: `translateX(calc(-${displayTrackIndex * 100}% + var(--swipe-offset, 0px)))`,
      }"
      @transitionend="handleTrackTransitionEnd"
    >
      <div
        v-for="(item, index) in renderedMedia"
        :key="`${item}-${index}`"
        class="media-carousel-slide"
      >
        <img
          v-if="!isPdf(item)"
          :src="item"
          :alt="`${title} image ${index + 1}`"
          loading="lazy"
          decoding="async"
        />
        <a
          v-else-if="pdfPreviews[item]"
          class="pdf-preview"
          :href="item"
          target="_blank"
          rel="noreferrer"
          :aria-label="`${pdfLinkLabel}: ${title}`"
        >
          <img
            class="pdf-preview-image"
            :src="pdfPreviews[item]"
            :alt="`${title} PDF preview`"
            decoding="async"
          />
        </a>
        <a
          v-else
          class="pdf-preview pdf-preview--fallback"
          :href="item"
          target="_blank"
          rel="noreferrer"
          >{{ unavailablePdfPreviews.has(item) ? pdfLinkLabel : 'Loading PDF preview…' }}</a
        >
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

.media-carousel.is-dragging .media-carousel-track,
.media-carousel-track.is-snapping-track {
  transition: none;
}

.media-carousel.is-dragging {
  cursor: grabbing;
  user-select: none;
}

.media-carousel-slide {
  flex: 0 0 100%;
  height: 100%;
}

.media-carousel-slide img,
.pdf-preview {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}

.media-carousel-slide img {
  object-fit: cover;
}

.pdf-preview {
  background: #f7f7f4;
  text-decoration: none;
}

.media-carousel-slide .pdf-preview-image {
  object-fit: contain;
}

.pdf-preview--fallback {
  display: grid;
  place-items: center;
  padding: 24px;
  color: #1b1b1b;
  font:
    0.75rem 'DM Mono',
    monospace;
  text-align: center;
  text-transform: uppercase;
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
