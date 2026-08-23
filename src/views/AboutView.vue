<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import aboutContent from '../data/about.json'
import { profile_declaration, socials } from '../data/portfolio'

const aboutSectionIds = ['profile', 'about-history'] as const
type AboutSectionId = (typeof aboutSectionIds)[number]
const activeAboutSection = ref<AboutSectionId>('profile')
const activeTimelineYear = ref(aboutContent.timeline[0]?.year ?? '')

const updateActiveAboutSection = () => {
  let activeSection: AboutSectionId = 'profile'

  for (const sectionId of aboutSectionIds) {
    const section = document.getElementById(sectionId)
    if (section && section.getBoundingClientRect().top <= 180) activeSection = sectionId
  }

  activeAboutSection.value = activeSection

  let activeYear = aboutContent.timeline[0]?.year ?? ''
  for (const timelineSection of aboutContent.timeline) {
    const section = document.getElementById(`timeline-${timelineSection.year}`)
    if (section && section.getBoundingClientRect().top <= 180) activeYear = timelineSection.year
  }
  activeTimelineYear.value = activeYear
}

onMounted(() => {
  updateActiveAboutSection()
  window.addEventListener('scroll', updateActiveAboutSection, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveAboutSection)
})
</script>

<template>
  <header class="site-header">
    <a class="brand" href="/" aria-label="SCIP — back to top"
      ><span class="brand-symbol" aria-hidden="true">S</span
      ><span class="brand-copy">SCIP316<b>/</b>DARREL LIM</span></a
    >
    <nav class="desktop-nav" aria-label="Main navigation">
      <a href="/">Home</a><a href="/experience">Work Experience</a><a href="/projects">Projects</a
      ><a href="/certificates">Credentials</a><a href="/about">About Me</a>
    </nav>
  </header>

  <main class="experience-page about-page">
    <header class="experience-page-header">
      <a href="/" class="back-link">← Back to portfolio</a>
      <p>About / {{ profile_declaration.location }}</p>
    </header>

    <nav class="home-section-rail about-section-rail is-visible" aria-label="On this page">
      <p>On this page</p>
      <a href="#profile" :class="{ 'is-active': activeAboutSection === 'profile' }"
        ><span>01</span> Profile</a
      >
      <a href="#about-history" :class="{ 'is-active': activeAboutSection === 'about-history' }"
        ><span>02</span> About me</a
      >
    </nav>

    <section id="profile" class="about-profile-grid" aria-label="Profile overview">
      <figure class="about-photo-card">
        <img :src="aboutContent.profilePhoto" :alt="`${profile_declaration.name} at IRAS`" />
      </figure>

      <section class="about-facts-card" aria-label="Profile details">
        <p class="page-kicker">Profile</p>
        <dl>
          <div v-for="detail in aboutContent.details" :key="detail.label">
            <dt>{{ detail.label }}</dt>
            <dd>{{ detail.value }}</dd>
          </div>
        </dl>
      </section>

      <section class="about-contact-card" aria-label="Contact details">
        <p class="page-kicker">Contacts</p>
        <div class="about-social-links">
          <a
            v-for="social in socials"
            :key="social.name"
            :href="social.url"
            :target="social.name === 'Email' ? undefined : '_blank'"
            rel="noreferrer"
            >{{ social.name }} <span aria-hidden="true">↗</span></a
          >
        </div>
      </section>
    </section>

    <section id="about-history" class="about-history" aria-label="About and history">
      <header class="about-history-heading">
        <p class="page-kicker">About / history</p>
      </header>

      <section class="about-introduction" aria-labelledby="about-introduction-title">
        <h1 id="about-introduction-title">{{ aboutContent.introduction.title }}</h1>
        <div>
          <p v-for="paragraph in aboutContent.introduction.body" :key="paragraph">
            {{ paragraph }}
          </p>
        </div>
      </section>

      <section class="about-journey" aria-label="Journey timeline">
        <p class="page-kicker">Journey / timeline</p>
        <div class="about-timeline">
          <nav class="about-timeline-nav" aria-label="Journey years">
            <a
              v-for="(timelineSection, index) in aboutContent.timeline"
              :key="timelineSection.year"
              :href="`#timeline-${timelineSection.year}`"
              :class="{ 'is-active': activeTimelineYear === timelineSection.year }"
              ><span>{{ String(index + 1).padStart(2, '0') }}</span
              >{{ timelineSection.year }}</a
            >
          </nav>
          <div class="about-timeline-content">
            <section
              v-for="timelineSection in aboutContent.timeline"
              :id="`timeline-${timelineSection.year}`"
              :key="timelineSection.year"
              class="about-timeline-year"
            >
              <h1>{{ timelineSection.year }}</h1>
              <article
                v-for="entry in timelineSection.entries"
                :key="entry.title"
                class="about-timeline-entry"
              >
                <h2>{{ entry.title }}</h2>
                <div>
                  <p v-for="paragraph in entry.body" :key="paragraph">{{ paragraph }}</p>
                </div>
              </article>
            </section>
          </div>
        </div>
      </section>
    </section>
  </main>
