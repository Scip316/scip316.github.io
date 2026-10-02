<script setup lang="ts">
import SiteHeader from './SiteHeader.vue'
defineProps<{ error?: Error }>()
const reload = () => window.location.reload()
</script>

<template>
  <SiteHeader />
  <main class="experience-page" :aria-busy="!error">
    <p v-if="error" role="alert">Unable to load this page. Please try again.</p>
    <p v-else role="status">
      Hang on, page is loading... still loading... why is it not loading... welp, since we are here,
      let me tell you a story. A man walk into a bar, and order 1 beer. The bartender gave him 1
      beer. He then ordered 2 beer, and 2 more came. After taking a slip of the first beer, he
      refund 1 beer. The bartender starred at him and took it away. The man then order 999 beers.
      The bartender outright refused him. The man smiled, for his code was working fine. A customer
      walks into the bar and asked the location of the restroom. THE BAR EXPLODED INTO FLAMES!
    </p>
    <button v-if="error" class="card-action-link" type="button" @click="reload">Reload page</button>
  </main>
</template>
