<template>
  <section class="projects">
    <h3 class="section-title">{{ title }}</h3>
    <div class="cards">
      <ProjectCard
        v-for="project in projects"
        :key="project.title"
        v-bind="project"
      />
    </div>
    <div v-if="viewAllUrl" class="view-all-wrap">
      <a :href="viewAllUrl" class="view-all">View All →</a>
    </div>
  </section>
</template>

<script setup>
import ProjectCard from './ProjectCard.vue'

defineProps({
  title: {
    type: String,
    default: 'Latest Projects',
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
  padding-bottom: 48px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 24px;
}

.view-all-wrap {
  display: flex;
  justify-content: center;
  margin-top: 28px;
}

.view-all {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-tag-text);
  text-decoration: none;
  border: 1.5px solid var(--color-tag-text);
  border-radius: 8px;
  padding: 8px 24px;
  transition: opacity 0.15s;
}

.view-all:hover {
  opacity: 0.7;
}

.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 640px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (min-width: 1024px) {
  .projects {
    padding-bottom: 60px;
  }

  .section-title {
    font-size: 1.4rem;
    margin-bottom: 32px;
  }

  .cards {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}
</style>
