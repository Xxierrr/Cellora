import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Analyse from './pages/Analyse'
import Model from './pages/Model'
import Learn from './pages/Learn'
import About from './pages/About'

const pageTitles = {
  '/': 'Cellora — Cervical cell analysis, made clearer',
  '/analyse': 'Analyse an image — Cellora',
  '/model': 'Model & performance — Cellora',
  '/learn': 'Learn about cervical screening — Cellora',
  '/about': 'About & privacy — Cellora',
}

function RouteEffects() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    document.title = pageTitles[pathname] || pageTitles['/']
    if (hash) {
      const scrollTimer = window.setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
      return () => window.clearTimeout(scrollTimer)
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
    return undefined
  }, [pathname, hash])

  return null
}

export default function App() {
  return (
    <>
      <RouteEffects />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="analyse" element={<Analyse />} />
          <Route path="model" element={<Model />} />
          <Route path="learn" element={<Learn />} />
          <Route path="about" element={<About />} />
          <Route path="privacy" element={<Navigate to="/about#privacy" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  )
}
