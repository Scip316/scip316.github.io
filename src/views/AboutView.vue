<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import aboutContent from '../data/about.json'
import { profile_declaration, socials } from '../data/portfolio'

const aboutSectionIds = ['profile', 'about-history'] as const
type AboutSectionId = (typeof aboutSectionIds)[number]
const activeAboutSection = ref<AboutSectionId>('profile')
const activeTimelineYear = ref(aboutContent.timeline[0]?.year ?? '')
const timelineProgress = ref(0)
const timelineNodeOffsets = ref<number[]>([])
const timelineStartYear = aboutContent.timeline[0]?.year ?? ''
const timelineEndYear = aboutContent.timeline[aboutContent.timeline.length - 1]?.year ?? ''
const activeTimelineYearIndex = computed(() =>
  aboutContent.timeline.findIndex((section) => section.year === activeTimelineYear.value),
)

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

  const timelineContent = document.querySelector('.about-timeline-content')

  if (timelineContent) {
    const contentRect = timelineContent.getBoundingClientRect()
    const scrollY = window.scrollY
    const contentTop = contentRect.top + scrollY
    const contentBottom = contentTop + contentRect.height
    const start = contentTop - window.innerHeight * 0.35
    const end = contentBottom - window.innerHeight
    const span = Math.max(end - start, 1)

    timelineProgress.value = Math.min(Math.max((scrollY - start) / span, 0), 1) * 100

    timelineNodeOffsets.value = aboutContent.timeline.map((section) => {
      const sectionEl = document.getElementById(`timeline-${section.year}`)
      if (!sectionEl) return 0
      const sectionTop = sectionEl.getBoundingClientRect().top + scrollY
      return Math.min(Math.max(((sectionTop - start) / span) * 100, 0), 100)
    })
  }
}

onMounted(() => {
  updateActiveAboutSection()
  window.addEventListener('scroll', updateActiveAboutSection, { passive: true })
  window.addEventListener('resize', updateActiveAboutSection)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveAboutSection)
  window.removeEventListener('resize', updateActiveAboutSection)
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
          <nav
            class="about-timeline-nav"
            aria-label="Journey years"
          >
            <span
              class="about-timeline-rail-year is-start"
              :class="{ 'is-lit': timelineProgress <= 0 }"
              aria-hidden="true"
              >{{ timelineStartYear }}</span
            >
            <span
              class="about-timeline-rail-year is-end"
              :class="{ 'is-lit': timelineProgress >= 100 }"
              aria-hidden="true"
              >{{ timelineEndYear }}</span
            >
            <a
              v-for="(timelineSection, index) in aboutContent.timeline"
              :key="timelineSection.year"
              class="about-timeline-node"
              :href="`#timeline-${timelineSection.year}`"
              :class="{
                'is-active': activeTimelineYear === timelineSection.year,
                'is-reached': index <= activeTimelineYearIndex,
                'is-endpoint': index === 0 || index === aboutContent.timeline.length - 1,
              }"
              :style="{ top: `${timelineNodeOffsets[index] ?? 0}%` }"
              :aria-label="timelineSection.year"
            ></a>
            <div
              class="about-timeline-cursor"
              aria-hidden="true"
              :style="{ top: `${timelineProgress}%` }"
            >
              <span
                v-if="timelineProgress > 0 && timelineProgress < 100"
                class="about-timeline-cursor-year"
                >{{ activeTimelineYear }}</span
              >
              <span class="about-timeline-cursor-arrow"></span>
            </div>
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
  font-size: clamp(1.7rem, 2.5vw, 2.5rem);
  letter-spacing: -0.05em;
  line-height: 1.05;
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
  position: relative;
  display: block;
}

.about-timeline-nav {
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(-1 * clamp(28px, 5vw, 72px) - 92px);
  z-index: 1;
  width: 84px;
}

.about-timeline-rail-year {
  position: absolute;
  left: 64px;
  z-index: 2;
  display: flex;
  width: max-content;
  color: var(--muted);
  font:
    0.9rem 'DM Mono',
    monospace;
  letter-spacing: 0.04em;
}

