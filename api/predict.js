import Busboy from 'busboy'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const GROQ_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct'

function parseMultipartImage(req) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers['content-type'] || ''
    if (!contentType.includes('multipart/form-data')) {
      reject(Object.assign(new Error('Expected multipart/form-data with an image file.'), { status: 400 }))
      return
    }

    const busboy = Busboy({
      headers: req.headers,
      limits: { fileSize: MAX_FILE_SIZE, files: 1 },
    })

    let fileBuffer = null
    let mimeType = ''
    let truncated = false

    busboy.on('file', (fieldname, stream, info) => {
      if (fieldname !== 'file') {
        stream.resume()
        return
      }
      mimeType = info.mimeType || ''
      const chunks = []
      stream.on('data', (chunk) => chunks.push(chunk))
      stream.on('limit', () => {
        truncated = true
      })
      stream.on('end', () => {
        fileBuffer = Buffer.concat(chunks)
      })
    })

    busboy.on('error', (error) => reject(Object.assign(error, { status: 400 })))
    busboy.on('finish', () => {
      if (truncated) {
        reject(Object.assign(new Error('Image exceeds the 10 MB size limit.'), { status: 413 }))
        return
      }
      if (!fileBuffer || fileBuffer.length === 0) {
        reject(Object.assign(new Error('No image file was received.'), { status: 400 }))
        return
      }
      if (!ALLOWED_MIME_TYPES.has(mimeType)) {
        reject(Object.assign(new Error('Unsupported file type. Use JPG, PNG, or WebP.'), { status: 400 }))
        return
      }
      resolve({ buffer: fileBuffer, mimeType })
    })

    req.pipe(busboy)
  })
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || 0))
}

function buildHeatmapSvg(focusRegions, abnormal) {
  const regions = Array.isArray(focusRegions) && focusRegions.length > 0
    ? focusRegions.slice(0, 4)
    : [{ x: 50, y: 50, radius: 22, intensity: abnormal ? 0.9 : 0.65 }]

  const ellipses = regions
    .map((region, index) => {
      const cx = clamp(region.x, 8, 92) * 7.68
      const cy = clamp(region.y, 8, 92) * 7.68
      const r = clamp(region.radius, 10, 36) * 7.68
      const opacity = clamp(region.intensity, 0.35, 1)
      const grad = index === 0 ? 'hot' : 'warm'
      return `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${r.toFixed(1)}" ry="${(r * 0.93).toFixed(1)}" fill="url(#${grad})" opacity="${opacity.toFixed(2)}" filter="url(#soft)"/>`
    })
    .join('\n    ')

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="768" height="768" viewBox="0 0 768 768">
    <defs>
      <radialGradient id="hot"><stop offset="0" stop-color="#c51f45" stop-opacity=".96"/><stop offset=".22" stop-color="#ee5338" stop-opacity=".86"/><stop offset=".45" stop-color="#ffad32" stop-opacity=".7"/><stop offset=".7" stop-color="#ffe66b" stop-opacity=".34"/><stop offset="1" stop-color="#fff59b" stop-opacity="0"/></radialGradient>
      <radialGradient id="warm"><stop offset="0" stop-color="#f07832" stop-opacity=".7"/><stop offset=".42" stop-color="#ffc843" stop-opacity=".42"/><stop offset="1" stop-color="#fff59b" stop-opacity="0"/></radialGradient>
      <filter id="soft"><feGaussianBlur stdDeviation="8"/></filter>
    </defs>
    ${ellipses}
  </svg>`

  return `data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`
}

function parseJsonResponse(rawText) {
  const cleaned = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
  return JSON.parse(cleaned)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return res.status(503).json({
      error: 'GROQ_API_KEY is not configured. Add it in Vercel Environment Variables to enable live image analysis.',
    })
  }

  let parsed
  try {
    parsed = await parseMultipartImage(req)
  } catch (error) {
    return res.status(error.status || 400).json({ error: error.message })
  }

  const prompt = [
    'You are an educational cervical cytology screening-aid analyzer (not a medical diagnosis).',
    'Carefully examine the provided microscopic cervical cell / Pap smear image.',
    'Assess whether cellular features appear Normal or Abnormal (e.g., enlarged or irregular nuclei, hyperchromasia, high nucleus-to-cytoplasm ratio, nuclear pleomorphism, or atypical clusters).',
    'If the image is not clearly a cytology/microscopy image, still evaluate what is visible and reflect lower confidence via uncertainty.',
    'Return ONLY a single JSON object with these exact keys:',
    '- "label": "Normal" or "Abnormal"',
    '- "probability": number from 0.01 to 0.99 (raw abnormal likelihood)',
    '- "calibratedProbability": number from 0.01 to 0.99 (calibrated abnormal likelihood; >= 0.50 means Abnormal, < 0.50 means Normal)',
    '- "uncertainty": number from 0.02 to 0.45',
    '- "reasoning": concise 1-2 sentence visual observation of the cellular and nuclear features seen in this image',
    '- "focusRegions": array of 1 to 3 objects, each with { "x": number 0-100, "y": number 0-100, "radius": number 10-32, "intensity": number 0.4-1.0 } marking the key cell/nucleus regions from top-left.',
  ].join(' ')

  const dataUrl = `data:${parsed.mimeType};base64,${parsed.buffer.toString('base64')}`

  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.1,
        max_tokens: 512,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: dataUrl } },
            ],
          },
        ],
      }),
    })

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text()
      return res.status(502).json({
        error: `Vision analysis service returned ${groqResponse.status}.`,
        detail: errorText.slice(0, 300),
      })
    }

    const groqData = await groqResponse.json()
    const rawText = groqData?.choices?.[0]?.message?.content
    if (!rawText) {
      return res.status(502).json({ error: 'The analysis service returned an empty response.' })
    }

    const analysis = parseJsonResponse(rawText)
    const threshold = 0.5
    const probability = Number(clamp(analysis.probability, 0.01, 0.99).toFixed(4))
    const calibratedProbability = Number(clamp(analysis.calibratedProbability, 0.01, 0.99).toFixed(4))
    const uncertainty = Number(clamp(analysis.uncertainty, 0.01, 0.5).toFixed(4))
    const label = calibratedProbability >= threshold ? 'Abnormal' : 'Normal'
    const focusRegions = Array.isArray(analysis.focusRegions) ? analysis.focusRegions.slice(0, 4) : []

    return res.status(200).json({
      label,
      probability,
      calibratedProbability,
      uncertainty,
      threshold,
      focusRegions,
      reasoning: typeof analysis.reasoning === 'string' ? analysis.reasoning : '',
      heatmapBase64: buildHeatmapSvg(focusRegions, label === 'Abnormal'),
    })
  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Failed to analyse the image.',
    })
  }
}
