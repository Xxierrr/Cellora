import { ArrowUpRight, BrainCircuit, Check, Code2, Database, FileText, GraduationCap, LockKeyhole, Microscope, ShieldCheck, Trash2, Users } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { CellMark } from '../components/Logo'

const roles = [
  { icon: BrainCircuit, title: 'Machine learning', text: 'Model architecture, training experiments, calibration and Grad-CAM explanations.' },
  { icon: Code2, title: 'Product engineering', text: 'React interface, API integration, accessible interactions and report generation.' },
  { icon: Microscope, title: 'Research & evaluation', text: 'Dataset review, baseline comparisons, error analysis and clinical-context research.' },
  { icon: FileText, title: 'Documentation & design', text: 'Project documentation, plain-language content, visual system and responsible AI messaging.' },
]

export default function About() {
  return (
    <>
      <PageHeader eyebrow="About Cellora" title="An academic project with a human purpose." description="Cellora explores how thoughtful design and explainable deep learning can make cervical cytology screening easier to understand—and easier to discuss with a doctor.">
        <div className="inline-flex items-center gap-2 rounded-full border border-plum-200 bg-plum-50 px-4 py-2 text-xs font-bold text-plum-800 dark:border-plum-800 dark:bg-plum-950/40 dark:text-plum-200"><GraduationCap size={16} /> B.Tech Major Project · PCSE28-040</div>
      </PageHeader>

      <div className="container-shell py-14 sm:py-20">
        <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20" aria-labelledby="project-heading">
          <div>
            <span className="eyebrow">The project</span>
            <h2 id="project-heading" className="section-title">Technology should clarify, not overstate.</h2>
            <p className="section-copy">Our goal is to pair a cervical cell classifier with the context people actually need: calibrated confidence, a visual explanation, honest limitations and a clear recommendation to seek professional care.</p>
            <p className="mt-4 text-sm leading-7 text-muted">This website is a functional academic prototype. Its current model layer and performance figures are demonstration data, designed to be replaced by a trained FastAPI service and verified held-out results.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {['Explainable by default', 'Privacy-minded workflow', 'Accessible, responsive design', 'Responsible health language'].map((item) => <span key={item} className="flex items-center gap-2 text-xs font-bold"><Check size={15} className="text-teal-600 dark:text-teal-400" />{item}</span>)}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[28px] bg-plum-950 p-8 text-white sm:p-10">
            <div className="cell-grid absolute inset-0 opacity-20" />
            <CellMark className="absolute -bottom-16 -right-16 h-64 w-64 text-plum-800" />
            <div className="relative">
              <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-plum-300">Project identity</span>
              <h3 className="mt-4 font-serif text-4xl font-medium">PCSE28-040</h3>
              <dl className="mt-8 space-y-5">
                {[['Programme', 'B.Tech Major Project'], ['Discipline', 'Computer Science & Engineering'], ['Focus', 'Deep learning · Digital health'], ['Academic year', '2026–2027'], ['Project name', 'Cellora']].map(([term, detail]) => <div key={term} className="flex items-center justify-between gap-5 border-b border-white/10 pb-4 text-xs"><dt className="text-plum-100/55">{term}</dt><dd className="text-right font-bold text-plum-50">{detail}</dd></div>)}
              </dl>
            </div>
          </div>
        </section>

        <section className="mt-20" aria-labelledby="team-heading">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><span className="eyebrow"><Users size={14} /> The team</span><h2 id="team-heading" className="section-title">One project, four perspectives.</h2></div><p className="max-w-sm text-xs leading-6 text-muted">The PCSE28-040 project team brings together model development, engineering, research and communication.</p></div>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map((role, index) => <article key={role.title} className="card p-6"><div className="flex items-center justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-plum-100 text-plum-700 dark:bg-plum-900/60 dark:text-plum-300"><role.icon size={20} /></span><span className="font-serif text-2xl text-plum-200 dark:text-plum-800">0{index + 1}</span></div><h3 className="mt-5 font-serif text-2xl font-medium">{role.title}</h3><p className="mt-3 text-xs leading-6 text-muted">{role.text}</p><p className="mt-5 border-t border-line pt-4 text-[10px] font-bold uppercase tracking-wider text-muted">PCSE28-040 project team</p></article>)}
          </div>
        </section>

        <section id="dataset" className="mt-20 scroll-mt-28 rounded-[28px] border border-line bg-surface p-7 sm:p-10" aria-labelledby="dataset-heading">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
            <div><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300"><Database size={23} /></span><span className="eyebrow mt-6">Dataset & licence</span><h2 id="dataset-heading" className="mt-3 font-serif text-4xl font-medium">Public data, properly acknowledged.</h2><p className="mt-4 text-sm leading-7 text-muted">Cellora’s proposed model workflow is designed around SIPaKMeD, a publicly available Pap smear image dataset for cervical cell classification research.</p><a href="https://www.cs.uoi.gr/~marina/sipakmed.html" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-plum-700 hover:underline dark:text-plum-300">Visit the SIPaKMeD dataset page <ArrowUpRight size={14} /></a></div>
            <div>
              <div className="grid grid-cols-3 gap-3">{[['4,049', 'Isolated cell images'], ['5', 'Cell categories'], ['Public', 'Research dataset']].map(([value, label]) => <div key={label} className="rounded-xl bg-surface-soft/65 p-4 text-center"><p className="font-serif text-3xl font-medium text-plum-800 dark:text-plum-200">{value}</p><p className="mt-2 text-[9px] font-bold uppercase leading-4 tracking-wider text-muted">{label}</p></div>)}</div>
              <div className="mt-6 space-y-4">{[['Dataset terms', 'Use remains subject to the original SIPaKMeD licence, citation requirements and any ethical terms set by its creators. Refer to the source before training or redistribution.'], ['Images in this demo', 'The cytology artwork and six crops bundled with this website are synthetic demonstration assets. Source dataset images are not redistributed here.'], ['Project licence', 'The interface is original academic project work. Add the team’s chosen software licence before public code distribution; no open-source licence is implied by this prototype.']].map(([title, text]) => <div key={title} className="border-l-2 border-plum-200 pl-4 dark:border-plum-800"><h3 className="text-xs font-bold">{title}</h3><p className="mt-1.5 text-xs leading-6 text-muted">{text}</p></div>)}</div>
              <div className="mt-6 rounded-xl bg-surface-soft/65 p-4">
                <h3 className="text-xs font-bold">How to cite the dataset</h3>
                <p className="mt-2 text-[11px] leading-6 text-muted">Plissiti, M. E., Dimitrakopoulos, P., Sfikas, G., Nikou, C., Krikoni, O., &amp; Charchanti, A. (2018). <em>SIPaKMeD: A new dataset for feature and image based classification of normal and pathological cervical cells in Pap smear images.</em> IEEE International Conference on Image Processing (ICIP), 3144–3148.</p>
                <p className="mt-2 text-[10px] leading-5 text-muted">Copy the current BibTeX and confirm the licence from the dataset page before redistribution.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="privacy" className="mt-20 scroll-mt-28" aria-labelledby="privacy-heading">
          <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-16">
            <div>
              <span className="eyebrow"><LockKeyhole size={14} /> Privacy note</span>
              <h2 id="privacy-heading" className="section-title">Your image is yours.</h2>
              <p className="section-copy">Cellora is designed to analyse an image without building a profile of you. There are no accounts, advertising trackers or analytics in this prototype.</p>
              <div className="mt-7 rounded-2xl bg-teal-50 p-6 dark:bg-teal-950/30"><ShieldCheck size={26} className="text-teal-700 dark:text-teal-300" /><h3 className="mt-4 font-serif text-2xl font-medium text-teal-950 dark:text-teal-50">In this demo, nothing is uploaded.</h3><p className="mt-2 text-xs leading-6 text-teal-900/75 dark:text-teal-100/70">Image selection and mock analysis happen in browser memory. Images are not sent to a server, written to local storage or retained after you reset or leave.</p></div>
            </div>
            <div className="card overflow-hidden">
              <div className="border-b border-line bg-surface-soft/45 px-6 py-5"><h3 className="text-sm font-bold">Data at a glance</h3><p className="mt-1 text-[11px] text-muted">Plain-language details, not a wall of legal text.</p></div>
              <div className="divide-y divide-line">
                {[
                  ['Uploaded images', 'Processed in memory for the current analysis', 'Never stored in demo mode'],
                  ['File name', 'Shown in the interface and your downloaded PDF', 'Not transmitted in demo mode'],
                  ['Theme preference', 'Saved in your browser’s local storage', 'Contains no health information'],
                  ['Analytics & cookies', 'No analytics, advertising or tracking cookies', 'No third-party profile created'],
                ].map(([title, use, retention]) => <div key={title} className="grid gap-2 px-6 py-5 sm:grid-cols-[.7fr_1.3fr]"><h4 className="text-xs font-bold">{title}</h4><div><p className="text-xs leading-5 text-muted">{use}</p><p className="mt-1.5 flex items-center gap-1.5 text-[10px] font-bold text-teal-700 dark:text-teal-300"><Check size={12} />{retention}</p></div></div>)}
              </div>
              <div className="border-t border-line p-6">
                <h3 className="flex items-center gap-2 text-xs font-bold"><Trash2 size={15} className="text-plum-600 dark:text-plum-300" /> When a FastAPI backend is connected</h3>
                <p className="mt-3 text-xs leading-6 text-muted">Your image will be sent to the configured analysis endpoint. A production deployment should use HTTPS, process images transiently, disable request-body logging and delete each image immediately after inference. Storage must remain off unless a user gives explicit, informed opt-in consent.</p>
                <p className="mt-3 text-xs leading-6 text-muted">The hosting provider’s operational logs and policies will also apply. Publish deployment-specific retention and contact details before using Cellora outside this local academic demonstration.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20 rounded-[24px] border border-plum-200 bg-plum-50 p-7 dark:border-plum-800 dark:bg-plum-950/30 sm:p-9">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"><div className="max-w-2xl"><span className="eyebrow">A responsible reminder</span><h2 className="mt-3 font-serif text-3xl font-medium">Cellora supports a conversation. It does not replace one.</h2><p className="mt-3 text-sm leading-7 text-muted">Cellora is an AI-based screening aid built on public data. It does not provide a medical diagnosis. Please consult a qualified doctor for any health concern.</p></div><a href="https://www.who.int/news-room/fact-sheets/detail/cervical-cancer" target="_blank" rel="noreferrer" className="btn-primary shrink-0">Read WHO guidance <ArrowUpRight size={16} /></a></div>
        </section>
      </div>
    </>
  )
}
