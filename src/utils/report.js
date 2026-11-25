const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297
const MARGIN = 18
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

function loadImage(source) {
  return new Promise((resolve) => {
    if (!source) {
      resolve(null)
      return
    }
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = source
  })
}

/**
 * Composites the uploaded image and the Grad-CAM layer into one square JPEG so
 * the downloaded report shows the same visual explanation as the results page.
 */
async function buildOverlay(originalSource, heatmapSource) {
  const [original, heatmap] = await Promise.all([loadImage(originalSource), loadImage(heatmapSource)])
  if (!original) return null

  const size = 640
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (!context) return null

  const scale = Math.max(size / original.width, size / original.height)
  const width = original.width * scale
  const height = original.height * scale
  context.drawImage(original, (size - width) / 2, (size - height) / 2, width, height)

  if (heatmap) {
    context.globalAlpha = 0.72
    context.drawImage(heatmap, 0, 0, size, size)
    context.globalAlpha = 1
  }

  return canvas.toDataURL('image/jpeg', 0.88)
}

export async function downloadPdfReport({ file, result, confidence, imageUrl }) {
  // Loaded on demand so the PDF library stays out of the initial bundle.
  const { jsPDF } = await import('jspdf')
  let overlay = null
  try {
    overlay = await buildOverlay(imageUrl, result.heatmapBase64)
  } catch (error) {
    overlay = null
  }

  const doc = new jsPDF()
  const date = new Date().toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })
  const finding = result.label === 'Abnormal' ? 'Abnormal cells detected' : 'No abnormal cells detected'
  const normal = result.label === 'Normal'
  const plum = [103, 50, 76]
  const muted = [100, 91, 97]

  doc.setFillColor(...plum)
  doc.rect(0, 0, PAGE_WIDTH, 38, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('times', 'bold')
  doc.setFontSize(25)
  doc.text('Cellora', MARGIN, 21)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('CERVICAL CELL ANALYSIS  /  AI SCREENING AID', MARGIN, 29)

  doc.setTextColor(40, 34, 38)
  doc.setFont('times', 'bold')
  doc.setFontSize(21)
  doc.text('Screening analysis report', MARGIN, 56)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...muted)
  doc.text(`Generated ${date}`, MARGIN, 64)
  doc.text('Project PCSE28-040  |  Demonstration report', MARGIN, 70)

  doc.setDrawColor(224, 216, 220)
  doc.line(MARGIN, 78, PAGE_WIDTH - MARGIN, 78)

  doc.setTextColor(...muted)
  doc.setFontSize(8)
  doc.text('IMAGE', MARGIN, 88)
  if (overlay) {
    doc.text('GRAD-CAM OVERLAY', 146, 84)
    doc.addImage(overlay, 'JPEG', 146, 88, 46, 46)
  }

  doc.setTextColor(40, 34, 38)
  doc.setFontSize(10)
  const nameLines = doc.splitTextToSize(file.name, overlay ? 120 : 172)
  doc.text(nameLines, MARGIN, 95)
  let cursor = Math.max(95 + nameLines.length * 4.6, overlay ? 140 : 104)

  doc.setFillColor(normal ? 237 : 254, normal ? 249 : 242, normal ? 246 : 242)
  doc.roundedRect(MARGIN, cursor, CONTENT_WIDTH, 40, 3, 3, 'F')
  doc.setTextColor(normal ? 35 : 153, normal ? 110 : 27, normal ? 101 : 27)
  doc.setFontSize(8)
  doc.text('SCREENING RESULT', 26, cursor + 11)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text(finding, 26, cursor + 23)
  doc.setFontSize(10)
  doc.text(`${confidence.percentage}% calibrated confidence  |  ${confidence.level} confidence`, 26, cursor + 33)
  cursor += 48

  doc.setTextColor(40, 34, 38)
  doc.setFont('times', 'bold')
  doc.setFontSize(15)
  doc.text('What this means', MARGIN, cursor)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(...muted)
  const explanation = normal
    ? 'The model did not identify patterns associated with abnormal cervical cells in this image. This does not rule out disease and should not replace routine screening or clinical review.'
    : 'The model identified patterns associated with abnormal cervical cells in this image. This is not a cancer diagnosis. A qualified doctor should review the finding and advise whether further testing is needed.'
  let explanationLines = doc.splitTextToSize(explanation, CONTENT_WIDTH)
  doc.text(explanationLines, MARGIN, cursor + 8)
  cursor += 12 + explanationLines.length * 4.4

  doc.setTextColor(40, 34, 38)
  doc.setFont('times', 'bold')
  doc.setFontSize(15)
  doc.text('Recommended next steps', MARGIN, cursor)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(...muted)
  const steps = normal
    ? '1. Keep your routine screening schedule; this result is not a reason to skip your next test.\n2. Unusual bleeding, discharge or pain should be checked regardless of an AI result.\n3. Share this report with a clinician if you have any concerns.'
    : '1. Talk with a qualified doctor and bring your original Pap smear report.\n2. Ask whether an HPV test, repeat cytology or a colposcopy is appropriate for you.\n3. Remember that abnormal-looking cells have many causes and this is not a diagnosis.'
  let stepLines = doc.splitTextToSize(steps, CONTENT_WIDTH - 6)
  doc.text(stepLines, MARGIN + 4, cursor + 8)
  cursor += 12 + stepLines.length * 4.4

  const noticeLines = doc.splitTextToSize('Cellora is an AI-based screening aid built on public data. It does not provide a medical diagnosis. Please consult a qualified doctor for any health concern.', CONTENT_WIDTH - 12)
  const noticeHeight = noticeLines.length * 4 + 12
  if (cursor + noticeHeight + 10 > PAGE_HEIGHT - 12) {
    doc.addPage()
    cursor = 24
  }

  doc.setFillColor(255, 248, 230)
  doc.roundedRect(MARGIN, cursor, CONTENT_WIDTH, noticeHeight, 2, 2, 'F')
  doc.setTextColor(108, 75, 20)
  doc.setFontSize(8)
  doc.text(noticeLines, MARGIN + 6, cursor + 8)

  doc.setFontSize(7)
  doc.setTextColor(...muted)
  doc.text(`Decision threshold: ${result.threshold}  |  Uncertainty estimate: ${(result.uncertainty * 100).toFixed(1)}%  |  Demonstration model`, MARGIN, cursor + noticeHeight + 7)

  doc.save(`cellora-report-${new Date().toISOString().slice(0, 10)}.pdf`)
}
