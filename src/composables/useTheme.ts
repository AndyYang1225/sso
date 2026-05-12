import { ref, watch } from 'vue'
import { Dark, setCssVar } from 'quasar'

export type ThemeKey = 'neon' | 'minimal' | 'sunset' | 'glass' | 'nature'

export interface ThemeMeta {
  key: ThemeKey
  label: string
  icon: string
  dark: boolean
  primary: string
}

export const THEMES: ThemeMeta[] = [
  { key: 'neon',    label: '暗黑霓虹', icon: 'bolt',            dark: true,  primary: '#22D3EE' },
  { key: 'minimal', label: '極簡黑白', icon: 'format_color_reset', dark: false, primary: '#111827' },
  { key: 'sunset',  label: '暖色日落', icon: 'wb_twilight',     dark: false, primary: '#EA580C' },
  { key: 'glass',   label: '玻璃擬態', icon: 'blur_on',         dark: false, primary: '#7C3AED' },
  { key: 'nature',  label: '綠色自然', icon: 'eco',             dark: false, primary: '#059669' },
]

const STORAGE_KEY = 'sso.theme'
const current = ref<ThemeKey>((localStorage.getItem(STORAGE_KEY) as ThemeKey) || 'neon')

function applyTheme(key: ThemeKey) {
  const meta = THEMES.find((t) => t.key === key) ?? THEMES[0]
  document.documentElement.dataset.theme = key
  Dark.set(meta.dark)
  setCssVar('primary', meta.primary)
  localStorage.setItem(STORAGE_KEY, key)
}

watch(current, applyTheme, { immediate: false })

export function useTheme() {
  function setTheme(key: ThemeKey) {
    current.value = key
    applyTheme(key)
  }
  return { current, themes: THEMES, setTheme }
}

// 初始化（App 啟動時呼叫一次）
export function initTheme() {
  applyTheme(current.value)
}
