import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'

// Scroll-position based, not an IntersectionObserver band: sections are looked
// up fresh on every update, so it keeps working after route changes (the home
// sections are removed and re-created), and the last section can still become
// active when the page is too short to scroll it up to the trigger line.
export function useActiveSection(sectionIds, routeSource = null) {
  const activeSection = ref(sectionIds[0])
  let frame = null
  let routeTimer = null

  function update() {
    frame = null
    const els = sectionIds.map((id) => document.getElementById(id)).filter(Boolean)
    if (!els.length) return

    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
    if (atBottom) {
      activeSection.value = els[els.length - 1].id
      return
    }

    // The active section is the last one whose top has passed this line.
    const line = window.innerHeight * 0.35
    let current = els[0]
    for (const el of els) {
      if (el.getBoundingClientRect().top <= line) current = el
    }
    activeSection.value = current.id
  }

  function schedule() {
    if (frame === null) frame = requestAnimationFrame(update)
  }

  onMounted(() => {
    update()
    // The home sections only render once the content has loaded.
    routeTimer = setTimeout(update, 600)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
  })

  if (routeSource) {
    watch(routeSource, () => {
      // The page transition mounts the new view after the old one leaves, so
      // check again once it has settled.
      nextTick().then(update)
      clearTimeout(routeTimer)
      routeTimer = setTimeout(update, 400)
    })
  }

  onUnmounted(() => {
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    if (frame !== null) cancelAnimationFrame(frame)
    clearTimeout(routeTimer)
  })

  return { activeSection }
}
