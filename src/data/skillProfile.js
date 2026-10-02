// Skill profile shown in the hero (radar, bar and bento views).
//
// Skill areas are grouped under four core pillars and scored 1–10. The areas themselves are
// edited in the admin (Skills) and served by the API as `content.skills`; nothing is hardcoded
// here. Areas are ordered by pillar: left-to-right in the bar view, clockwise from the top in
// the radar view.

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

