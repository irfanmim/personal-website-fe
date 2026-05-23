<template>
  <div class="page">
    <NavBar :name="owner" :links="navLinks" />

    <HeroSection id="home" role="Software Engineer | Product Manager | Sports Enthusiast." />

    <ProjectsSection id="projects" :projects="projects" />

    <AboutSection
      id="about"
      bio="I thrive at the intersection of technology and people — combining a technical mindset with a strong product instinct to build things users actually want and businesses actually need. Whether shaping strategy or working closely with dev teams, I stay focused on outcomes that matter."
    />

    <ExperienceSection id="experience" :experiences="experiences" />

    <ContactSection
      id="contact"
linkedin="https://linkedin.com/in/irfanmim"
      github="https://github.com/irfanmim"
      cv-url=""
    />
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import ExperienceSection from './components/ExperienceSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import ContactSection from './components/ContactSection.vue'

import { projects } from './data/projects.js'
import { experiences } from './data/experience.js'

const owner = 'M. Irfan Maulana'
const navLinks = [
  { label: 'Projects',   href: '#projects' },
  { label: 'About',      href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact',    href: '#contact' },
]
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: system-ui, Arial, sans-serif;
  color: #1a1a1a;
  background: #fff;
}
</style>

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
