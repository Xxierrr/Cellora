import { ArrowUpRight, CheckCircle2, Focus, ScanLine, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[560px] lg:mx-0" aria-label="Cervical cell micrograph with an AI attention heatmap overlay">
      <div className="absolute -inset-8 -z-10 animate-soft-pulse rounded-full bg-plum-200/35 blur-3xl dark:bg-plum-800/20" />
      <div className="absolute -right-5 -top-7 -z-10 h-36 w-36 rounded-full border border-plum-200/80 dark:border-plum-800/50" />
      <div className="card relative overflow-hidden rounded-[28px] p-2.5 shadow-float">
        <div className="relative aspect-[1.12/1] overflow-hidden rounded-[21px] bg-[#eee9f1]">
          <img src="/images/cytology-hero.png" alt="Microscopic view of stained cervical epithelial cells" className="h-full w-full object-cover object-[60%_center]" />
          <div className="heatmap-visual absolute inset-0 animate-breathe opacity-90" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 animate-hero-scan bg-gradient-to-b from-transparent via-white/35 to-transparent" aria-hidden="true" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-plum-950/60 to-transparent p-4 text-white sm:p-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] backdrop-blur-md"><ScanLine size={13} /> Grad-CAM view</span>
            <span className="rounded-full border border-white/25 bg-black/15 px-2.5 py-1 text-[10px] font-semibold backdrop-blur-md">40×</span>
          </div>
          <div className="absolute left-[59%] top-[30%] h-[31%] w-[29%] rounded-full border border-white/80 shadow-[0_0_0_5px_rgba(255,255,255,0.13)]" aria-hidden="true">
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-white" />
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg border border-white/30 bg-white/85 px-2.5 py-1.5 text-[10px] font-bold text-plum-900 shadow-sm backdrop-blur-md dark:border-white/15 dark:bg-plum-950/80 dark:text-plum-100 sm:bottom-4 sm:left-4 sm:gap-2 sm:px-3 sm:py-2 sm:text-xs">
            <Focus size={14} /> Nucleus region
          </div>
          <div className="absolute bottom-3 right-3 w-[176px] rounded-xl border border-white/40 bg-surface/95 p-3 shadow-float backdrop-blur-lg dark:border-white/10 sm:bottom-4 sm:right-4 sm:w-[212px] sm:p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted sm:text-[10px]">Analysis complete</span>
              <CheckCircle2 size={15} className="text-teal-600 dark:text-teal-400" />
            </div>
            <p className="mt-1.5 text-xs font-bold leading-5">No abnormal cells detected</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-soft"><div className="h-full w-[96%] rounded-full bg-teal-500" /></div>
              <span className="text-[10px] font-extrabold text-teal-700 dark:text-teal-300">96%</span>
            </div>
            <p className="mt-1.5 text-[9px] text-muted">High confidence · Demo result</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 px-3 py-4 sm:px-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300"><Sparkles size={17} /></span>
            <div><p className="text-xs font-bold">Attention visualisation</p><p className="mt-0.5 text-[11px] text-muted">See where the model looked</p></div>
          </div>
          <span className="hidden text-[10px] font-bold uppercase tracking-[0.13em] text-muted sm:block">Explainable AI</span>
        </div>
      </div>

      <Link to="/analyse" className="group absolute -right-3 top-1/2 hidden w-[154px] rounded-2xl border border-line bg-surface/95 p-4 shadow-float backdrop-blur-lg transition hover:-translate-y-1 lg:block lg:-right-8">
        <span className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Your turn <ArrowUpRight size={14} className="transition group-hover:translate-x-0.5" /></span>
        <span className="mt-2 block text-xs font-bold leading-5 text-plum-800 dark:text-plum-200">Try a sample image</span>
      </Link>
    </div>
  )
}
