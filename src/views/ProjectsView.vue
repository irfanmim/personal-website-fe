<template>
  <div class="projects-page">
    <main class="page-content">
      <RouterLink to="/" class="back-link">
        <span aria-hidden="true">←</span> Back to home
      </RouterLink>
      <h1 class="page-title">Projects</h1>

      <!-- Project grid -->
      <p v-if="loading" class="loading-hint">Loading…</p>
      <div v-else class="grid">
        <ProjectCard
          v-for="project in visibleProjects"
          :key="project.id ?? project.title"
          v-bind="project"
        />
      </div>

      <button
        v-if="!loading && visibleCount < allProjects.length"
        class="load-more"
        @click="loadMore"
      >
        Load more
      </button>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import client from '../api/client.js'
import ProjectCard from '../components/ProjectCard.vue'

const allProjects = ref([])
const visibleCount = ref(6)
const loading = ref(true)

const visibleProjects = computed(() => allProjects.value.slice(0, visibleCount.value))

onMounted(async () => {
  try {
    const { data } = await client.get('/api/projects')
    allProjects.value = data
  } catch {
    // If the API is unreachable, the grid stays empty
  } finally {
    loading.value = false
  }
})

function loadMore() {
  visibleCount.value += 3
}
</script>

<style scoped>
.projects-page {
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 24px;
  min-height: 100vh;
}

@media (min-width: 640px) {
  .projects-page {
    padding: 0 48px;
  }
}

@media (min-width: 1024px) {
  .projects-page {
    padding: 0 64px;
  }
}

@media (min-width: 1280px) {
  .projects-page {
    max-width: 1240px;
    padding: 0 72px;
  }
}

@media (min-width: 1536px) {
  .projects-page {
    max-width: 1360px;
    padding: 0 88px;
  }
}

@media (min-width: 1920px) {
  .projects-page {
    max-width: 1480px;
    padding: 0 96px;
  }
}

/* ── Loading hint ─────────────────────────────────────── */
.loading-hint {
  font-size: var(--text-sm);
  color: var(--color-text-faint);
  margin: 48px 0;
}

/* ── Back link ────────────────────────────────────────── */
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 0.15s ease;
}

.back-link:hover {
  color: var(--color-accent-strong);
}

/* ── Page title ───────────────────────────────────────── */
.page-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: var(--text-h1);
  color: var(--color-text);
  margin: 20px 0 36px;
  letter-spacing: -0.01em;
}

@media (min-width: 640px) {
  .page-title {
    font-size: var(--text-h1);
    margin: 24px 0 44px;
  }
}

/* ── Project grid ─────────────────────────────────────── */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 40px;
}

@media (min-width: 540px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1536px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* ── Load more ────────────────────────────────────────── */
.load-more {
  display: block;
  margin: 0 0 64px;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 10px 28px;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  cursor: pointer;
  font-family: var(--font-body);
  transition: border-color 0.15s ease, color 0.15s ease;
}

.load-more:hover {
  border-color: var(--color-accent);
  color: var(--color-accent-strong);
}
</style>
