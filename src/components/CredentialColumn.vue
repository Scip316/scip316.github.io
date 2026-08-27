<script setup lang="ts">
import MediaCarousel from './MediaCarousel.vue'

type CredentialItem = {
  name: string
  type: string
  displayDate: string
  issuer: string
  description?: string
  headerPhotos: string[]
}

defineProps<{
  id: string
  kicker: string
  title: string
  introduction: string
  items: CredentialItem[]
}>()
</script>

<template>
  <section class="credential-column" :aria-labelledby="id">
    <header class="credential-column-heading">
      <p class="page-kicker">{{ kicker }}</p>
      <h2 :id="id">{{ title }}</h2>
      <p>{{ introduction }}</p>
    </header>
    <div class="credential-list">
      <article v-for="(item, index) in items" :key="item.name" class="credential-list-card">
        <MediaCarousel
          v-if="item.headerPhotos.length"
          class="credential-card-visual credential-media-carousel"
          :media="item.headerPhotos"
          :title="item.name"
        />
        <div v-else class="credential-card-visual">
          <span>{{ item.type }}</span><strong>{{ String(index + 1).padStart(2, '0') }}</strong>
        </div>
        <div class="credential-card-content">
          <p class="page-kicker">{{ item.displayDate }}</p>
          <h3>{{ item.name }}</h3>
          <p class="credential-card-issuer">{{ item.issuer }}</p>
          <p v-if="item.description" class="credential-card-description">{{ item.description }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.credential-column {
  min-width: 0;
  padding-top: 24px;
  border-top: 1px solid var(--line);
}
.credential-column-heading {
  min-height: 156px;
  margin-bottom: 26px;
}
.credential-column-heading h2 {
  margin: 0;
  font-size: clamp(1.9rem, 3vw, 2.6rem);
  letter-spacing: -0.055em;
}
.credential-column-heading > p:last-child {
  max-width: 360px;
  margin: 14px 0 0;
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.55;
}
.credential-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.credential-list-card {
  display: grid;
  grid-template-rows: auto auto;
  overflow: hidden;
  border: 1px solid var(--line);
  background: var(--surface);
}
.credential-card-visual {
  display: flex;
  aspect-ratio: 4 / 3;
  min-height: 0;
  padding: clamp(18px, 2vw, 24px);
  flex-direction: column;
  justify-content: space-between;
  background: #151515;
  color: #fff;
}
.credential-card-visual span {
  color: #ffffffa8;
  font: 0.65rem var(--font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.credential-card-visual strong {
  color: var(--accent);
  font: 4.6rem / 0.8 var(--font-mono);
  letter-spacing: -0.14em;
}
.credential-media-carousel {
  position: relative;
  display: block;
  padding: 0;
  overflow: hidden;
  touch-action: pan-y;
}
.credential-card-content {
  height: 210px;
  min-height: 210px;
  padding: clamp(18px, 2vw, 24px);
}
.credential-card-content h3 {
  margin: 0;
  font-size: clamp(1.05rem, 1.35vw, 1.35rem);
  letter-spacing: -0.04em;
  line-height: 1.13;
}
.credential-card-content > p:last-child,
.credential-card-content .credential-card-issuer {
  margin: 16px 0 0;
  color: var(--muted);
  font-size: 0.92rem;
}
.credential-card-content .credential-card-description {
  margin-top: 8px;
  font-size: 0.78rem;
  line-height: 1.45;
}
@media (max-width: 760px) {
  .credential-column-heading {
    min-height: 0;
  }
  .credential-list {
    grid-template-columns: 1fr;
  }
  .credential-card-content {
    height: auto;
    min-height: 190px;
  }
}
@media (max-width: 1600px) and (min-width: 761px) {
  .credential-list {
    grid-template-columns: 1fr;
  }
}
</style>
