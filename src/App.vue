<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, onMounted, onUnmounted, ref } from 'vue'
import type { AsyncComponentLoader } from 'vue'
import PageLoadStatus from './components/PageLoadStatus.vue'
import CardActionLink from './components/CardActionLink.vue'
import SectionRail from './components/SectionRail.vue'
import MediaCarousel from './components/MediaCarousel.vue'
import SiteFooter from './components/SiteFooter.vue'
import SiteHeader from './components/SiteHeader.vue'
import achievementData from './data/achievements.json'
import certificateData from './data/certificates.json'
import { profile_declaration } from './data/portfolio'
import projectData from './data/projects.json'
import { mediaSrc, mediaSrcset } from './utils/mediaAsset'
import { primaryHeaderPhoto } from './utils/primaryHeaderPhoto'
import { sortAlphabetically } from './utils/sortAlphabetically'
import workExperienceData from './data/work-experience.json'
import { sortByNewestDate } from './utils/sortByNewestDate'
import { useActiveSection } from './composables/useActiveSection'
import { showcaseInterval, useShowcaseCarousel } from './composables/useShowcaseCarousel'
import MobileGroupToggle from './components/MobileGroupToggle.vue'

const loadPage = (loader: AsyncComponentLoader) =>
  defineAsyncComponent({
    loader,
    loadingComponent: PageLoadStatus,
    errorComponent: PageLoadStatus,
    delay: 120,
  })
const AboutView = loadPage(() => import('./views/AboutView.vue'))
const CertificateListView = loadPage(() => import('./views/CertificateListView.vue'))
const ProjectListView = loadPage(() => import('./views/ProjectListView.vue'))
const WorkExperienceDetailView = loadPage(() => import('./views/WorkExperienceDetailView.vue'))
const WorkExperienceListView = loadPage(() => import('./views/WorkExperienceListView.vue'))
const scrollToCurrentHash = () => {
  if (window.location.hash) {
    document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView()
  }
}

const normalizePathname = (pathname: string) =>
  pathname === '/' ? '/' : pathname.replace(/\/+$/, '')

