const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '')
export const isBackendConnected = Boolean(API_URL)
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))

const samplePredictions = {
  '01': 0.09,
  '02': 0.22,
  '03': 0.85,
  '04': 0.14,
  '05': 0.72,
  '06': 0.9,
}

function hashText(text) {
  return [...text].reduce((hash, character) => ((hash << 5) - hash + character.charCodeAt(0)) | 0, 0)
}

function createHeatmap(seed, abnormal) {
  const shift = Math.abs(seed) % 16
  const primaryX = abnormal ? 61 + shift / 3 : 35 + shift / 2
  const primaryY = abnormal ? 37 + shift / 4 : 62 - shift / 3
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="768" height="768" viewBox="0 0 768 768">
    <defs>
      <radialGradient id="hot"><stop offset="0" stop-color="#c51f45" stop-opacity=".96"/><stop offset=".2" stop-color="#ee5338" stop-opacity=".86"/><stop offset=".43" stop-color="#ffad32" stop-opacity=".7"/><stop offset=".68" stop-color="#ffe66b" stop-opacity=".34"/><stop offset="1" stop-color="#fff59b" stop-opacity="0"/></radialGradient>
      <radialGradient id="warm"><stop offset="0" stop-color="#f07832" stop-opacity=".65"/><stop offset=".4" stop-color="#ffc843" stop-opacity=".42"/><stop offset="1" stop-color="#fff59b" stop-opacity="0"/></radialGradient>
      <filter id="soft"><feGaussianBlur stdDeviation="7"/></filter>
    </defs>
    <ellipse cx="${primaryX * 7.68}" cy="${primaryY * 7.68}" rx="${abnormal ? 150 : 110}" ry="${abnormal ? 140 : 105}" fill="url(#hot)" filter="url(#soft)"/>
    <ellipse cx="${abnormal ? 220 : 525}" cy="${abnormal ? 555 : 235}" rx="105" ry="95" fill="url(#warm)" filter="url(#soft)"/>
    <ellipse cx="${abnormal ? 530 : 185}" cy="${abnormal ? 170 : 480}" rx="75" ry="85" fill="url(#warm)" opacity=".55" filter="url(#soft)"/>
  </svg>`
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

function normaliseApiResult(data) {
  return {
    ...data,
    heatmapBase64: data.heatmapBase64?.startsWith('data:') ? data.heatmapBase64 : `data:image/png;base64,${data.heatmapBase64}`,
  }
}

/**
 * Analyse an image with the configured FastAPI endpoint, or use the local
 * deterministic demonstration model when VITE_API_URL is not configured.
 */
export async function predict(imageFile) {
  if (!imageFile) throw new Error('Choose an image before starting the analysis.')

  if (API_URL) {
    const formData = new FormData()
    formData.append('file', imageFile)
    const response = await fetch(`${API_URL}/predict`, { method: 'POST', body: formData })
    if (!response.ok) throw new Error(`The analysis service returned ${response.status}. Please try again.`)
    return normaliseApiResult(await response.json())
  }

  await wait(2600)
  const sampleId = imageFile.name.match(/cellora-sample-(\d{2})/)?.[1]
  const seed = hashText(`${imageFile.name}-${imageFile.size}`)
  const rawProbability = sampleId
    ? samplePredictions[sampleId]
    : 0.08 + (Math.abs(seed) % 86) / 100
  const calibratedProbability = sampleId
    ? samplePredictions[sampleId]
    : Math.min(0.96, Math.max(0.04, rawProbability * 0.94 + 0.025))

  return {
    label: calibratedProbability >= 0.5 ? 'Abnormal' : 'Normal',
    probability: Number(rawProbability.toFixed(4)),
    calibratedProbability: Number(calibratedProbability.toFixed(4)),
    uncertainty: Number((0.025 + (1 - Math.abs(calibratedProbability - 0.5) * 2) * 0.16).toFixed(4)),
    heatmapBase64: createHeatmap(seed, calibratedProbability >= 0.5),
    threshold: 0.5,
  }
}

export function getConfidence(result) {
  const value = result.label === 'Abnormal'
    ? result.calibratedProbability
    : 1 - result.calibratedProbability
  const percentage = Math.round(value * 100)
  const level = percentage >= 85 ? 'High' : percentage >= 65 ? 'Medium' : 'Low'
  return { value, percentage, level }
}
