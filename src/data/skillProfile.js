// T-shape skill profile shown in the hero. Source of truth: CV.
//
// Breadth items carry no score — they render at one uniform "crossbar" height.
// The two peaks are sized by real tenure, computed from experience data at render
// time via `peakTrack` (the `role` group name in `experience.js`), so they stay
// correct when roles change. Order is left-to-right in the bar view and clockwise
// from the top in the radar view.
//
// accent: 'engineering' | 'product' | 'tools'
export const skillProfile = [
  { key: 'frontend', label: 'Frontend', tech: ['Vue.js', 'React', 'Cytoscape.js'], accent: 'engineering' },
  { key: 'backend', label: 'Backend', tech: ['Spring Boot', 'Django', 'Laravel'], accent: 'engineering' },
  {
    key: 'engineering',
    label: 'Engineering',
    tech: ['Microservices', 'Event-Driven Architecture', 'CQRS', 'Event Sourcing', 'Apache Kafka'],
    accent: 'engineering',
    peakTrack: 'Software Engineering',
    depthLabel: 'engineering depth',
  },
  { key: 'languages', label: 'Languages', tech: ['JavaScript', 'Python', 'Java', 'PHP'], accent: 'engineering' },
  { key: 'data', label: 'Data', tech: ['SQL', 'Neo4j (proof-of-concept)'], accent: 'tools' },
  {
    key: 'product',
    label: 'Product',
    tech: ['Product ownership', 'Scrum (PSPO I)', 'Release management'],
    accent: 'product',
    peakTrack: 'Product',
    depthLabel: 'product depth',
  },
  { key: 'quality', label: 'Quality & i18n', tech: ['QA coordination', 'Localization (i18n)'], accent: 'product' },
  { key: 'devops', label: 'DevOps', tech: ['Docker', 'Kubernetes', 'Azure', 'Jenkins (CI/CD)'], accent: 'tools' },
]
