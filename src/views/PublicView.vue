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
    <ProjectsSection id="projects" :projects="content.projects" />
    <AboutSection id="about" :bio="content.about.bio" />
    <ExperienceSection id="experience" :experiences="content.experiences" />
    <ContactSection
      id="contact"
      :linkedin="content.contact.linkedin"
      :github="content.contact.github"
      :cv-url="content.contact.cvUrl"
    />
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import HeroSection from '../components/HeroSection.vue'
import AboutSection from '../components/AboutSection.vue'
import ExperienceSection from '../components/ExperienceSection.vue'
import ProjectsSection from '../components/ProjectsSection.vue'
import ContactSection from '../components/ContactSection.vue'

import { content } from '../store/content.js'
import { useDarkMode } from '../composables/useDarkMode.js'
import { useActiveSection } from '../composables/useActiveSection.js'

const navLinks = [
  { label: 'Projects',   href: '#projects' },
  { label: 'About',      href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact',    href: '#contact' },
]

const { isDark, toggle } = useDarkMode()
const sectionIds = ['home', 'projects', 'about', 'experience', 'contact']
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
