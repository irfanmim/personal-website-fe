export const vReveal = {
  mounted(el) {
    el.style.opacity = '0'
    el.style.transform = 'translateY(16px)'
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease'

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-revealed')
          observer.disconnect()
        }
      },
      { threshold: 0.12 }
    )

    observer.observe(el)
    el._revealObserver = observer
  },

  unmounted(el) {
    el._revealObserver?.disconnect()
  },
}