const currentPath = ref(normalizePathname(window.location.pathname))
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
const activeCredentialGroup = ref('credentials')
const isMobileViewport = ref(window.matchMedia('(max-width: 760px)').matches)
const certificatePreviousPreparation = ref<number | null>(null)
const achievementPreviousPreparation = ref<number | null>(null)
const homeSectionIds = ['intro', 'work-experience', 'projects', 'credentials'] as const
const homeRailItems = [
  { id: 'intro', label: 'Intro' },
  { id: 'work-experience', label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'credentials', label: 'Credentials' },
]
const homeRailHasClearedHero = ref(false)
const homeSectionRailTop = ref(118)
const showHomeSectionRail = computed(
  () => homeRailHasClearedHero.value && activeHomeSection.value !== null,
)
const displayedWorkIndex = computed(() => activeWorkIndex.value)
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
const nextProject = () => {
  activeProjectIndex.value = (activeProjectIndex.value + 1) % featuredProjects.length
}
const previousProject = () => {
  activeProjectIndex.value =
    (activeProjectIndex.value - 1 + featuredProjects.length) % featuredProjects.length
}
let certificateAnimationFrame: number | undefined
let achievementAnimationFrame: number | undefined
const nextCertificate = () => {
  if (certificateAnimationFrame !== undefined)
    window.cancelAnimationFrame(certificateAnimationFrame)
  certificatePreviousPreparation.value = null
  activeCertificateIndex.value = (activeCertificateIndex.value + 1) % featuredCertificates.length
}
const previousCertificate = () => {
  if (certificateAnimationFrame !== undefined)
    window.cancelAnimationFrame(certificateAnimationFrame)
  certificatePreviousPreparation.value = null
  const previousIndex =
    (activeCertificateIndex.value - 1 + featuredCertificates.length) % featuredCertificates.length

  if (featuredCertificates.length !== 2 || isMobileViewport.value) {
    activeCertificateIndex.value = previousIndex
    return
  }

  certificatePreviousPreparation.value = previousIndex
  certificateAnimationFrame = window.requestAnimationFrame(() => {
    certificateAnimationFrame = window.requestAnimationFrame(() => {
      activeCertificateIndex.value = previousIndex
      certificatePreviousPreparation.value = null
      certificateAnimationFrame = undefined
    })
  })
}
const nextAchievement = () => {
  if (achievementAnimationFrame !== undefined)
    window.cancelAnimationFrame(achievementAnimationFrame)
  achievementPreviousPreparation.value = null
  activeAchievementIndex.value = (activeAchievementIndex.value + 1) % featuredAchievements.length
}
const previousAchievement = () => {
  if (achievementAnimationFrame !== undefined)
    window.cancelAnimationFrame(achievementAnimationFrame)
  achievementPreviousPreparation.value = null
  const previousIndex =
    (activeAchievementIndex.value - 1 + featuredAchievements.length) % featuredAchievements.length

  if (featuredAchievements.length !== 2 || isMobileViewport.value) {
    activeAchievementIndex.value = previousIndex
    return
  }

  achievementPreviousPreparation.value = previousIndex
  achievementAnimationFrame = window.requestAnimationFrame(() => {
    achievementAnimationFrame = window.requestAnimationFrame(() => {
      activeAchievementIndex.value = previousIndex
      achievementPreviousPreparation.value = null
      achievementAnimationFrame = undefined
    })
  })
}
const workCarousel = useShowcaseCarousel(
  (direction) => (direction === 'next' ? nextWork() : previousWork()),
  () => workExperiences.length,
  () => currentPath.value === '/' && !isMobileViewport.value,
)
const projectCarousel = useShowcaseCarousel(
  (direction) => (direction === 'next' ? nextProject() : previousProject()),
  () => featuredProjects.length,
  () => currentPath.value === '/' && !isMobileViewport.value,
)
const certificateCarousel = useShowcaseCarousel(
  (direction) => (direction === 'next' ? nextCertificate() : previousCertificate()),
  () => featuredCertificates.length,
  () =>
    currentPath.value === '/' &&
    (!isMobileViewport.value || activeCredentialGroup.value === 'credentials'),
)
const achievementCarousel = useShowcaseCarousel(
  (direction) => (direction === 'next' ? nextAchievement() : previousAchievement()),
  () => featuredAchievements.length,
  () =>
    currentPath.value === '/' &&
    (!isMobileViewport.value || activeCredentialGroup.value === 'activities'),
)
const updateMobileViewport = () => {
  isMobileViewport.value = window.matchMedia('(max-width: 760px)').matches
}

const updateCurrentPath = () => {
  const normalizedPath = normalizePathname(window.location.pathname)
  if (normalizedPath !== window.location.pathname) {
    window.history.replaceState(
      {},
      '',
      `${normalizedPath}${window.location.search}${window.location.hash}`,
    )
  }
  currentPath.value = normalizedPath
}

const updateHomeRailPosition = () => {
  const introSection = document.getElementById('intro')
  const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0

  homeRailHasClearedHero.value = Boolean(
    introSection &&
      introSection.getBoundingClientRect().bottom <= headerHeight + introSection.offsetHeight * 0.5,
  )
  homeSectionRailTop.value = introSection
    ? Math.max(118, Math.round(introSection.getBoundingClientRect().bottom + 24))
    : 118
}

const { activeSection: activeHomeSection } = useActiveSection(homeSectionIds, {
  onUpdate: updateHomeRailPosition,
})

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
  updateCurrentPath()
  updateMobileViewport()
  window.addEventListener('popstate', updateCurrentPath)
  window.addEventListener('resize', updateMobileViewport)
  document.addEventListener('click', handleInternalNavigation)
})
onUnmounted(() => {
  if (certificateAnimationFrame !== undefined)
    window.cancelAnimationFrame(certificateAnimationFrame)
  if (achievementAnimationFrame !== undefined)
    window.cancelAnimationFrame(achievementAnimationFrame)
  window.removeEventListener('popstate', updateCurrentPath)
  window.removeEventListener('resize', updateMobileViewport)
  document.removeEventListener('click', handleInternalNavigation)
})
</script>

