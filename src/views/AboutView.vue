<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import CardActionLink from '../components/CardActionLink.vue'
import SectionRail from '../components/SectionRail.vue'
import SiteHeader from '../components/SiteHeader.vue'
import aboutContent from '../data/about.json'
import { profile_declaration, socials } from '../data/portfolio'
import { useActiveSection } from '../composables/useActiveSection'
import { sortByNewestDate } from '../utils/sortByNewestDate'

const aboutSectionIds = ['profile', 'about-history', 'timeline'] as const
const aboutRailItems = [
  { id: 'profile', label: 'Profile' },
  { id: 'about-history', label: 'About me' },
  { id: 'timeline', label: 'Timeline' },
]
const activeTimelineYear = ref(aboutContent.timeline[0]?.year ?? '')
const timeline = computed(() =>
  sortByNewestDate(
    aboutContent.timeline.map((section) => {
      const entries = sortByNewestDate(section.entries)
      return { ...section, entries, date: entries[0]?.date }
    }),
  ),
)
const timelineNodeOffsets = ref<number[]>(
  timeline.value.map((_, index) => (index / Math.max(timeline.value.length - 1, 1)) * 100),
)
let timelineObserver: IntersectionObserver | undefined

const updateTimelineNodeOffsets = () => {
  const rail = document.querySelector<HTMLElement>('.about-timeline-nav')
  if (!rail || rail.getBoundingClientRect().height === 0) return

  const railTop = rail.getBoundingClientRect().top
  const railHeight = rail.getBoundingClientRect().height
  timelineNodeOffsets.value = timeline.value.map((timelineSection) => {
    const heading = document.querySelector<HTMLElement>(
      `[data-timeline-year="${timelineSection.year}"]`,
    )
    if (!heading) return 0

    const offset = ((heading.getBoundingClientRect().top - railTop) / railHeight) * 100
    return Math.max(0, Math.min(100, offset))
  })
}

const { activeSection: activeAboutSection } = useActiveSection(aboutSectionIds)

onMounted(() => {
  const visibleHeadings = new Set<HTMLElement>()

  const updateActiveYear = () => {
    const upcomingHeading = [...visibleHeadings].sort(
      (first, second) => second.getBoundingClientRect().top - first.getBoundingClientRect().top,
    )[0]
    const year = upcomingHeading?.dataset.timelineYear
    if (year) activeTimelineYear.value = year
  }

  timelineObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const heading = entry.target as HTMLElement
        if (entry.isIntersecting) visibleHeadings.add(heading)
        else visibleHeadings.delete(heading)
      }
      updateActiveYear()
    },
    {
      // A year becomes active as soon as its heading is visible to the reader.
      rootMargin: '0px 0px -5% 0px',
      threshold: 0,
    },
  )

  document.querySelectorAll<HTMLElement>('[data-timeline-year]').forEach((heading) => {
    timelineObserver?.observe(heading)
  })

  window.requestAnimationFrame(updateTimelineNodeOffsets)
  window.addEventListener('resize', updateTimelineNodeOffsets)
})

onUnmounted(() => {
  timelineObserver?.disconnect()
  window.removeEventListener('resize', updateTimelineNodeOffsets)
})
</script>

<template>
  <SiteHeader />

  <main class="experience-page about-page">
    <header class="experience-page-header">
      <CardActionLink href="/" :show-arrow="false">← Back to portfolio</CardActionLink>
      <p>About / {{ profile_declaration.location }}</p>
    </header>

    <SectionRail
      :items="aboutRailItems"
      :active-id="activeAboutSection"
      :top="156"
      content-aligned
    />

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
          <CardActionLink
            v-for="social in socials"
            :key="social.name"
            :href="social.url"
            :external="social.name !== 'Email'"
            >{{ social.name }}</CardActionLink
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

      <section id="timeline" class="about-journey" aria-label="Journey timeline">
        <p class="page-kicker">Journey / timeline</p>
        <div class="about-timeline">
          <nav class="about-timeline-nav" aria-label="Journey years">
            <a
              v-for="(timelineSection, index) in timeline"
              :key="timelineSection.year"
              class="about-timeline-rail-year"
              :href="`#timeline-${timelineSection.year}`"
              :class="{
                'is-active': activeTimelineYear === timelineSection.year,
              }"
              :style="{ top: `${timelineNodeOffsets[index] ?? 0}%` }"
              >{{ timelineSection.year }}</a
            >
          </nav>
          <div class="about-timeline-content">
            <section
              v-for="timelineSection in timeline"
              :id="`timeline-${timelineSection.year}`"
            :key="timelineSection.year"
            class="about-timeline-year"
          >
            <header class="about-timeline-year-heading">
              <h1 :data-timeline-year="timelineSection.year">{{ timelineSection.year }}</h1>
            </header>
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

