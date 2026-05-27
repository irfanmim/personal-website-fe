import { reactive } from 'vue'
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

/** Load all content from the API and overwrite the store. Fails silently so
 *  the public site keeps showing defaults if the API is unreachable.
 *  Projects are fetched with ?limit=3 — the homepage only shows the top 3.
 *  ProjectsView fetches /api/projects independently for the full list. */
export async function loadContent() {
  try {
    const [{ data }, { data: limitedProjects }] = await Promise.all([
      client.get('/api/content'),
      client.get('/api/projects', { params: { limit: 3 } }),
    ])
    Object.assign(content, data)
    content.projects = limitedProjects
  } catch {
    // Keep defaults — do not surface errors on the public site
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
