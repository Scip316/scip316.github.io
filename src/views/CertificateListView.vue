<script setup lang="ts">
import certificateData from '../data/certificates.json'

const certificates = certificateData.certifications
</script>

<template>
  <header class="site-header"><a class="brand" href="/" aria-label="SCIP — back to top"><span class="brand-symbol" aria-hidden="true">S</span><span class="brand-copy">SCIP316<b>/</b>DARREL LIM</span></a><nav class="desktop-nav" aria-label="Main navigation"><a href="/">Home</a><a href="/experience">Work Experience</a><a href="/projects">Projects</a><a href="/certificates">Certificates</a><a href="/#contact">Contact</a></nav></header>
  <main class="experience-page certificate-page">
    <header class="experience-page-header"><a href="/" class="back-link">← Back to portfolio</a><p>All credentials / {{ certificates.length }} certificates</p></header>
    <section class="experience-page-title"><p class="page-kicker">Certificate archive</p><h1>Learning, recognised<br />along the way.</h1></section>
    <section class="experience-grid certificate-list-grid" aria-label="Certificates">
      <article v-for="(certificate, index) in certificates" :key="certificate.name" class="experience-grid-card certificate-list-card"><div class="certificate-number">{{ String(index + 1).padStart(2, '0') }}</div><div class="experience-grid-content"><p class="page-kicker">{{ certificate.displayDate }}</p><h2>{{ certificate.name }}</h2><p class="certificate-issuer">{{ certificate.issuer }}</p></div></article>
    </section>
  </main>
</template>

<style scoped>
.certificate-list-card { position: relative; min-height: 285px; overflow: hidden; background: var(--surface); }
.certificate-number { padding: 20px 24px; background: var(--header); color: var(--accent); font: 2rem/.8 'DM Mono', monospace; letter-spacing: -.1em; }
.certificate-issuer { margin: 20px 0 0; color: var(--muted); font-size: 1rem; }
</style>