</template>

<style scoped>
.about-page {
  padding-bottom: clamp(72px, 8vw, 130px);
}

.about-section-rail {
  top: 118px;
  left: clamp(24px, 3vw, 60px);
  min-width: 205px;
  padding: 20px 22px 20px 23px;
}

.about-section-rail p {
  margin-bottom: 12px;
  font-size: 0.75rem;
}

.about-section-rail a {
  padding: 9px 0;
  font-size: 0.88rem;
}

.about-section-rail a::before {
  left: -24px;
}

.about-section-rail a.is-active::before {
  height: 31px;
}

.about-section-rail a span {
  width: 36px;
}

.about-profile-grid {
  display: grid;
  grid-template-columns: minmax(360px, 1.2fr) minmax(300px, 0.85fr) minmax(300px, 0.72fr);
  gap: clamp(18px, 2.5vw, 38px);
  margin-top: clamp(42px, 6vw, 84px);
}

#profile,
#about-history,
.about-timeline-year {
  scroll-margin-top: 105px;
}

.about-photo-card,
.about-facts-card,
.about-contact-card,
.about-history {
  margin: 0;
  border: 1px solid var(--line);
  background: var(--surface);
}

.about-photo-card {
  position: relative;
  height: clamp(400px, 28vw, 480px);
  overflow: hidden;
}

.about-photo-card img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.about-facts-card,
.about-contact-card {
  display: flex;
  flex-direction: column;
  height: clamp(400px, 28vw, 480px);
  padding: clamp(24px, 3vw, 42px);
}

.about-facts-card dl {
  display: grid;
  gap: 0;
  margin: auto 0;
}

.about-facts-card dl div {
  padding: 17px 0;
  border-top: 1px solid var(--line);
}

.about-facts-card dl div:last-child {
  border-bottom: 1px solid var(--line);
}

.about-facts-card dt {
  margin-bottom: 6px;
  color: var(--accent);
  font:
    0.68rem 'DM Mono',
    monospace;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.about-facts-card dd {
  margin: 0;
  color: var(--text);
  font-size: clamp(1rem, 1.35vw, 1.2rem);
  line-height: 1.35;
}

.about-social-links {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
  margin: auto 0;
}

.about-social-links a {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid var(--line);
  color: var(--text);
  font:
    0.75rem 'DM Mono',
    monospace;
  text-decoration: none;
  text-transform: uppercase;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.about-social-links a:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-3px);
}

.about-social-links span {
  color: var(--accent);
}

.about-history {
  margin-top: clamp(22px, 2.5vw, 38px);
  padding: clamp(28px, 5vw, 72px);
}

.about-history-heading {
  padding-bottom: 24px;
  border-bottom: 1px solid var(--line);
}

.about-history-heading .page-kicker {
  margin: 0;
}

.about-introduction {
  display: grid;
  grid-template-columns: minmax(220px, 0.45fr) minmax(0, 1fr);
  gap: clamp(24px, 3vw, 54px);
  padding: clamp(30px, 4vw, 52px) 0;
}

