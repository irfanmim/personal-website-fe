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
    </div>
  </nav>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  links: {
    type: Array,
    default: () => [],
  },
  activeSection: {
    type: String,
    default: '',
  },
  isDark: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['toggleDark'])
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

.nav-separator {
  width: 1px;
  height: 16px;
  background: var(--color-border);
}

.nav-links {
  display: flex;
  gap: 16px;
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
  background: #d1d5db;
  border: 1.5px solid #b0b4bb;
  transition: background 0.25s, border-color 0.25s;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.theme-toggle--dark .toggle-track {
  background: #2a2a2a;
  border-color: #555;
}

.toggle-thumb {
  position: absolute;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  transition: transform 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  line-height: 1;
}

.theme-toggle--dark .toggle-thumb {
  transform: translateX(24px);
  background: #444;
}

@media (min-width: 640px) {
  .navbar {
    padding: 28px 0;
  }

  .nav-name,
  .nav-link {
    font-size: 1rem;
  }

  .nav-links {
    gap: 24px;
  }
}
</style>
