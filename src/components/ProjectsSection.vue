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
})
</script>

<style scoped>
.projects {
  padding-bottom: 64px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 500;
  
  margin-bottom: 24px;
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
    padding-bottom: 80px;
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
