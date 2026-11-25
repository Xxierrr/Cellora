import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'

const ThemeContext = createContext(null)

function getInitialTheme() {
  const saved = localStorage.getItem('cellora-theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('cellora-theme', theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#181518' : '#f8f6f2')
  }, [theme])

  const value = useMemo(() => ({
    theme,
    toggleTheme: () => {
      const next = theme === 'light' ? 'dark' : 'light'
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!document.startViewTransition || reduceMotion) {
        setTheme(next)
        return
      }
      document.startViewTransition(() => {
        flushSync(() => setTheme(next))
      })
    },
  }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
