import { ArrowUpRight, BarChart3, Check, Database, FlaskConical, Info, Scale, ShieldAlert, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import PageHeader from '../components/PageHeader'
import CountUp from '../components/CountUp'
import Reveal from '../components/Reveal'
import metrics from '../data/metrics.json'

const tooltipStyle = {
  backgroundColor: 'rgb(var(--surface))',
  border: '1px solid rgb(var(--line))',
  borderRadius: '12px',
  color: 'rgb(var(--ink))',
  fontSize: '11px',
  boxShadow: '0 12px 30px -18px rgba(0,0,0,.35)',
}

function CurveChart({ type }) {
  const roc = type === 'roc'
  const data = roc ? metrics.roc : metrics.pr
  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div><h3 className="font-serif text-2xl font-medium">{roc ? 'ROC curve' : 'Precision–recall curve'}</h3><p className="mt-1 text-xs leading-5 text-muted">{roc ? 'True positive rate across classification thresholds.' : 'Precision and recall for the abnormal cell class.'}</p></div>
        <span className="rounded-lg bg-plum-50 px-2.5 py-1.5 text-[10px] font-bold text-plum-700 dark:bg-plum-950/50 dark:text-plum-300">{roc ? 'AUROC' : 'AUPRC'} {roc ? metrics.models[0].auroc : metrics.models[0].auprc}</span>
      </div>
      <div className="mt-5 h-[280px] w-full" role="img" aria-label={`${roc ? 'Receiver operating characteristic' : 'Precision recall'} chart comparing Cellora Ensemble with ResNet-50 and a random baseline`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 12, left: -12, bottom: 8 }}>
            <CartesianGrid stroke="rgb(var(--line))" strokeDasharray="3 4" vertical={false} />
            <XAxis dataKey={roc ? 'fpr' : 'recall'} type="number" domain={[0, 1]} ticks={[0, .2, .4, .6, .8, 1]} tickFormatter={(value) => value.toFixed(1)} axisLine={{ stroke: 'rgb(var(--line))' }} tickLine={false} label={{ value: roc ? 'False positive rate' : 'Recall', position: 'insideBottom', offset: -5, fill: 'rgb(var(--muted))', fontSize: 10 }} />
            <YAxis domain={[0, 1]} ticks={[0, .2, .4, .6, .8, 1]} tickFormatter={(value) => value.toFixed(1)} axisLine={false} tickLine={false} label={{ value: roc ? 'True positive rate' : 'Precision', angle: -90, position: 'insideLeft', fill: 'rgb(var(--muted))', fontSize: 10 }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [Number(value).toFixed(3), name]} labelFormatter={(value) => `${roc ? 'False positive rate' : 'Recall'}: ${Number(value).toFixed(2)}`} />
            <Legend iconType="plainline" wrapperStyle={{ fontSize: '10px', paddingTop: '16px' }} />
            <Line name="Cellora Ensemble" type="monotone" dataKey="ensemble" stroke="#82405f" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
            <Line name="ResNet-50" type="monotone" dataKey="resnet" stroke="#2d8a7d" strokeWidth={1.8} dot={false} />
            <Line name={roc ? 'Random baseline' : 'Prevalence baseline'} type="linear" dataKey="baseline" stroke="#aaa0a6" strokeWidth={1.3} strokeDasharray="5 5" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function ConfusionMatrix() {
  const { values, labels } = metrics.confusionMatrix
  const descriptions = [['True negatives', 'False positives'], ['False negatives', 'True positives']]
  return (
    <div className="card p-6 sm:p-7">
      <span className="eyebrow">At the 0.50 threshold</span>
      <h3 className="mt-3 font-serif text-3xl font-medium">Confusion matrix</h3>
      <p className="mt-2 text-xs leading-5 text-muted">Held-out demonstration set · 565 images</p>
      <div className="mx-auto mt-8 max-w-md">
        <div className="mb-2 grid grid-cols-[80px_1fr_1fr] gap-2 text-center text-[10px] font-bold uppercase tracking-wider text-muted"><span />{labels.map((label) => <span key={label}>Predicted {label.toLowerCase()}</span>)}</div>
        {values.map((row, rowIndex) => (
          <div key={labels[rowIndex]} className="mb-2 grid grid-cols-[80px_1fr_1fr] items-center gap-2">
            <span className="pr-2 text-right text-[10px] font-bold uppercase leading-4 tracking-wider text-muted">Actual {labels[rowIndex].toLowerCase()}</span>
            {row.map((value, columnIndex) => {
              const correct = rowIndex === columnIndex
              return <div key={columnIndex} className={`flex aspect-[1.5/1] flex-col items-center justify-center rounded-xl border ${correct ? 'border-plum-200 bg-plum-100 text-plum-900 dark:border-plum-800 dark:bg-plum-900/60 dark:text-plum-100' : 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100'}`}><span className="font-serif text-3xl font-medium">{value}</span><span className="mt-1 text-[9px] font-bold">{descriptions[rowIndex][columnIndex]}</span></div>
            })}
          </div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-line pt-5 text-center"><div><p className="text-xs text-muted">Correctly classified</p><p className="mt-1 text-sm font-extrabold">528 of 565</p></div><div><p className="text-xs text-muted">Overall accuracy</p><p className="mt-1 text-sm font-extrabold">93.5%</p></div></div>
    </div>
  )
}

export default function Model() {
  const primary = metrics.models[0]
  return (
    <>
      <PageHeader eyebrow="Research transparency" title="The model, with its workings showing." description="Compare architectures, inspect discrimination and calibration, and understand the data and limitations behind Cellora’s screening outputs.">
        <div className="flex flex-wrap gap-3 text-xs font-semibold text-muted"><span className="inline-flex items-center gap-1.5"><FlaskConical size={14} className="text-plum-500" /> Academic prototype</span><span className="inline-flex items-center gap-1.5"><BarChart3 size={14} className="text-plum-500" /> Held-out test split</span><span>Updated {metrics.lastUpdated}</span></div>
      </PageHeader>

      <div className="container-shell py-10 sm:py-14">
        <div className="notice mb-8"><Info className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300" size={18} /><p><strong className="font-bold">Demonstration results.</strong> {metrics.evaluationNote}</p></div>

        <section aria-labelledby="overview-heading">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><span className="eyebrow"><Sparkles size={14} /> Proposed architecture</span><div className="mt-3 flex flex-wrap items-center gap-3"><h2 id="overview-heading" className="font-serif text-4xl font-medium">Cellora Ensemble</h2><span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">Illustrative data</span></div></div><span className="text-xs text-muted">ResNet-50 + DenseNet-121 · Temperature calibrated</span></div>
          <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'Sensitivity', value: primary.sensitivity, decimals: 1, suffix: '%', note: 'Abnormal cells correctly identified' },
              { label: 'Specificity', value: primary.specificity, decimals: 1, suffix: '%', note: 'Normal cells correctly identified' },
              { label: 'AUROC', value: primary.auroc, decimals: 3, suffix: '', note: 'Ranking across all thresholds' },
              { label: 'Calibration error', value: primary.ece, decimals: 1, suffix: '%', note: 'Expected error · lower is better' },
            ].map((metric, index) => (
              <Reveal key={metric.label} delay={index * 70} className="card p-5 sm:p-6">
                <p className="data-label">{metric.label}</p>
                <p className="mt-3 font-serif text-4xl font-medium tracking-[-0.04em] text-plum-800 dark:text-plum-200 sm:text-5xl"><CountUp value={metric.value} decimals={metric.decimals} suffix={metric.suffix} /></p>
                <p className="mt-3 text-[10px] leading-5 text-muted">{metric.note}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="comparison-heading">
          <div className="flex items-end justify-between gap-4"><div><span className="eyebrow">Architecture comparison</span><h2 id="comparison-heading" className="mt-3 font-serif text-3xl font-medium sm:text-4xl">More than a single accuracy score.</h2></div><span className="hidden text-xs text-muted sm:block">Best proposed result highlighted</span></div>
          <div className="card relative mt-7 overflow-hidden">
            <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Scrollable table comparing model performance metrics">
            <table className="w-full min-w-[780px] border-collapse text-left">
              <caption className="sr-only">Performance metrics for Cellora Ensemble and four baseline models</caption>
              <thead><tr className="border-b border-line bg-surface-soft/55"><th scope="col" className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Model</th>{['Sensitivity', 'Specificity', 'AUROC', 'AUPRC', 'ECE ↓'].map((heading) => <th scope="col" key={heading} className="px-4 py-4 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{heading}</th>)}</tr></thead>
              <tbody className="divide-y divide-line">
                {metrics.models.map((model) => <tr key={model.name} className={model.type === 'Proposed' ? 'bg-plum-50/70 dark:bg-plum-950/30' : 'hover:bg-surface-soft/30'}><th scope="row" className="px-6 py-5"><span className="flex items-center gap-2 text-sm font-bold">{model.name}{model.type === 'Proposed' && <span className="rounded-full bg-plum-100 px-2 py-0.5 text-[9px] uppercase tracking-wider text-plum-700 dark:bg-plum-900 dark:text-plum-200">Proposed</span>}</span><span className="mt-1 block text-[10px] font-normal text-muted">{model.type === 'Proposed' ? 'Weighted feature ensemble' : 'Comparison model'}</span></th><td className="px-4 py-5 text-right text-sm font-semibold">{model.sensitivity.toFixed(1)}%</td><td className="px-4 py-5 text-right text-sm font-semibold">{model.specificity.toFixed(1)}%</td><td className="px-4 py-5 text-right text-sm font-semibold">{model.auroc.toFixed(3)}</td><td className="px-4 py-5 text-right text-sm font-semibold">{model.auprc.toFixed(3)}</td><td className="px-4 py-5 text-right text-sm font-semibold">{model.ece.toFixed(1)}%</td></tr>)}
              </tbody>
            </table>
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-surface to-transparent lg:hidden" aria-hidden="true" />
          </div>
          <p className="mt-3 text-[11px] leading-5 text-muted">Sensitivity and specificity are reported at a 0.50 decision threshold. ECE is expected calibration error; lower values indicate better agreement between confidence and observed accuracy.</p>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[['Sensitivity', 'Of the abnormal images, the share the model flagged.'], ['Specificity', 'Of the normal images, the share the model correctly cleared.'], ['AUROC', 'How well the model ranks abnormal above normal across every threshold.'], ['AUPRC', 'Precision–recall balance for the abnormal class, useful when classes are uneven.'], ['ECE', 'Expected calibration error: how far confidence drifts from observed accuracy.']].map(([term, detail]) => <div key={term} className="rounded-xl bg-surface-soft/60 p-4"><dt className="text-[11px] font-bold">{term}</dt><dd className="mt-1 text-[10px] leading-5 text-muted">{detail}</dd></div>)}
          </dl>
        </section>

        <section className="mt-14" aria-labelledby="curves-heading">
          <span className="eyebrow">Threshold behaviour</span><h2 id="curves-heading" className="mt-3 font-serif text-3xl font-medium sm:text-4xl">Performance across the full curve.</h2>
          <div className="mt-7 grid gap-5 lg:grid-cols-2"><CurveChart type="roc" /><CurveChart type="pr" /></div>
        </section>

        <section className="mt-14 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <ConfusionMatrix />
          <div className="card p-6 sm:p-7">
            <span className="eyebrow"><Scale size={14} /> Reading the trade-offs</span>
            <h3 className="mt-3 font-serif text-3xl font-medium">Why sensitivity leads.</h3>
            <p className="mt-4 text-sm leading-7 text-muted">In screening, missing an abnormal cell can matter more than flagging a normal cell for review. The operating point therefore prioritises sensitivity while tracking the false-positive burden.</p>
            <div className="mt-6 space-y-4">
              {[['13 missed abnormal images', 'These false negatives show why a normal-looking AI result cannot rule out disease.'], ['24 normal images flagged', 'These false positives would need expert review, not a cancer assumption.'], ['2.8% calibration error', 'Confidence is adjusted on validation data to better match observed performance.']].map(([title, text]) => <div key={title} className="rounded-xl bg-surface-soft/65 p-4"><p className="text-xs font-bold">{title}</p><p className="mt-1.5 text-[11px] leading-5 text-muted">{text}</p></div>)}
            </div>
            <p className="mt-5 text-[10px] leading-5 text-muted">Counts and interpretations shown here belong to the illustrative metrics above, not a clinically validated study.</p>
          </div>
        </section>

        <section className="mt-14 rounded-[28px] bg-plum-950 p-7 text-white sm:p-10" aria-labelledby="data-heading">
          <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
            <div><span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-plum-300"><Database size={15} /> Training & evaluation</span><h2 id="data-heading" className="mt-4 font-serif text-4xl font-medium leading-tight">Clear splits. No quiet shortcuts.</h2><p className="mt-5 text-sm leading-7 text-plum-100/70">The proposed workflow uses SIPaKMeD cervical cytology images with preprocessing and augmentation fitted only on the training partition. The held-out test set remains untouched during model and calibration choices.</p><Link to="/about#dataset" className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-plum-200 hover:text-white">Dataset & licence details <ArrowUpRight size={14} /></Link></div>
            <div>
              <div className="flex h-4 overflow-hidden rounded-full bg-white/10">{metrics.splits.map((split) => <div key={split.name} style={{ width: `${split.value}%`, backgroundColor: split.color }} className="h-full border-r border-plum-950 last:border-0" />)}</div>
              <div className="mt-6 grid grid-cols-3 gap-3">{metrics.splits.map((split) => <div key={split.name} className="rounded-xl border border-white/10 bg-white/5 p-4"><span className="flex items-center gap-2 text-[10px] font-bold text-plum-100"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: split.color }} />{split.name}</span><p className="mt-3 font-serif text-3xl">{split.value}%</p><p className="mt-1 text-[10px] text-plum-100/55">{split.images.toLocaleString()} images</p></div>)}</div>
              <div className="mt-6 space-y-3">{['Normalisation statistics come from training images only.', 'Calibration is fitted on validation data, never on test labels.', 'Patient-level grouped separation is required where identifiers exist.'].map((text) => <p key={text} className="flex gap-2.5 text-xs leading-6 text-plum-100/75"><Check size={15} className="mt-1 shrink-0 text-teal-300" />{text}</p>)}</div>
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
          <div><span className="eyebrow"><ShieldAlert size={14} /> Known limitations</span><h2 className="section-title !text-4xl">Where the model can fall short.</h2><p className="section-copy !text-sm">Responsible use starts with knowing when not to trust an output.</p></div>
          <div className="grid gap-4 sm:grid-cols-2">{[['Dataset shift', 'Stains, microscopes and preparation methods differ between laboratories. Performance may drop on images unlike the public training data.'], ['Image quality', 'Blur, overlapping cells, poor lighting and cropping can obscure the features the model relies on.'], ['Binary simplification', 'Normal versus abnormal does not capture the clinical range of cytology categories or the cause of a cell change.'], ['Not clinical validation', 'Public-data evaluation cannot establish safety or effectiveness for real patients, prospective care or diagnostic use.']].map(([title, text]) => <article key={title} className="card p-5"><h3 className="text-sm font-bold">{title}</h3><p className="mt-2 text-xs leading-6 text-muted">{text}</p></article>)}</div>
        </section>
      </div>
    </>
  )
}
