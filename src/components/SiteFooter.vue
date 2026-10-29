<script setup lang="ts">
import SocialIcon from './SocialIcon.vue'
import { profile_declaration, socials } from '../data/portfolio'
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer-content">
      <h2>Contact me</h2>
      <nav class="site-footer-icons" aria-label="Social links">
        <a
          v-for="social in socials"
          :key="social.name"
          :href="social.url"
          :target="social.name === 'Email' ? undefined : '_blank'"
          rel="noreferrer"
          :aria-label="social.name"
        >
          <SocialIcon :name="social.name" />
        </a>
      </nav>
      <p>Last updated: {{ profile_declaration.lastUpdated }}</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: 34px 24px;
  border-top: 1px solid var(--line);
  background: var(--header);
}

.site-footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
}

.site-footer h2 {
  margin: 0;
  color: var(--chrome-text, #fff);
  font-size: 1.4rem;
  letter-spacing: -0.04em;
}

.site-footer-icons {
  display: flex;
  gap: 12px;
  margin: 0;
}

.site-footer-icons a {
  display: grid;
  width: 39px;
  height: 39px;
  place-items: center;
  padding: 0;
  border: 1px solid var(--chrome-line, #ffffff45);
  border-radius: 50%;
  color: var(--chrome-text, #fff);
}

.site-footer-icons a:hover {
  border-color: var(--accent);
  background: var(--accent);
  color: #fff;
}

.site-footer p {
  margin: 0;
  color: var(--chrome-muted, #c7c7c2);
  font:
    0.9rem 'DM Mono',
    monospace;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

@media (max-width: 560px) {
  .site-footer-content {
    flex-direction: column;
    gap: 18px;
  }
}
</style>
