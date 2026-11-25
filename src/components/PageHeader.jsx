export default function PageHeader({ eyebrow, title, description, children, align = 'left', compact = false }) {
  return (
    <section className="border-b border-line/70 bg-surface/40">
      <div className={`container-shell ${compact ? 'py-9 sm:py-12' : 'py-14 sm:py-20'} ${align === 'center' ? 'text-center' : ''}`}>
        <div className={align === 'center' ? 'mx-auto max-w-3xl' : 'max-w-3xl'}>
          <span className="eyebrow">{eyebrow}</span>
          <h1 className={`text-balance mt-4 font-serif font-medium leading-[1.04] tracking-[-0.035em] ${compact ? 'text-4xl sm:text-5xl' : 'text-5xl sm:text-6xl'}`}>{title}</h1>
          <p className={`mt-5 text-muted ${compact ? 'text-sm leading-7 sm:text-base sm:leading-7' : 'text-base leading-7 sm:text-lg sm:leading-8'}`}>{description}</p>
          {children && <div className="mt-7">{children}</div>}
        </div>
      </div>
    </section>
  )
}
