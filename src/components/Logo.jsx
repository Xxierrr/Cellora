import { Link } from 'react-router-dom'

export function CellMark({ className = 'h-9 w-9' }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="16.5" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="23" cy="17" r="6.25" fill="currentColor" opacity="0.8" />
      <circle cx="13" cy="27" r="2" fill="currentColor" opacity="0.35" />
    </svg>
  )
}

export default function Logo({ light = false }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 rounded-sm ${light ? 'text-white' : 'text-plum-800 dark:text-plum-200'}`} aria-label="Cellora home">
      <CellMark />
      <span className="font-serif text-[30px] font-semibold leading-none tracking-[-0.035em]">Cellora</span>
    </Link>
  )
}