.about-introduction h1,
.about-introduction p {
  margin: 0;
}

.about-introduction h1 {
  font-size: clamp(1.8rem, 3vw, 3.1rem);
  letter-spacing: -0.065em;
  line-height: 0.98;
}

.about-introduction div {
  display: grid;
  gap: 18px;
}

.about-introduction p {
  max-width: 760px;
  color: var(--muted);
  font-size: clamp(1rem, 1.35vw, 1.16rem);
  line-height: 1.7;
}

.about-journey {
  padding-top: clamp(28px, 4vw, 54px);
  border-top: 1px solid var(--line);
}

.about-journey > .page-kicker {
  margin: 0 0 clamp(24px, 3vw, 36px);
}

.about-timeline {
  display: grid;
  grid-template-columns: minmax(108px, 0.14fr) minmax(0, 1fr);
  gap: clamp(20px, 2.2vw, 42px);
}

.about-timeline-nav {
  position: sticky;
  top: 112px;
  display: grid;
  align-self: start;
  max-height: calc(100vh - 142px);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-left: 16px;
  border-left: 1px solid var(--line);
  scrollbar-color: var(--accent) transparent;
  scrollbar-width: thin;
}

.about-timeline-nav a {
  position: relative;
  padding: 9px 0;
  color: var(--muted);
  font:
    0.78rem 'DM Mono',
    monospace;
  letter-spacing: 0.04em;
  text-decoration: none;
  transition: color 0.2s ease;
}

.about-timeline-nav a::before {
  position: absolute;
  top: 50%;
  left: -17px;
  width: 2px;
  height: 0;
  content: '';
  background: var(--accent);
  transform: translateY(-50%);
  transition: height 0.2s ease;
}

.about-timeline-nav a:hover,
.about-timeline-nav a.is-active {
  color: var(--accent);
}

.about-timeline-nav a.is-active::before {
  height: 24px;
}

.about-timeline-nav span {
  display: inline-block;
  width: 34px;
}

.about-timeline-year + .about-timeline-year {
  border-top: 1px solid var(--line);
}

.about-timeline-year {
  padding: 0 0 clamp(36px, 5vw, 68px);
}

.about-timeline-year h1,
.about-timeline-entry h2,
.about-timeline-entry p {
  margin: 0;
}

.about-timeline-year h1 {
  margin-bottom: clamp(18px, 2.4vw, 28px);
  font-size: clamp(2.25rem, 3.4vw, 3.75rem);
  font-weight: 600;
  letter-spacing: -0.055em;
  line-height: 0.95;
}

.about-timeline-entry {
  display: grid;
  grid-template-columns: minmax(220px, 0.38fr) minmax(0, 1fr);
  gap: clamp(24px, 3vw, 52px);
  padding: clamp(20px, 2vw, 28px) 0;
  border-top: 1px solid var(--line);
}

.about-timeline-entry h2 {
  font-size: clamp(1.2rem, 1.55vw, 1.7rem);
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1.16;
}

.about-timeline-entry p {
  max-width: 720px;
  color: var(--muted);
  font-size: clamp(0.96rem, 1.1vw, 1.07rem);
  line-height: 1.65;
}

.about-timeline-entry p + p {
  margin-top: 12px;
}

@media (max-width: 960px) {
  .about-profile-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .about-contact-card {
    grid-column: span 2;
    min-height: 270px;
  }
}

@media (max-width: 650px) {
  .about-profile-grid,
  .about-timeline,
  .about-introduction,
  .about-timeline-entry {
    grid-template-columns: 1fr;
  }

  .about-contact-card {
    grid-column: auto;
  }

  .about-profile-grid {
    gap: 14px;
  }

  .about-photo-card,
  .about-facts-card,
  .about-contact-card {
    height: auto;
    min-height: 320px;
  }

  .about-timeline-nav {
    position: static;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    padding: 0;
    border: 0;
  }

  .about-timeline-nav a {
    padding: 10px;
    border: 1px solid var(--line);
  }

  .about-timeline-nav a::before {
    display: none;
  }
}
</style>
