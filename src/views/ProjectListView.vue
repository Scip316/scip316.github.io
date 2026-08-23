<script setup lang="ts">
import projectData from '../data/projects.json'
import { sortByNewestDate } from '../utils/sortByNewestDate'

const projects = sortByNewestDate(projectData.projects)
</script>

<template>
  <header class="site-header">
    <a class="brand" href="/" aria-label="SCIP — back to top"
      ><span class="brand-symbol" aria-hidden="true">S</span
      ><span class="brand-copy">SCIP316<b>/</b>DARREL LIM</span></a
    >
    <nav class="desktop-nav" aria-label="Main navigation">
      <a href="/">Home</a><a href="/experience">Work Experience</a><a href="/projects">Projects</a
      ><a href="/certificates">Credentials</a><a href="/#contact">Contact</a>
    </nav>
  </header>
  <main class="experience-page project-page">
    <header class="experience-page-header project-page-header">
      <a href="/" class="back-link">← Back to portfolio</a>
      <p>All projects / {{ projects.length }} builds</p>
    </header>
    <section class="experience-page-title">
      <p class="page-kicker">Project archive</p>
      <h1>Projects that<br />I made.</h1>
    </section>
    <section class="experience-grid project-list-grid" aria-label="Projects">
      <article
        v-for="project in projects"
        :key="project.id"
        class="experience-grid-card project-list-card"
      >
        <div class="experience-grid-image project-list-image" :class="`visual-${project.visual}`">
          <span>{{ project.visualLabel }}</span>
        </div>
        <div class="experience-grid-content">
          <p class="page-kicker">{{ project.category }} · {{ project.year }}</p>
          <h2>{{ project.title }}</h2>
          <p class="project-summary">{{ project.summary }}</p>
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
.project-list-image.visual-chatbot {
  background-color: #373e65;
}
.project-list-image span {
  z-index: 1;
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
  padding-top: 13px;
  border-top: 1px solid var(--line);
  font:
    0.69rem 'DM Mono',
    monospace;
  text-transform: uppercase;
}
.project-links a {
  margin-right: 16px;
  color: var(--text);
  text-decoration: none;
}
.project-links a:hover {
  color: var(--accent);
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
