import { reactive } from 'vue'
import { projects as defaultProjects } from '../data/projects.js'
import { experiences as defaultExperiences } from '../data/experience.js'

const STORAGE_KEY = 'site_content'

const defaults = {
  hero: {
    name: 'M. Irfan Maulana',
    role: 'Software Engineer | Product Manager | Sports Enthusiast.',
  },
  about: {
    bio: 'Software engineer and product manager who combines technical depth with product instinct — focused on building things users actually want and delivering outcomes that matter.',
  },
  projects: defaultProjects,
  experiences: defaultExperiences,
  contact: {
    linkedin: 'https://linkedin.com/in/irfanmim',
    github: 'https://github.com/irfanmim',
    instagram: 'http://instagram.com/irfanmim',
    cvUrl: '',
  },
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const content = reactive(load() ?? JSON.parse(JSON.stringify(defaults)))

export function saveContent() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
}

export function resetToDefaults() {
  const fresh = JSON.parse(JSON.stringify(defaults))
  Object.keys(fresh).forEach((key) => {
    content[key] = fresh[key]
  })
  localStorage.removeItem(STORAGE_KEY)
}
