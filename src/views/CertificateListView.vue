<script setup lang="ts">
import { ref } from 'vue'
import SiteHeader from '../components/SiteHeader.vue'
import achievementData from '../data/achievements.json'
import certificateData from '../data/certificates.json'
import { sortByNewestDate } from '../utils/sortByNewestDate'

const achievements = sortByNewestDate(achievementData.achievements)
const certificates = sortByNewestDate(certificateData.certifications)
const activeMediaIndices = ref<Record<string, number>>({})
const mediaTouchStarts = new Map<string, number>()

const activeMediaIndex = (name: string) => activeMediaIndices.value[name] ?? 0
const isPdf = (path: string) => path.toLowerCase().endsWith('.pdf')
const changeMedia = (name: string, mediaCount: number, direction: 'next' | 'previous') => {
  const currentIndex = activeMediaIndex(name)
  const change = direction === 'next' ? 1 : -1
  activeMediaIndices.value[name] = (currentIndex + change + mediaCount) % mediaCount
}
const selectMedia = (name: string, index: number) => {
  activeMediaIndices.value[name] = index
}
const startMediaSwipe = (name: string, event: TouchEvent) => {
  mediaTouchStarts.set(name, event.touches[0]?.clientX ?? 0)
}
const endMediaSwipe = (name: string, mediaCount: number, event: TouchEvent) => {
  const startPosition = mediaTouchStarts.get(name)
  const endPosition = event.changedTouches[0]?.clientX
  mediaTouchStarts.delete(name)
  if (
    startPosition === undefined ||
    endPosition === undefined ||
    Math.abs(endPosition - startPosition) < 36
  )
    return

  changeMedia(name, mediaCount, endPosition < startPosition ? 'next' : 'previous')
}
</script>

<template>
  <SiteHeader />
  <main class="experience-page certificate-page">
    <header class="experience-page-header">
      <a href="/" class="back-link">← Back to portfolio</a>
      <p>{{ certificates.length }} credentials / {{ achievements.length }} Activities</p>
    </header>
    <section class="experience-page-title">
      <p class="page-kicker">Credentials archive</p>
      <h1>Credentials<br />& Activities.</h1>
    </section>
    <section class="credential-columns" aria-label="Credentials and achievements">
      <section class="credential-column" aria-labelledby="certifications-title">
        <header class="credential-column-heading">
          <p class="page-kicker">Certificates & training</p>
          <h2 id="certifications-title">Credentials.</h2>
          <p>Industry credentials and training that support my technology and delivery work.</p>
        </header>
        <div class="credential-list">
          <article
            v-for="(certificate, index) in certificates"
            :key="certificate.name"
            class="credential-list-card"
          >
            <div
              v-if="certificate.headerPhotos.length"
              class="credential-card-visual credential-media-carousel"
              @touchstart.passive="startMediaSwipe(certificate.name, $event)"
              @touchend="endMediaSwipe(certificate.name, certificate.headerPhotos.length, $event)"
            >
              <div
                class="credential-media-track"
                :style="{
                  transform: `translateX(-${activeMediaIndex(certificate.name) * 100}%)`,
                }"
              >
                <div
                  v-for="(media, mediaIndex) in certificate.headerPhotos"
                  :key="media"
                  class="credential-media-slide"
                >
                  <img
                    v-if="!isPdf(media)"
                    :src="media"
                    :alt="`${certificate.name} image ${mediaIndex + 1}`"
                  />
                  <object
                    v-else
                    :data="media"
                    type="application/pdf"
                    :aria-label="certificate.name"
                  >
                    <a :href="media" target="_blank" rel="noreferrer">Open the PDF document</a>
                  </object>
                </div>
              </div>
              <div v-if="certificate.headerPhotos.length > 1" class="credential-media-controls">
                <button
                  type="button"
                  aria-label="Previous image"
                  @click="
                    changeMedia(certificate.name, certificate.headerPhotos.length, 'previous')
                  "
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  @click="changeMedia(certificate.name, certificate.headerPhotos.length, 'next')"
                >
                  →
                </button>
              </div>
              <div v-if="certificate.headerPhotos.length > 1" class="credential-media-dots">
                <button
                  v-for="(_, mediaIndex) in certificate.headerPhotos"
                  :key="mediaIndex"
                  type="button"
                  :class="{ 'is-active-media': mediaIndex === activeMediaIndex(certificate.name) }"
                  :aria-label="`Show image ${mediaIndex + 1}`"
                  @click="selectMedia(certificate.name, mediaIndex)"
                ></button>
              </div>
            </div>
            <div v-else class="credential-card-visual">
              <span>{{ certificate.type }}</span
              ><strong>{{ String(index + 1).padStart(2, '0') }}</strong>
            </div>
            <div class="credential-card-content">
              <p class="page-kicker">{{ certificate.displayDate }}</p>
              <h3>{{ certificate.name }}</h3>
              <p class="credential-card-issuer">{{ certificate.issuer }}</p>
              <p v-if="certificate.description" class="credential-card-description">
                {{ certificate.description }}
              </p>
            </div>
          </article>
        </div>
      </section>
      <section class="credential-column" aria-labelledby="achievements-title">
        <header class="credential-column-heading">
          <p class="page-kicker">Honours & activities</p>
          <h2 id="achievements-title">Activities.</h2>
          <p>Academic honours and competition involvement earned through consistent effort.</p>
        </header>
        <div class="credential-list">
          <article
            v-for="(achievement, index) in achievements"
            :key="achievement.name"
            class="credential-list-card"
          >
            <div
              v-if="achievement.headerPhotos.length"
              class="credential-card-visual credential-media-carousel"
              @touchstart.passive="startMediaSwipe(achievement.name, $event)"
              @touchend="endMediaSwipe(achievement.name, achievement.headerPhotos.length, $event)"
            >
              <div
                class="credential-media-track"
                :style="{
                  transform: `translateX(-${activeMediaIndex(achievement.name) * 100}%)`,
                }"
              >
                <div
                  v-for="(media, mediaIndex) in achievement.headerPhotos"
                  :key="media"
                  class="credential-media-slide"
                >
                  <img
                    v-if="!isPdf(media)"
                    :src="media"
                    :alt="`${achievement.name} image ${mediaIndex + 1}`"
                  />
                  <object
                    v-else
                    :data="media"
                    type="application/pdf"
                    :aria-label="achievement.name"
                  >
                    <a :href="media" target="_blank" rel="noreferrer">Open the PDF document</a>
                  </object>
                </div>
              </div>
              <div v-if="achievement.headerPhotos.length > 1" class="credential-media-controls">
                <button
                  type="button"
                  aria-label="Previous image"
                  @click="
                    changeMedia(achievement.name, achievement.headerPhotos.length, 'previous')
                  "
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  @click="changeMedia(achievement.name, achievement.headerPhotos.length, 'next')"
                >
                  →
                </button>
              </div>
              <div v-if="achievement.headerPhotos.length > 1" class="credential-media-dots">
                <button
                  v-for="(_, mediaIndex) in achievement.headerPhotos"
                  :key="mediaIndex"
                  type="button"
                  :class="{ 'is-active-media': mediaIndex === activeMediaIndex(achievement.name) }"
                  :aria-label="`Show image ${mediaIndex + 1}`"
                  @click="selectMedia(achievement.name, mediaIndex)"
                ></button>
              </div>
            </div>
            <div v-else class="credential-card-visual">
              <span>{{ achievement.type }}</span
              ><strong>{{ String(index + 1).padStart(2, '0') }}</strong>
            </div>
            <div class="credential-card-content">
              <p class="page-kicker">{{ achievement.displayDate }}</p>
              <h3>{{ achievement.name }}</h3>
              <p class="credential-card-issuer">{{ achievement.issuer }}</p>
              <p v-if="achievement.description" class="credential-card-description">
                {{ achievement.description }}
              </p>
            </div>
          </article>
        </div>
      </section>
    </section>
  </main>
