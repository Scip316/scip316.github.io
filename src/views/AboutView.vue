<script setup lang="ts">
import { profile_declaration, socials } from '../data/portfolio'
</script>

<template>
  <header class="site-header">
    <a class="brand" href="/" aria-label="SCIP — back to top"
      ><span class="brand-symbol" aria-hidden="true">S</span
      ><span class="brand-copy">SCIP316<b>/</b>DARREL LIM</span></a
    >
    <nav class="desktop-nav" aria-label="Main navigation">
      <a href="/">Home</a><a href="/experience">Work Experience</a><a href="/projects">Projects</a
      ><a href="/certificates">Credentials</a><a href="/about">About Me</a>
    </nav>
  </header>

  <main class="experience-page about-page">
    <header class="experience-page-header">
      <a href="/" class="back-link">← Back to portfolio</a>
      <p>Profile / {{ profile_declaration.location }}</p>
    </header>

    <section class="experience-page-title">
      <p class="page-kicker">About me</p>
      <h1>Hello, I’m<br />{{ profile_declaration.name }}.</h1>
    </section>

    <section class="about-layout" aria-label="About Darrel">
      <div>
        <p class="page-kicker">Current chapter</p>
        <p class="about-role">{{ profile_declaration.role }}</p>
        <p class="about-intro">{{ profile_declaration.intro }}</p>
      </div>

      <dl class="about-details">
        <div>
          <dt>Based in</dt>
          <dd>{{ profile_declaration.location }}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>
            <a :href="`mailto:${profile_declaration.email}`">{{ profile_declaration.email }}</a>
          </dd>
        </div>
      </dl>
    </section>

    <section class="about-connect">
      <p class="page-kicker">Connect</p>
      <div class="about-connect-links">
        <a
          v-for="social in socials"
          :key="social.name"
          :href="social.url"
          :target="social.name === 'Email' ? undefined : '_blank'"
          rel="noreferrer"
          >{{ social.name }} <span aria-hidden="true">↗</span></a
        >
      </div>
      <p class="about-updated">Last updated: {{ profile_declaration.lastUpdated }}</p>
    </section>
  </main>
</template>

<style scoped>
.about-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(270px, 0.7fr);
  gap: clamp(42px, 9vw, 150px);
  padding: clamp(32px, 5vw, 68px) 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.about-role {
  display: inline-block;
  margin: 0 0 24px;
  padding: 7px 11px;
  border: 1px solid var(--accent);
  color: var(--accent);
  font:
    0.78rem 'DM Mono',
    monospace;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.about-intro {
  max-width: 760px;
  margin: 0;
  color: var(--muted);
  font-size: clamp(1.12rem, 1.8vw, 1.45rem);
  line-height: 1.7;
  white-space: pre-line;
}

.about-details {
  display: grid;
  margin: 0;
}

.about-details div {
  padding: 19px 0;
  border-top: 1px solid var(--line);
}

.about-details div:last-child {
  border-bottom: 1px solid var(--line);
}

.about-details dt {
  margin-bottom: 6px;
  color: var(--accent);
  font:
    0.7rem 'DM Mono',
    monospace;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.about-details dd {
  margin: 0;
  color: var(--text);
  font-size: 1.02rem;
}

.about-details a {
  color: inherit;
  text-decoration-color: var(--accent);
  text-underline-offset: 5px;
}

.about-connect {
  margin-top: clamp(56px, 9vw, 130px);
}

.about-connect-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.about-connect-links a {
  padding: 12px 15px;
  border: 1px solid var(--line);
  color: var(--text);
  font:
    0.8rem 'DM Mono',
    monospace;
  text-decoration: none;
  text-transform: uppercase;
  transition:
    color 0.25s ease,
    border-color 0.25s ease,
    transform 0.25s ease;
}

.about-connect-links a:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-3px);
}

.about-connect-links span {
  color: var(--accent);
}

.about-updated {
  margin: 30px 0 0;
  color: var(--muted);
  font:
    0.72rem 'DM Mono',
    monospace;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

@media (max-width: 760px) {
  .about-layout {
    grid-template-columns: 1fr;
  }
}
</style>
