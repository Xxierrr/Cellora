import { ArrowRight, ArrowUpRight, BookOpen, Check, ChevronRight, Database, Eye, FileImage, LockKeyhole, Microscope, ScanSearch, ShieldCheck, Sparkles, Stethoscope, Upload } from 'lucide-react'
import { Link } from 'react-router-dom'
import HeroVisual from '../components/HeroVisual'
import FaqList from '../components/FaqList'
import CountUp from '../components/CountUp'
import Reveal from '../components/Reveal'
import { isBackendConnected } from '../api'
import metrics from '../data/metrics.json'

const steps = [
  { number: '01', icon: Upload, title: 'Upload', text: 'Add a Pap smear image, or start with one of our six sample images. JPG, PNG or WebP up to 10 MB.', note: 'No account needed' },
  { number: '02', icon: ScanSearch, title: 'Analyse', text: 'The model examines cellular patterns and creates a Grad-CAM view of the regions that shaped its result.', note: 'Explainable by design' },
  { number: '03', icon: FileImage, title: 'Review results', text: 'See a clear screening result, calibrated confidence and practical next steps to discuss with your doctor.', note: 'A downloadable report' },
]

const trustItems = (connected) => [
  { icon: Database, title: 'Public, documented data', text: 'Built around the SIPaKMeD public cervical cytology dataset, with clear evaluation and limitations.', link: 'Explore the dataset', to: '/about#dataset' },
  connected
    ? { icon: LockKeyhole, title: 'Transient by design', text: 'Images are sent only to the configured analysis endpoint for inference and are never written to storage.', link: 'Read the privacy note', to: '/about#privacy' }
    : { icon: LockKeyhole, title: 'Private by default', text: 'Your demo images stay in this browser session. No uploads, accounts or hidden image retention.', link: 'Read our privacy note', to: '/about#privacy' },
  { icon: Eye, title: 'Nothing hidden', text: 'Model comparisons, calibration error and visual explanations are available—not just a single score.', link: 'See model performance', to: '/model' },
]

