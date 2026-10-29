import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useSwipe } from './useSwipe'

export const showcaseInterval = 12_000

export const useShowcaseCarousel = (
  advance: (direction: 'next' | 'previous') => void,
  itemCount: () => number,
  enabled: () => boolean,
) => {
  const paused = ref(true)
  const progressVersion = ref(0)
  const pauses = new Set<string>()
  let mounted = false
  let timer: number | undefined
  let deadline = 0
  let remaining = showcaseInterval

  const stop = () => {
    if (timer === undefined) return
    remaining = Math.max(0, deadline - performance.now())
    window.clearTimeout(timer)
    timer = undefined
  }
  const sync = () => {
    paused.value = !mounted || pauses.size > 0 || itemCount() < 2
    if (paused.value) {
      stop()
      return
    }
    if (timer !== undefined) return
    deadline = performance.now() + remaining
    timer = window.setTimeout(() => {
      timer = undefined
      advance('next')
      remaining = showcaseInterval
      progressVersion.value++
      sync()
    }, remaining)
  }
  const setPause = (reason: string, value: boolean) => {
    if (value) pauses.add(reason)
    else pauses.delete(reason)
    sync()
  }
  const move = (direction: 'next' | 'previous') => {
    if (itemCount() < 2) return
    stop()
    advance(direction)
    remaining = showcaseInterval
    progressVersion.value++
    sync()
  }
  const swipe = useSwipe(
    move,
    (event) => {
      if (!(event.target instanceof Element)) return false
      // Multi-image galleries own their swipe; a single image can move the outer card.
      const gallery = event.target.closest<HTMLElement>('.media-carousel')
      return !event.target.closest('button') && (!gallery || Number(gallery.dataset.mediaCount) < 2)
    },
    (active) => setPause('drag', active),
  )
  const touchStart = (event: TouchEvent) => {
    setPause('touch', true)
    swipe.startSwipe(event)
  }
  const touchEnd = (event: TouchEvent) => {
    swipe.endSwipe(event)
    if (!event.touches.length) setPause('touch', false)
  }
  const touchCancel = () => {
    swipe.cancelSwipe()
    setPause('touch', false)
  }
  const mouseEnter = () => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setPause('hover', true)
  }
  const mouseLeave = () => setPause('hover', false)
  const focusIn = () => setPause('focus', true)
  const focusOut = (event: FocusEvent) => {
    if (
      !(event.relatedTarget instanceof Node) ||
      !(event.currentTarget as Element).contains(event.relatedTarget)
    ) {
      setPause('focus', false)
    }
  }
  const updateVisibility = () => setPause('hidden', document.hidden)

  watch(
    enabled,
    (active) => {
      stop()
      remaining = showcaseInterval
      progressVersion.value++
      // The old frame may have been removed while hovered or focused.
      pauses.delete('hover')
      pauses.delete('focus')
      pauses.delete('touch')
      setPause('inactive', !active)
    },
    { immediate: true },
  )

  onMounted(() => {
    mounted = true
    document.addEventListener('visibilitychange', updateVisibility)
    updateVisibility()
    sync()
  })
  onUnmounted(() => {
    mounted = false
    stop()
    document.removeEventListener('visibilitychange', updateVisibility)
  })
  return {
    paused,
    progressVersion,
    move,
    touchStart,
    touchEnd,
    touchCancel,
    mouseEnter,
    mouseLeave,
    focusIn,
    focusOut,
    handleSwipeClick: swipe.handleSwipeClick,
    mouseEvents: swipe.mouseEvents,
    dragging: swipe.dragging,
    dragOffset: swipe.dragOffset,
  }
}
