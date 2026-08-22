<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import WorkExperienceDetailView from './views/WorkExperienceDetailView.vue'
import WorkExperienceListView from './views/WorkExperienceListView.vue'
import {
  certifications,
  profile_declaration,
  projects,
  socials,
} from './data/portfolio'
import workExperienceData from './data/work-experience.json'

type Section = 'projects' | 'credentials'
const openSection = ref<Section | null>(null)
const menuOpen = ref(false)
const currentPath = ref(window.location.pathname)
const detailSlug = computed(() => {
  const pathSegments = currentPath.value.split('/').filter(Boolean)
  return pathSegments[pathSegments.length - 1] ?? ''
})
const workExperiences = workExperienceData.experiences.filter((experience) => experience.featured)
const activeWorkIndex = ref(1)
const isWorkSlideAnimating = ref(true)
const carouselWorkExperiences = computed(() => [
  workExperiences[workExperiences.length - 1],
  ...workExperiences,
  workExperiences[0],
])
const displayedWorkIndex = computed(() => {
  if (activeWorkIndex.value === 0) return workExperiences.length - 1
  if (activeWorkIndex.value === workExperiences.length + 1) return 0
  return activeWorkIndex.value - 1
})
let workCarouselTimer: number | undefined

const nextWork = () => {
  if (activeWorkIndex.value < workExperiences.length + 1) activeWorkIndex.value += 1
}
const previousWork = () => {
  if (activeWorkIndex.value > 0) activeWorkIndex.value -= 1
}
const resetWorkSlide = () => {
  if (activeWorkIndex.value !== 0 && activeWorkIndex.value !== workExperiences.length + 1) return
  isWorkSlideAnimating.value = false
  activeWorkIndex.value = activeWorkIndex.value === 0 ? workExperiences.length : 1
  window.requestAnimationFrame(() => {
    isWorkSlideAnimating.value = true
  })
}
const startWorkRotation = () => {
  stopWorkRotation()
  workCarouselTimer = window.setInterval(nextWork, 4500)
}
const stopWorkRotation = () => {
  if (workCarouselTimer) {
    window.clearInterval(workCarouselTimer)
    workCarouselTimer = undefined
  }
}
onMounted(() => {
  startWorkRotation()
  window.addEventListener('popstate', () => (currentPath.value = window.location.pathname))
})
onUnmounted(stopWorkRotation)
const toggleSection = (section: Section) =>
  (openSection.value = openSection.value === section ? null : section)
const closeMenu = () => (menuOpen.value = false)
</script>

