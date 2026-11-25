import { Check, LoaderCircle, ScanLine, ShieldCheck } from 'lucide-react'

const stages = [
  { label: 'Preparing image', detail: 'Checking quality and dimensions', threshold: 0 },
  { label: 'Analysing cell patterns', detail: 'Comparing features with learned patterns', threshold: 32 },
  { label: 'Creating your explanation', detail: 'Calibrating confidence and mapping attention', threshold: 68 },
]

export default function AnalysisProgress({ progress, imageUrl }) {
  const activeStage = progress >= 68 ? 2 : progress >= 32 ? 1 : 0

  return (
    <div className="grid items-center gap-8 py-4 md:grid-cols-[.8fr_1.2fr] md:gap-12">
      <div className="relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-2xl bg-plum-100 dark:bg-plum-950">
        <img src={imageUrl} alt="Uploaded cervical cells being analysed" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-plum-950/10" />
        <div className="absolute inset-x-4 top-4 h-0.5 animate-scan bg-teal-200 shadow-[0_0_16px_4px_rgba(168,222,212,.6)]" />
        <div className="absolute inset-0 cell-grid opacity-30" />
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-plum-950/80 px-4 py-2 text-xs font-bold text-white backdrop-blur-md"><ScanLine size={15} /> Scanning cellular regions</div>
      </div>
      <div>
        <span className="eyebrow"><LoaderCircle size={14} className="animate-spin" /> Analysis in progress</span>
        <h2 className="mt-4 font-serif text-4xl font-medium leading-tight">Looking closely at the details.</h2>
        <p className="mt-3 text-sm leading-6 text-muted">This demonstration takes a few seconds. Keep this tab open while we prepare your result.</p>
        <div className="mt-7" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} aria-label="Image analysis progress">
          <div className="flex items-center justify-between text-xs font-bold"><span>{stages[activeStage].label}</span><span>{Math.round(progress)}%</span></div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-soft"><div className="h-full rounded-full bg-plum-600 transition-[width] duration-300 dark:bg-plum-300" style={{ width: `${progress}%` }} /></div>
        </div>
        <div className="mt-7 space-y-4">
          {stages.map((stage, index) => {
            const complete = activeStage > index
            const active = activeStage === index
            return (
              <div key={stage.label} className={`flex gap-3 transition-opacity ${!complete && !active ? 'opacity-40' : ''}`}>
                <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${complete ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300' : 'border border-plum-300 text-plum-700 dark:border-plum-700 dark:text-plum-300'}`}>{complete ? <Check size={13} strokeWidth={3} /> : active ? <LoaderCircle size={13} className="animate-spin" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}</span>
                <div><p className="text-xs font-bold">{stage.label}</p><p className="mt-1 text-[11px] text-muted">{stage.detail}</p></div>
              </div>
            )
          })}
        </div>
        <p className="mt-7 flex items-center gap-2 text-[11px] text-muted"><ShieldCheck size={14} className="text-teal-600" /> Your image remains private during this demo.</p>
      </div>
    </div>
  )
}
