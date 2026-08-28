<script setup lang="ts">
import { computed } from 'vue'
import CardActionLink from '../components/CardActionLink.vue'
import MediaCarousel from '../components/MediaCarousel.vue'
import SiteHeader from '../components/SiteHeader.vue'
import workExperienceData from '../data/work-experience.json'
import { sortAlphabetically } from '../utils/sortAlphabetically'
const props = defineProps<{ slug: string }>()
const experience = computed(() =>
  workExperienceData.experiences.find((item) => item.detailPageSlug === props.slug),
)
const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ??
      character,
  )
const formatInlineMarkdown = (value: string) =>
  escapeHtml(value).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
type DescriptionSection = {
  title: string
  content: string[]
}

const descriptionSections = computed<DescriptionSection[]>(() => {
  const description = experience.value?.longDescription
  if (Array.isArray(description)) return description as DescriptionSection[]
  if (!description) return []

  return [{ title: 'Overview', content: [description] }]
})
</script>

<template>
  <SiteHeader />
  <main v-if="experience" class="experience-page experience-detail-page">
    <header class="experience-page-header">
      <CardActionLink href="/experience" :show-arrow="false">← All work experiences</CardActionLink>
      <p>{{ experience.period }}</p>
    </header>
    <section class="experience-detail-hero">
      <MediaCarousel
        class="experience-detail-image"
        :media="experience.headerPhotos"
        :title="experience.title"
      />
      <div>
        <p class="page-kicker">{{ experience.workplace }}</p>
        <h1>{{ experience.title }}</h1>
        <p class="experience-detail-summary">{{ experience.summary }}</p>
      </div>
    </section>
    <section class="experience-detail-content">
      <div>
        <p class="page-kicker">My Responsibilities:</p>
        <div class="experience-description">
          <section
            v-for="section in descriptionSections"
            :key="section.title"
            class="experience-description-section"
          >
            <h2>{{ section.title }}</h2>
            <p
              v-for="paragraph in section.content"
              :key="paragraph"
              v-html="formatInlineMarkdown(paragraph)"
            ></p>
          </section>
        </div>
      </div>
      <div>
        <p class="page-kicker">Skills</p>
        <ul class="detail-skills">
          <li v-for="skill in sortAlphabetically(experience.skills)" :key="skill">{{ skill }}</li>
        </ul>
      </div>
    </section>
    <section v-if="experience.endorsements?.length" class="endorsements">
      <p class="page-kicker">Endorsements</p>
      <div class="endorsement-grid">
        <blockquote v-for="endorsement in experience.endorsements ?? []" :key="endorsement.name">
          <footer>
            <strong>{{ endorsement.name }}</strong
            ><span aria-hidden="true">|</span><span>{{ endorsement.role }}</span>
          </footer>
          <p>“{{ endorsement.quote }}”</p>
        </blockquote>
      </div>
    </section>
  </main>
  <main v-else class="experience-page">
    <CardActionLink href="/experience" :show-arrow="false">← All work experiences</CardActionLink>
    <h1>Experience not found.</h1>
  </main>
</template>
