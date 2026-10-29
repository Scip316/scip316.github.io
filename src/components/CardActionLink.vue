<script setup lang="ts">
withDefaults(
  defineProps<{
    href?: string
    external?: boolean
    showArrow?: boolean
  }>(),
  { href: undefined, external: false, showArrow: true },
)
</script>

<template>
  <component
    :is="href ? 'a' : 'span'"
    class="card-action-link"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noreferrer' : undefined"
  >
    <span class="card-action-link-label"><slot /> <b v-if="showArrow" aria-hidden="true">↗</b></span>
  </component>
</template>
