<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import CardActionLink from './components/CardActionLink.vue'
import SectionRail from './components/SectionRail.vue'
import AboutView from './views/AboutView.vue'
import CertificateListView from './views/CertificateListView.vue'
import MediaCarousel from './components/MediaCarousel.vue'
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
import { useActiveSection } from './composables/useActiveSection'

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
const carouselInterval = 4600
const createResumableRotation = (advance: () => void, itemCount: () => number) => {
  let timer: number | undefined
  let deadline = 0
  let remaining = carouselInterval

  const schedule = (delay: number) => {
    if (itemCount() < 2) return

    deadline = performance.now() + delay
    timer = window.setTimeout(() => {
      timer = undefined
      remaining = carouselInterval
      advance()
      schedule(carouselInterval)
    }, delay)
  }

  const start = () => {
    if (timer !== undefined) return
    schedule(remaining)
  }

  const stop = () => {
    if (timer === undefined) return
    remaining = Math.max(0, deadline - performance.now())
    window.clearTimeout(timer)
    timer = undefined
  }

  const restart = () => {
    stop()
    remaining = carouselInterval
    start()
  }

  return { start, stop, restart }
}

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
const nextCertificate = () => {
  activeCertificateIndex.value = (activeCertificateIndex.value + 1) % featuredCertificates.length
}
const previousCertificate = () => {
  activeCertificateIndex.value =
    (activeCertificateIndex.value - 1 + featuredCertificates.length) % featuredCertificates.length
}
const nextAchievement = () => {
  activeAchievementIndex.value = (activeAchievementIndex.value + 1) % featuredAchievements.length
}
const previousAchievement = () => {
  activeAchievementIndex.value =
    (activeAchievementIndex.value - 1 + featuredAchievements.length) % featuredAchievements.length
}
const workRotation = createResumableRotation(nextWork, () => workExperiences.length)
const projectRotation = createResumableRotation(nextProject, () => featuredProjects.length)
const certificateRotation = createResumableRotation(nextCertificate, () => featuredCertificates.length)
const achievementRotation = createResumableRotation(nextAchievement, () => featuredAchievements.length)
const startWorkRotation = workRotation.start
const stopWorkRotation = workRotation.stop
const startProjectRotation = projectRotation.start
const stopProjectRotation = projectRotation.stop
const startCertificateRotation = certificateRotation.start
const stopCertificateRotation = certificateRotation.stop
const startAchievementRotation = achievementRotation.start
const stopAchievementRotation = achievementRotation.stop
const moveWork = (direction: 'next' | 'previous') => {
  if (direction === 'next') nextWork()
  else previousWork()
  workRotation.restart()
}
const moveProject = (direction: 'next' | 'previous') => {
  if (direction === 'next') nextProject()
  else previousProject()
  projectRotation.restart()
}
const moveCertificate = (direction: 'next' | 'previous') => {
  if (direction === 'next') nextCertificate()
  else previousCertificate()
  certificateRotation.restart()
}
const moveAchievement = (direction: 'next' | 'previous') => {
  if (direction === 'next') nextAchievement()
  else previousAchievement()
  achievementRotation.restart()
}

const updateCurrentPath = () => {
  currentPath.value = window.location.pathname
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
  startWorkRotation()
  startProjectRotation()
  startCertificateRotation()
  startAchievementRotation()
  window.addEventListener('popstate', updateCurrentPath)
  document.addEventListener('click', handleInternalNavigation)
})
onUnmounted(() => {
  stopWorkRotation()
  stopProjectRotation()
  stopCertificateRotation()
  stopAchievementRotation()
  window.removeEventListener('popstate', updateCurrentPath)
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
              <span :key="displayedWorkIndex" class="showcase-progress"></span>
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
              <span :key="activeProjectIndex" class="showcase-progress"></span>
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
                  <span :key="activeAchievementIndex" class="showcase-progress"></span>
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
  <WorkExperienceListView v-else-if="currentPath === '/experience'" />
  <ProjectListView v-else-if="currentPath === '/projects'" />
  <CertificateListView v-else-if="currentPath === '/certificates'" />
  <AboutView v-else-if="currentPath === '/about'" />
  <WorkExperienceDetailView v-else :slug="detailSlug" />
  <SiteFooter />
</template>
