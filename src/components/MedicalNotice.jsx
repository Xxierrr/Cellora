import { Info } from 'lucide-react'

export default function MedicalNotice({ compact = false, className = '' }) {
  return (
    <div className={`notice ${compact ? '!py-3' : ''} ${className}`} role="note">
      <Info className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300" size={18} />
      <p><strong className="font-bold">A screening aid, not a diagnosis.</strong> Cellora is an AI-based screening aid built on public data. It does not provide a medical diagnosis. Please consult a qualified doctor for any health concern.</p>
    </div>
  )
}
