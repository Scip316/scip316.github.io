<script setup lang="ts">
import { computed } from 'vue'
import workExperienceData from '../data/work-experience.json'
const props = defineProps<{ slug: string }>()
const experience = computed(() => workExperienceData.experiences.find((item) => item.detailPageSlug === props.slug))
</script>

<template>
  <header class="site-header"><a class="brand" href="/" aria-label="SCIP — back to top"><span class="brand-symbol" aria-hidden="true">S</span><span class="brand-copy">SCIP316<b>/</b>DARREL LIM</span></a><nav class="desktop-nav" aria-label="Main navigation"><a href="/">Home</a><a href="/experience">Work Experience</a><a href="/projects">Projects</a><a href="/certificates">Credentials</a><a href="/#contact">Contact</a></nav></header>
  <main v-if="experience" class="experience-page experience-detail-page"><header class="experience-page-header"><a href="/experience" class="back-link">← All work experiences</a><p>{{ experience.period }}</p></header><section class="experience-detail-hero"><div class="experience-detail-image" :style="{ backgroundImage: `linear-gradient(135deg, #1c1c1c99, #1c1c1c33), url(${experience.headerPhoto})` }"><span>{{ experience.title }}</span></div><div><p class="page-kicker">{{ experience.workplace }}</p><h1>{{ experience.title }}</h1><p class="experience-detail-summary">{{ experience.summary }}</p></div></section><section class="experience-detail-content"><div><p class="page-kicker">What I did</p><p>{{ experience.longDescription }}</p></div><div><p class="page-kicker">Skills</p><ul class="detail-skills"><li v-for="skill in experience.skills" :key="skill">{{ skill }}</li></ul></div></section><section v-if="experience.endorsements.length" class="endorsements"><p class="page-kicker">Endorsements</p><div class="endorsement-grid"><blockquote v-for="endorsement in experience.endorsements" :key="endorsement.name"><footer><strong>{{ endorsement.name }}</strong><span aria-hidden="true">|</span><span>{{ endorsement.role }}</span></footer><p>“{{ endorsement.quote }}”</p></blockquote></div></section></main>
  <main v-else class="experience-page"><a href="/experience" class="back-link">← All work experiences</a><h1>Experience not found.</h1></main>
</template>
