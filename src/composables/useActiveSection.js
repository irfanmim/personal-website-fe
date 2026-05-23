import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'

export function useActiveSection(sectionIds, routeSource = null) {
  const activeSection = ref(sectionIds[0])
  let observer = null

  function reobserve() {
    observer?.disconnect()
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) activeSection.value = entry.target.id
        }
      },
      { root: null, rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    )
    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
  }

  onMounted(reobserve)

  if (routeSource) watch(routeSource, () => nextTick().then(reobserve))

  onUnmounted(() => observer?.disconnect())

  return { activeSection }
}
