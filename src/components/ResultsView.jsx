import { useEffect, useState } from 'react'
import { AlertTriangle, ArrowRight, Check, CheckCircle2, Download, Eye, FileText, Focus, Info, Layers2, LoaderCircle, RotateCcw, ShieldCheck, Stethoscope } from 'lucide-react'
import { getConfidence } from '../api'
import { downloadPdfReport } from '../utils/report'
import CountUp from './CountUp'
import Reveal from './Reveal'
import MedicalNotice from './MedicalNotice'

function ConfidenceGauge({ confidence, abnormal }) {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const [progress, setProgress] = useState(0)
  const color = confidence.level === 'Low' ? '#b45309' : abnormal ? '#b83a4b' : '#2d8a7d'

  useEffect(() => {
    const frame = requestAnimationFrame(() => setProgress(confidence.value))
    return () => cancelAnimationFrame(frame)
  }, [confidence.value])

  const offset = circumference * (1 - progress)

  return (
    <div className="relative h-32 w-32 shrink-0" aria-label={`${confidence.percentage}% calibrated confidence, ${confidence.level} confidence`}>
      <svg viewBox="0 0 104 104" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="52" cy="52" r={radius} fill="none" stroke="rgb(var(--surface-soft))" strokeWidth="7" />
        <circle cx="52" cy="52" r={radius} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-[stroke-dashoffset] duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-4xl font-medium tracking-[-0.04em]"><CountUp value={confidence.percentage} suffix="%" /></span>
        <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.13em] text-muted">Calibrated</span>
      </div>
    </div>
  )
}

