import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'

const faqs = [
  { question: 'Can Cellora diagnose cervical cancer?', answer: 'No. Cellora highlights patterns in a cervical cell image that may need professional review. It cannot diagnose cancer or replace a Pap test, HPV test, colposcopy, biopsy, or a qualified clinician.' },
  { question: 'What happens to my uploaded image?', answer: 'In this demonstration, your image stays in your browser and is not uploaded or retained. When a backend is connected, images should be processed transiently and deleted immediately unless you explicitly opt in to storage.' },
  { question: 'What does the heatmap show?', answer: 'The Grad-CAM heatmap highlights regions that strongly influenced the model’s output. It is an explanation of model attention, not an outline of cancer or a medical finding.' },
  { question: 'What should I do with an abnormal result?', answer: 'Arrange to speak with a qualified doctor and bring the original Pap smear report if you have one. An abnormal screening result does not mean that you have cancer, but it does deserve professional follow-up.' },
  { question: 'How reliable are the confidence scores?', answer: 'The current scores are realistic demonstration values from the mock model layer. A connected model should be calibrated on a held-out validation set, and confidence should always be interpreted alongside clinical review.' },
]

export default function FaqList() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((faq, index) => {
        const open = openIndex === index
        return (
          <div key={faq.question}>
            <h3>
              <button className="flex w-full items-center justify-between gap-6 py-5 text-left text-[15px] font-bold hover:text-plum-700 dark:hover:text-plum-300" onClick={() => setOpenIndex(open ? -1 : index)} aria-expanded={open} aria-controls={`faq-answer-${index}`}>
                {faq.question}
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition ${open ? 'bg-plum-700 text-white dark:bg-plum-300 dark:text-plum-950' : 'bg-surface-soft text-muted'}`}>{open ? <Minus size={15} /> : <Plus size={15} />}</span>
              </button>
            </h3>
            <div id={`faq-answer-${index}`} hidden={!open}>
              <p className="max-w-2xl pb-6 pr-10 text-sm leading-7 text-muted">{faq.answer}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
