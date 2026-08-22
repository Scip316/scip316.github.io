<script setup lang="ts">
import workExperienceData from '../data/work-experience.json'
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
  <main class="experience-page">
    <header class="experience-page-header">
      <a href="/" class="back-link">← Back to portfolio</a>
      <p>Work history / {{ workExperienceData.experiences.length }} roles</p>
    </header>
    <section class="experience-page-title">
      <p class="page-kicker">All work experience</p>
      <h1>Previous appointments<br />that I held.</h1>
    </section>
    <section class="experience-grid" aria-label="Work experience">
      <a
        v-for="item in workExperienceData.experiences"
        :key="item.id"
        :href="`/experience/${item.detailPageSlug}`"
        class="experience-grid-card"
        ><div
          class="experience-grid-image"
          :style="{
            backgroundImage: `linear-gradient(135deg, #1c1c1c99, #1c1c1c33), url(${item.headerPhoto})`,
          }"
        >
          <span>{{ item.title }}</span>
        </div>
        <div class="experience-grid-content">
          <p class="page-kicker">{{ item.period }}</p>
          <h2>{{ item.title }}</h2>
          <p class="experience-workplace">{{ item.workplace }}</p>
          <p>{{ item.summary }}</p>
          <span class="experience-card-link">View experience →</span>
        </div></a
      >
    </section>
  </main>
</template>
