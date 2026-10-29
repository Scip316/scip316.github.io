import { onUnmounted, ref, watch } from 'vue'

// Keep downloads for distant sections from competing with the current section.
export const useNearbyMedia = () => {
  const element = ref<HTMLElement | null>(null)
  const ready = ref(typeof window !== 'undefined' && typeof IntersectionObserver === 'undefined')
  const observer =
    ready.value || typeof window === 'undefined'
      ? undefined
      : new IntersectionObserver(
          (entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return
            ready.value = true
            observer?.disconnect()
          },
          { rootMargin: '600px' },
        )
  watch(
    element,
    (current, previous) => {
      if (previous) observer?.unobserve(previous)
      if (current && !ready.value) observer?.observe(current)
    },
    { flush: 'post' },
  )
  onUnmounted(() => observer?.disconnect())
  return { element, ready }
}
