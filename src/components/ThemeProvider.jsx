'use client'
import { useEffect } from 'react'
import { useSettingsStore } from '@/stores/globalStore'

export default function ThemeProvider ({ children }) {
  const isDark = useSettingsStore(state => state.isDark)

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return children
}
