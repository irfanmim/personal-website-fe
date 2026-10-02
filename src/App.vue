<template>
  <header v-if="showNav" class="nav-shell">
    <div class="nav-container">
      <NavBar
        :name="navName"
        :links="navLinks"
        :active-section="currentSection"
        :is-dark="isDark"
        @toggle-dark="toggle"
      />
    </div>
  </header>
  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import { content, loadContent } from './store/content.js'
import { useDarkMode } from './composables/useDarkMode.js'
import { useActiveSection } from './composables/useActiveSection.js'

onMounted(() => loadContent())

const route = useRoute()
const { isDark, toggle } = useDarkMode()

const sectionIds = ['home', 'projects', 'experience', 'about', 'contact']
const { activeSection } = useActiveSection(sectionIds, () => route.path)

const showNav = computed(() => !route.path.startsWith('/admin'))

const navName = 'Irfan'

// `id` is what the scroll tracking (or the current route) is matched against.
const navLinks = [
  { id: 'home',       label: 'Home',       href: '#home' },
  { id: 'projects',   label: 'Projects',   href: '/#/projects' },
  { id: 'experience', label: 'Experience', href: '#experience' },
  { id: 'about',      label: 'About',      href: '#about' },
  { id: 'contact',    label: 'Contact',    href: '#contact' },
]

// The /projects page has no home-page sections to scroll through, so the
// scroll tracking would stay stuck on whichever section was last seen there.
const currentSection = computed(() => (route.path.startsWith('/projects') ? 'projects' : activeSection.value))
</script>

<style>
/* ── Design tokens ──────────────────────────────────────────────
   Dark navy is the primary identity. Cyan = engineering, violet =
   product, emerald = everything else — the same mapping in every
   chart, the hero T-shape, and the 3D career path. Light is a
   secondary alt behind the toggle, same relationships. ── */
:root {
  --color-bg: #0a0e17;
  --color-bg-elevated: #0f1420;
  --color-panel-2: #141b29;
  --color-text: #e6ebf4;
  --color-text-muted: #aab6cc;
  --color-text-faint: #7c8aa5;
  --color-text-dim: #7c8aa5;
  --color-text-footer: #56627a;
  --color-border: rgba(148, 163, 184, 0.10);
  --color-border-strong: rgba(148, 163, 184, 0.18);
  --color-card-bg: #0f1420;
  --color-accent: #22d3ee;
  --color-accent-strong: #67e8f9;
  --color-accent-ink: #05070c;
  --color-tag-text: var(--color-text-muted);
  --color-rail: var(--color-border-strong);
  --color-nav-bg: rgba(10, 14, 23, 0.82);

  --chart-engineering: #22d3ee;
  --chart-product: #a78bfa;
  --chart-tools: #34d399;
  --chart-engineering-soft: #67e8f9;
  --chart-product-soft: #c4b5fd;
  --chart-lead: #fbbf24;
  --chart-lead-soft: #fcd34d;
  --chart-tools-soft: #6ee7b7;
  --gradient-depth: linear-gradient(90deg, var(--chart-engineering), #8b5cf6);

  --font-display: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
  --font-body: 'Inter', ui-sans-serif, system-ui, sans-serif;

  /* ── Type scale ── one size per job; components use these, not raw values.
     The hero headline keeps its own responsive sizes. */
  --text-h1: 2.25rem;      /* page title (/projects) */
  --text-h2: 1.75rem;      /* section titles */
  --text-h3: 1.2rem;       /* card and role titles */
  --text-statement: 1.6rem; /* About lead sentence */
  --text-lead: 1.0625rem;  /* about bio, contact tagline, hero role line */
  --text-body: 0.9375rem;  /* descriptions, achievements, links */
  --text-sm: 0.875rem;     /* buttons, nav, labels, periods */
  --text-xs: 0.75rem;      /* tags, chips, axis years, footer */
}

@media (min-width: 640px) {
  :root {
    --text-h1: 2.75rem;
  }
}

@media (min-width: 1024px) {
  :root {
    --text-h2: 2.125rem;
    --text-statement: 1.9rem;
  }
}

[data-theme="light"] {
  --color-bg: #f6f8fb;
  --color-bg-elevated: #ffffff;
  --color-panel-2: #eef2f7;
  --color-text: #0f172a;
  --color-text-muted: #475569;
  --color-text-faint: #64748b;
  --color-text-dim: #64748b;
  --color-text-footer: #94a3b8;
  --color-border: rgba(15, 23, 42, 0.09);
  --color-border-strong: rgba(15, 23, 42, 0.16);
  --color-card-bg: #ffffff;
  --color-accent: #0891b2;
  --color-accent-strong: #0e7490;
  --color-accent-ink: #ffffff;
  --color-nav-bg: rgba(246, 248, 251, 0.85);

  --chart-engineering: #0891b2;
  --chart-product: #7c3aed;
  --chart-tools: #059669;
  --chart-engineering-soft: #0e7490;
  --chart-product-soft: #6d28d9;
  --chart-lead: #d97706;
  --chart-lead-soft: #b45309;
  --chart-tools-soft: #047857;
  --gradient-depth: linear-gradient(90deg, #0891b2, #7c3aed);
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  color: var(--color-text);
  background: var(--color-bg);
  -webkit-font-smoothing: antialiased;
  transition: background 0.25s ease, color 0.25s ease;
}

/* Keep anchored sections clear of the sticky nav. */
[id] {
  scroll-margin-top: 88px;
}

.nav-shell {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--color-nav-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

a {
  color: inherit;
}

::selection {
  background: var(--color-accent);
  color: var(--color-accent-ink);
}

:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.nav-container {
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (min-width: 640px) {
  .nav-container {
    padding: 0 48px;
  }
}

@media (min-width: 1024px) {
  .nav-container {
    padding: 0 64px;
  }
}

@media (min-width: 1280px) {
  .nav-container {
    max-width: 1240px;
    padding: 0 72px;
  }
}

@media (min-width: 1536px) {
  .nav-container {
    max-width: 1360px;
    padding: 0 88px;
  }
}

@media (min-width: 1920px) {
  .nav-container {
    max-width: 1480px;
    padding: 0 96px;
  }
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
