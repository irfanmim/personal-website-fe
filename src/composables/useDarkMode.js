import { ref, onMounted } from 'vue'

export function useDarkMode() {
  const isDark = ref(false)

  function applyTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    isDark.value = dark
  }

  function toggle() {
    const next = !isDark.value
    localStorage.setItem('theme', next ? 'dark' : 'light')
    applyTheme(next)
  }

  onMounted(() => {
    // Dark is the site's primary identity, so it's the default for first-time
    // visitors. An explicit saved choice always wins.
    const saved = localStorage.getItem('theme')
    applyTheme(saved !== 'light')
  })

  return { isDark, toggle }
}
