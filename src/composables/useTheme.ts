import { ref } from 'vue'

type Theme = 'light' | 'dark'
const theme = ref<Theme>(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')

export const useTheme = () => {
  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = theme.value
    try {
      localStorage.setItem('portfolio-theme', theme.value)
    } catch (error) {
      // The switch still works for this visit when browser storage is unavailable.
      console.warn('Unable to save the portfolio theme preference.', error)
    }
  }
  return { theme, toggleTheme }
}
