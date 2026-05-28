<template>
  <div class="page">
    <template v-if="contentReady">
      <HeroSection id="home" :role="content.hero.role" />
      <ProjectsSection id="projects" :projects="content.projects" view-all-url="/#/projects" />
      <ExperienceSection id="experience" :experiences="content.experiences" :view-more-url="content.contact.linkedin" />
      <AboutContactSection
        id="about"
        :bio="content.about.bio"
        :linkedin="content.contact.linkedin"
        :github="content.contact.github"
        :instagram="content.contact.instagram"
        :cv-url="content.contact.cvUrl"
      />
    </template>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HeroSection from '../components/HeroSection.vue'
import ExperienceSection from '../components/ExperienceSection.vue'
import ProjectsSection from '../components/ProjectsSection.vue'
import AboutContactSection from '../components/AboutContactSection.vue'
import { content, contentReady } from '../store/content.js'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  const target = route.query.scrollTo
  if (target) {
    router.replace({ path: '/' })
    setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
    }, 250)
  }
})
</script>

<style scoped>
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  min-height: 100vh;
}

@media (min-width: 640px) {
  .page {
    padding: 0 48px;
  }
}

@media (min-width: 1024px) {
  .page {
    padding: 0 80px;
  }
}
</style>
