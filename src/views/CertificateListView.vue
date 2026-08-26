<script setup lang="ts">
import MediaCarousel from '../components/MediaCarousel.vue'
import ArchivePageHeader from '../components/ArchivePageHeader.vue'
import SiteHeader from '../components/SiteHeader.vue'
import achievementData from '../data/achievements.json'
import certificateData from '../data/certificates.json'
import { sortByNewestDate } from '../utils/sortByNewestDate'

const achievements = sortByNewestDate(achievementData.achievements)
const certificates = sortByNewestDate(certificateData.certifications)
</script>

<template>
  <SiteHeader />
  <main class="experience-page certificate-page">
    <ArchivePageHeader
      :meta="`${certificates.length} credentials / ${achievements.length} activities`"
      kicker="Credentials archive"
      >Credentials<br />& Activities.</ArchivePageHeader
    >
    <section class="credential-columns" aria-label="Credentials and achievements">
      <section class="credential-column" aria-labelledby="certifications-title">
        <header class="credential-column-heading">
          <p class="page-kicker">Certificates & training</p>
          <h2 id="certifications-title">Credentials.</h2>
          <p>Industry credentials and training that enhance my skills and workflow.</p>
        </header>
        <div class="credential-list">
          <article
            v-for="(certificate, index) in certificates"
            :key="certificate.name"
            class="credential-list-card"
          >
            <MediaCarousel
              v-if="certificate.headerPhotos.length"
              class="credential-card-visual credential-media-carousel"
              :media="certificate.headerPhotos"
              :title="certificate.name"
            />
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
          <p>Academic honours and competition involvement that i partake in.</p>
        </header>
        <div class="credential-list">
          <article
            v-for="(achievement, index) in achievements"
            :key="achievement.name"
            class="credential-list-card"
          >
            <MediaCarousel
              v-if="achievement.headerPhotos.length"
              class="credential-card-visual credential-media-carousel"
              :media="achievement.headerPhotos"
              :title="achievement.name"
            />
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
