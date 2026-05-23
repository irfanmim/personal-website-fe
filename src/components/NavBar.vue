<template>
  <nav class="navbar">
    <span class="nav-name">{{ name }}</span>
    <div class="nav-links">
      <a
        v-for="link in links"
        :key="link.label"
        :href="link.href"
        class="nav-link"
      >
        {{ link.label }}
      </a>
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
})
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
}

.nav-links {
  display: flex;
  gap: 16px;
}

.nav-link {
  font-size: 0.95rem;
  color: #1a1a1a;
  text-decoration: none;
}

.nav-link:hover {
  text-decoration: underline;
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
