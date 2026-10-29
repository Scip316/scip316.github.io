<script setup lang="ts">
type SectionRailItem = {
  id: string
  label: string
}

withDefaults(
  defineProps<{
    items: SectionRailItem[]
    activeId: string | null
    visible?: boolean
    top?: number
    compact?: boolean
    contentAligned?: boolean
  }>(),
  {
    visible: true,
    top: 118,
    compact: false,
    contentAligned: false,
  },
)
</script>

<template>
  <nav
    class="section-rail"
    :class="{
      'is-visible': visible,
      'section-rail--compact': compact,
      'section-rail--content-aligned': contentAligned,
    }"
    :style="{ top: `${top}px` }"
    :aria-hidden="!visible"
    aria-label="On this page"
  >
    <p>On this page</p>
    <a
      v-for="(item, index) in items"
      :key="item.id"
      :href="`#${item.id}`"
      :class="{ 'is-active': activeId === item.id }"
    >
      <span>{{ String(index + 1).padStart(2, '0') }}</span>{{ item.label }}
    </a>
  </nav>
</template>

<style scoped>
.section-rail {
  position: fixed;
  left: clamp(42px, 6vw, 110px);
  z-index: 10;
  display: grid;
  min-width: 280px;
  padding: 24px 28px 24px 27px;
  border: 1px solid var(--line);
  background: var(--background);
  isolation: isolate;
  box-shadow: 0 0 0 1px var(--background);
  opacity: 0;
  pointer-events: none;
  transform: translateX(-12px);
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.section-rail.is-visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(0);
}

.section-rail p {
  margin: 0 0 15px;
  color: var(--muted);
  font: 0.88rem 'DM Mono', monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.section-rail a {
  position: relative;
  padding: 12px 0;
  color: var(--muted);
  font: 1.08rem 'DM Mono', monospace;
  letter-spacing: 0.05em;
  text-decoration: none;
  text-transform: uppercase;
  transition: color 0.2s ease;
}

.section-rail a::before {
  position: absolute;
  top: 50%;
  left: -28px;
  width: 3px;
  height: 0;
  content: '';
  background: var(--accent);
  transform: translateY(-50%);
  transition: height 0.2s ease;
}

.section-rail a:hover,
.section-rail a.is-active {
  color: var(--accent);
}

.section-rail a.is-active::before {
  height: 38px;
}

.section-rail a span {
  display: inline-block;
  width: 44px;
  color: inherit;
}

.section-rail--compact {
  left: clamp(24px, 3vw, 60px);
  min-width: 205px;
  padding: 20px 22px 20px 23px;
}

/* Keep at least 32px between the rail and the centered content as the viewport narrows. */
.section-rail--content-aligned {
  left: max(16px, calc(50vw - (clamp(1000px, 58vw, 1360px) / 2) - 328px));
  right: auto;
  width: min(280px, calc(50vw - (clamp(1000px, 58vw, 1360px) / 2) - 48px));
  min-width: 0;
}

.section-rail--compact p {
  margin-bottom: 12px;
  font-size: 0.75rem;
}

.section-rail--compact a {
  padding: 9px 0;
  font-size: 0.88rem;
}

.section-rail--compact a::before {
  left: -24px;
}

.section-rail--compact a.is-active::before {
  height: 31px;
}

.section-rail--compact a span {
  width: 36px;
}

/* Reserve a slimmer rail for laptops; tablet/mobile navigation uses the header. */
@media (min-width: 1201px) and (max-width: 1600px) {
  .section-rail {
    left: 16px;
    width: var(--section-rail-laptop-width);
    min-width: 0;
    padding: 18px 18px 18px 17px;
  }
  .section-rail p {
    font-size: 0.75rem;
  }
  .section-rail a {
    padding: 10px 0;
    font-size: clamp(0.8rem, 0.9vw, 0.9rem);
    letter-spacing: 0.03em;
  }
  .section-rail a span {
    width: 30px;
  }
  .section-rail a::before {
    left: -18px;
  }
}

@media (max-width: 1200px) {
  .section-rail {
    display: none;
  }
}
</style>
