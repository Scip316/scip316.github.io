<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import AboutView from './views/AboutView.vue'
import CertificateListView from './views/CertificateListView.vue'
import ProjectListView from './views/ProjectListView.vue'
import SiteFooter from './components/SiteFooter.vue'
import SiteHeader from './components/SiteHeader.vue'
import WorkExperienceDetailView from './views/WorkExperienceDetailView.vue'
import WorkExperienceListView from './views/WorkExperienceListView.vue'
import achievementData from './data/achievements.json'
import certificateData from './data/certificates.json'
import { profile_declaration } from './data/portfolio'
import projectData from './data/projects.json'
import { primaryHeaderPhoto } from './utils/primaryHeaderPhoto'
import { sortAlphabetically } from './utils/sortAlphabetically'
import workExperienceData from './data/work-experience.json'
import { sortByNewestDate } from './utils/sortByNewestDate'

const currentPath = ref(window.location.pathname)
const achievements = sortByNewestDate(achievementData.achievements)
const certifications = sortByNewestDate(certificateData.certifications)
const projects = sortByNewestDate(projectData.projects)
const detailSlug = computed(() => {
  const pathSegments = currentPath.value.split('/').filter(Boolean)
  return pathSegments[pathSegments.length - 1] ?? ''
})
const workExperiences = sortByNewestDate(
  workExperienceData.experiences.filter((experience) => experience.featured),
)
const featuredProjects = projects.filter((project) => project.featured)
const featuredCertificates = certifications.filter((certificate) => certificate.featured)
const featuredAchievements = achievements.filter((achievement) => achievement.featured)
const activeWorkIndex = ref(0)
const activeProjectIndex = ref(0)
const activeCertificateIndex = ref(0)
const activeAchievementIndex = ref(0)
const activeFeatureMediaIndices = ref<Record<string, number>>({})
const homeSectionIds = ['intro', 'work-experience', 'projects', 'credentials'] as const
type HomeSectionId = (typeof homeSectionIds)[number]
const activeHomeSection = ref<HomeSectionId | null>(null)
const homeRailHasClearedHero = ref(false)
const homeSectionRailTop = ref(118)
const showHomeSectionRail = computed(
  () => homeRailHasClearedHero.value && activeHomeSection.value !== null,
)
const featureMediaTouchStarts = new Map<string, number>()
const featureMediaSwiped = new Set<string>()
const displayedWorkIndex = computed(() => activeWorkIndex.value)
let workCarouselTimer: number | undefined
let projectCarouselTimer: number | undefined
let certificateCarouselTimer: number | undefined
let achievementCarouselTimer: number | undefined

const nextWork = () => {
  activeWorkIndex.value = (activeWorkIndex.value + 1) % workExperiences.length
}
const previousWork = () => {
  activeWorkIndex.value =
    (activeWorkIndex.value - 1 + workExperiences.length) % workExperiences.length
}
const coverflowPosition = (index: number, activeIndex: number, itemCount: number) => {
  const relativePosition = (index - activeIndex + itemCount) % itemCount
  if (relativePosition === 0) return 'is-active-showcase'
  if (relativePosition === 1) return 'is-next-showcase'
  if (relativePosition === itemCount - 1) return 'is-previous-showcase'
  return 'is-hidden-showcase'
}
const workCardPosition = (index: number) =>
  coverflowPosition(index, activeWorkIndex.value, workExperiences.length)
const projectCardPosition = (index: number) =>
  coverflowPosition(index, activeProjectIndex.value, featuredProjects.length)
const certificateCardPosition = (index: number) =>
  coverflowPosition(index, activeCertificateIndex.value, featuredCertificates.length)
const achievementCardPosition = (index: number) =>
  coverflowPosition(index, activeAchievementIndex.value, featuredAchievements.length)
