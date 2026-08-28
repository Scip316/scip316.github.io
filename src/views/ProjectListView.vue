<script setup lang="ts">
import projectData from '../data/projects.json'
import ArchivePageHeader from '../components/ArchivePageHeader.vue'
import CardActionLink from '../components/CardActionLink.vue'
import SiteHeader from '../components/SiteHeader.vue'
import { primaryHeaderPhoto } from '../utils/primaryHeaderPhoto'
import { sortByNewestDate } from '../utils/sortByNewestDate'

const projects = sortByNewestDate(projectData.projects)
</script>

<template>
  <SiteHeader />
  <main class="experience-page project-page">
    <ArchivePageHeader
      class="project-page-header"
      :meta="`All projects / ${projects.length} builds`"
      kicker="Project archive"
      >Projects that<br />I made.</ArchivePageHeader
    >
    <section class="experience-grid project-list-grid" aria-label="Projects">
      <article
        v-for="project in projects"
        :key="project.id"
        class="experience-grid-card project-list-card"
      >
        <div
          class="experience-grid-image project-list-image"
          :style="{
            backgroundColor: '#202020',
            backgroundImage: `url(${primaryHeaderPhoto(project.headerPhotos)})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
          }"
        ></div>
        <div class="experience-grid-content">
          <p class="page-kicker">{{ project.category }} · {{ project.year }}</p>
          <h2>{{ project.title }}</h2>
          <p class="project-summary">{{ project.summary }}</p>
          <ul>
            <li v-for="technology in project.technologies" :key="technology">{{ technology }}</li>
          </ul>
          <div class="card-action-link-group project-links">
            <CardActionLink
              v-for="link in project.links"
              :key="link.url"
              :href="link.url"
              external
              >{{ link.title }}</CardActionLink
            >
            <span v-if="!project.links.length">NA</span>
          </div>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.project-page-header {
  position: relative;
}
.project-page-header::after {
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  content: '';
  background: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent);
  animation: trace-project-divider 7s ease-in-out infinite;
}
.project-list-card {
  --action-link-color: var(--text);
  background: var(--surface);
}
.project-list-image {
  position: relative;
  overflow: hidden;
  background-color: #45504a;
  background-image:
    linear-gradient(45deg, #ffffff1c 25%, transparent 25%, transparent 75%, #ffffff1c 75%),
    linear-gradient(45deg, #ffffff1c 25%, transparent 25%, transparent 75%, #ffffff1c 75%);
  background-size: 40px 40px;
  background-position:
    0 0,
    20px 20px;
}
.project-list-image::after {
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(115deg, transparent 38%, #ffffff28 50%, transparent 62%);
}
.project-summary {
  min-height: 72px;
}
.project-list-card ul {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  padding: 0;
  margin: 22px 0;
  list-style: none;
}
.project-list-card li {
  padding: 3px 7px;
  border: 1px solid var(--line);
  font:
    0.62rem 'DM Mono',
    monospace;
  text-transform: uppercase;
}
.project-links {
  margin-top: auto;
}
.project-links span {
  color: var(--muted);
}
@keyframes trace-project-divider {
  0%,
  12% {
    left: 0;
    opacity: 0;
  }
  18%,
  82% {
    opacity: 1;
  }
  88%,
  100% {
    left: calc(100% - 5px);
    opacity: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .project-page-header::after {
    animation: none;
  }
}
</style>
