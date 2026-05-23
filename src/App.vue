<template>
  <div class="page">
    <NavBar :name="owner" :links="navLinks" :active-section="activeSection" :is-dark="isDark" @toggle-dark="toggle" />

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
import { useDarkMode } from './composables/useDarkMode.js'
import { useActiveSection } from './composables/useActiveSection.js'

const owner = 'M. Irfan Maulana'
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

<style>
:root {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-text-muted: #555;
  --color-text-faint: #888;
  --color-text-dim: #999;
  --color-text-footer: #aaa;
  --color-border: #e5e7eb;
  --color-card-bg: #ffffff;
  --color-tag-bg: #dbeafe;
  --color-tag-text: #3b82f6;
  --color-pill-bg: #f3f4f6;
  --color-pill-text: #374151;
  --color-pill-border: #e5e7eb;
  --color-rail: #e5e7eb;
}

[data-theme="dark"] {
  --color-bg: #111111;
  --color-text: #e8e8e8;
  --color-text-muted: #a0a0a0;
  --color-text-faint: #777;
  --color-text-dim: #666;
  --color-text-footer: #555;
  --color-border: #2a2a2a;
  --color-card-bg: #1a1a1a;
  --color-tag-bg: #1e2d40;
  --color-tag-text: #60a5fa;
  --color-pill-bg: #1f1f1f;
  --color-pill-text: #c0c0c0;
  --color-pill-border: #2a2a2a;
  --color-rail: #2a2a2a;
}

.is-revealed {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

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
  color: var(--color-text);
  background: var(--color-bg);
  transition: background 0.2s, color 0.2s;
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
