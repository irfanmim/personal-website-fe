<template>
  <nav class="navbar">
    <span class="nav-name">{{ name }}</span>
    <div class="nav-right">
      <div class="nav-links">
        <a
          v-for="link in links"
          :key="link.label"
          :href="link.href"
          class="nav-link"
          :class="{ 'nav-link--active': link.href === '#' + activeSection }"
          @click="link.href.startsWith('#') ? scrollTo($event, link.href.slice(1)) : null"
        >
          {{ link.label }}
        </a>
      </div>
      <span class="nav-separator"></span>
      <button
        class="theme-toggle"
        :class="{ 'theme-toggle--dark': isDark }"
        @click="$emit('toggleDark')"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <span class="toggle-track">
          <span class="toggle-thumb">
            <span v-if="isDark">&#9728;</span>
            <span v-else>&#9790;</span>
          </span>
        </span>
      </button>
      <button class="hamburger" @click="menuOpen = true" aria-label="Open menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>

  <!-- Backdrop -->
  <Transition name="backdrop">
    <div v-if="menuOpen" class="drawer-backdrop" @click="menuOpen = false" />
  </Transition>

  <!-- Drawer -->
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
          :class="{ 'drawer-link--active': link.href === '#' + activeSection }"
          @click="handleMobileLink($event, link)"
        >
          {{ link.label }}
        </a>
      </nav>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineProps({
  name: { type: String, required: true },
  links: { type: Array, default: () => [] },
  activeSection: { type: String, default: '' },
  isDark: { type: Boolean, default: false },
})

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
  padding: 20px 0;
}

.nav-name {
  font-size: 0.95rem;
  font-weight: 400;
  color: var(--color-text);
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
  font-size: 0.95rem;
  color: var(--color-text);
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
  background: var(--color-text);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.2s ease;
}

.nav-link:hover::after,
.nav-link--active::after {
  transform: scaleX(1);
}

.nav-link--active {
  font-weight: 500;
}

/* ── Theme toggle ── */
.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  transition: opacity 0.15s;
}

.theme-toggle:hover {
  opacity: 0.8;
}

.toggle-track {
  position: relative;
  width: 52px;
  height: 28px;
  border-radius: 999px;
  background: #cbd5e1;
  border: 2px solid #94a3b8;
  transition: background 0.25s, border-color 0.25s;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.theme-toggle--dark .toggle-track {
  background: #f1f5f9;
  border-color: #e2e8f0;
}

.toggle-thumb {
  position: absolute;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
  transition: transform 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  line-height: 1;
}

.theme-toggle--dark .toggle-thumb {
  transform: translateX(24px);
  background: #334155;
  color: #ffffff;
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
  font-size: 1.05rem;
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
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(-100%);
}

/* ── Desktop (≥ 640px) ── */
@media (min-width: 640px) {
  .navbar {
    padding: 28px 0;
  }

  .nav-name,
  .nav-link {
    font-size: 1rem;
  }

  .nav-links {
    display: flex;
    gap: 24px;
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
