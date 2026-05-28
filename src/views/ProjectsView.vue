<template>
  <div class="projects-page">
    <main class="page-content">
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
  max-width: 1200px;
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
    padding: 0 80px;
  }
}

/* ── Loading hint ─────────────────────────────────────── */
.loading-hint {
  text-align: center;
  font-size: 0.88rem;
  color: var(--color-text-faint);
  margin: 48px 0;
}

/* ── Page title ───────────────────────────────────────── */
.page-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 400;
  color: var(--color-text-faint);
  margin: 40px 0 36px;
  letter-spacing: -0.01em;
}

@media (min-width: 640px) {
  .page-title {
    font-size: 2.6rem;
    margin: 48px 0 44px;
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

/* ── Load more ────────────────────────────────────────── */
.load-more {
  display: block;
  margin: 0 auto 64px;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 10px 32px;
  font-size: 0.88rem;
  color: var(--color-text-muted);
  cursor: pointer;
  font-family: system-ui, Arial, sans-serif;
  transition: border-color 0.15s, color 0.15s;
}

.load-more:hover {
  border-color: var(--color-text);
  color: var(--color-text);
}
</style>