<template>
  <div v-if="currentPath === '/'">
  <header class="site-header">
    <a class="brand" href="#intro" aria-label="SCIP — back to top"
      ><span class="brand-symbol" aria-hidden="true">S</span
      ><span class="brand-copy">SCIP316<b>/</b>DARREL LIM</span></a
    >
    <nav class="desktop-nav" aria-label="Main navigation">
      <a href="#intro">Home</a><a href="/experience">Work Experience</a
      ><a href="#projects">Projects</a><a href="#certificates">Certificates</a
      ><a href="#contact">Contact</a>
    </nav>
    <button
      class="menu-button"
      type="button"
      :aria-expanded="menuOpen"
      aria-controls="mobile-nav"
      @click="menuOpen = !menuOpen"
    >
      <span class="sr-only">Toggle menu</span>☰
    </button>
    <nav v-if="menuOpen" id="mobile-nav" class="mobile-nav" aria-label="Mobile navigation">
      <a href="#intro" @click="closeMenu">Home</a
      ><a href="/experience" @click="closeMenu">Work Experience</a
      ><a href="#projects" @click="closeMenu">Projects</a
      ><a href="#certificates" @click="closeMenu">Certificates</a
      ><a href="#contact" @click="closeMenu">Contact</a>
    </nav>
  </header>
  <main>
    <section id="intro" class="intro">
      <div class="intro-text">
        <h1>Greetings, I am Darrel.</h1>
        <p class="current-role">{{ profile_declaration.role }}</p>
        <p>{{ profile_declaration.intro }}</p>
      </div>
    </section>
    <section id="work-experience" class="work-gallery">
      <div class="work-gallery-inner">
        <div class="work-gallery-heading"><div><p class="overline">Career highlights</p><h2>Work experience.</h2></div><div class="work-gallery-actions"><p>Showcasing the roles I’ve taken on, the work I’ve contributed to, and the skills I’ve developed along the way.</p><div class="work-controls"><button type="button" aria-label="Previous experience" @click="previousWork">←</button><span>{{ String(displayedWorkIndex + 1).padStart(2, '0') }} / {{ String(workExperiences.length).padStart(2, '0') }}</span><button type="button" aria-label="Next experience" @click="nextWork">→</button></div></div></div>
        <div class="work-card-row" @mouseenter="stopWorkRotation" @mouseleave="startWorkRotation">
          <div class="work-card-track" :class="{ 'is-resetting': !isWorkSlideAnimating }" :style="{ transform: `translateX(-${activeWorkIndex * 100}%)` }" @transitionend="resetWorkSlide">
          <a v-for="(item, index) in carouselWorkExperiences" :key="`${item.id}-${index}`" class="work-card" :href="`/experience/${item.detailPageSlug}`">
            <div class="work-card-image" :style="{ backgroundImage: `linear-gradient(135deg, #1c1c1c99, #1c1c1c33), url(${item.headerPhoto})` }"><span>{{ item.title }}</span></div>
            <div class="work-card-body"><p class="card-label">{{ item.period }}</p><h3>{{ item.title }}</h3><p class="workplace">{{ item.workplace }}</p><p>{{ item.summary }}</p><ul><li v-for="skill in item.skills" :key="skill">{{ skill }}</li></ul><span class="work-card-link">View experience <b aria-hidden="true">↗</b></span></div>
          </a>
          </div>
          <div class="work-progress-track" aria-hidden="true"><span :key="displayedWorkIndex" class="work-progress"></span></div>
        </div>
        <a class="view-all-work" href="/experience">View all work experiences <span aria-hidden="true">→</span></a>
      </div>
    </section>
    <section id="projects" class="content-section">
      <button
        class="accordion-title"
        type="button"
        :aria-expanded="openSection === 'projects'"
        @click="toggleSection('projects')"
      >
        <span>Projects</span><span class="arrow">{{ openSection === 'projects' ? '−' : '+' }}</span>
      </button>
      <div v-if="openSection === 'projects'" class="accordion-content project-grid">
        <article v-for="project in projects" :key="project.id" class="project-card">
          <div class="project-visual" :class="`visual-${project.visual}`">
            <span>{{ project.visualLabel }}</span>
          </div>
          <p class="card-label">{{ project.category }} · {{ project.year }}</p>
          <h2>{{ project.title }}</h2>
          <p>{{ project.summary }}</p>
          <ul>
            <li v-for="technology in project.technologies" :key="technology">{{ technology }}</li>
          </ul>
          <div class="project-links">
            <a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" rel="noreferrer"
              >View project ↗</a
            ><a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" rel="noreferrer"
              >Source ↗</a
            ><span v-if="!project.liveUrl && !project.githubUrl">Case study in progress</span>
          </div>
        </article>
      </div>
    </section>
    <section id="certificates" class="content-section">
      <button
        class="accordion-title"
        type="button"
        :aria-expanded="openSection === 'credentials'"
        @click="toggleSection('credentials')"
      >
        <span>Certificates</span
        ><span class="arrow">{{ openSection === 'credentials' ? '−' : '+' }}</span>
      </button>
      <div v-if="openSection === 'credentials'" class="accordion-content">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Certification</th>
                <th>Issuer</th>
                <th>Acquired</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="certificate in certifications" :key="certificate.name">
                <td>{{ certificate.name }}</td>
                <td>{{ certificate.issuer }}</td>
                <td>{{ certificate.displayDate }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>
  <footer id="contact" class="contact">
    <div>
      <p class="overline">Contact me</p>
      <h2>Let's build something useful.</h2>
      <a class="email" :href="`mailto:${profile_declaration.email}`">{{
        profile_declaration.email
      }}</a>
    </div>
    <nav aria-label="Social links">
      <a
        v-for="social in socials"
        :key="social.name"
        :href="social.url"
        target="_blank"
        rel="noreferrer"
        >{{ social.name }} ↗</a
      >
    </nav>
    <time class="last-updated" datetime="2026-08-22"
      >Last updated: {{ profile_declaration.lastUpdated }}</time
    >
  </footer>
  </div>
  <WorkExperienceListView v-else-if="currentPath === '/experience'" />
  <WorkExperienceDetailView v-else :slug="detailSlug" />
</template>
