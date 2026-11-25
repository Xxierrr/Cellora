export const SAMPLE_IMAGE_URL = '/images/cytology-hero.png'

export const samples = [
  { id: '01', name: 'Sample 01', detail: 'Epithelial cells', crop: { x: 40, y: 40, width: 700, height: 700 } },
  { id: '02', name: 'Sample 02', detail: 'Nucleus detail', crop: { x: 690, y: 40, width: 690, height: 690 } },
  { id: '03', name: 'Sample 03', detail: 'Cell cluster', crop: { x: 370, y: 230, width: 720, height: 720 } },
  { id: '04', name: 'Sample 04', detail: 'Cytoplasm', crop: { x: 60, y: 300, width: 640, height: 640 } },
  { id: '05', name: 'Sample 05', detail: 'Mixed cells', crop: { x: 820, y: 300, width: 610, height: 610 } },
  { id: '06', name: 'Sample 06', detail: 'Nuclear region', crop: { x: 480, y: 40, width: 650, height: 650 } },
]

export async function createSampleFile(sample) {
  const response = await fetch(SAMPLE_IMAGE_URL)
  if (!response.ok) throw new Error('The sample image could not be loaded. Please try again.')
  const blob = await response.blob()
  const bitmap = await createImageBitmap(blob)
  const canvas = document.createElement('canvas')
  canvas.width = 768
  canvas.height = 768
  const context = canvas.getContext('2d')
  context.drawImage(bitmap, sample.crop.x, sample.crop.y, sample.crop.width, sample.crop.height, 0, 0, 768, 768)
  bitmap.close()

  const croppedBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 0.92))
  if (!croppedBlob) throw new Error('The sample image could not be prepared. Please try another sample.')
  return new File([croppedBlob], `cellora-sample-${sample.id}.png`, { type: 'image/png' })
}
