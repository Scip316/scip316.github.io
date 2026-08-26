import { onMounted, onUnmounted, ref } from 'vue'

type ActiveSectionOptions = {
  threshold?: number
  onUpdate?: () => void
}

export const useActiveSection = <T extends string>(
  sectionIds: readonly T[],
  { threshold = 180, onUpdate }: ActiveSectionOptions = {},
) => {
  const activeSection = ref<T | null>(null)

  const updateActiveSection = () => {
    let activeId: T | null = null

    for (const sectionId of sectionIds) {
      const section = document.getElementById(sectionId)
      if (section && section.getBoundingClientRect().top <= threshold) activeId = sectionId
    }

    activeSection.value = activeId
    onUpdate?.()
  }

  onMounted(() => {
    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', updateActiveSection)
    window.removeEventListener('resize', updateActiveSection)
  })

  return { activeSection, updateActiveSection }
}
