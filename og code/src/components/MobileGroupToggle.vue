<script setup lang="ts">
import { nextTick, ref } from 'vue'

const root = ref<HTMLElement | null>(null)
const selected = defineModel<string>({ required: true })
const selectGroup = async (group: string) => {
  if (selected.value === group) return
  const element = root.value
  const wasSticky =
    element && element.getBoundingClientRect().top <= parseFloat(getComputedStyle(element).top) + 1
  selected.value = group
  await nextTick()
  if (wasSticky) element?.scrollIntoView({ behavior: 'instant', block: 'start' })
}
</script>

<template>
  <div
    ref="root"
    class="mobile-group-toggle mobile-sticky-selector"
    role="group"
    aria-label="Choose credentials or activities"
  >
    <button
      type="button"
      :aria-pressed="selected === 'credentials'"
      @click="selectGroup('credentials')"
    >
      Credentials
    </button>
    <button
      type="button"
      :aria-pressed="selected === 'activities'"
      @click="selectGroup('activities')"
    >
      Activities
    </button>
  </div>
</template>
