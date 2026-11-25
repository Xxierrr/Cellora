import { useState } from 'react'
import { AlertCircle, Check, LoaderCircle } from 'lucide-react'
import { createSampleFile, SAMPLE_IMAGE_URL, samples } from '../data/samples'

const positions = ['18% 22%', '78% 18%', '50% 52%', '18% 80%', '82% 78%', '58% 24%']
const zooms = ['210%', '300%', '260%', '340%', '280%', '380%']

export default function SampleGallery({ onSelect, selectedId, disabled = false }) {
  const [loadingId, setLoadingId] = useState(null)
  const [error, setError] = useState('')

  async function selectSample(sample) {
    setLoadingId(sample.id)
    setError('')
    try {
      const file = await createSampleFile(sample)
      onSelect(file, sample.id)
    } catch (sampleError) {
      setError(sampleError.message)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {samples.map((sample, index) => {
          const selected = selectedId === sample.id
          const loading = loadingId === sample.id
          return (
            <button key={sample.id} type="button" disabled={disabled || Boolean(loadingId)} onClick={() => selectSample(sample)} className={`group overflow-hidden rounded-xl border bg-surface text-left transition hover:-translate-y-0.5 hover:border-plum-400 disabled:hover:translate-y-0 ${selected ? 'border-plum-600 ring-2 ring-plum-200 dark:border-plum-300 dark:ring-plum-900' : 'border-line'}`} aria-pressed={selected} aria-label={`Try ${sample.name}: ${sample.detail}`}>
              <div className="relative aspect-square overflow-hidden bg-plum-100 dark:bg-plum-950">
                <div className="absolute inset-0 bg-cover transition duration-300 group-hover:scale-105" style={{ backgroundImage: `url(${SAMPLE_IMAGE_URL})`, backgroundSize: zooms[index], backgroundPosition: positions[index] }} />
                <span className="absolute left-1.5 top-1.5 rounded-full bg-plum-950/55 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">{sample.id}</span>
                {selected && <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-plum-700 text-white dark:bg-plum-300 dark:text-plum-950"><Check size={12} strokeWidth={3} /></span>}
                {loading && <span className="absolute inset-0 flex items-center justify-center bg-surface/70 text-plum-800 backdrop-blur-sm dark:text-plum-200"><LoaderCircle className="animate-spin" size={20} /></span>}
              </div>
              <div className="p-2.5">
                <p className="text-[11px] font-bold">{sample.name}</p>
                <p className="mt-0.5 truncate text-[10px] text-muted">{sample.detail}</p>
              </div>
            </button>
          )
        })}
      </div>
      {error && <p className="mt-3 flex items-center gap-2 text-xs text-red-700 dark:text-red-300" role="alert"><AlertCircle size={14} /> {error}</p>}
    </div>
  )
}
