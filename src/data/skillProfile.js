// Skill profile shown in the hero (radar, bar and bento views). Source of truth: CV.
//
// Skill areas are grouped under four core pillars and scored 1–10. Areas are editable in the
// admin (Skills) and served by the API as `content.skills`; `defaultSkills` below is the
// fallback used until the API answers, if it is unreachable, or if no skills are saved yet.
// Areas are ordered by pillar: left-to-right in the bar view, clockwise from the top in the
// radar view.

// accent: 'engineering' | 'product' | 'delivery' | 'leadership'
// badge: small label on the bento card
export const skillPillars = {
  engineering: { label: 'Engineering', accent: 'engineering', badge: 'Core depth' },
  product: { label: 'Product', accent: 'product', badge: 'Core depth' },
  delivery: { label: 'Delivery & Management', accent: 'delivery', badge: 'Release owner' },
  leadership: { label: 'Leadership', accent: 'leadership', badge: 'Team lead' },
}

export const MIN_VISIBLE_AREAS = 3

export const LEVEL_MIN = 1
export const LEVEL_MAX = 10

/** Chart height (0–1) for a 1–10 level: level 1 stays visible, level 10 reaches the rim. */
export function levelToHeight(level) {
  const l = Math.min(LEVEL_MAX, Math.max(LEVEL_MIN, Number(level) || LEVEL_MIN))
  return 0.2 + (0.8 * (l - LEVEL_MIN)) / (LEVEL_MAX - LEVEL_MIN)
}

/** Named band for a level, used in the editor and tooltips. */
export function levelBand(level) {
  if (level >= 9) return 'Expert'
  if (level >= 7) return 'Strong'
  if (level >= 4) return 'Working'
  return 'Familiar'
}

/** Split a label over at most two balanced lines (radar axis labels). */
export function wrapLabel(label) {
  const words = String(label || '').trim().split(/\s+/)
  if (words.length < 2 || label.length <= 12) return [words.join(' ')]
  let best = 1
  let bestMax = Infinity
  for (let i = 1; i < words.length; i++) {
    const max = Math.max(words.slice(0, i).join(' ').length, words.slice(i).join(' ').length)
    if (max < bestMax) {
      bestMax = max
      best = i
    }
  }
  return [words.slice(0, best).join(' '), words.slice(best).join(' ')]
}

export const defaultSkills = [
  { key: 'frontend', label: 'Frontend', shortLabel: 'Frontend', pillar: 'engineering', level: 9, visible: true, tech: ['Vue.js', 'React', 'Cytoscape.js', 'JavaScript'] },
  { key: 'backend', label: 'Backend & APIs', shortLabel: 'Backend', pillar: 'engineering', level: 7, visible: true, tech: ['Spring Boot', 'Django', 'Laravel', 'Java', 'Python', 'PHP'] },
  { key: 'architecture', label: 'Architecture', shortLabel: 'Architecture', pillar: 'engineering', level: 9, visible: true, tech: ['Microservices', 'Event-Driven Architecture', 'CQRS', 'Event Sourcing', 'Apache Kafka'] },
  { key: 'data', label: 'Data & Graph', shortLabel: 'Data', pillar: 'engineering', level: 5, visible: true, tech: ['SQL', 'Neo4j (proof-of-concept)', 'Graph visualization'] },
  { key: 'devops', label: 'DevOps & Cloud', shortLabel: 'DevOps', pillar: 'engineering', level: 5, visible: true, tech: ['Docker', 'Kubernetes', 'Azure', 'Jenkins (CI/CD)'] },
  { key: 'ownership', label: 'Product Ownership', shortLabel: 'Product', pillar: 'product', level: 9, visible: true, tech: ['Product ownership', 'Scrum (PSPO I)', 'Localization (i18n)', 'QA coordination'] },
  { key: 'stakeholders', label: 'Stakeholder Management', shortLabel: 'Stakeholders', pillar: 'product', level: 6, visible: false, tech: ['Stakeholder alignment'] },
  { key: 'projects', label: 'Project Management', shortLabel: 'Projects', pillar: 'delivery', level: 7, visible: true, tech: ['Release management', '16 production releases', 'Lean 5-person teams'] },
  { key: 'mentoring', label: 'Team Leadership & Mentoring', shortLabel: 'Mentoring', pillar: 'leadership', level: 7, visible: true, tech: ['Led 4 engineers', 'Code reviews', 'Onboarded 6 engineers'] },
  { key: 'presenting', label: 'Presentation & Communication', shortLabel: 'Presenting', pillar: 'leadership', level: 5, visible: false, tech: ['Demos', 'Stakeholder communication'] },
]
