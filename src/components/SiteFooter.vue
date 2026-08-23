<script setup lang="ts">
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
          ><svg v-if="social.name === 'WhatsApp'" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.6 4.1 1.6 5.8L.2 23.8l6.4-1.7a11.8 11.8 0 0 0 5.5 1.4h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.3-6.1-3.5-8.2ZM12.1 21.5c-1.8 0-3.5-.5-5-1.3l-.4-.2-3.8 1 1-3.7-.3-.4a9.7 9.7 0 0 1-1.5-5.1c0-5.4 4.4-9.7 9.8-9.7 2.6 0 5 .9 6.9 2.8a9.7 9.7 0 0 1 2.8 6.9c0 5.4-4.4 9.7-9.5 9.7Zm5.3-7.3c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-.9 1.2-.3.2-.6.1a7.8 7.8 0 0 1-2.3-1.4 8.5 8.5 0 0 1-1.6-2c-.2-.3 0-.4.1-.6l.5-.5c.1-.1.2-.3.3-.5.1-.2 0-.4 0-.5l-1-2.3c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.4 1 2.8 1.1 3 .2.3.3.5c1.4 2.1 3.4 3.7 5.7 4.6.5.2.9.4 1.2.5.5.2 1 .2 1.3.1.4-.1 1.8-.8 2-1.6.3-.8.3-1.4.2-1.6-.1-.1-.3-.2-.6-.4Z"
            /></svg
          ><svg v-else-if="social.name === 'Telegram'" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M21.9 3.5 18.6 20c-.2 1.2-.9 1.5-1.8 1l-5.1-3.7-2.5 2.4c-.3.3-.5.5-1 .5l.4-5.2 9.5-8.6c.4-.4-.1-.6-.6-.2L5.8 13.5.8 12c-1.1-.3-1.1-1.1.2-1.6L20.4 3c.9-.3 1.7.2 1.5.5Z"
            /></svg
          ><svg v-else-if="social.name === 'LinkedIn'" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM2.8 9.8h4.4V21H2.8V9.8ZM10 9.8h4.2v1.5h.1c.6-1.1 2-2.2 4.1-2.2 4.4 0 5.2 2.9 5.2 6.6V21h-4.4v-4.7c0-1.1 0-2.6-1.6-2.6s-1.9 1.2-1.9 2.5V21H10V9.8Z"
            /></svg
          ><svg v-else viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M2 4.5A2.5 2.5 0 0 1 4.5 2h15A2.5 2.5 0 0 1 22 4.5v15a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 19.5v-15Zm2 .1v.2l8 5.6 8-5.6v-.2H4Zm16 2.7-7.4 5.2a1 1 0 0 1-1.2 0L4 7.3v12.2c0 .3.2.5.5.5h15c.3 0 .5-.2.5-.5V7.3Z"
            /></svg
        ></a>
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
  color: #fff;
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
  border: 1px solid #ffffff45;
  border-radius: 50%;
  color: #fff;
}

.site-footer-icons a:hover {
  border-color: var(--accent);
  background: var(--accent);
  color: #fff;
}

.site-footer-icons svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.site-footer p {
  margin: 0;
  color: #c7c7c2;
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
