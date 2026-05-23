<template>
  <div class="page">
    <NavBar :name="owner" :links="navLinks" />
    <HeroSection role="Software Engineer | Product Manager | Sports Enthusiast." />
    <ProjectsSection :projects="projects" />
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import { projects } from './data/projects.js'

const owner = 'M. Irfan Maulana'
const navLinks = [{ label: 'Home', href: '#' }]
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
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
