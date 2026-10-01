<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<template>
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path v-if="name === 'LinkedIn'" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM2.8 9.8h4.4V21H2.8V9.8ZM10 9.8h4.2v1.5h.1c.6-1.1 2-2.2 4.1-2.2 4.4 0 5.2 2.9 5.2 6.6V21h-4.4v-4.7c0-1.1 0-2.6-1.6-2.6s-1.9 1.2-1.9 2.5V21H10V9.8Z" />
    <path v-else-if="name === 'Email'" d="M2 4.5A2.5 2.5 0 0 1 4.5 2h15A2.5 2.5 0 0 1 22 4.5v15a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 19.5v-15Zm2 .1v.2l8 5.6 8-5.6v-.2H4Zm16 2.7-7.4 5.2a1 1 0 0 1-1.2 0L4 7.3v12.2c0 .3.2.5.5.5h15c.3 0 .5-.2.5-.5V7.3Z" />
  </svg>
</template>

<style scoped>
svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  fill: currentColor;
}
</style>
