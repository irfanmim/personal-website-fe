<template>
  <section class="projects">
    <h2 class="section-title">{{ title }}</h2>
    <div class="cards">
      <ProjectCard
        v-for="project in projects"
        :key="project.title"
        v-bind="project"
        :id="projectSlug(project.title)"
      />
    </div>
    <div v-if="viewAllUrl" class="view-all-wrap">
      <a :href="viewAllUrl" class="view-all">View all projects <span aria-hidden="true">→</span></a>
    </div>
  </section>
</template>

<script setup>
import ProjectCard from './ProjectCard.vue'
import { projectSlug } from '../utils/projectLinks.js'

defineProps({
  title: {
    type: String,
    default: 'Selected work',
  },
  projects: {
    type: Array,
    required: true,
  },
  viewAllUrl: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.projects {
  padding: 80px 0;
  border-top: 1px solid var(--color-border);
}

.section-title {
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: -0.01em;
  font-size: var(--text-h2);
  color: var(--color-text);
  margin-bottom: 28px;
}

.view-all-wrap {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

.view-all {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-accent-strong);
  background: transparent;
  border: 1px solid var(--color-accent);
  text-decoration: none;
  border-radius: 12px;
  padding: 10px 20px;
  transition: background 0.15s ease, color 0.15s ease;
}

.view-all:hover {
  background: color-mix(in srgb, var(--color-accent) 12%, transparent);
  color: var(--color-accent-strong);
}

.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 640px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .projects {
    padding: 120px 0;
  }

  .section-title {
    font-size: var(--text-h2);
    margin-bottom: 36px;
  }

  .cards {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}

@media (min-width: 1536px) {
  .cards {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
