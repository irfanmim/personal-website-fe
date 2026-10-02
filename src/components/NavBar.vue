<template>
  <nav class="navbar">
    <a href="/#/" class="nav-brand" :aria-label="name" @click="scrollTo($event, 'home')">
      <svg class="nav-logo" viewBox="0 0 100 100" aria-hidden="true">
        <rect x="3" y="3" width="94" height="94" rx="12" fill="none" stroke="currentColor" stroke-width="5" />
        <text x="50" y="50" font-family="system-ui, Arial, sans-serif" font-size="34" font-weight="700" fill="currentColor" text-anchor="middle" dominant-baseline="central">{{ initials }}</text>
      </svg>
    </a>
    <div class="nav-right">
      <div class="nav-links">
        <a
          v-for="link in links"
          :key="link.label"
          :href="link.href"
          class="nav-link"
          :class="{ 'nav-link--active': link.id === activeSection }"
          @click="link.href.startsWith('#') ? scrollTo($event, link.href.slice(1)) : null"
        >
          {{ link.label }}
        </a>
      </div>
      <span class="nav-separator"></span>
      <button
        class="theme-toggle"
        @click="$emit('toggleDark')"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        {{ isDark ? '☀' : '☾' }}
      </button>
      <button class="hamburger" @click="menuOpen = true" aria-label="Open menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>

  <!-- Teleported: the sticky nav uses backdrop-filter, which would otherwise
       become the containing block for these fixed-position layers. -->
  <Teleport to="body">
    <Transition name="backdrop">
      <div v-if="menuOpen" class="drawer-backdrop" @click="menuOpen = false" />
    </Transition>

    <Transition name="drawer">
      <div v-if="menuOpen" class="drawer">
        <div class="drawer-header">
          <button class="drawer-close" @click="menuOpen = false" aria-label="Close menu">&#x2715;</button>
        </div>
        <nav class="drawer-links">
          <a
            v-for="link in links"
            :key="link.label"
            :href="link.href"
            class="drawer-link"
            :class="{ 'drawer-link--active': link.id === activeSection }"
            @click="handleMobileLink($event, link)"
          >
            {{ link.label }}
          </a>
        </nav>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  name: { type: String, default: '' },
  links: { type: Array, default: () => [] },
  activeSection: { type: String, default: '' },
  isDark: { type: Boolean, default: false },
})

// Monogram from the display name, e.g. "M. Irfan Maulana" -> "MIM".
const initials = computed(() =>
  props.name.split(/\s+/).filter(Boolean).slice(0, 3).map((w) => w[0].toUpperCase()).join(''),
)

defineEmits(['toggleDark'])

const router = useRouter()
const menuOpen = ref(false)

function scrollTo(e, id) {
  e.preventDefault()
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  } else {
    router.push({ path: '/', query: { scrollTo: id } })
  }
}

function handleMobileLink(e, link) {
  menuOpen.value = false
  if (link.href.startsWith('#')) {
    scrollTo(e, link.href.slice(1))
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.nav-brand {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  /* --color-accent is redefined for the light theme, so the logo follows it. */
  color: var(--color-accent);
  transition: color 0.15s ease;
}

.nav-brand:hover,
.nav-brand:focus-visible {
  color: var(--color-accent-strong);
}

.nav-logo {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* ── Desktop links ── */
.nav-links {
  display: none;
}

.nav-separator {
  display: none;
}

.nav-link {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  text-decoration: none;
  position: relative;
  padding-bottom: 2px;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--color-accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.2s ease;
}

.nav-link:hover {
  color: var(--color-text);
}

.nav-link:hover::after,
.nav-link--active::after {
  transform: scaleX(1);
}

.nav-link--active {
  font-weight: 500;
  color: var(--color-accent-strong);
}

/* ── Theme toggle ── */
.theme-toggle {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  font-size: 0.95rem;
  line-height: 1;
  cursor: pointer;
  flex-shrink: 0;
  transition: border-color 0.15s ease, color 0.15s ease;
}

.theme-toggle:hover {
  border-color: var(--color-accent);
  color: var(--color-accent-strong);
}

/* ── Hamburger ── */
.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.hamburger span {
  display: block;
  width: 100%;
  height: 1.5px;
  background: var(--color-text);
  border-radius: 2px;
}

/* ── Backdrop ── */
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 100;
}

.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.25s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

/* ── Drawer ── */
.drawer {
  position: fixed;
  top: 0;
  left: 0;
  width: 72%;
  max-width: 300px;
  height: 100dvh;
  background: var(--color-bg);
  z-index: 101;
  display: flex;
  flex-direction: column;
  padding: 24px;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.1);
}

.drawer-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 40px;
}

.drawer-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  color: var(--color-text-muted);
  padding: 4px;
  line-height: 1;
  transition: color 0.15s;
}

.drawer-close:hover {
  color: var(--color-text);
}

.drawer-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.drawer-link {
  font-size: var(--text-lead);
  color: var(--color-text);
  text-decoration: none;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border);
  transition: opacity 0.15s;
}

.drawer-link:hover {
  opacity: 0.6;
}

.drawer-link--active {
  font-weight: 500;
  color: var(--color-accent-strong);
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(-100%);
}

/* ── Desktop (≥ 900px) — below this, 6 links + brand don't fit on one row ── */
@media (min-width: 900px) {
  .nav-links {
    display: flex;
    gap: 22px;
  }

  .nav-separator {
    display: block;
    width: 1px;
    height: 16px;
    background: var(--color-border);
  }

  .hamburger {
    display: none;
  }
}
</style>
