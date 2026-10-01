const norm = (s) => String(s || '').trim().toLowerCase()

export function projectSlug(title) {
  return `project-${norm(title).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`
}
