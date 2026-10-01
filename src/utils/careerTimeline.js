const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

export function parseMonthIndex(str) {
  if (!str) return null
  const [monAbbr, yearStr] = str.trim().split(' ')
  const month = MONTHS.indexOf((monAbbr || '').slice(0, 3).toLowerCase())
  const year = Number(yearStr)
  if (!year) return null
  return year * 12 + Math.max(month, 0)
}

export function nowMonthIndex() {
  const d = new Date()
  return d.getFullYear() * 12 + d.getMonth()
}

export function formatDuration(months) {
  const y = Math.floor(months / 12)
  const m = months % 12
  if (y === 0) return `${m} mo`
  if (m === 0) return `${y} yr`
  return `${y} yr ${m} mo`
}

const OWNED_PREFIX = /^owned:\s*/i

/** Achievements starting with "Owned:" are product ownership; the rest is hands-on build work. */
export function splitAchievements(list) {
  const built = []
  const owned = []
  ;(list || []).forEach((item) => {
    if (OWNED_PREFIX.test(item)) owned.push(item.replace(OWNED_PREFIX, ''))
    else built.push(item)
  })
  return { built, owned }
}

// Responsibilities layer on top of each other rather than replacing one
// another: every role is hands-on engineering, some also lead, some also own product.
const LANES = [
  { key: 'engineering', label: 'Hands-on engineering', match: () => true },
  { key: 'leadership', label: 'Team leadership', match: (e) => e.isLeadership },
  { key: 'product', label: 'Product ownership', match: (e) => e.isProduct },
]

/**
 * Flattens the role-grouped `experiences` data (kept as-is for the
 * store/admin/backend contract) into one chronological list with computed
 * start/end month indices and duration, plus the responsibility lanes each
 * role belongs to.
 */
export function buildCareerTimeline(experiences) {
  const now = nowMonthIndex()

  const flat = (experiences || []).flatMap((group) =>
    (group.companies || []).map((c) => {
      const [startStr, endStr] = (c.period || '').split('-')
      const start = parseMonthIndex(startStr)
      const isPresent = /present/i.test(endStr || '')
      const end = isPresent ? now : parseMonthIndex(endStr)
      return {
        ...c,
        track: group.role,
        start: start ?? 0,
        end: end ?? start ?? 0,
        isPresent,
      }
    })
  )

  const sorted = [...flat].sort((a, b) => a.start - b.start)
  const entries = sorted.map((entry) => ({
    ...entry,
    duration: Math.max(entry.end - entry.start, 1),
    isLeadership: /lead|manager/i.test(entry.summary || ''),
    isProduct: entry.track === 'Product',
  }))

  const totalsByTrack = {}
  for (const entry of entries) {
    totalsByTrack[entry.track] = (totalsByTrack[entry.track] || 0) + entry.duration
  }

  // Lane length is the span from its first start to its last end, not a sum.
  const lanes = LANES.map(({ key, label, match }) => {
    const indices = entries.map((e, i) => (match(e) ? i : -1)).filter((i) => i >= 0)
    if (!indices.length) return null
    const members = indices.map((i) => entries[i])
    const start = Math.min(...members.map((e) => e.start))
    const end = Math.max(...members.map((e) => e.end))
    return {
      key,
      label,
      indices,
      start,
      span: Math.max(end - start, 1),
      ongoing: members.some((e) => e.isPresent),
    }
  }).filter(Boolean)

  return {
    entries,
    lanes,
    totalsByTrack,
    current: entries.find((e) => e.isPresent) || null,
    mostRecent: entries.length ? entries[entries.length - 1] : null,
  }
}
