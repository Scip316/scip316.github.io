<script setup lang="ts">
import { ref } from 'vue'
import { certifications, experience, profile, projects, socials } from './data/portfolio'
type Section = 'work' | 'projects' | 'credentials'
const openSection = ref<Section | null>(null)
const menuOpen = ref(false)
const toggleSection = (section: Section) =>
  (openSection.value = openSection.value === section ? null : section)
const closeMenu = () => (menuOpen.value = false)
</script>

<template>
  <header class="site-header">
    <a class="brand" href="#intro" aria-label="SCIP — back to top"
      ><span class="brand-symbol" aria-hidden="true">S</span
      ><span class="brand-copy">SCIP316<b>/</b>DARREL LIM</span></a
    >
    <nav class="desktop-nav" aria-label="Main navigation">
      <a href="#intro">Home</a><a href="#work-experience">Work Experience</a
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
      ><a href="#work-experience" @click="closeMenu">Work Experience</a
      ><a href="#projects" @click="closeMenu">Projects</a
      ><a href="#certificates" @click="closeMenu">Certificates</a
      ><a href="#contact" @click="closeMenu">Contact</a>
    </nav>
  </header>
  <main>
    <section id="intro" class="intro">
      <div class="intro-text">
        <h1>Greetings, I am Darrel.</h1>
        <p class="current-role">{{ profile.role }}</p>
        <p>{{ profile.intro }}</p>
      </div>
    </section>
    <section id="work-experience" class="content-section">
      <button
        class="accordion-title"
        type="button"
        :aria-expanded="openSection === 'work'"
        @click="toggleSection('work')"
      >
        <span>Work Experience</span
        ><span class="arrow">{{ openSection === 'work' ? '−' : '+' }}</span>
      </button>
      <div v-if="openSection === 'work'" class="accordion-content">
        <article v-for="item in experience" :key="item.company" class="detail-card">
          <p class="card-label">{{ item.period }}</p>
          <h2>{{ item.role }}</h2>
          <p class="card-subtitle">{{ item.company }}</p>
          <p>{{ item.description }}</p>
        </article>
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
      <a class="email" :href="`mailto:${profile.email}`">{{ profile.email }}</a>
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
    <time class="last-updated" datetime="2026-08-22">Last updated: {{ profile.lastUpdated }}</time>
  </footer>
</template>
