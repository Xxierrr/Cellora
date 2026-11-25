import { useEffect, useRef, useState } from 'react'
import { AlertCircle, ArrowRight, Check, FileImage, Image as ImageIcon, Info, LockKeyhole, Microscope, RefreshCw, ShieldCheck, Sparkles, Trash2 } from 'lucide-react'
import { predict, isBackendConnected } from '../api'
import PageHeader from '../components/PageHeader'
import UploadZone from '../components/UploadZone'
import SampleGallery from '../components/SampleGallery'
import AnalysisProgress from '../components/AnalysisProgress'
import ResultsView from '../components/ResultsView'
import MedicalNotice from '../components/MedicalNotice'

function formatFileSize(bytes) {
  return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function Analyse() {
  const [file, setFile] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [selectedSample, setSelectedSample] = useState(null)
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const imageUrlRef = useRef('')
  const analysisIdRef = useRef(0)

  useEffect(() => () => {
    analysisIdRef.current += 1
    if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current)
  }, [])

  function selectFile(nextFile, sampleId = null) {
    analysisIdRef.current += 1
    if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current)
    const nextUrl = URL.createObjectURL(nextFile)
    imageUrlRef.current = nextUrl
    setFile(nextFile)
    setImageUrl(nextUrl)
    setSelectedSample(sampleId)
    setResult(null)
    setError('')
    setProgress(0)
    setStatus('ready')
  }

  function resetAnalysis() {
    analysisIdRef.current += 1
    if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current)
    imageUrlRef.current = ''
    setFile(null)
    setImageUrl('')
    setSelectedSample(null)
    setResult(null)
    setError('')
    setProgress(0)
    setStatus('idle')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function analyseImage() {
    if (!file) return
    const currentAnalysis = analysisIdRef.current + 1
    analysisIdRef.current = currentAnalysis
    setStatus('analysing')
    setError('')
    setProgress(7)
    const progressTimer = window.setInterval(() => {
      setProgress((current) => Math.min(92, current + (current < 35 ? 5 : current < 70 ? 3 : 1)))
    }, 150)

    try {
      const prediction = await predict(file)
      if (analysisIdRef.current !== currentAnalysis) return
      setProgress(100)
      setResult(prediction)
      setStatus('results')
    } catch (predictionError) {
      if (analysisIdRef.current !== currentAnalysis) return
      setError(predictionError.message || 'We could not analyse this image. Please try again.')
      setStatus('error')
    } finally {
      window.clearInterval(progressTimer)
    }
  }

  const showWorkspace = status !== 'results'

  return (
    <>
      <PageHeader compact eyebrow="AI-assisted cytology" title="A closer look, in a few moments." description={isBackendConnected ? 'Upload a microscopic cervical cell image for an explainable screening result. The image is sent to the configured analysis service, processed for inference and not stored.' : 'Upload a microscopic cervical cell image for an explainable screening result. Your demo image stays in this browser and is never stored.'}>
        <div className="flex flex-wrap gap-3 text-xs font-semibold text-muted">
          <span className="inline-flex items-center gap-1.5"><LockKeyhole size={14} className="text-teal-600" /> {isBackendConnected ? 'Processed transiently' : 'Private by default'}</span>
          <span className="inline-flex items-center gap-1.5"><Sparkles size={14} className="text-plum-500" /> Grad-CAM explanation</span>
          <span className="inline-flex items-center gap-1.5"><FileImage size={14} className="text-plum-500" /> PDF report</span>
        </div>
      </PageHeader>

      <div className="container-shell py-10 sm:py-14">
        {status === 'results' && result ? (
          <ResultsView file={file} imageUrl={imageUrl} result={result} onReset={resetAnalysis} />
        ) : (
          <div className="mx-auto max-w-5xl">
            {showWorkspace && (
              <section className="card p-5 sm:p-7 lg:p-8" aria-label="Cervical cell image analysis workspace">
                <div className="mb-7 flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-plum-100 text-plum-700 dark:bg-plum-900/60 dark:text-plum-300"><Microscope size={18} /></span><div><h2 className="text-sm font-bold">{status === 'analysing' ? 'Analysing your image' : file ? 'Your image is ready' : 'New image analysis'}</h2><p className="mt-0.5 text-[11px] text-muted">Cellora ensemble · Demonstration model</p></div></div>
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-[10px] font-bold text-teal-800 dark:bg-teal-950/40 dark:text-teal-200"><ShieldCheck size={13} /> Not stored</span>
                </div>

                {status === 'analysing' ? (
                  <AnalysisProgress progress={progress} imageUrl={imageUrl} />
                ) : file ? (
                  <div>
                    <div className="grid items-center gap-7 md:grid-cols-[260px_1fr] md:gap-9">
                      <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-plum-100 dark:bg-plum-950">
                        <img src={imageUrl} alt="Preview of the selected cervical cell sample" className="h-full w-full object-cover" />
                        <span className="absolute bottom-3 left-3 rounded-full bg-plum-950/75 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-sm">Ready for analysis</span>
                      </div>
                      <div>
                        <span className="eyebrow"><ImageIcon size={14} /> Image preview</span>
                        <h3 className="mt-3 break-all font-serif text-2xl font-medium leading-snug">{file.name}</h3>
                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted"><span>{formatFileSize(file.size)}</span><span>{file.type.replace('image/', '').toUpperCase()}</span><span className="inline-flex items-center gap-1 text-teal-700 dark:text-teal-300"><Check size={13} /> File validated</span></div>
                        <p className="mt-5 text-sm leading-6 text-muted">Cellora will examine cellular patterns, estimate calibrated confidence and generate a visual attention map.</p>
                        {error && <div className="mt-5 flex items-start gap-2 rounded-xl bg-red-50 p-4 text-xs leading-5 text-red-800 dark:bg-red-950/30 dark:text-red-200" role="alert"><AlertCircle className="mt-0.5 shrink-0" size={16} /><div><strong className="block font-bold">Analysis unsuccessful</strong><span className="mt-1 block">{error}</span></div></div>}
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                          <button onClick={analyseImage} className="btn-primary !px-6">{status === 'error' ? <RefreshCw size={17} /> : <Sparkles size={17} />}{status === 'error' ? 'Try analysis again' : 'Analyse image'}<ArrowRight size={16} /></button>
                          <button onClick={resetAnalysis} className="btn-secondary"><Trash2 size={15} /> Remove image</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-7 lg:grid-cols-[1.4fr_.6fr]">
                    <UploadZone onFileSelect={selectFile} />
                    <aside className="rounded-2xl bg-surface-soft/65 p-6">
                      <Info size={21} className="text-plum-600 dark:text-plum-300" />
                      <h3 className="mt-4 font-serif text-2xl font-medium">Before you begin</h3>
                      <ul className="mt-5 space-y-4">
                        {['Use a clear microscopic Pap smear image, not a photo of a printed report.', 'Avoid images with heavy blur, annotations or cropped cellular regions.', 'This tool is for screening support and education—not urgent care or diagnosis.'].map((text) => <li key={text} className="flex gap-2.5 text-xs leading-6 text-muted"><Check size={15} className="mt-1 shrink-0 text-teal-600 dark:text-teal-400" />{text}</li>)}
                      </ul>
                      <div className="mt-6 border-t border-line pt-5"><p className="flex items-center gap-2 text-[11px] font-bold"><Microscope size={14} className="text-plum-600 dark:text-plum-300" /> Where does the image come from?</p><p className="mt-2 text-[10px] leading-5 text-muted">Cytology laboratories capture Pap smear images through a microscope, often at 40×. If you do not have one, start with a sample below—the workflow is identical.</p></div>
                      <div className="mt-5 border-t border-line pt-5"><p className="flex items-center gap-2 text-[11px] font-bold"><LockKeyhole size={14} className="text-teal-600" /> {isBackendConnected ? 'Processed, then deleted' : 'Nothing leaves your browser'}</p><p className="mt-2 text-[10px] leading-5 text-muted">{isBackendConnected ? 'The image is sent to the configured endpoint only for inference and should be deleted immediately after processing.' : 'In mock mode, analysis is simulated locally and object URLs are released when you finish.'}</p></div>
                    </aside>
                  </div>
                )}
              </section>
            )}

            {status !== 'analysing' && (
              <section className="card mt-6 p-5 sm:p-7" aria-labelledby="samples-heading">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><h2 id="samples-heading" className="font-serif text-2xl font-medium">No image handy? Try a sample.</h2><p className="mt-1.5 text-xs text-muted">Choose a prepared crop to explore the complete analysis experience.</p></div><span className="text-[10px] font-semibold text-muted">6 demo images</span></div>
                <SampleGallery onSelect={selectFile} selectedId={selectedSample} />
                <p className="mt-4 text-[10px] leading-5 text-muted">Sample artwork is synthetic and provided for interface demonstration only. Selected samples are sent to the configured analysis service just like uploaded images.</p>
              </section>
            )}

            <MedicalNotice className="mt-6" />
          </div>
        )}
      </div>
    </>
  )
}