export default function Home() {
  const primary = metrics.models[0]

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="cell-grid absolute inset-y-0 right-0 -z-10 w-1/2 opacity-50 [mask-image:linear-gradient(to_left,black,transparent)]" />
        <div className="container-shell grid items-center gap-16 py-14 sm:py-20 lg:grid-cols-[1.02fr_.98fr] lg:gap-20 lg:py-24">
          <div className="animate-fade-up">
            <div className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-plum-500" /> Cervical cytology, made clearer</div>
            <h1 className="text-balance mt-5 max-w-[650px] font-serif text-[50px] font-medium leading-[1.01] tracking-[-0.045em] text-ink sm:text-[64px] lg:text-[68px]">Early cervical cell analysis, <em className="font-normal text-plum-700 dark:text-plum-300">in seconds.</em></h1>
            <p className="mt-6 max-w-[560px] text-[17px] leading-8 text-muted">Upload a Pap smear image to explore an explainable AI screening result—complete with confidence, visual context and clear next steps.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/analyse" className="btn-primary !px-6 !py-3.5">Analyse an image <ArrowRight size={18} /></Link>
              <Link to="/model" className="btn-secondary !px-6 !py-3.5">Explore the model <ArrowUpRight size={17} /></Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-muted">
              <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-teal-600 dark:text-teal-400" /> Free to try</span>
              <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-teal-600 dark:text-teal-400" /> No sign-up</span>
              <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-teal-600 dark:text-teal-400" /> {isBackendConnected ? 'Deleted after analysis' : 'Images not stored'}</span>
            </div>
          </div>
          <div className="pb-10 pt-2 sm:px-4 lg:px-0 lg:pb-0"><HeroVisual /></div>
        </div>
        <div className="container-shell">
          <div className="grid gap-4 border-y border-line py-5 text-xs font-semibold text-muted sm:grid-cols-3 sm:divide-x sm:divide-line">
            <div className="flex items-center gap-2.5 sm:justify-center"><ShieldCheck size={17} className="text-plum-600 dark:text-plum-300" /> Screening support, never a diagnosis</div>
            <div className="flex items-center gap-2.5 sm:justify-center"><Microscope size={17} className="text-plum-600 dark:text-plum-300" /> Designed for cervical cytology</div>
            <div className="flex items-center gap-2.5 sm:justify-center"><Sparkles size={17} className="text-plum-600 dark:text-plum-300" /> Academic project · PCSE28-040</div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="container-shell py-20 sm:py-28">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">From image to insight</span>
            <h2 className="section-title">Three steps. One clearer picture.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted sm:pb-1">A simple workflow that makes a complex model easier to understand and easier to question.</p>
        </div>
        <div className="relative mt-12 grid gap-5 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-12 hidden border-t border-dashed border-plum-200 dark:border-plum-800 md:block" />
          {steps.map((step, index) => (
            <Reveal as="article" key={step.number} delay={index * 90} className="card group relative p-7 transition duration-300 hover:-translate-y-1 hover:border-plum-200 dark:hover:border-plum-800 sm:p-8">
              <div className="relative flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-plum-100 text-plum-700 dark:bg-plum-900/60 dark:text-plum-300"><step.icon size={22} /></span>
                <span className="font-serif text-4xl text-plum-200 dark:text-plum-800">{step.number}</span>
              </div>
              <h3 className="mt-7 font-serif text-3xl font-medium">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{step.text}</p>
              <p className="mt-6 flex items-center gap-2 border-t border-line pt-5 text-xs font-bold text-plum-700 dark:text-plum-300"><Check size={14} /> {step.note}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-shell pb-20 sm:pb-28">
        <div className="relative overflow-hidden rounded-[28px] bg-plum-900 text-white">
          <div className="cell-grid absolute inset-0 opacity-20" />
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full border border-white/10" />
          <div className="relative grid lg:grid-cols-[.8fr_1.2fr]">
            <div className="flex flex-col justify-center border-b border-white/15 p-8 sm:p-12 lg:border-b-0 lg:border-r lg:p-14">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-plum-200">Why early detection matters</span>
              <div className="mt-8 flex items-end gap-3"><span className="font-serif text-[92px] leading-[.8] tracking-[-0.06em] text-plum-200">4th</span><ArrowUpRight className="mb-1 text-plum-300" size={28} /></div>
              <p className="mt-6 max-w-xs font-serif text-2xl leading-8">Cervical cancer is the fourth most common cancer in women globally.</p>
              <p className="mt-3 text-xs leading-6 text-plum-100/70">WHO estimated about 660,000 new cases and 350,000 deaths worldwide in 2022.</p>
              <a href="https://www.who.int/news-room/fact-sheets/detail/cervical-cancer" target="_blank" rel="noreferrer" className="mt-7 inline-flex w-fit items-center gap-1.5 text-xs font-bold text-plum-200 hover:text-white">Source: WHO fact sheet <ArrowUpRight size={14} /></a>
            </div>
            <div className="p-8 sm:p-12 lg:p-14">
              <Stethoscope className="text-plum-300" size={32} strokeWidth={1.5} />
              <h2 className="mt-6 max-w-lg font-serif text-4xl font-medium leading-[1.1] sm:text-5xl">Early attention can change the whole story.</h2>
              <p className="mt-6 max-w-xl text-[15px] leading-8 text-plum-100/75">Cervical cancer often develops slowly. Screening can find HPV infection or cell changes before they cause symptoms, creating an opportunity for timely monitoring and treatment.</p>
              <ul className="mt-7 grid gap-3 text-sm text-plum-50 sm:grid-cols-2">
                <li className="flex gap-2.5"><Check className="mt-0.5 shrink-0 text-plum-300" size={17} /> Screen even without symptoms</li>
                <li className="flex gap-2.5"><Check className="mt-0.5 shrink-0 text-plum-300" size={17} /> Follow local screening guidance</li>
                <li className="flex gap-2.5"><Check className="mt-0.5 shrink-0 text-plum-300" size={17} /> Discuss HPV vaccination</li>
                <li className="flex gap-2.5"><Check className="mt-0.5 shrink-0 text-plum-300" size={17} /> Act on abnormal test results</li>
              </ul>
              <Link to="/learn" className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-plum-900 transition hover:bg-plum-100">Understand screening <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface/55">
        <div className="container-shell py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
            <div>
              <span className="eyebrow">Measured beyond accuracy</span>
              <h2 className="mt-3 font-serif text-4xl font-medium tracking-[-0.025em]">Performance you can inspect.</h2>
              <p className="mt-4 text-sm leading-6 text-muted">A snapshot of the proposed ensemble on the held-out test split. Demonstration values, not clinical validation.</p>
              <Link to="/model" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-plum-700 hover:gap-3 dark:text-plum-300">View full model results <ArrowRight size={16} /></Link>
            </div>
            <Reveal delay={100}>
              <div className="grid grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-surface px-2 py-7 shadow-card sm:px-6">
                {[{ label: 'Sensitivity', value: primary.sensitivity, decimals: 1, suffix: '%' }, { label: 'Specificity', value: primary.specificity, decimals: 1, suffix: '%' }, { label: 'AUPRC', value: primary.auprc, decimals: 3, suffix: '' }].map((metric) => (
                  <div key={metric.label} className="px-2 text-center sm:px-5">
                    <p className="font-serif text-4xl font-medium tracking-[-0.04em] text-plum-800 dark:text-plum-200 sm:text-5xl"><CountUp value={metric.value} decimals={metric.decimals} suffix={metric.suffix} /></p>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted sm:text-xs">{metric.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[10px] leading-5 text-muted">Decision threshold 0.50 · held-out demonstration split (n = 565). Values are illustrative, not clinical validation.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-shell py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
          <div>
            <span className="eyebrow">Good questions, clear answers</span>
            <h2 className="section-title">A tool should earn your trust.</h2>
            <p className="section-copy">Understand what Cellora can do, what it cannot do, and how your data is treated.</p>
            <div className="mt-7 rounded-2xl bg-teal-50 p-5 dark:bg-teal-950/30">
              <ShieldCheck className="text-teal-700 dark:text-teal-300" size={24} />
              <p className="mt-3 text-sm font-bold text-teal-900 dark:text-teal-100">Your health deserves a human expert.</p>
              <p className="mt-2 text-xs leading-6 text-teal-800/80 dark:text-teal-100/70">Always discuss symptoms and screening results with a qualified doctor.</p>
            </div>
          </div>
          <FaqList />
        </div>
      </section>

      <section className="bg-surface-soft/60 py-20 sm:py-24">
        <div className="container-shell">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Transparency at every layer</span>
            <h2 className="section-title">Built to be open, not opaque.</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {trustItems(isBackendConnected).map((item, index) => (
              <Reveal as="article" key={item.title} delay={index * 80} className="card p-7">
                <item.icon size={25} className="text-plum-600 dark:text-plum-300" strokeWidth={1.7} />
                <h3 className="mt-5 font-serif text-2xl font-medium">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{item.text}</p>
                <Link to={item.to} className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-plum-700 hover:underline dark:text-plum-300">{item.link} <ChevronRight size={14} /></Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-20 sm:py-24">
        <Reveal className="relative overflow-hidden rounded-[28px] border border-plum-200 bg-plum-50 px-6 py-12 text-center dark:border-plum-800 dark:bg-plum-950/40 sm:px-12 sm:py-16">
          <div className="cell-grid absolute inset-0 opacity-50" />
          <div className="relative mx-auto max-w-2xl">
            <BookOpen className="mx-auto text-plum-600 dark:text-plum-300" size={28} strokeWidth={1.5} />
            <h2 className="mt-5 font-serif text-4xl font-medium leading-tight tracking-[-0.03em] sm:text-5xl">Curious what your image can reveal?</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted">Try a sample or upload your own cytology image. You’ll have an explainable screening result in moments.</p>
            <Link to="/analyse" className="btn-primary mt-7 !px-6 !py-3.5">Start an analysis <ArrowRight size={17} /></Link>
            <p className="mt-5 text-[11px] text-muted">AI screening aid · Not a medical diagnosis</p>
          </div>
        </Reveal>
      </section>
    </>
  )
}
