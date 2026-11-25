import { useEffect, useRef, useState } from 'react'

/**
 * Animates a number from zero once it scrolls into view.
 * Falls back to the final value for reduced-motion users.
 */
export default function CountUp({ value, decimals = 0, prefix = '', suffix = '', duration = 1100, className = '' }) {
  const ref = useRef(null)
  const started = useRef(false)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const node = ref.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!node || reduceMotion || typeof IntersectionObserver === 'undefined') {
      setDisplay(value)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        observer.disconnect()

        const start = performance.now()
        const tick = (now) => {
          const progress = Math.min(1, (now - start) / duration)
          const eased = 1 - (1 - progress) ** 3
          setDisplay(value * eased)
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.35 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  )
}
