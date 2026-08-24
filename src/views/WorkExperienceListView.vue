<script setup lang="ts">
import WorkMediaGallery from '../components/WorkMediaGallery.vue'
import SiteHeader from '../components/SiteHeader.vue'
import workExperienceData from '../data/work-experience.json'
import { sortByNewestDate } from '../utils/sortByNewestDate'

const workExperiences = sortByNewestDate(workExperienceData.experiences)
</script>

<template>
  <SiteHeader />
  <main class="experience-page">
    <header class="experience-page-header">
      <a href="/" class="back-link">← Back to portfolio</a>
      <p>Work history / {{ workExperiences.length }} roles</p>
    </header>
    <section class="experience-page-title">
      <p class="page-kicker">All work experience</p>
      <h1>Previous appointments<br />that I held.</h1>
    </section>
    <section class="experience-grid" aria-label="Work experience">
      <a
        v-for="item in workExperiences"
        :key="item.id"
        :href="`/experience/${item.detailPageSlug}`"
        class="experience-grid-card"
        ><WorkMediaGallery
          class="experience-grid-image"
          :photos="item.headerPhotos"
          :title="item.title"
        />
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
