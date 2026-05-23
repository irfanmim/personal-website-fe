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
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme(saved ? saved === 'dark' : prefersDark)
  })

  return { isDark, toggle }
}