<template>
  <div v-if="currentPath === '/'" :style="{ '--showcase-slide-duration': `${showcaseInterval}ms` }">
    <SiteHeader home />
    <main>
      <section id="intro" class="intro">
        <div class="intro-text">
          <h1>Greetings, I am Darrel.</h1>
          <p class="current-role">{{ profile_declaration.role }}</p>
          <p>{{ profile_declaration.intro }}</p>
        </div>
      </section>
      <SectionRail
        :items="homeRailItems"
        :active-id="activeHomeSection"
        :visible="showHomeSectionRail"
        :top="homeSectionRailTop"
        content-aligned
      />
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
                  @click="workCarousel.move('previous')"
                >
                  ←</button
                ><span
                  >{{ String(displayedWorkIndex + 1).padStart(2, '0') }} /
                  {{ String(workExperiences.length).padStart(2, '0') }}</span
                ><button
                  type="button"
                  aria-label="Next experience"
                  @click="workCarousel.move('next')"
                >
                  →
                </button>
              </div>
            </div>
          </div>
          <div
            class="showcase-frame showcase-coverflow work-card-row"
            @mouseenter="workCarousel.mouseEnter"
            @mouseleave="workCarousel.mouseLeave"
            @focusin="workCarousel.focusIn"
            @focusout="workCarousel.focusOut"
            @touchstart.passive="workCarousel.touchStart"
            @touchend="workCarousel.touchEnd"
            @touchcancel="workCarousel.touchCancel"
            @click.capture="workCarousel.handleSwipeClick"
            v-on="workCarousel.mouseEvents"
            :style="{ '--swipe-offset': `${workCarousel.dragOffset.value}px` }"
            :class="{
              'is-paused': workCarousel.paused.value,
              'is-dragging': workCarousel.dragging.value,
            }"
          >
            <div class="showcase-coverflow-stage">
              <a
                v-for="(item, index) in workExperiences"
                :key="item.id"
                class="showcase-coverflow-card work-card"
                :class="workCardPosition(index)"
                :inert="index !== activeWorkIndex"
                :aria-hidden="index !== activeWorkIndex"
                :href="`/experience/${item.detailPageSlug}`"
              >
                <MediaCarousel
                  v-if="item.headerPhotos.length"
                  class="work-card-image"
                  :media="item.headerPhotos"
                  :title="item.title"
                />
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
                  <div class="card-action-link-group">
                    <CardActionLink>View experience</CardActionLink>
                  </div>
                </div>
              </a>
            </div>
            <div class="showcase-progress-track" aria-hidden="true">
              <span :key="workCarousel.progressVersion.value" class="showcase-progress"></span>
            </div>
          </div>
          <CardActionLink class="home-section-action" href="/experience" :show-arrow="false"
            >View all work experiences <span aria-hidden="true">→</span></CardActionLink
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
              <p>Projects that I have done</p>
              <div class="showcase-controls">
                <button
                  type="button"
                  aria-label="Previous project"
                  @click="projectCarousel.move('previous')"
                >
                  ←</button
                ><span
                  >{{ String(activeProjectIndex + 1).padStart(2, '0') }} /
                  {{ String(featuredProjects.length).padStart(2, '0') }}</span
                ><button
                  type="button"
                  aria-label="Next project"
                  @click="projectCarousel.move('next')"
                >
                  →
                </button>
              </div>
            </div>
          </div>
          <div
            class="showcase-frame showcase-coverflow home-feature-row"
            @mouseenter="projectCarousel.mouseEnter"
            @mouseleave="projectCarousel.mouseLeave"
            @focusin="projectCarousel.focusIn"
            @focusout="projectCarousel.focusOut"
            @touchstart.passive="projectCarousel.touchStart"
            @touchend="projectCarousel.touchEnd"
            @touchcancel="projectCarousel.touchCancel"
            @click.capture="projectCarousel.handleSwipeClick"
            v-on="projectCarousel.mouseEvents"
            :style="{ '--swipe-offset': `${projectCarousel.dragOffset.value}px` }"
            :class="{
              'is-paused': projectCarousel.paused.value,
              'is-dragging': projectCarousel.dragging.value,
            }"
          >
            <div class="showcase-coverflow-stage">
              <article
                v-for="(project, index) in featuredProjects"
                :key="project.id"
                class="showcase-coverflow-card home-project-card"
                :class="projectCardPosition(index)"
                :inert="index !== activeProjectIndex"
                :aria-hidden="index !== activeProjectIndex"
              >
                <div class="home-project-visual" style="background: #202020">
                  <img
                    class="project-preview-image"
                    :src="mediaSrc(primaryHeaderPhoto(project.headerPhotos))"
                    :srcset="mediaSrcset(primaryHeaderPhoto(project.headerPhotos))"
                    sizes="(max-width: 760px) calc(100vw - 60px), 600px"
                    :alt="`${project.title} preview`"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div class="home-feature-body">
                  <p class="card-label">{{ project.category }} · {{ project.year }}</p>
                  <h3>{{ project.title }}</h3>
                  <p>{{ project.summary }}</p>
                  <ul>
                    <li v-for="technology in project.technologies" :key="technology">
                      {{ technology }}
                    </li>
                  </ul>
                  <div
                    v-if="project.links.length"
                    class="card-action-link-group home-project-links"
                  >
                    <CardActionLink
                      v-for="link in project.links"
                      :key="link.url"
                      :href="link.url"
                      external
                      >{{ link.title }}</CardActionLink
                    >
                  </div>
                  <span v-else class="home-feature-link">NA</span>
                </div>
              </article>
            </div>
            <div class="showcase-progress-track" aria-hidden="true">
              <span :key="projectCarousel.progressVersion.value" class="showcase-progress"></span>
            </div>
          </div>
          <CardActionLink class="home-section-action" href="/projects" :show-arrow="false"
            >View all projects <span aria-hidden="true">→</span></CardActionLink
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
          <MobileGroupToggle v-model="activeCredentialGroup" />
          <div class="credential-showcase-grid">
            <div
              class="credential-showcase-panel"
              :class="{ 'mobile-group-hidden': activeCredentialGroup !== 'credentials' }"
            >
              <div class="credential-showcase-heading">
                <p>Certificates & training</p>
                <div class="showcase-controls">
                  <button
                    type="button"
                    aria-label="Previous certification"
                    @click="certificateCarousel.move('previous')"
                  >
                    ←</button
                  ><span
                    >{{ String(activeCertificateIndex + 1).padStart(2, '0') }} /
                    {{ String(featuredCertificates.length).padStart(2, '0') }}</span
                  ><button
                    type="button"
                    aria-label="Next certification"
                    @click="certificateCarousel.move('next')"
                  >
                    →
                  </button>
                </div>
              </div>
              <div
                class="showcase-frame showcase-coverflow credential-showcase"
                @mouseenter="certificateCarousel.mouseEnter"
                @mouseleave="certificateCarousel.mouseLeave"
                @focusin="certificateCarousel.focusIn"
                @focusout="certificateCarousel.focusOut"
                @touchstart.passive="certificateCarousel.touchStart"
                @touchend="certificateCarousel.touchEnd"
                @touchcancel="certificateCarousel.touchCancel"
                @click.capture="certificateCarousel.handleSwipeClick"
                v-on="certificateCarousel.mouseEvents"
                :style="{ '--swipe-offset': `${certificateCarousel.dragOffset.value}px` }"
                :class="{
                  'is-paused': certificateCarousel.paused.value,
                  'is-dragging': certificateCarousel.dragging.value,
                }"
              >
                <div class="showcase-coverflow-stage">
                  <article
                    v-for="(certificate, index) in featuredCertificates"
                    :key="certificate.name"
                    class="showcase-coverflow-card home-certificate-card"
                    :class="[
                      certificateCardPosition(index),
                      { 'is-preparing-from-left': index === certificatePreviousPreparation },
                    ]"
                    :inert="index !== activeCertificateIndex"
                    :aria-hidden="index !== activeCertificateIndex"
                  >
                    <MediaCarousel
                      v-if="certificate.headerPhotos.length"
                      class="home-certificate-media"
                      :media="certificate.headerPhotos"
                      :title="certificate.name"
                    />
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
                  <span
                    :key="certificateCarousel.progressVersion.value"
                    class="showcase-progress"
                  ></span>
                </div>
              </div>
            </div>
            <div
              class="credential-showcase-panel"
              :class="{ 'mobile-group-hidden': activeCredentialGroup !== 'activities' }"
            >
              <div class="credential-showcase-heading">
                <p>Honours & activities</p>
                <div class="showcase-controls">
                  <button
                    type="button"
                    aria-label="Previous achievement"
                    @click="achievementCarousel.move('previous')"
                  >
                    ←</button
                  ><span
                    >{{ String(activeAchievementIndex + 1).padStart(2, '0') }} /
                    {{ String(featuredAchievements.length).padStart(2, '0') }}</span
                  ><button
                    type="button"
                    aria-label="Next achievement"
                    @click="achievementCarousel.move('next')"
                  >
                    →
                  </button>
                </div>
              </div>
              <div
                class="showcase-frame showcase-coverflow credential-showcase"
                @mouseenter="achievementCarousel.mouseEnter"
                @mouseleave="achievementCarousel.mouseLeave"
                @focusin="achievementCarousel.focusIn"
                @focusout="achievementCarousel.focusOut"
                @touchstart.passive="achievementCarousel.touchStart"
                @touchend="achievementCarousel.touchEnd"
                @touchcancel="achievementCarousel.touchCancel"
                @click.capture="achievementCarousel.handleSwipeClick"
                v-on="achievementCarousel.mouseEvents"
                :style="{ '--swipe-offset': `${achievementCarousel.dragOffset.value}px` }"
                :class="{
                  'is-paused': achievementCarousel.paused.value,
                  'is-dragging': achievementCarousel.dragging.value,
                }"
              >
                <div class="showcase-coverflow-stage">
                  <article
                    v-for="(achievement, index) in featuredAchievements"
                    :key="achievement.name"
                    class="showcase-coverflow-card home-certificate-card"
                    :class="[
                      achievementCardPosition(index),
                      { 'is-preparing-from-left': index === achievementPreviousPreparation },
                    ]"
                    :inert="index !== activeAchievementIndex"
                    :aria-hidden="index !== activeAchievementIndex"
                  >
                    <MediaCarousel
                      v-if="achievement.headerPhotos.length"
                      class="home-certificate-media"
                      :media="achievement.headerPhotos"
                      :title="achievement.name"
                    />
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
                  <span
                    :key="achievementCarousel.progressVersion.value"
                    class="showcase-progress"
                  ></span>
                </div>
              </div>
            </div>
          </div>
          <CardActionLink class="home-section-action" href="/certificates" :show-arrow="false"
            >View all credentials <span aria-hidden="true">→</span></CardActionLink
          >
        </div>
      </section>
    </main>
  </div>
  <WorkExperienceListView
    @vue:mounted="scrollToCurrentHash"
    v-else-if="currentPath === '/experience'"
  />
  <ProjectListView @vue:mounted="scrollToCurrentHash" v-else-if="currentPath === '/projects'" />
  <CertificateListView
    @vue:mounted="scrollToCurrentHash"
    v-else-if="currentPath === '/certificates'"
  />
  <AboutView @vue:mounted="scrollToCurrentHash" v-else-if="currentPath === '/about'" />
  <WorkExperienceDetailView @vue:mounted="scrollToCurrentHash" v-else :slug="detailSlug" />
  <SiteFooter />
</template>
