<template>
  <div class="page">
    <NavBar
      :name="content.hero.name"
      :links="navLinks"
      :active-section="activeSection"
      :is-dark="isDark"
      @toggle-dark="toggle"
    />
    <HeroSection id="home" :role="content.hero.role" />
    <ProjectsSection id="projects" :projects="content.projects" view-all-url="/projects" />
    <ExperienceSection id="experience" :experiences="content.experiences" />
    <AboutContactSection
      id="about"
      :bio="content.about.bio"
      :linkedin="content.contact.linkedin"
      :github="content.contact.github"
      :instagram="content.contact.instagram"
      :cv-url="content.contact.cvUrl"
    />
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import HeroSection from '../components/HeroSection.vue'
import ExperienceSection from '../components/ExperienceSection.vue'
import ProjectsSection from '../components/ProjectsSection.vue'
import AboutContactSection from '../components/AboutContactSection.vue'

import { content } from '../store/content.js'
import { useDarkMode } from '../composables/useDarkMode.js'
import { useActiveSection } from '../composables/useActiveSection.js'

const navLinks = [
  { label: 'Home',       href: '/' },
  { label: 'Projects',   href: '/projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'About',      href: '#about' },
]

const { isDark, toggle } = useDarkMode()
const sectionIds = ['home', 'projects', 'experience', 'about']
const { activeSection } = useActiveSection(sectionIds)
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