/* The fixed section rail is outside normal document flow, so reserve its column here. */
@media (min-width: 1601px) {
  .about-page {
    padding-left: clamp(280px, 18vw, 360px);
  }
}

.about-profile-grid {
  display: grid;
  grid-template-columns: minmax(360px, 1.2fr) minmax(300px, 0.85fr) minmax(300px, 0.72fr);
  gap: clamp(18px, 2.5vw, 38px);
  margin-top: clamp(42px, 6vw, 84px);
}

#profile,
#about-history,
#timeline,
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

.about-social-links :deep(.card-action-link) {
  width: 100%;
  padding: 12px;
  color: var(--text);
}

.about-social-links :deep(.card-action-link-label) {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}

.about-social-links :deep(.card-action-link:hover) {
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
  display: grid;
  grid-template-columns: minmax(145px, 0.13fr) minmax(0, 1fr);
  gap: clamp(24px, 3vw, 48px);
}

.about-timeline-nav {
  position: relative;
  z-index: 1;
  align-self: stretch;
  width: 100%;
  height: auto;
  min-height: 0;
}

.about-timeline-rail-year {
  position: absolute;
  left: 82px;
  z-index: 2;
  display: flex;
  min-width: 50px;
  justify-content: flex-end;
  padding: 3px 0;
  color: var(--muted);
  font:
    0.74rem 'DM Mono',
    monospace;
  letter-spacing: 0.04em;
  text-decoration: none;
  transform: translate(-100%, -50%);
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.about-timeline-nav::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 92px;
  width: 2px;
  background: var(--line);
}

.about-timeline-rail-year:hover,
.about-timeline-rail-year.is-active {
  color: var(--accent);
  font-weight: 700;
}

.about-timeline-rail-year::before {
  position: absolute;
  top: 50%;
  right: -28px;
  width: 28px;
  height: 1px;
  content: '';
  background: transparent;
  transform: translateY(-50%);
}

.about-timeline-rail-year::after {
  position: absolute;
  top: 50%;
  right: -15px;
  width: 9px;
  height: 9px;
  border: 2px solid var(--surface);
  border-radius: 50%;
  content: '';
  background: var(--line);
  transform: translateY(-50%);
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.about-timeline-rail-year.is-active::before {
  background: var(--accent);
}

.about-timeline-rail-year.is-active::after {
  background: var(--accent);
  transform: translateY(-50%) scale(1.25);
}

.about-timeline-year + .about-timeline-year {
  padding-top: clamp(14px, 1.8vw, 24px);
  margin-top: 0;
}

.about-timeline-year:not(:last-child) {
  padding-bottom: 0;
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

.about-timeline-year-heading {
  margin-bottom: clamp(14px, 1.8vw, 22px);
}

.about-timeline-year h1 {
  color: var(--accent);
  font: 500 clamp(2rem, 3vw, 3.2rem) 'DM Mono', monospace;
  letter-spacing: -0.08em;
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

@media (max-width: 1100px) {
  .about-profile-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .about-contact-card {
    grid-column: span 2;
    min-height: 270px;
  }
}

@media (max-width: 1400px) {
  .about-timeline {
    grid-template-columns: 1fr;
  }

  .about-timeline-nav {
    position: static;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
    width: auto;
    height: auto;
    min-height: 0;
    margin-bottom: 24px;
  }

  .about-timeline-nav::before {
    display: none;
  }

  .about-timeline-rail-year {
    position: static;
    display: block;
    width: auto;
    min-width: 0;
    padding: 10px;
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--text);
    font: 0.75rem 'DM Mono', monospace;
    letter-spacing: 0.04em;
    text-align: center;
    transform: none;
  }

  .about-timeline-rail-year::before,
  .about-timeline-rail-year::after {
    display: none;
  }

  .about-timeline-rail-year.is-active {
    border-color: var(--accent);
    color: var(--accent);
  }
}

@media (max-width: 760px) {
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
    width: auto;
    height: auto;
    margin-bottom: 24px;
  }

  .about-timeline-nav::before {
    display: none;
  }

  .about-timeline-rail-year {
    position: static;
    display: block;
    width: auto;
    padding: 10px;
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--text);
    font:
      0.75rem 'DM Mono',
      monospace;
    letter-spacing: 0.04em;
    transform: none;
  }

  .about-timeline-rail-year::before,
  .about-timeline-rail-year::after {
    display: none;
  }

  .about-timeline-rail-year.is-active {
    border-color: var(--accent);
    color: var(--accent);
  }
}
</style>