const activeFeatureMediaIndex = (name: string) => activeFeatureMediaIndices.value[name] ?? 0
const isPdf = (path: string) => path.toLowerCase().endsWith('.pdf')
const changeFeatureMedia = (name: string, mediaCount: number, direction: 'next' | 'previous') => {
  const currentIndex = activeFeatureMediaIndex(name)
  const change = direction === 'next' ? 1 : -1
  activeFeatureMediaIndices.value[name] = (currentIndex + change + mediaCount) % mediaCount
}
const selectFeatureMedia = (name: string, index: number) => {
  activeFeatureMediaIndices.value[name] = index
}
const startFeatureMediaSwipe = (name: string, event: TouchEvent) => {
  featureMediaTouchStarts.set(name, event.touches[0]?.clientX ?? 0)
}
const endFeatureMediaSwipe = (name: string, mediaCount: number, event: TouchEvent) => {
  const startPosition = featureMediaTouchStarts.get(name)
  const endPosition = event.changedTouches[0]?.clientX
  featureMediaTouchStarts.delete(name)
  if (
    startPosition === undefined ||
    endPosition === undefined ||
    Math.abs(endPosition - startPosition) < 36
  )
    return

  featureMediaSwiped.add(name)
  changeFeatureMedia(name, mediaCount, endPosition < startPosition ? 'next' : 'previous')
}
const handleFeatureMediaClick = (name: string, event: MouseEvent) => {
  if (!featureMediaSwiped.has(name)) return

  featureMediaSwiped.delete(name)
  event.preventDefault()
  event.stopPropagation()
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
  activeProjectIndex.value =
    (activeProjectIndex.value - 1 + featuredProjects.length) % featuredProjects.length
}
const startProjectRotation = () => {
  stopProjectRotation()
  if (featuredProjects.length > 1) projectCarouselTimer = window.setInterval(nextProject, 4600)
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
  activeCertificateIndex.value =
    (activeCertificateIndex.value - 1 + featuredCertificates.length) % featuredCertificates.length
}
const startCertificateRotation = () => {
  stopCertificateRotation()
  if (featuredCertificates.length > 1)
    certificateCarouselTimer = window.setInterval(nextCertificate, 4600)
}
const stopCertificateRotation = () => {
  if (certificateCarouselTimer) {
    window.clearInterval(certificateCarouselTimer)
    certificateCarouselTimer = undefined
  }
}
const nextAchievement = () => {
  activeAchievementIndex.value = (activeAchievementIndex.value + 1) % featuredAchievements.length
}
const previousAchievement = () => {
  activeAchievementIndex.value =
    (activeAchievementIndex.value - 1 + featuredAchievements.length) % featuredAchievements.length
}
const startAchievementRotation = () => {
  stopAchievementRotation()
  if (featuredAchievements.length > 1)
    achievementCarouselTimer = window.setInterval(nextAchievement, 4600)
}
const stopAchievementRotation = () => {
  if (achievementCarouselTimer) {
    window.clearInterval(achievementCarouselTimer)
    achievementCarouselTimer = undefined
  }
}
const moveWork = (direction: 'next' | 'previous') => {
  if (direction === 'next') nextWork()
  else previousWork()
  startWorkRotation()
}
const moveProject = (direction: 'next' | 'previous') => {
  if (direction === 'next') nextProject()
  else previousProject()
  startProjectRotation()
}
const moveCertificate = (direction: 'next' | 'previous') => {
  if (direction === 'next') nextCertificate()
  else previousCertificate()
  startCertificateRotation()
}
const moveAchievement = (direction: 'next' | 'previous') => {
  if (direction === 'next') nextAchievement()
  else previousAchievement()
  startAchievementRotation()
}

const updateCurrentPath = () => {
  currentPath.value = window.location.pathname
}

const updateActiveHomeSection = () => {
  let activeSection: HomeSectionId | null = null
  const introSection = document.getElementById('intro')
  const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0

  homeRailHasClearedHero.value = Boolean(
    introSection &&
      introSection.getBoundingClientRect().bottom <= headerHeight + introSection.offsetHeight * 0.5,
  )
  homeSectionRailTop.value = introSection
    ? Math.max(118, Math.round(introSection.getBoundingClientRect().bottom + 24))
    : 118

  for (const sectionId of homeSectionIds) {
    const section = document.getElementById(sectionId)
    if (section && section.getBoundingClientRect().top <= 180) {
      activeSection = sectionId
    }
  }

  activeHomeSection.value = activeSection
}

const handleInternalNavigation = async (event: MouseEvent) => {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    !(event.target instanceof Element)
  ) {
    return
  }

  const link = event.target.closest('a[href]') as HTMLAnchorElement | null
  if (!link || link.target || link.hasAttribute('download')) return

  const destination = new URL(link.href)
  const isSameDocument =
    destination.origin === window.location.origin &&
    destination.pathname === window.location.pathname &&
    destination.search === window.location.search

  if (destination.origin !== window.location.origin || isSameDocument) return

  event.preventDefault()
  window.history.pushState(
    {},
    '',
    `${destination.pathname}${destination.search}${destination.hash}`,
  )
  updateCurrentPath()
  await nextTick()
  if (destination.hash) {
    document.getElementById(decodeURIComponent(destination.hash.slice(1)))?.scrollIntoView()
  } else {
    window.scrollTo(0, 0)
  }
}

