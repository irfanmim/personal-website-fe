import { ref, onMounted, onUnmounted } from 'vue'

export function useActiveSection(sectionIds) {
  const activeSection = ref(sectionIds[0])
  let observer = null

  onMounted(() => {
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
  })

  onUnmounted(() => observer?.disconnect())

  return { activeSection }
}
