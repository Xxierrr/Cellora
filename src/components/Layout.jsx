import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, Moon, ShieldCheck, Sun, X } from 'lucide-react'
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'
import Logo, { CellMark } from './Logo'
import { useTheme } from './ThemeProvider'

const navigation = [
  { label: 'How it works', to: '/#how-it-works' },
  { label: 'Analyse', to: '/analyse' },
  { label: 'Model', to: '/model' },
  { label: 'Learn', to: '/learn' },
  { label: 'About', to: '/about' },
]

function HeaderLink({ item, onClick }) {
  if (item.to.includes('#')) {
    return <Link to={item.to} onClick={onClick} className="rounded-md px-3 py-2 text-sm font-semibold text-muted transition hover:text-plum-700 dark:hover:text-plum-300">{item.label}</Link>
  }

  return (
    <NavLink to={item.to} onClick={onClick} className={({ isActive }) => `relative rounded-md px-3 py-2 text-sm font-semibold transition ${isActive ? 'text-plum-800 dark:text-plum-200' : 'text-muted hover:text-plum-700 dark:hover:text-plum-300'}`}>
      {({ isActive }) => <>{item.label}{isActive && <span className="absolute inset-x-3 -bottom-[17px] h-0.5 rounded-full bg-plum-600 dark:bg-plum-300" />}</>}
    </NavLink>
  )
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  useEffect(() => setMenuOpen(false), [location.pathname, location.hash])

  return (
    <div className="min-h-screen overflow-x-clip">
      <a href="#main-content" className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-lg bg-plum-800 px-4 py-2 text-sm font-bold text-white transition focus:translate-y-0">Skip to content</a>
      <header className="sticky top-0 z-50 border-b border-line/70 bg-canvas/90 backdrop-blur-xl">
        <div className="container-shell flex h-[76px] items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-teal-800 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-200 md:inline-flex">
              <ShieldCheck size={12} /> AI screening aid
            </span>
          </div>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {navigation.map((item) => <HeaderLink key={item.label} item={item} />)}
          </nav>
          <div className="flex items-center gap-2.5">
            <button className="icon-button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
              {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
            </button>
            <Link to="/analyse" className="btn-primary hidden !min-h-10 !px-4 sm:inline-flex">Analyse an image <ArrowUpRight size={16} /></Link>
            <button className="icon-button lg:hidden" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav id="mobile-menu" className="animate-menu-in border-t border-line bg-surface px-5 py-5 shadow-float lg:hidden" aria-label="Mobile navigation">
            <div className="mx-auto flex max-w-lg flex-col gap-1">
              {navigation.map((item) => <HeaderLink key={item.label} item={item} onClick={() => setMenuOpen(false)} />)}
              <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800 dark:bg-teal-950/40 dark:text-teal-200"><ShieldCheck size={13} /> AI screening aid</span>
              <Link to="/analyse" className="btn-primary mt-4 w-full">Analyse an image <ArrowUpRight size={16} /></Link>
            </div>
          </nav>
        )}
      </header>

      <main id="main-content" key={location.pathname} className="animate-fade-in"><Outlet /></main>

      <footer className="bg-plum-950 text-white">
        <div className="container-shell py-14 sm:py-16">
          <div className="grid gap-10 border-b border-white/15 pb-12 md:grid-cols-[1.3fr_1fr_1fr] lg:gap-20">
            <div>
              <Logo light />
              <p className="mt-5 max-w-sm text-sm leading-6 text-plum-100/75">Thoughtful, explainable cervical cell analysis for learning and early screening support.</p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-plum-100"><CellMark className="h-4 w-4" /> B.Tech Major Project · PCSE28-040</div>
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-plum-200">Explore Cellora</h2>
              <div className="mt-5 flex flex-col items-start gap-3 text-sm text-plum-100/75">
                <Link className="hover:text-white" to="/analyse">Analyse an image</Link>
                <Link className="hover:text-white" to="/model">Model & performance</Link>
                <Link className="hover:text-white" to="/learn">Screening explained</Link>
                <Link className="hover:text-white" to="/about">About the project</Link>
              </div>
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-plum-200">Trust & transparency</h2>
              <div className="mt-5 flex flex-col items-start gap-3 text-sm text-plum-100/75">
                <Link className="hover:text-white" to="/about#dataset">Dataset & licence</Link>
                <Link className="hover:text-white" to="/about#privacy">Privacy policy</Link>
                <a className="hover:text-white" href="https://www.who.int/news-room/fact-sheets/detail/cervical-cancer" target="_blank" rel="noreferrer">WHO cervical cancer resources <ArrowUpRight className="inline" size={13} /></a>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6 pt-8">
            <p className="max-w-5xl text-xs leading-6 text-plum-100/65"><strong className="font-semibold text-plum-100">Important:</strong> Cellora is an AI-based screening aid built on public data. It does not provide a medical diagnosis. Please consult a qualified doctor for any health concern.</p>
            <div className="flex flex-col gap-2 text-xs text-plum-100/50 sm:flex-row sm:items-center sm:justify-between">
              <span>© 2026 Cellora. Academic demonstration project.</span>
              <span>Designed with care. Built for clarity.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