.about-timeline-node.is-endpoint {
  display: none;
}

.about-timeline-rail-year.is-start {
  top: 0;
  transform: translate(-50%, -50%);
}

.about-timeline-rail-year.is-end {
  bottom: 0;
  transform: translate(-50%, 50%);
}

.about-timeline-rail-year.is-lit {
  color: var(--accent);
}

.about-timeline-nav::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 64px;
  width: 2px;
  background: var(--line);
}

.about-timeline-node {
  position: absolute;
  left: 65px;
  width: 9px;
  height: 9px;
  border: 2px solid var(--line);
  border-radius: 50%;
  background: var(--surface);
  transform: translate(-50%, -50%);
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.about-timeline-node:hover,
.about-timeline-node.is-reached {
  border-color: var(--accent);
}

.about-timeline-node.is-active {
  border-color: var(--accent);
  background: var(--accent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 18%, transparent);
}

.about-timeline-cursor {
  position: absolute;
  top: 0%;
  left: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 7px;
  width: 66px;
  transform: translateY(-50%);
  transition: top 0.18s ease-out;
}

.about-timeline-cursor-year {
  color: var(--accent);
  font:
    500 0.9rem 'DM Mono',
    monospace;
  letter-spacing: 0.04em;
}

.about-timeline-cursor-arrow {
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 8px solid var(--accent);
}

.about-timeline-nav span {
  display: inline-block;
  width: 34px;
}

.about-timeline-year + .about-timeline-year {
  margin-top: clamp(28px, 3.5vw, 48px);
  border-top: 1px solid var(--line);
}

.about-timeline-year {
  padding: clamp(28px, 3.5vw, 48px) 0;
}

.about-timeline-year:first-child {
  padding-top: 0;
}

.about-timeline-year:last-child {
  padding-bottom: clamp(36px, 5vw, 68px);
}

.about-timeline-year h1,
.about-timeline-entry h2,
.about-timeline-entry p {
  margin: 0;
}

.about-timeline-year h1 {
  position: sticky;
  top: 112px;
  z-index: 2;
  margin-bottom: clamp(14px, 1.8vw, 22px);
  padding: 12px 0;
  background: var(--surface);
  font-size: clamp(1.75rem, 2.4vw, 2.6rem);
  font-weight: 600;
  letter-spacing: -0.04em;
  line-height: 1;
}

.about-timeline-entry {
  display: grid;
  grid-template-columns: minmax(200px, 0.34fr) minmax(0, 1fr);
  gap: clamp(20px, 2.6vw, 48px);
  align-items: baseline;
  padding: clamp(18px, 1.8vw, 26px) 0;
  border-top: 1px solid var(--line);
}

.about-timeline-entry h2 {
  font-size: clamp(1.02rem, 1.25vw, 1.3rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.25;
}

.about-timeline-entry p {
  max-width: 720px;
  color: var(--muted);
  font-size: clamp(0.95rem, 1.05vw, 1.05rem);
  line-height: 1.7;
}

.about-timeline-entry p + p {
  margin-top: 12px;
}

.about-timeline-entry:last-child {
  border-bottom: 1px solid var(--line);
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
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    height: auto;
    min-height: 0;
    padding: 0;
  }

  .about-timeline-nav::before,
  .about-timeline-cursor,
  .about-timeline-rail-year {
    display: none;
  }

  .about-timeline-node {
    position: static;
    display: block;
    width: auto;
    height: auto;
    padding: 10px;
    border: 1px solid var(--line);
    border-radius: 0;
    background: var(--surface);
    color: var(--text);
    font:
      0.75rem 'DM Mono',
      monospace;
    letter-spacing: 0.04em;
    transform: none;
  }

  .about-timeline-node::after {
    content: attr(aria-label);
  }

  .about-timeline-node.is-active {
    border-color: var(--accent);
    background: transparent;
    box-shadow: none;
  }
}
</style>
