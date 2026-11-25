import { ArrowRight, BookOpen, Check, CircleHelp, Clock3, Dna, ExternalLink, HeartHandshake, Microscope, ShieldCheck, Stethoscope } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

const sections = [
  { id: 'cervical-cancer', label: 'Cervical cancer' },
  { id: 'hpv', label: 'Understanding HPV' },
  { id: 'pap-smear', label: 'The Pap smear' },
  { id: 'abnormal-cells', label: 'Abnormal cells' },
  { id: 'glossary', label: 'Report terms' },
  { id: 'next-conversation', label: 'Talking with a doctor' },
]

function SectionHeading({ icon: Icon, eyebrow, title }) {
  return <div><span className="eyebrow"><Icon size={14} />{eyebrow}</span><h2 className="mt-3 font-serif text-4xl font-medium tracking-[-0.025em]">{title}</h2></div>
}

export default function Learn() {
  return (
    <>
      <PageHeader eyebrow="A calm guide to cervical screening" title="Understand the cells. Understand the next step." description="A plain-language introduction to cervical cancer, HPV, Pap smears and abnormal results—without frightening jargon or false certainty.">
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted"><span className="inline-flex items-center gap-1.5"><Clock3 size={14} /> 5-minute read</span><span className="inline-flex items-center gap-1.5"><BookOpen size={14} /> General health education</span></div>
      </PageHeader>

      <div className="container-shell grid gap-12 py-12 sm:py-16 lg:grid-cols-[220px_1fr] lg:gap-20">
        <aside className="hidden lg:block">
          <nav className="sticky top-28 border-l border-line" aria-label="On this page">
            <p className="mb-4 pl-5 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">In this guide</p>
            {sections.map((section) => <a key={section.id} href={`#${section.id}`} className="block border-l-2 border-transparent py-2.5 pl-4 text-xs font-semibold text-muted transition hover:border-plum-500 hover:text-plum-700 dark:hover:text-plum-300">{section.label}</a>)}
            <div className="ml-5 mt-7 rounded-xl bg-teal-50 p-4 dark:bg-teal-950/30"><ShieldCheck size={20} className="text-teal-700 dark:text-teal-300" /><p className="mt-3 text-[11px] font-bold leading-5 text-teal-900 dark:text-teal-100">Screening is for people without symptoms, too.</p></div>
          </nav>
        </aside>

        <div className="max-w-[780px]">
          <section id="cervical-cancer" className="scroll-mt-28">
            <SectionHeading icon={Microscope} eyebrow="The basics" title="What is cervical cancer?" />
            <p className="mt-6 text-[15px] leading-8 text-muted">The cervix is the lower part of the uterus, connecting it to the vagina. Cervical cancer happens when cells in this area grow in an uncontrolled way. It usually develops slowly, often over years, and early cell changes may cause no noticeable symptoms.</p>
            <p className="mt-4 text-[15px] leading-8 text-muted">That quiet beginning is why screening matters. Finding and treating cell changes early can prevent some cervical cancers from developing. When cancer is found early, treatment also has a better chance of success.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[['Often slow', 'Cell changes can develop over many years.'], ['Often silent', 'Early changes may not cause symptoms.'], ['Often preventable', 'Vaccination, screening and follow-up save lives.']].map(([title, text], index) => <div key={title} className="rounded-xl border border-line bg-surface p-5"><span className="font-serif text-3xl text-plum-300 dark:text-plum-700">0{index + 1}</span><h3 className="mt-3 text-sm font-bold">{title}</h3><p className="mt-2 text-xs leading-6 text-muted">{text}</p></div>)}
            </div>
          </section>

          <section id="hpv" className="mt-16 scroll-mt-28 border-t border-line pt-14">
            <SectionHeading icon={Dna} eyebrow="The most common cause" title="HPV is common. Persistence matters." />
            <p className="mt-6 text-[15px] leading-8 text-muted">Human papillomavirus (HPV) is a very common group of viruses passed through intimate skin-to-skin contact, including sexual contact. Most people will encounter HPV at some point. In most cases, the immune system clears the infection without it causing problems.</p>
            <p className="mt-4 text-[15px] leading-8 text-muted">Some HPV types are called “high-risk” because a persistent infection can lead to changes in cervical cells. Having HPV is not the same as having cancer, and there is usually no way to know when or from whom it was acquired.</p>
            <div className="mt-7 rounded-2xl bg-plum-50 p-6 dark:bg-plum-950/30 sm:p-7">
              <h3 className="font-serif text-2xl font-medium">Protection has more than one layer.</h3>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-plum-100 text-plum-700 dark:bg-plum-900 dark:text-plum-300"><ShieldCheck size={16} /></span><div><h4 className="text-xs font-bold">HPV vaccination</h4><p className="mt-1.5 text-xs leading-6 text-muted">Helps protect against the HPV types that cause most cervical cancers. Ask a healthcare professional what is recommended for you.</p></div></div>
                <div className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-plum-100 text-plum-700 dark:bg-plum-900 dark:text-plum-300"><Microscope size={16} /></span><div><h4 className="text-xs font-bold">Regular screening</h4><p className="mt-1.5 text-xs leading-6 text-muted">Still important after vaccination, because no vaccine covers every cancer-causing HPV type.</p></div></div>
              </div>
            </div>
          </section>

          <section id="pap-smear" className="mt-16 scroll-mt-28 border-t border-line pt-14">
            <SectionHeading icon={BookOpen} eyebrow="What happens at screening" title="A Pap smear looks at the cells." />
            <p className="mt-6 text-[15px] leading-8 text-muted">During a Pap smear (also called a Pap test or cervical cytology), a healthcare professional gently collects a small sample of cells from the cervix. The sample goes to a laboratory, where the cells are examined under a microscope for changes.</p>
            <div className="mt-7 space-y-3">
              {[['Before', 'Follow the clinic’s instructions. Tell the professional if you are pregnant, anxious, or have questions about the procedure.'], ['During', 'A speculum helps the clinician see the cervix. The cell collection itself is brief; pressure or mild discomfort is possible.'], ['After', 'Ask when and how you will receive the result. A clear follow-up plan matters just as much as the sample itself.']].map(([title, text], index) => <div key={title} className="flex gap-4 rounded-xl border border-line bg-surface p-5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-plum-100 text-xs font-extrabold text-plum-700 dark:bg-plum-900 dark:text-plum-300">{index + 1}</span><div><h3 className="text-sm font-bold">{title}</h3><p className="mt-1.5 text-xs leading-6 text-muted">{text}</p></div></div>)}
            </div>
            <div className="mt-6 flex gap-3 rounded-xl border border-teal-200 bg-teal-50 p-5 text-xs leading-6 text-teal-900 dark:border-teal-900/60 dark:bg-teal-950/30 dark:text-teal-100"><CircleHelp className="mt-0.5 shrink-0" size={18} /><p><strong>Is a Pap test the same as an HPV test?</strong><br />No. A Pap test examines cell changes; an HPV test looks for high-risk HPV. Some screening programmes use one, the other, or both. Local recommendations vary by age and health history.</p></div>
          </section>

          <section id="abnormal-cells" className="mt-16 scroll-mt-28 border-t border-line pt-14">
            <SectionHeading icon={CircleHelp} eyebrow="Without the scary assumptions" title="What do abnormal cells mean?" />
            <p className="mt-6 text-[15px] leading-8 text-muted">“Abnormal” means some cells look different from what is typically expected. It is a reason for the right follow-up—not a statement that cancer is present. Infections, inflammation and HPV-related changes can all affect how cells appear.</p>
            <div className="mt-7 overflow-hidden rounded-2xl border border-line bg-surface">
              {[['Atypical or unclear changes', 'The difference is mild or uncertain. An HPV test or repeat cytology may help clarify what is happening.'], ['Low-grade changes', 'Often linked with HPV. Many mild changes resolve, but monitoring is important.'], ['High-grade changes', 'More significant cell changes need timely further assessment. High-grade does not automatically mean cancer.']].map(([title, text], index) => <div key={title} className="flex gap-4 border-b border-line p-5 last:border-0"><span className="mt-1 font-serif text-2xl text-plum-400 dark:text-plum-600">0{index + 1}</span><div><h3 className="text-sm font-bold">{title}</h3><p className="mt-1.5 text-xs leading-6 text-muted">{text}</p></div></div>)}
            </div>
            <p className="mt-5 text-sm leading-7 text-muted">The exact name on a laboratory report matters. A doctor will interpret it alongside your age, HPV result, screening history and local guidelines before recommending repeat testing, colposcopy or another next step.</p>
            <div className="notice mt-6"><Stethoscope className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300" size={18} /><p><strong>Do not wait for a routine screen if you have symptoms.</strong> Unusual bleeding, bleeding after sex, persistent unusual discharge or pelvic pain should be discussed with a healthcare professional.</p></div>
          </section>

          <section id="glossary" className="mt-16 scroll-mt-28 border-t border-line pt-14">
            <SectionHeading icon={BookOpen} eyebrow="Plain-language glossary" title="Terms you may see on a report." />
            <p className="mt-6 text-[15px] leading-8 text-muted">Laboratory wording and follow-up guidance differ between countries and clinics. These short descriptions are a starting point for a conversation, not a substitute for your own report or a clinician’s explanation.</p>
            <dl className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                ['ASC-US', 'Atypical squamous cells of undetermined significance: mildly unusual cells that need clarification, often with an HPV test or repeat cytology.'],
                ['LSIL', 'Low-grade squamous intraepithelial lesion: mild cell changes, commonly linked with HPV, that are usually monitored rather than treated immediately.'],
                ['HSIL', 'High-grade squamous intraepithelial lesion: more significant cell changes that need timely assessment, usually with colposcopy. It is not automatically cancer.'],
                ['Colposcopy', 'A closer examination of the cervix with a magnifying instrument. A small biopsy may be taken during the same visit.'],
                ['HPV test', 'A laboratory test that looks for high-risk types of human papillomavirus rather than cell changes.'],
                ['LEEP', 'Loop electrosurgical excision procedure: removes a small area of abnormal cervical tissue for examination and treatment.'],
              ].map(([term, detail]) => <div key={term} className="rounded-xl border border-line bg-surface p-5"><dt className="text-sm font-bold text-plum-800 dark:text-plum-200">{term}</dt><dd className="mt-1.5 text-xs leading-6 text-muted">{detail}</dd></div>)}
            </dl>
            <p className="mt-5 text-[11px] leading-5 text-muted">Cellora reports only “normal” or “abnormal” for a single image. It does not produce any of the categories above.</p>
          </section>

          <section id="next-conversation" className="mt-16 scroll-mt-28 border-t border-line pt-14">
            <SectionHeading icon={HeartHandshake} eyebrow="Feel prepared" title="A better conversation starts with a few questions." />
            <p className="mt-6 text-[15px] leading-8 text-muted">You deserve to understand your result and what happens next. Consider taking these questions to your appointment:</p>
            <ul className="mt-6 space-y-3">{['What exactly does my screening result mean?', 'Do I need an HPV test, repeat cytology or a colposcopy?', 'When should the next test happen, and who will contact me?', 'What symptoms should prompt an earlier appointment?', 'How does my HPV vaccination or screening history affect the plan?'].map((question) => <li key={question} className="flex gap-3 rounded-xl bg-surface-soft/60 p-4 text-sm font-semibold leading-6"><Check className="mt-1 shrink-0 text-teal-600 dark:text-teal-400" size={16} />{question}</li>)}</ul>
          </section>

          <section className="mt-16 rounded-[24px] bg-plum-950 p-7 text-white sm:p-9">
            <h2 className="font-serif text-3xl font-medium">Trusted places to keep learning.</h2>
            <p className="mt-3 text-sm leading-6 text-plum-100/70">General information is a starting point. Your own screening plan should come from a qualified professional.</p>
            <div className="mt-6 space-y-3">
              <a href="https://www.who.int/news-room/fact-sheets/detail/cervical-cancer" target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border border-white/15 p-4 text-xs font-bold transition hover:bg-white/10"><span>World Health Organization · Cervical cancer</span><ExternalLink size={15} /></a>
              <a href="https://www.cdc.gov/cervical-cancer/screening/index.html" target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border border-white/15 p-4 text-xs font-bold transition hover:bg-white/10"><span>CDC · Cervical cancer screening</span><ExternalLink size={15} /></a>
              <a href="https://www.nhs.uk/conditions/cervical-screening/" target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border border-white/15 p-4 text-xs font-bold transition hover:bg-white/10"><span>NHS · Cervical screening</span><ExternalLink size={15} /></a>
            </div>
          </section>

          <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl border border-plum-200 bg-plum-50 p-6 dark:border-plum-800 dark:bg-plum-950/30 sm:flex-row sm:items-center"><div><h2 className="font-serif text-2xl font-medium">See how Cellora reads an image.</h2><p className="mt-1.5 text-xs text-muted">Explore the model with one of six demo samples.</p></div><Link to="/analyse" className="btn-primary shrink-0">Try an analysis <ArrowRight size={16} /></Link></div>
        </div>
      </div>
    </>
  )
}
