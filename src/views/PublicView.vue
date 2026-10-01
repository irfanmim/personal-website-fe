<template>
  <div class="page">
    <template v-if="contentReady">
      <HeroSection
        id="home"
        :tagline="content.hero.tagline"
        :experiences="content.experiences"
      />
      <ProjectsSection id="projects" :projects="content.projects.slice(0, 4)" view-all-url="/#/projects" />
      <ExperienceSection id="experience" :experiences="content.experiences" :view-more-url="content.contact.linkedin" />
      <AboutContactSection
        :bio="content.about.bio"
        :name="content.hero.name"
        :linkedin="content.contact.linkedin"
        :github="content.contact.github"
        :instagram="content.contact.instagram"
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
  max-width: 1160px;
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
    padding: 0 64px;
  }
}

@media (min-width: 1280px) {
  .page {
    max-width: 1240px;
    padding: 0 72px;
  }
}

@media (min-width: 1536px) {
  .page {
    max-width: 1360px;
    padding: 0 88px;
  }
}

@media (min-width: 1920px) {
  .page {
    max-width: 1480px;
    padding: 0 96px;
  }
}
</style>
