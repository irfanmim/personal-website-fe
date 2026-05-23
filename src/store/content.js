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
    bio: 'I am a software engineer and product manager who loves building products people actually use. Believing technology is a catalyst for business success, I combine technical expertise with product thinking to create solutions that are useful, valuable, and built to last.',
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
