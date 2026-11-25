import { useEffect, useRef, useState } from 'react'
import { AlertCircle, FileImage, UploadCloud } from 'lucide-react'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function validateImageFile(file) {
  if (!file) return 'Choose an image to continue.'
  if (!ALLOWED_TYPES.includes(file.type)) return 'This file type is not supported. Choose a JPG, PNG or WebP image.'
  if (file.size > MAX_FILE_SIZE) return 'This image is larger than 10 MB. Choose a smaller file and try again.'
  if (file.size === 0) return 'This file is empty. Choose a valid image and try again.'
  return null
}

export default function UploadZone({ onFileSelect, disabled = false }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    function handlePaste(event) {
      if (disabled) return
      const item = [...(event.clipboardData?.items || [])].find((entry) => entry.type.startsWith('image/'))
      const pastedFile = item?.getAsFile()
      if (!pastedFile) return
      event.preventDefault()
      const validationError = validateImageFile(pastedFile)
      setError(validationError || '')
      if (!validationError) onFileSelect(pastedFile)
    }

    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [disabled, onFileSelect])

  function acceptFile(file) {
    const validationError = validateImageFile(file)
    setError(validationError || '')
    if (!validationError) onFileSelect(file)
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      inputRef.current?.click()
    }
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload a cervical cell image"
        aria-disabled={disabled}
        onKeyDown={handleKeyDown}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragEnter={(event) => { event.preventDefault(); setDragging(true) }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => { event.preventDefault(); if (event.currentTarget === event.target) setDragging(false) }}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          if (!disabled) acceptFile(event.dataTransfer.files[0])
        }}
        className={`group flex min-h-[310px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-plum-500 focus-visible:ring-offset-4 ${dragging ? 'scale-[1.01] border-plum-500 bg-plum-100/70 dark:bg-plum-900/30' : 'border-plum-200 bg-plum-50/45 hover:border-plum-400 hover:bg-plum-50 dark:border-plum-800 dark:bg-plum-950/20 dark:hover:border-plum-600 dark:hover:bg-plum-950/40'}`}
      >
        <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { acceptFile(event.target.files[0]); event.target.value = '' }} disabled={disabled} />
        <div className="relative">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-plum-200 bg-surface text-plum-700 shadow-sm transition group-hover:-translate-y-1 dark:border-plum-800 dark:text-plum-300"><UploadCloud size={28} strokeWidth={1.7} /></span>
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-white ring-4 ring-surface"><FileImage size={12} /></span>
        </div>
        <p className="mt-6 font-serif text-2xl font-medium">{dragging ? 'Drop your image here' : 'Drop a cervical cell image here'}</p>
        <p className="mt-2 text-sm text-muted">or <span className="font-bold text-plum-700 underline decoration-plum-300 underline-offset-4 dark:text-plum-300">browse your files</span></p>
        <p className="mt-5 text-[11px] font-semibold text-muted">JPG, PNG or WebP · Maximum 10 MB · or paste with Ctrl/⌘ + V</p>
      </div>
      {error && <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs leading-5 text-red-800 dark:bg-red-950/30 dark:text-red-200" role="alert"><AlertCircle className="mt-0.5 shrink-0" size={15} /> {error}</div>}
    </div>
  )
}
