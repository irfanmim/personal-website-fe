<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-brand">
        <span class="brand-dot"></span>
        <span class="brand-label">Admin Panel</span>
      </div>

      <nav class="sidebar-nav">
        <button
          v-for="section in sections"
          :key="section.id"
          class="sidebar-item"
          :class="{ 'sidebar-item--active': activeSection === section.id }"
          @click="activeSection = section.id"
        >
          {{ section.label }}
        </button>
      </nav>

      <div class="sidebar-footer">
        <a href="/" target="_blank" rel="noopener" class="sidebar-link">↗ View Site</a>
        <button class="sidebar-logout" @click="logout">Logout</button>
      </div>
    </aside>

    <!-- Main content area -->
    <main class="admin-main">
      <HeroEditor v-if="activeSection === 'hero'" />
      <ProjectsEditor v-else-if="activeSection === 'projects'" />
      <AboutEditor v-else-if="activeSection === 'about'" />
      <ExperienceEditor v-else-if="activeSection === 'experience'" />
      <ContactEditor v-else-if="activeSection === 'contact'" />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import HeroEditor from './editors/HeroEditor.vue'
import ProjectsEditor from './editors/ProjectsEditor.vue'
import AboutEditor from './editors/AboutEditor.vue'
import ExperienceEditor from './editors/ExperienceEditor.vue'
import ContactEditor from './editors/ContactEditor.vue'

const router = useRouter()
const activeSection = ref('hero')

const sections = [
  { id: 'hero',       label: 'Hero' },
  { id: 'projects',   label: 'Projects' },
  { id: 'about',      label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact',    label: 'Contact' },
]

function logout() {
  sessionStorage.removeItem('admin_token')
  router.push('/admin/login')
}
</script>

<style>
@import './admin.css';
</style>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f6f8;
}

/* ── Sidebar ──────────────────────────────────────────── */
.sidebar {
  width: 216px;
  flex-shrink: 0;
  background: #1a1a1a;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 22px 20px 18px;
  border-bottom: 1px solid #2a2a2a;
}

.brand-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
  flex-shrink: 0;
}

.brand-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  overflow-y: auto;
}

.sidebar-item {
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  padding: 10px 20px;
  font-size: 0.88rem;
  color: #888;
  transition: color 0.15s, background 0.15s;
  font-family: system-ui, Arial, sans-serif;
}

.sidebar-item:hover {
  color: #fff;
  background: #222;
}

.sidebar-item--active {
  color: #fff;
  background: #262626;
  font-weight: 500;
}

.sidebar-footer {
  padding: 14px 20px;
  border-top: 1px solid #252525;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sidebar-link {
  font-size: 0.82rem;
  color: #777;
  text-decoration: none;
  transition: color 0.15s;
}

.sidebar-link:hover {
  color: #ccc;
}

.sidebar-logout {
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  padding: 0;
  font-size: 0.82rem;
  color: #777;
  font-family: system-ui, Arial, sans-serif;
  transition: color 0.15s;
}

.sidebar-logout:hover {
  color: #ef4444;
}

/* ── Main content ─────────────────────────────────────── */
.admin-main {
  flex: 1;
  margin-left: 216px;
  padding: 40px 48px;
  min-height: 100vh;
  overflow-y: auto;
}
</style>