onMounted(() => {
  startWorkRotation()
  startProjectRotation()
  startCertificateRotation()
  startAchievementRotation()
  updateActiveHomeSection()
  window.addEventListener('popstate', updateCurrentPath)
  window.addEventListener('scroll', updateActiveHomeSection, { passive: true })
  window.addEventListener('resize', updateActiveHomeSection)
  document.addEventListener('click', handleInternalNavigation)
})
onUnmounted(() => {
  stopWorkRotation()
  stopProjectRotation()
  stopCertificateRotation()
  stopAchievementRotation()
  window.removeEventListener('popstate', updateCurrentPath)
  window.removeEventListener('scroll', updateActiveHomeSection)
  window.removeEventListener('resize', updateActiveHomeSection)
  document.removeEventListener('click', handleInternalNavigation)
})
</script>

<template>
  <div v-if="currentPath === '/'">
    <SiteHeader home />
    <main>
      <section id="intro" class="intro">
        <div class="intro-text">
          <h1>Greetings, I am Darrel.</h1>
          <p class="current-role">{{ profile_declaration.role }}</p>
          <p>{{ profile_declaration.intro }}</p>
        </div>
      </section>
      <nav
        class="home-section-rail"
        :class="{ 'is-visible': showHomeSectionRail }"
        :style="{ top: `${homeSectionRailTop}px` }"
        :aria-hidden="!showHomeSectionRail"
        aria-label="On this page"
      >
        <p>On this page</p>
        <a href="#intro" :class="{ 'is-active': activeHomeSection === 'intro' }"
          ><span>01</span> Intro</a
        >
        <a href="#work-experience" :class="{ 'is-active': activeHomeSection === 'work-experience' }"
          ><span>02</span> Work</a
        >
        <a href="#projects" :class="{ 'is-active': activeHomeSection === 'projects' }"
          ><span>03</span> Projects</a
        >
        <a href="#credentials" :class="{ 'is-active': activeHomeSection === 'credentials' }"
          ><span>04</span> Credentials</a
        >
      </nav>
      <section id="work-experience" class="showcase-section showcase-section--work">
        <div class="showcase-section-inner">
          <div class="showcase-section-heading">
            <div>
              <p class="overline">Career highlights</p>
              <h2>Work experience.</h2>
            </div>
            <div class="showcase-section-actions">
              <p>Featured work experiences</p>
              <div class="showcase-controls">
                <button
                  type="button"
                  aria-label="Previous experience"
                  @click="moveWork('previous')"
                >
                  ←</button
                ><span
                  >{{ String(displayedWorkIndex + 1).padStart(2, '0') }} /
                  {{ String(workExperiences.length).padStart(2, '0') }}</span
                ><button type="button" aria-label="Next experience" @click="moveWork('next')">
                  →
                </button>
              </div>
            </div>
          </div>
          <div
            class="showcase-frame showcase-coverflow work-card-row"
            @mouseenter="stopWorkRotation"
            @mouseleave="startWorkRotation"
          >
            <div class="showcase-coverflow-stage">
              <a
                v-for="(item, index) in workExperiences"
                :key="item.id"
                class="showcase-coverflow-card work-card"
                :class="workCardPosition(index)"
                :href="`/experience/${item.detailPageSlug}`"
              >
                <div
                  v-if="item.headerPhotos.length"
                  class="work-card-image work-card-media"
                  @touchstart.passive="startFeatureMediaSwipe(item.id, $event)"
                  @touchend="endFeatureMediaSwipe(item.id, item.headerPhotos.length, $event)"
                  @click="handleFeatureMediaClick(item.id, $event)"
                >
                  <div
                    class="work-card-media-track"
                    :style="{
                      transform: `translateX(-${activeFeatureMediaIndex(item.id) * 100}%)`,
                    }"
                  >
                    <div
                      v-for="(media, mediaIndex) in item.headerPhotos"
                      :key="media"
                      class="work-card-media-slide"
                    >
                      <img :src="media" :alt="`${item.title} image ${mediaIndex + 1}`" />
                    </div>
                  </div>
                  <div v-if="item.headerPhotos.length > 1" class="work-card-media-controls">
                    <button
                      type="button"
                      aria-label="Previous work image"
                      @click.stop.prevent="
                        changeFeatureMedia(item.id, item.headerPhotos.length, 'previous')
                      "
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      aria-label="Next work image"
                      @click.stop.prevent="
                        changeFeatureMedia(item.id, item.headerPhotos.length, 'next')
                      "
                    >
                      →
                    </button>
                  </div>
                  <div v-if="item.headerPhotos.length > 1" class="work-card-media-dots">
                    <button
                      v-for="(_, mediaIndex) in item.headerPhotos"
                      :key="mediaIndex"
                      type="button"
                      :class="{
                        'is-active-work-media': mediaIndex === activeFeatureMediaIndex(item.id),
                      }"
                      :aria-label="`Show work image ${mediaIndex + 1}`"
                      @click.stop.prevent="selectFeatureMedia(item.id, mediaIndex)"
                    ></button>
                  </div>
                </div>
                <div
                  v-else
                  class="work-card-image"
                  :style="{
                    backgroundImage: `linear-gradient(135deg, #1c1c1c99, #1c1c1c33), url(${primaryHeaderPhoto(item.headerPhotos)})`,
                  }"
                ></div>
                <div class="work-card-body">
                  <p class="card-label">{{ item.period }}</p>
                  <h3>{{ item.title }}</h3>
                  <p class="workplace">{{ item.workplace }}</p>
                  <p>{{ item.summary }}</p>
                  <ul>
                    <li v-for="skill in sortAlphabetically(item.skills)" :key="skill">
                      {{ skill }}
                    </li>
                  </ul>
                  <span class="work-card-link"
                    ><span class="work-card-link-label"
                      >View experience <b aria-hidden="true">↗</b></span
                    ></span
                  >
                </div>
              </a>
            </div>
            <div class="showcase-progress-track" aria-hidden="true">
              <span :key="displayedWorkIndex" class="showcase-progress"></span>
            </div>
          </div>
          <a class="showcase-link" href="/experience"
            >View all work experiences <span aria-hidden="true">→</span></a
          >
        </div>
      </section>
      <section id="projects" class="showcase-section showcase-section--projects">
        <div class="showcase-section-inner">
          <div class="showcase-section-heading">
            <div>
              <p class="overline">Featured projects</p>
              <h2>Projects.</h2>
            </div>
            <div class="showcase-section-actions">
              <p>Work I’m proud to share</p>
              <div class="showcase-controls">
                <button
                  type="button"
                  aria-label="Previous project"
                  @click="moveProject('previous')"
                >
                  ←</button
                ><span
                  >{{ String(activeProjectIndex + 1).padStart(2, '0') }} /
                  {{ String(featuredProjects.length).padStart(2, '0') }}</span
                ><button type="button" aria-label="Next project" @click="moveProject('next')">
                  →
                </button>
              </div>
            </div>
          </div>
          <div
            class="showcase-frame showcase-coverflow home-feature-row"
            @mouseenter="stopProjectRotation"
            @mouseleave="startProjectRotation"
          >
            <div class="showcase-coverflow-stage">
              <article
                v-for="(project, index) in featuredProjects"
                :key="project.id"
                class="showcase-coverflow-card home-project-card"
                :class="projectCardPosition(index)"
              >
                <div
                  class="home-project-visual"
                  :style="{
                    backgroundColor: '#202020',
                    backgroundImage: `url(${primaryHeaderPhoto(project.headerPhotos)})`,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                  }"
                ></div>
                <div class="home-feature-body">
                  <p class="card-label">{{ project.category }} · {{ project.year }}</p>
                  <h3>{{ project.title }}</h3>
                  <p>{{ project.summary }}</p>
                  <ul>
                    <li v-for="technology in project.technologies" :key="technology">
                      {{ technology }}
                    </li>
                  </ul>
                  <a
                    v-if="project.githubUrl"
                    class="home-feature-link"
                    :href="project.githubUrl"
                    target="_blank"
                    rel="noreferrer"
                    >View source <b aria-hidden="true">↗</b></a
                  >
                  <span v-else class="home-feature-link">Case study in progress</span>
                </div>
              </article>
            </div>
            <div class="showcase-progress-track" aria-hidden="true">
              <span :key="activeProjectIndex" class="showcase-progress"></span>
            </div>
          </div>
          <a class="showcase-link" href="/projects"
            >View all projects <span aria-hidden="true">→</span></a
          >
        </div>
      </section>
      <section id="credentials" class="showcase-section showcase-section--credentials">
        <div class="showcase-section-inner">
          <div class="showcase-section-heading">
            <div>
              <p class="overline">Credentials</p>
              <h2>Credentials & Activities.</h2>
            </div>
            <div class="showcase-section-actions">
              <p>Milestones that I encounter and conqured</p>
            </div>
          </div>
          <div class="credential-showcase-grid">
            <div class="credential-showcase-panel">
              <div class="credential-showcase-heading">
                <p>Certificates & training</p>
                <div class="showcase-controls">
                  <button
                    type="button"
                    aria-label="Previous certification"
                    @click="moveCertificate('previous')"
                  >
                    ←</button
                  ><span
                    >{{ String(activeCertificateIndex + 1).padStart(2, '0') }} /
                    {{ String(featuredCertificates.length).padStart(2, '0') }}</span
                  ><button
                    type="button"
                    aria-label="Next certification"
                    @click="moveCertificate('next')"
                  >
                    →
                  </button>
                </div>
              </div>
              <div
                class="showcase-frame showcase-coverflow credential-showcase"
                @mouseenter="stopCertificateRotation"
                @mouseleave="startCertificateRotation"
              >
                <div class="showcase-coverflow-stage">
                  <article
                    v-for="(certificate, index) in featuredCertificates"
                    :key="certificate.name"
                    class="showcase-coverflow-card home-certificate-card"
                    :class="certificateCardPosition(index)"
                  >
                    <div
                      v-if="certificate.headerPhotos.length"
                      class="home-certificate-media"
                      @touchstart.passive="startFeatureMediaSwipe(certificate.name, $event)"
                      @touchend="
                        endFeatureMediaSwipe(
                          certificate.name,
                          certificate.headerPhotos.length,
                          $event,
                        )
                      "
                    >
                      <div
                        class="home-certificate-media-track"
                        :style="{
                          transform: `translateX(-${activeFeatureMediaIndex(certificate.name) * 100}%)`,
                        }"
                      >
                        <div
                          v-for="(media, mediaIndex) in certificate.headerPhotos"
                          :key="media"
                          class="home-certificate-media-slide"
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
                            <a :href="media" target="_blank" rel="noreferrer">Open PDF</a>
                          </object>
                        </div>
                      </div>
                      <div
                        v-if="certificate.headerPhotos.length > 1"
                        class="home-certificate-media-controls"
                      >
                        <button
                          type="button"
                          aria-label="Previous image"
                          @click="
                            changeFeatureMedia(
                              certificate.name,
                              certificate.headerPhotos.length,
                              'previous',
                            )
                          "
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          aria-label="Next image"
                          @click="
                            changeFeatureMedia(
                              certificate.name,
                              certificate.headerPhotos.length,
                              'next',
                            )
                          "
                        >
                          →
                        </button>
                      </div>
                      <div
                        v-if="certificate.headerPhotos.length > 1"
                        class="home-certificate-media-dots"
                      >
                        <button
                          v-for="(_, mediaIndex) in certificate.headerPhotos"
                          :key="mediaIndex"
                          type="button"
                          :class="{
                            'is-active-feature-media':
                              mediaIndex === activeFeatureMediaIndex(certificate.name),
                          }"
                          :aria-label="`Show image ${mediaIndex + 1}`"
                          @click="selectFeatureMedia(certificate.name, mediaIndex)"
                        ></button>
                      </div>
                    </div>
                    <div v-else class="home-certificate-index">
                      <span>{{ certificate.type }}</span
                      ><strong>{{ String(index + 1).padStart(2, '0') }}</strong>
                    </div>
                    <div class="home-certificate-body">
                      <p class="card-label">{{ certificate.displayDate }}</p>
                      <h3>{{ certificate.name }}</h3>
                      <p>{{ certificate.issuer }}</p>
                    </div>
                  </article>
                </div>
                <div class="showcase-progress-track" aria-hidden="true">
                  <span :key="activeCertificateIndex" class="showcase-progress"></span>
                </div>
              </div>
            </div>
            <div class="credential-showcase-panel">
              <div class="credential-showcase-heading">
                <p>Honours & activities</p>
                <div class="showcase-controls">
                  <button
                    type="button"
                    aria-label="Previous achievement"
                    @click="moveAchievement('previous')"
                  >
                    ←</button
                  ><span
                    >{{ String(activeAchievementIndex + 1).padStart(2, '0') }} /
                    {{ String(featuredAchievements.length).padStart(2, '0') }}</span
                  ><button
                    type="button"
                    aria-label="Next achievement"
                    @click="moveAchievement('next')"
                  >
                    →
                  </button>
                </div>
              </div>
              <div
                class="showcase-frame showcase-coverflow credential-showcase"
                @mouseenter="stopAchievementRotation"
                @mouseleave="startAchievementRotation"
              >
                <div class="showcase-coverflow-stage">
                  <article
                    v-for="(achievement, index) in featuredAchievements"
                    :key="achievement.name"
                    class="showcase-coverflow-card home-certificate-card"
                    :class="achievementCardPosition(index)"
                  >
                    <div
                      v-if="achievement.headerPhotos.length"
                      class="home-certificate-media"
                      @touchstart.passive="startFeatureMediaSwipe(achievement.name, $event)"
                      @touchend="
                        endFeatureMediaSwipe(
                          achievement.name,
                          achievement.headerPhotos.length,
                          $event,
                        )
                      "
                    >
                      <div
                        class="home-certificate-media-track"
                        :style="{
                          transform: `translateX(-${activeFeatureMediaIndex(achievement.name) * 100}%)`,
                        }"
                      >
                        <div
                          v-for="(media, mediaIndex) in achievement.headerPhotos"
                          :key="media"
                          class="home-certificate-media-slide"
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
                            <a :href="media" target="_blank" rel="noreferrer">Open PDF</a>
                          </object>
                        </div>
                      </div>
                      <div
                        v-if="achievement.headerPhotos.length > 1"
                        class="home-certificate-media-controls"
                      >
                        <button
                          type="button"
                          aria-label="Previous image"
                          @click="
                            changeFeatureMedia(
                              achievement.name,
                              achievement.headerPhotos.length,
                              'previous',
                            )
                          "
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          aria-label="Next image"
                          @click="
                            changeFeatureMedia(
                              achievement.name,
                              achievement.headerPhotos.length,
                              'next',
                            )
                          "
                        >
                          →
                        </button>
                      </div>
                      <div
                        v-if="achievement.headerPhotos.length > 1"
                        class="home-certificate-media-dots"
                      >
                        <button
                          v-for="(_, mediaIndex) in achievement.headerPhotos"
                          :key="mediaIndex"
                          type="button"
                          :class="{
                            'is-active-feature-media':
                              mediaIndex === activeFeatureMediaIndex(achievement.name),
                          }"
                          :aria-label="`Show image ${mediaIndex + 1}`"
                          @click="selectFeatureMedia(achievement.name, mediaIndex)"
                        ></button>
                      </div>
                    </div>
                    <div v-else class="home-certificate-index">
                      <span>{{ achievement.type }}</span
                      ><strong>{{ String(index + 1).padStart(2, '0') }}</strong>
                    </div>
                    <div class="home-certificate-body">
                      <p class="card-label">{{ achievement.displayDate }}</p>
                      <h3>{{ achievement.name }}</h3>
                      <p class="home-certificate-issuer">{{ achievement.issuer }}</p>
                      <p v-if="achievement.description" class="home-certificate-description">
                        {{ achievement.description }}
                      </p>
                    </div>
                  </article>
                </div>
                <div class="showcase-progress-track" aria-hidden="true">
                  <span :key="activeAchievementIndex" class="showcase-progress"></span>
                </div>
              </div>
            </div>
          </div>
          <a class="showcase-link" href="/certificates"
            >View all credentials <span aria-hidden="true">→</span></a
          >
        </div>
      </section>
    </main>
  </div>
  <WorkExperienceListView v-else-if="currentPath === '/experience'" />
  <ProjectListView v-else-if="currentPath === '/projects'" />
  <CertificateListView v-else-if="currentPath === '/certificates'" />
  <AboutView v-else-if="currentPath === '/about'" />
  <WorkExperienceDetailView v-else :slug="detailSlug" />
  <SiteFooter />
</template>