</template>

<style scoped>
.credential-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(28px, 5vw, 72px);
  position: relative;
}

.credential-columns::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  content: '';
  background: var(--line);
}

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
  font:
    0.65rem 'DM Mono',
    monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.credential-card-visual strong {
  color: var(--accent);
  font:
    4.6rem / 0.8 'DM Mono',
    monospace;
  letter-spacing: -0.14em;
}

.credential-media-carousel {
  position: relative;
  display: block;
  padding: 0;
  overflow: hidden;
  touch-action: pan-y;
}

.credential-media-track {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.35s ease;
}

.credential-media-slide {
  min-width: 100%;
  height: 100%;
  background: #151515;
}

.credential-media-slide img,
.credential-media-slide object {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}

.credential-media-slide img {
  object-fit: cover;
}

.credential-media-slide object {
  background: #f7f7f4;
}

.credential-media-controls {
  position: absolute;
  top: 50%;
  right: 10px;
  left: 10px;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  pointer-events: none;
}

.credential-media-controls button {
  width: 30px;
  height: 30px;
  border: 1px solid #ffffff8a;
  background: #151515c9;
  color: #fff;
  cursor: pointer;
  pointer-events: auto;
}

.credential-media-dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  display: flex;
  gap: 6px;
  transform: translateX(-50%);
}

.credential-media-dots button {
  width: 6px;
  height: 6px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #ffffff85;
  cursor: pointer;
}

.credential-media-dots button.is-active-media {
  background: #fff;
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

.credential-card-content > p:last-child {
  margin: 16px 0 0;
  color: var(--muted);
  font-size: 0.92rem;
}

.credential-card-content .credential-card-issuer {
  margin: 16px 0 0;
  color: var(--muted);
  font-size: 0.92rem;
}

.credential-card-content .credential-card-description {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 0.78rem;
  line-height: 1.45;
}

@media (max-width: 760px) {
  .credential-columns {
    grid-template-columns: 1fr;
  }

  .credential-columns::before {
    display: none;
  }

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
