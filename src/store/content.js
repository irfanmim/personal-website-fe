import { reactive, ref } from 'vue'
import { projects as defaultProjects } from '../data/projects.js'
import { experiences as defaultExperiences } from '../data/experience.js'
import client from '../api/client.js'

// Hardcoded defaults are used as the initial state so the public site
// renders instantly before the API response arrives.
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

export const content = reactive(JSON.parse(JSON.stringify(defaults)))

// False until loadContent() settles (success or failure).
// Components should gate rendering on this so defaults never flash before API data.
export const contentReady = ref(false)

/** Load all content from the API and overwrite the store.
 *  On failure, content stays as the hardcoded defaults.
 *  Projects are fetched with ?limit=9 — the homepage only shows up to the top 9.
 *  ProjectsView fetches /api/projects independently for the full list. */
export async function loadContent() {
  try {
    const [{ data }, { data: limitedProjects }] = await Promise.all([
      client.get('/api/content'),
      client.get('/api/projects', { params: { limit: 9 } }),
    ])
    Object.assign(content, data)
    content.projects = limitedProjects
  } catch {
    // API unreachable — content stays as defaults
  } finally {
    contentReady.value = true
  }
}

export async function saveHero() {
  const { data } = await client.put('/api/content/hero', content.hero)
  Object.assign(content.hero, data)
}

export async function saveAbout() {
  const { data } = await client.put('/api/content/about', content.about)
  Object.assign(content.about, data)
}

export async function saveContact() {
  const { data } = await client.put('/api/content/contact', content.contact)
  Object.assign(content.contact, data)
}
