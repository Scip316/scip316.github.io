<script setup lang="ts">
import achievementData from '../data/achievements.json'
import certificateData from '../data/certificates.json'

const achievements = achievementData.achievements
const certificates = certificateData.certifications
</script>

<template>
  <header class="site-header">
    <a class="brand" href="/" aria-label="SCIP — back to top">
      <span class="brand-symbol" aria-hidden="true">S</span>
      <span class="brand-copy">SCIP316<b>/</b>DARREL LIM</span>
    </a>
    <nav class="desktop-nav" aria-label="Main navigation">
      <a href="/">Home</a><a href="/experience">Work Experience</a><a href="/projects">Projects</a
      ><a href="/certificates">Credentials</a><a href="/#contact">Contact</a>
    </nav>
  </header>
  <main class="experience-page certificate-page">
    <header class="experience-page-header">
      <a href="/" class="back-link">← Back to portfolio</a>
      <p>{{ certificates.length }} certifications / {{ achievements.length }} achievements</p>
    </header>
    <section class="experience-page-title">
      <p class="page-kicker">Credentials archive</p>
      <h1>Credentials<br />& achievements.</h1>
    </section>
    <section class="credential-columns" aria-label="Credentials and achievements">
      <section class="credential-column" aria-labelledby="certifications-title">
        <header class="credential-column-heading">
          <p class="page-kicker">Industry credentials</p>
          <h2 id="certifications-title">Certifications.</h2>
          <p>Professional certifications that support my technology and delivery work.</p>
        </header>
        <div class="credential-list">
          <article
            v-for="(certificate, index) in certificates"
            :key="certificate.name"
            class="credential-list-card"
          >
            <div class="credential-card-visual">
              <span>Certification</span><strong>{{ String(index + 1).padStart(2, '0') }}</strong>
            </div>
            <div class="credential-card-content">
              <p class="page-kicker">{{ certificate.displayDate }}</p>
              <h3>{{ certificate.name }}</h3>
              <p>{{ certificate.issuer }}</p>
            </div>
          </article>
        </div>
      </section>
      <section class="credential-column" aria-labelledby="achievements-title">
        <header class="credential-column-heading">
          <p class="page-kicker">Academic & competition</p>
          <h2 id="achievements-title">Achievements.</h2>
          <p>School honours and milestones earned through consistent effort.</p>
        </header>
        <div class="credential-list">
          <article
            v-for="(achievement, index) in achievements"
            :key="achievement.name"
            class="credential-list-card"
          >
            <div class="credential-card-visual">
              <span>{{ achievement.type }}</span
              ><strong>{{ String(index + 1).padStart(2, '0') }}</strong>
            </div>
            <div class="credential-card-content">
              <p class="page-kicker">{{ achievement.displayDate }}</p>
              <h3>{{ achievement.name }}</h3>
              <p>{{ achievement.issuer }}</p>
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
  grid-template-rows: 1fr 1fr;
  aspect-ratio: 1;
  overflow: hidden;
  border: 1px solid var(--line);
  background: var(--surface);
}

.credential-card-visual {
  display: flex;
  min-height: 0;
  padding: clamp(18px, 2vw, 24px);
  flex-direction: column;
  justify-content: space-between;
  background: #151515;
  color: #fff;
}

.credential-card-visual span {
  color: #ffffffa8;
  font: 0.65rem 'DM Mono', monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.credential-card-visual strong {
  color: var(--accent);
  font: 4.6rem / 0.8 'DM Mono', monospace;
  letter-spacing: -0.14em;
}

.credential-card-content {
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
}
</style>
