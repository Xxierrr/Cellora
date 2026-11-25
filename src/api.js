const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '')
const PREDICT_ENDPOINT = API_URL ? `${API_URL}/predict` : '/api/predict'
export const isBackendConnected = true

function normaliseApiResult(data) {
  return {
    ...data,
    heatmapBase64: data.heatmapBase64?.startsWith('data:')
      ? data.heatmapBase64
      : `data:image/png;base64,${data.heatmapBase64}`,
  }
}

/**
 * Analyse an image with the configured FastAPI endpoint (VITE_API_URL)
 * or the built-in Vercel serverless endpoint (/api/predict).
 */
export async function predict(imageFile) {
  if (!imageFile) throw new Error('Choose an image before starting the analysis.')

  const formData = new FormData()
  formData.append('file', imageFile)

  const response = await fetch(PREDICT_ENDPOINT, { method: 'POST', body: formData })
  if (!response.ok) {
    let message = `The analysis service returned ${response.status}. Please try again.`
    try {
      const errorData = await response.json()
      if (errorData?.error) message = errorData.error
    } catch {
      // Ignore non-JSON error bodies
    }
    throw new Error(message)
  }

  return normaliseApiResult(await response.json())
}

export function getConfidence(result) {
  const value = result.label === 'Abnormal'
    ? result.calibratedProbability
    : 1 - result.calibratedProbability
  const percentage = Math.round(value * 100)
  const level = percentage >= 85 ? 'High' : percentage >= 65 ? 'Medium' : 'Low'
  return { value, percentage, level }
}
