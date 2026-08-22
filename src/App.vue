<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import CertificateListView from './views/CertificateListView.vue'
import ProjectListView from './views/ProjectListView.vue'
import WorkExperienceDetailView from './views/WorkExperienceDetailView.vue'
import WorkExperienceListView from './views/WorkExperienceListView.vue'
import certificateData from './data/certificates.json'
import { profile_declaration, socials } from './data/portfolio'
import projectData from './data/projects.json'
import workExperienceData from './data/work-experience.json'

const menuOpen = ref(false)
const currentPath = ref(window.location.pathname)
const certifications = certificateData.certifications
const projects = projectData.projects
const detailSlug = computed(() => {
  const pathSegments = currentPath.value.split('/').filter(Boolean)
  return pathSegments[pathSegments.length - 1] ?? ''
})
const workExperiences = workExperienceData.experiences.filter((experience) => experience.featured)
const featuredProjects = projects.filter((project) => project.featured)
const featuredCertificates = certifications.filter((certificate) => certificate.featured)
const activeWorkIndex = ref(0)
const activeProjectIndex = ref(0)
const activeCertificateIndex = ref(0)
const activeProject = computed(() => featuredProjects[activeProjectIndex.value])
const activeCertificate = computed(() => featuredCertificates[activeCertificateIndex.value])
const displayedWorkIndex = computed(() => activeWorkIndex.value)
let workCarouselTimer: number | undefined
let projectCarouselTimer: number | undefined
let certificateCarouselTimer: number | undefined

