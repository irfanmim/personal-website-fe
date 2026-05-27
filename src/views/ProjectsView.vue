<template>
  <div class="projects-page">
    <main class="page-content">
      <h1 class="page-title">Projects</h1>

      <!-- Project grid -->
      <p v-if="loading" class="loading-hint">Loading…</p>
      <div v-else class="grid">
        <div
          v-for="project in visibleProjects"
          :key="project.id ?? project.title"
          class="grid-card"
          @click="project.demo && openDemo(project.demo)"
          :class="{ 'grid-card--clickable': project.demo }"
        >
          <div class="card-image">
            <img v-if="project.image" :src="project.image" :alt="project.title" />
            <div v-else class="img-placeholder" />
          </div>
          <div class="card-body">
            <h3 class="card-title">{{ project.title }}</h3>
            <p class="card-desc">{{ project.description }}</p>
            <div class="card-tags">
              <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
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

function openDemo(url) {
  window.open(url, '_blank', 'noopener')
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

.grid-card {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--color-card-bg);
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s, transform 0.2s, background 0.2s, border-color 0.2s;
}

.grid-card--clickable {
  cursor: pointer;
}

.grid-card--clickable:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.card-image {
  width: 100%;
  height: 140px;
  overflow: hidden;
  flex-shrink: 0;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* shared placeholder */
.img-placeholder {
  width: 100%;
  height: 100%;
  background: var(--color-pill-bg);
}

.card-body {
  padding: 16px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.card-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
}

.card-desc {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 4px;
}

/* shared tag pill */
.tag {
  display: inline-flex;
  align-items: center;
  background: var(--color-tag-bg);
  color: var(--color-tag-text);
  font-size: 0.72rem;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 999px;
  white-space: nowrap;
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
