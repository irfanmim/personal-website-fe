<template>
  <div v-if="showNav" class="nav-container">
    <NavBar
      :name="content.hero.name"
      :links="navLinks"
      :active-section="activeSection"
      :is-dark="isDark"
      @toggle-dark="toggle"
    />
  </div>
  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import { content } from './store/content.js'
import { useDarkMode } from './composables/useDarkMode.js'
import { useActiveSection } from './composables/useActiveSection.js'

const route = useRoute()
const { isDark, toggle } = useDarkMode()

const sectionIds = ['home', 'projects', 'experience', 'about']
const { activeSection } = useActiveSection(sectionIds, () => route.path)

const showNav = computed(() => !route.path.startsWith('/admin'))

const navLinks = [
  { label: 'Home',       href: '/#/' },
  { label: 'Projects',   href: '/#/projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'About',      href: '#about' },
]
</script>

<style>
:root {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-text-muted: #555;
  --color-text-faint: #888;
  --color-text-dim: #999;
  --color-text-footer: #aaa;
  --color-border: #e5e7eb;
  --color-card-bg: #ffffff;
  --color-tag-bg: #dbeafe;
  --color-tag-text: #3b82f6;
  --color-pill-bg: #f3f4f6;
  --color-pill-text: #374151;
  --color-pill-border: #e5e7eb;
  --color-rail: #e5e7eb;
}

[data-theme="dark"] {
  --color-bg: #111111;
  --color-text: #e8e8e8;
  --color-text-muted: #a0a0a0;
  --color-text-faint: #777;
  --color-text-dim: #666;
  --color-text-footer: #555;
  --color-border: #2a2a2a;
  --color-card-bg: #1a1a1a;
  --color-tag-bg: #1e2d40;
  --color-tag-text: #60a5fa;
  --color-pill-bg: #1f1f1f;
  --color-pill-text: #c0c0c0;
  --color-pill-border: #2a2a2a;
  --color-rail: #2a2a2a;
}

.is-revealed {
  opacity: 1 !important;
  transform: translateY(0) !important;
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
  font-family: system-ui, Arial, sans-serif;
  color: var(--color-text);
  background: var(--color-bg);
  transition: background 0.2s, color 0.2s;
}

.nav-container {
  max-width: 1200px;
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
    padding: 0 80px;
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
