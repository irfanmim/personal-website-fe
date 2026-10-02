import { reactive, ref } from 'vue'
import { projects as defaultProjects } from '../data/projects.js'
import { experiences as defaultExperiences } from '../data/experience.js'
import { defaultSkills } from '../data/skillProfile.js'
import client from '../api/client.js'

// Hardcoded defaults are used as the initial state so the public site
// renders instantly before the API response arrives.
const defaults = {
  hero: {
    name: 'Muhamad Irfan Maulana',
    role: 'Software Engineer | Full-Stack',
    tagline: 'I’ve spent 7 years shipping production software across the full stack, including 3 years combining hands-on development with product ownership.',
  },
  about: {
    bio: 'I spent seven years at Visual Analysis, building an intelligence and investigation platform. As a fullstack developer I built its interactive graph visualization, a self-service query builder, and a schema-aware dynamic form system. As development team lead I architected the Insight Designer service on an event-driven microservices platform — CQRS, event sourcing, Kafka — while mentoring a team of four. Since 2023 I’ve owned the product as product manager without putting the code down: 16 production releases, CI/CD improvements, and localization for international expansion. I’m most useful where technical depth and product judgement both matter.',
  },
  projects: defaultProjects,
  experiences: defaultExperiences,
  skills: defaultSkills,
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

/** Copy an API `/content` response into the store. An empty `skills` list (nothing saved
 *  yet) keeps the default skill areas instead of blanking the hero charts. */
export function applyContent(data) {
  const { skills, ...rest } = data
  Object.assign(content, rest)
  if (Array.isArray(skills) && skills.length) content.skills = skills
}

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
    applyContent(data)
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

/** Persist a full skills list (array order = display order) and sync the store. */
export async function saveSkills(skills) {
  const { data } = await client.put('/api/content/skills', { skills })
  content.skills = data
}

export async function saveContact() {
  const { data } = await client.put('/api/content/contact', content.contact)
  Object.assign(content.contact, data)
}