export default function ResultsView({ file, imageUrl, result, onReset }) {
  const [showOverlay, setShowOverlay] = useState(true)
  const [opacity, setOpacity] = useState(72)
  const [downloaded, setDownloaded] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState('')
  const confidence = getConfidence(result)
  const abnormal = result.label === 'Abnormal'
  const finding = abnormal ? 'Abnormal cells detected' : 'No abnormal cells detected'
  const nextSteps = abnormal
    ? [
        ['Talk with a qualified doctor', 'Share this result and your original Pap smear report for professional interpretation.'],
        ['Ask about follow-up testing', 'Depending on your history, your doctor may suggest an HPV test, repeat cytology or a colposcopy.'],
        ['Treat this as a prompt, not a diagnosis', 'Abnormal-looking cells have many causes. Only clinical assessment can confirm what is happening.'],
      ]
    : [
        ['Keep your routine screening schedule', 'A clear AI result is not a reason to skip your next Pap or HPV test.'],
        ['Watch for unusual symptoms', 'Bleeding between periods or after sex, unusual discharge or pelvic pain should be checked regardless of this result.'],
        ['Bring this report to your next appointment', 'A clinician can interpret it alongside your screening history and local guidance.'],
      ]

  async function handleDownload() {
    if (downloading) return
    setDownloading(true)
    setDownloadError('')
    try {
      await downloadPdfReport({ file, result, confidence, imageUrl })
      setDownloaded(true)
      window.setTimeout(() => setDownloaded(false), 3000)
    } catch (error) {
      setDownloadError('The report could not be generated. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <section aria-labelledby="result-heading" className={`overflow-hidden rounded-2xl border shadow-card ${abnormal ? 'border-red-200 bg-red-50/70 dark:border-red-900/60 dark:bg-red-950/20' : 'border-teal-200 bg-teal-50/70 dark:border-teal-900/60 dark:bg-teal-950/20'}`}>
        <div className="flex flex-col gap-7 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${abnormal ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' : 'bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300'}`}>
              {abnormal ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`data-label ${abnormal ? '!text-red-700 dark:!text-red-300' : '!text-teal-700 dark:!text-teal-300'}`}>Screening result</span>
                <span className="rounded-full border border-line/70 bg-surface/70 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted">Demo model</span>
              </div>
              <h2 id="result-heading" className={`mt-2 font-serif text-3xl font-medium leading-tight sm:text-4xl ${abnormal ? 'text-red-900 dark:text-red-100' : 'text-teal-900 dark:text-teal-100'}`}>{finding}</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted">{abnormal ? 'The model found cellular patterns that need professional review. This does not mean that you have cancer.' : 'The model did not find patterns associated with abnormal cells in this image. Continue routine screening and clinical care.'}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${confidence.level === 'Low' ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-100' : confidence.level === 'Medium' ? 'bg-plum-100 text-plum-800 dark:bg-plum-900/60 dark:text-plum-100' : abnormal ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-100' : 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-100'}`}>
                  {confidence.level === 'Low' ? <AlertTriangle size={13} /> : <Check size={13} />} {confidence.level} confidence
                </span>
                <span className="text-[11px] text-muted">Uncertainty estimate: {(result.uncertainty * 100).toFixed(1)}%</span>
              </div>
              <p className="mt-3 max-w-lg text-[11px] leading-5 text-muted">Confidence describes how sure the model is about its own label. It is not your risk of disease.</p>
            </div>
          </div>
          <ConfidenceGauge confidence={confidence} abnormal={abnormal} />
        </div>
        <div className="flex flex-col gap-2 border-t border-line/70 bg-surface/50 px-6 py-3 text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span className="max-w-full truncate">Image: <strong className="font-semibold text-ink">{file.name}</strong></span>
          <span>Decision threshold: {result.threshold} (balanced cut-off) · Confidence is not disease probability</span>
        </div>
      </section>

      <Reveal as="section" delay={80} className="card p-5 sm:p-7" aria-labelledby="explanation-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="eyebrow"><Layers2 size={14} /> Visual explanation</span>
            <h2 id="explanation-heading" className="mt-2 font-serif text-3xl font-medium">See what shaped the result.</h2>
            <p className="mt-2 text-sm leading-6 text-muted">Compare the original image with the model’s Grad-CAM attention map.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-surface-soft px-3 py-1.5 text-[10px] font-bold text-muted"><Info size={12} /> Attention is not a diagnosis</span>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <figure>
            <div className="mb-3 flex items-center justify-between"><figcaption className="text-xs font-bold">Original image</figcaption><span className="data-label">Input</span></div>
            <div className="aspect-square overflow-hidden rounded-xl border border-line bg-plum-100 dark:bg-plum-950"><img src={imageUrl} alt="Original uploaded cervical cell sample" className="h-full w-full object-cover" /></div>
          </figure>
          <figure>
            <div className="mb-3 flex items-center justify-between"><figcaption className="text-xs font-bold">Grad-CAM attention</figcaption><span className="data-label">Explanation</span></div>
            <div className="relative aspect-square overflow-hidden rounded-xl border border-line bg-plum-100 dark:bg-plum-950">
              <img src={imageUrl} alt="Cervical cell sample with model attention heatmap" className="h-full w-full object-cover" />
              {showOverlay && <img src={result.heatmapBase64} alt="" aria-hidden="true" className="heatmap-layer absolute inset-0 h-full w-full object-cover transition-opacity duration-300" style={{ opacity: opacity / 100 }} />}
              {showOverlay && <div className="pointer-events-none absolute left-[52%] top-[27%] h-[30%] w-[32%] rounded-full border border-white/90 shadow-[0_0_0_4px_rgba(255,255,255,.18)]"><span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-white" /></div>}
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-plum-950/75 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-sm"><Eye size={12} /> {showOverlay ? 'Nucleus region highlighted' : 'Overlay hidden'}</span>
            </div>
          </figure>
        </div>

        <div className="mt-6 flex flex-col gap-5 rounded-xl bg-surface-soft/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center justify-between gap-4 sm:min-w-[210px]">
            <div><label htmlFor="overlay-toggle" className="text-xs font-bold">Heatmap overlay</label><p className="mt-1 text-[10px] text-muted">Show model attention</p></div>
            <button id="overlay-toggle" type="button" role="switch" aria-checked={showOverlay} onClick={() => setShowOverlay((visible) => !visible)} className={`relative h-7 w-12 shrink-0 rounded-full transition ${showOverlay ? 'bg-plum-700 dark:bg-plum-400' : 'bg-neutral-300 dark:bg-neutral-600'}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${showOverlay ? 'translate-x-6' : 'translate-x-1'}`} /></button>
          </div>
          <div className="flex-1 sm:max-w-sm">
            <div className="flex items-center justify-between"><label htmlFor="heatmap-opacity" className="text-xs font-bold">Overlay opacity</label><span className="text-xs font-bold text-muted">{opacity}%</span></div>
            <input id="heatmap-opacity" type="range" min="10" max="100" value={opacity} disabled={!showOverlay} onChange={(event) => setOpacity(Number(event.target.value))} className="mt-3 h-1.5 w-full cursor-pointer accent-plum-700 disabled:cursor-not-allowed disabled:opacity-40 dark:accent-plum-300" />
          </div>
          <div className="hidden items-center gap-2 text-[9px] font-semibold text-muted lg:flex"><span>Low</span><span className="h-2 w-20 rounded-full bg-gradient-to-r from-yellow-100 via-orange-400 to-red-600" /><span>High</span></div>
        </div>

        <div className="mt-6 flex gap-4 rounded-xl border border-plum-100 bg-plum-50/60 p-5 dark:border-plum-900 dark:bg-plum-950/30">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-plum-100 text-plum-700 dark:bg-plum-900 dark:text-plum-300"><Focus size={18} /></span>
          <div><h3 className="text-sm font-bold">What am I looking at?</h3><p className="mt-1.5 text-sm leading-6 text-muted">The model focused on the highlighted nucleus region and nearby cytoplasm. Warmer colours show stronger influence on this output; they do not mark cancer cells or define a clinical boundary.</p></div>
        </div>
      </Reveal>

      <Reveal as="section" delay={140} className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
        <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-6 dark:border-teal-900/60 dark:bg-teal-950/20 sm:p-7">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300"><Stethoscope size={20} /></span><h2 className="font-serif text-3xl font-medium text-teal-950 dark:text-teal-50">Your next steps</h2></div>
          <ol className="mt-6 space-y-4">
            {nextSteps.map(([title, text], index) => <li key={title} className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-extrabold text-teal-700 shadow-sm dark:text-teal-300">{index + 1}</span><div><h3 className="text-sm font-bold">{title}</h3><p className="mt-1 text-xs leading-5 text-muted">{text}</p></div></li>)}
          </ol>
        </div>
        <div className="card flex flex-col justify-center p-6 sm:p-7">
          <FileText size={25} className="text-plum-600 dark:text-plum-300" strokeWidth={1.6} />
          <h2 className="mt-4 font-serif text-2xl font-medium">Keep a copy for your conversation.</h2>
          <p className="mt-2 text-xs leading-6 text-muted">Download a concise PDF with your result, confidence and recommended next steps.</p>
          <div className="mt-6 space-y-3 no-print">
            <button onClick={handleDownload} disabled={downloading} className="btn-primary w-full">{downloading ? <LoaderCircle className="animate-spin" size={17} /> : downloaded ? <Check size={17} /> : <Download size={17} />}{downloading ? 'Preparing report…' : downloaded ? 'Report downloaded' : 'Download PDF report'}</button>
            <button onClick={onReset} className="btn-secondary w-full"><RotateCcw size={16} /> Analyse another image</button>
            {downloadError && <p className="text-center text-[11px] leading-5 text-red-700 dark:text-red-300" role="alert">{downloadError}</p>}
          </div>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-muted"><ShieldCheck size={12} /> No personal details are added</p>
        </div>
      </Reveal>

      <MedicalNotice />
      <div className="flex justify-center pt-2 no-print"><button onClick={onReset} className="inline-flex items-center gap-2 text-sm font-bold text-plum-700 hover:gap-3 dark:text-plum-300">Start a fresh analysis <ArrowRight size={16} /></button></div>
    </div>
  )
}
