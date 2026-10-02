import { reactive, ref } from 'vue'
import client from '../api/client.js'

// Empty-shaped state: all profile content comes from the API, nothing is hardcoded here.
const defaults = {
  hero: { name: '', role: '', tagline: '', greeting: '', headline: '' },
  about: { bio: '' },
  projects: [],
  experiences: [],
  skills: [],
  contact: { heading: '', blurb: '', linkedin: '', github: '', instagram: '', cvUrl: '' },
}

export const content = reactive(JSON.parse(JSON.stringify(defaults)))

// False until loadContent() settles (success or failure).
// Components should gate rendering on this so the empty state never flashes before API data.
export const contentReady = ref(false)

// True when the API could not be reached; the public site shows a neutral error state.
export const contentError = ref(false)

/** Copy an API `/content` response into the store. */
export function applyContent(data) {
  Object.assign(content, data)
}

/** Load all content from the API and overwrite the store.
 *  On failure, `contentError` is set and content stays empty.
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
    contentError.value = true
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
