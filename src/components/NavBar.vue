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
      <button class="theme-toggle" @click="$emit('toggleDark')" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
        <span v-if="isDark">&#9728;</span>
        <span v-else>&#9790;</span>
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
  gap: 8px;
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
  font-size: 1.1rem;
  color: var(--color-text);
  padding: 4px;
  line-height: 1;
  margin-left: 4px;
  display: flex;
  align-items: center;
  opacity: 0.65;
  transition: opacity 0.15s;
}

.theme-toggle:hover {
  opacity: 1;
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
