<script setup lang="ts">
import ArchivePageHeader from '../components/ArchivePageHeader.vue'
import CardActionLink from '../components/CardActionLink.vue'
import MediaCarousel from '../components/MediaCarousel.vue'
import SiteHeader from '../components/SiteHeader.vue'
import workExperienceData from '../data/work-experience.json'
import { sortByNewestDate } from '../utils/sortByNewestDate'

const workExperiences = sortByNewestDate(workExperienceData.experiences)
</script>

<template>
  <SiteHeader />
  <main class="experience-page">
    <ArchivePageHeader
      :meta="`Work history / ${workExperiences.length} roles`"
      kicker="All work experience"
      >Previous appointments<br />that I held.</ArchivePageHeader
    >
    <section class="experience-grid" aria-label="Work experience">
      <a
        v-for="item in workExperiences"
        :key="item.id"
        :href="`/experience/${item.detailPageSlug}`"
        class="experience-grid-card"
        ><MediaCarousel
          class="experience-grid-image"
          :media="item.headerPhotos"
          :title="item.title"
        />
        <div class="experience-grid-content">
          <p class="page-kicker">{{ item.period }}</p>
          <h2>{{ item.title }}</h2>
          <p class="experience-workplace">{{ item.workplace }}</p>
          <p>{{ item.summary }}</p>
          <div class="card-action-link-group">
            <CardActionLink :show-arrow="false">View experience →</CardActionLink>
          </div>
        </div></a
      >
    </section>
  </main>
</template>