const nextWork = () => {
  activeWorkIndex.value = (activeWorkIndex.value + 1) % workExperiences.length
}
const previousWork = () => {
  activeWorkIndex.value = (activeWorkIndex.value - 1 + workExperiences.length) % workExperiences.length
}
const workCardPosition = (index: number) => {
  const relativePosition = (index - activeWorkIndex.value + workExperiences.length) % workExperiences.length
  if (relativePosition === 0) return 'is-active-work-slide'
  if (relativePosition === 1) return 'is-next-work-slide'
  if (relativePosition === workExperiences.length - 1) return 'is-previous-work-slide'
  return 'is-hidden-work-slide'
}
const startWorkRotation = () => {
  stopWorkRotation()
  if (workExperiences.length > 1) workCarouselTimer = window.setInterval(nextWork, 4600)
}
const stopWorkRotation = () => {
  if (workCarouselTimer) {
    window.clearInterval(workCarouselTimer)
    workCarouselTimer = undefined
  }
}
const nextProject = () => {
  activeProjectIndex.value = (activeProjectIndex.value + 1) % featuredProjects.length
}
const previousProject = () => {
  activeProjectIndex.value = (activeProjectIndex.value - 1 + featuredProjects.length) % featuredProjects.length
}
const startProjectRotation = () => {
  stopProjectRotation()
  if (featuredProjects.length > 1) projectCarouselTimer = window.setInterval(nextProject, 5200)
}
const stopProjectRotation = () => {
  if (projectCarouselTimer) {
    window.clearInterval(projectCarouselTimer)
    projectCarouselTimer = undefined
  }
}
const nextCertificate = () => {
  activeCertificateIndex.value = (activeCertificateIndex.value + 1) % featuredCertificates.length
}
const previousCertificate = () => {
  activeCertificateIndex.value = (activeCertificateIndex.value - 1 + featuredCertificates.length) % featuredCertificates.length
}
const startCertificateRotation = () => {
  stopCertificateRotation()
  if (featuredCertificates.length > 1) certificateCarouselTimer = window.setInterval(nextCertificate, 5600)
}
const stopCertificateRotation = () => {
  if (certificateCarouselTimer) {
    window.clearInterval(certificateCarouselTimer)
    certificateCarouselTimer = undefined
  }
}
onMounted(() => {
  startWorkRotation()
  startProjectRotation()
  startCertificateRotation()
  window.addEventListener('popstate', () => (currentPath.value = window.location.pathname))
})
onUnmounted(() => {
  stopWorkRotation()
  stopProjectRotation()
  stopCertificateRotation()
})
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
      <a href="/">Home</a><a href="/experience">Work Experience</a
      ><a href="/projects">Projects</a><a href="/certificates">Certificates</a
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
      <a href="/" @click="closeMenu">Home</a
      ><a href="/experience" @click="closeMenu">Work Experience</a
      ><a href="/projects" @click="closeMenu">Projects</a
      ><a href="/certificates" @click="closeMenu">Certificates</a
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
    <section id="work-experience" class="showcase-section showcase-section--work">
      <div class="showcase-section-inner">
        <div class="showcase-section-heading"><div><p class="overline">Career highlights</p><h2>Work experience.</h2></div><div class="showcase-section-actions"><p>Showcasing the roles I’ve taken on, the work I’ve contributed to, and the skills I’ve developed along the way.</p><div class="showcase-controls"><button type="button" aria-label="Previous experience" @click="previousWork">←</button><span>{{ String(displayedWorkIndex + 1).padStart(2, '0') }} / {{ String(workExperiences.length).padStart(2, '0') }}</span><button type="button" aria-label="Next experience" @click="nextWork">→</button></div></div></div>
        <div class="showcase-frame work-card-row" @mouseenter="stopWorkRotation" @mouseleave="startWorkRotation">
          <div class="work-card-stage">
          <a v-for="(item, index) in workExperiences" :key="item.id" class="work-card" :class="workCardPosition(index)" :href="`/experience/${item.detailPageSlug}`">
            <div class="work-card-image" :style="{ backgroundImage: `linear-gradient(135deg, #1c1c1c99, #1c1c1c33), url(${item.headerPhoto})` }"><span>{{ item.title }}</span></div>
            <div class="work-card-body"><p class="card-label">{{ item.period }}</p><h3>{{ item.title }}</h3><p class="workplace">{{ item.workplace }}</p><p>{{ item.summary }}</p><ul><li v-for="skill in item.skills" :key="skill">{{ skill }}</li></ul><span class="work-card-link">View experience <b aria-hidden="true">↗</b></span></div>
          </a>
          </div>
          <div class="work-progress-track" aria-hidden="true"><span :key="displayedWorkIndex" class="work-progress"></span></div>
        </div>
        <a class="showcase-link" href="/experience">View all work experiences <span aria-hidden="true">→</span></a>
      </div>
    </section>
    <section id="projects" class="showcase-section showcase-section--projects">
      <div class="showcase-section-inner">
        <div class="showcase-section-heading"><div><p class="overline">Featured builds</p><h2>Projects.</h2></div><div class="showcase-section-actions"><p>A closer look at the products and experiments I’ve built to turn ideas into useful experiences.</p><div class="showcase-controls"><button type="button" aria-label="Previous project" @click="previousProject">←</button><span>{{ String(activeProjectIndex + 1).padStart(2, '0') }} / {{ String(featuredProjects.length).padStart(2, '0') }}</span><button type="button" aria-label="Next project" @click="nextProject">→</button></div></div></div>
        <div class="showcase-frame home-feature-row" @mouseenter="stopProjectRotation" @mouseleave="startProjectRotation">
          <Transition name="project-home-shift" mode="out-in">
            <article :key="activeProject.id" class="home-project-card">
              <div class="home-project-visual" :class="`visual-${activeProject.visual}`"><span>{{ activeProject.visualLabel }}</span></div>
              <div class="home-feature-body"><p class="card-label">{{ activeProject.category }} · {{ activeProject.year }}</p><h3>{{ activeProject.title }}</h3><p>{{ activeProject.summary }}</p><ul><li v-for="technology in activeProject.technologies" :key="technology">{{ technology }}</li></ul><span class="home-feature-link">Case study in progress</span></div>
            </article>
          </Transition>
        </div>
        <a class="showcase-link" href="/projects">View all projects <span aria-hidden="true">→</span></a>
      </div>
    </section>
    <section id="certificates" class="showcase-section showcase-section--certificates">
      <div class="showcase-section-inner">
        <div class="showcase-section-heading"><div><p class="overline">Featured credentials</p><h2>Certificates.</h2></div><div class="showcase-section-actions"><p>Milestones that reflect the skills, knowledge, and discipline I’m continuing to build.</p><div class="showcase-controls"><button type="button" aria-label="Previous certificate" @click="previousCertificate">←</button><span>{{ String(activeCertificateIndex + 1).padStart(2, '0') }} / {{ String(featuredCertificates.length).padStart(2, '0') }}</span><button type="button" aria-label="Next certificate" @click="nextCertificate">→</button></div></div></div>
        <div class="showcase-frame home-feature-row" @mouseenter="stopCertificateRotation" @mouseleave="startCertificateRotation">
          <Transition name="certificate-home-scan" mode="out-in">
            <article :key="activeCertificate.name" class="home-certificate-card"><div class="home-certificate-index"><span>Credential</span><strong>{{ String(activeCertificateIndex + 1).padStart(2, '0') }}</strong></div><div class="home-certificate-body"><p class="card-label">{{ activeCertificate.displayDate }}</p><h3>{{ activeCertificate.name }}</h3><p>{{ activeCertificate.issuer }}</p></div></article>
          </Transition>
        </div>
        <a class="showcase-link" href="/certificates">View all certificates <span aria-hidden="true">→</span></a>
      </div>
    </section>
  </main>
  <footer id="contact" class="contact">
    <h2>Contact Me</h2>
    <nav class="contact-icons" aria-label="Social links">
      <a
        v-for="social in socials"
        :key="social.name"
        :href="social.url"
        target="_blank"
        rel="noreferrer"
        :aria-label="social.name"
      ><svg v-if="social.name === 'WhatsApp'" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.6 4.1 1.6 5.8L.2 23.8l6.4-1.7a11.8 11.8 0 0 0 5.5 1.4h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.3-6.1-3.5-8.2ZM12.1 21.5c-1.8 0-3.5-.5-5-1.3l-.4-.2-3.8 1 1-3.7-.3-.4a9.7 9.7 0 0 1-1.5-5.1c0-5.4 4.4-9.7 9.8-9.7 2.6 0 5 .9 6.9 2.8a9.7 9.7 0 0 1 2.8 6.9c0 5.4-4.4 9.7-9.5 9.7Zm5.3-7.3c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-.9 1.2-.3.2-.6.1a7.8 7.8 0 0 1-2.3-1.4 8.5 8.5 0 0 1-1.6-2c-.2-.3 0-.4.1-.6l.5-.5c.1-.1.2-.3.3-.5.1-.2 0-.4 0-.5l-1-2.3c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.4 1 2.8 1.1 3 .2.3.3.5c1.4 2.1 3.4 3.7 5.7 4.6.5.2.9.4 1.2.5.5.2 1 .2 1.3.1.4-.1 1.8-.8 2-1.6.3-.8.3-1.4.2-1.6-.1-.1-.3-.2-.6-.4Z"/></svg><svg v-else-if="social.name === 'Telegram'" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.9 3.5 18.6 20c-.2 1.2-.9 1.5-1.8 1l-5.1-3.7-2.5 2.4c-.3.3-.5.5-1 .5l.4-5.2 9.5-8.6c.4-.4-.1-.6-.6-.2L5.8 13.5.8 12c-1.1-.3-1.1-1.1.2-1.6L20.4 3c.9-.3 1.7.2 1.5.5Z"/></svg><svg v-else-if="social.name === 'LinkedIn'" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM2.8 9.8h4.4V21H2.8V9.8ZM10 9.8h4.2v1.5h.1c.6-1.1 2-2.2 4.1-2.2 4.4 0 5.2 2.9 5.2 6.6V21h-4.4v-4.7c0-1.1 0-2.6-1.6-2.6s-1.9 1.2-1.9 2.5V21H10V9.8Z"/></svg><svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h15A2.5 2.5 0 0 1 22 4.5v15a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 19.5v-15Zm2 .1v.2l8 5.6 8-5.6v-.2H4Zm16 2.7-7.4 5.2a1 1 0 0 1-1.2 0L4 7.3v12.2c0 .3.2.5.5.5h15c.3 0 .5-.2.5-.5V7.3Z"/></svg></a>
    </nav>
    <p class="footer-updated">Last updated: {{ profile_declaration.lastUpdated }}</p>
  </footer>
  </div>
  <WorkExperienceListView v-else-if="currentPath === '/experience'" />
  <ProjectListView v-else-if="currentPath === '/projects'" />
  <CertificateListView v-else-if="currentPath === '/certificates'" />
  <WorkExperienceDetailView v-else :slug="detailSlug" />
</template>
