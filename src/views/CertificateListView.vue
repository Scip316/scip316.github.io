<script setup lang="ts">
import { ref } from 'vue'
import MobileGroupToggle from '../components/MobileGroupToggle.vue'
import ArchivePageHeader from '../components/ArchivePageHeader.vue'
import CredentialColumn from '../components/CredentialColumn.vue'
import SiteHeader from '../components/SiteHeader.vue'
import achievementData from '../data/achievements.json'
import certificateData from '../data/certificates.json'
import { sortByNewestDate } from '../utils/sortByNewestDate'

const activeGroup = ref('credentials')
const achievements = sortByNewestDate(achievementData.achievements)
const certificates = sortByNewestDate(certificateData.certifications)
</script>

<template>
  <SiteHeader />
  <main class="experience-page certificate-page">
    <ArchivePageHeader
      :meta="`${certificates.length} credentials / ${achievements.length} activities`"
      kicker="Credentials archive"
      >Credentials<br />& Activities.</ArchivePageHeader
    >
    <MobileGroupToggle v-model="activeGroup" />
    <section class="credential-columns" aria-label="Credentials and achievements">
      <CredentialColumn
        id="certifications-title"
        :class="{ 'mobile-group-hidden': activeGroup !== 'credentials' }"
        kicker="Certificates & training"
        title="Credentials."
        introduction="Industry credentials and training that enhance my skills and workflow."
        :items="certificates"
      />
      <CredentialColumn
        id="achievements-title"
        :class="{ 'mobile-group-hidden': activeGroup !== 'activities' }"
        kicker="Honours & activities"
        title="Activities."
        introduction="Academic honours and competition involvement that i partake in."
        :items="achievements"
      />
    </section>
  </main>
</template>

<style scoped>
.credential-columns {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(28px, 5vw, 72px);
}
.credential-columns::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  content: '';
  background: var(--line);
}
@media (max-width: 760px) {
  .credential-columns {
    grid-template-columns: 1fr;
  }
  .credential-columns::before {
    display: none;
  }
}
</style>
