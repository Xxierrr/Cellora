# Cellora

Cellora is a polished, responsive cervical cytology screening-aid prototype built for B.Tech Major Project **PCSE28-040**. It combines an explainable analysis workflow, responsible health language, model evaluation views, general screening education, and transparent dataset/privacy notes.

> Cellora is an AI-based screening aid built on public data. It does not provide a medical diagnosis. Please consult a qualified doctor for any health concern.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Vite serves the app at `http://localhost:7734` by default.

```bash
npm run build    # Production output in dist/
npm run preview  # Preview the production build
```

## What is included

- Landing page with a cytology/Grad-CAM hero, three-step workflow, cited WHO statistic, performance snapshot, FAQ, and trust content.
- Drag-and-drop analysis with keyboard support, image preview, JPG/PNG/WebP and 10 MB validation, six synthetic sample crops, loading/error/empty states, and cancellation-safe resets.
- Deterministic mock predictions with calibrated confidence, Low/Medium/High labels, uncertainty, Grad-CAM overlay toggle and opacity control, next steps, and PDF export.
- Model comparison table, Recharts ROC and PR curves, confusion matrix, data splits, calibration notes, and limitations.
- Learn, About, Dataset & Licence, and Privacy content.
- Light/dark themes, responsive navigation, visible focus states, semantic text/icons in addition to colour, and reduced-motion support.

## Project structure

```text
src/
├── api.js                     # Mock or FastAPI prediction layer
├── components/
│   ├── AnalysisProgress.jsx   # Animated inference state
│   ├── Layout.jsx             # Navigation, theme control, footer
│   ├── ResultsView.jsx        # Result, Grad-CAM controls, next steps
│   ├── SampleGallery.jsx      # Six interactive samples
│   └── UploadZone.jsx         # Upload and file validation
├── data/
│   ├── metrics.json           # All displayed evaluation data
│   └── samples.js             # Sample metadata and crop preparation
├── pages/                     # Home, Analyse, Model, Learn, About
├── utils/report.js            # jsPDF report generation
├── App.jsx                    # Routes and page titles
└── index.css                  # Theme tokens and shared components
```

## Connect a FastAPI model

1. Copy `.env.example` to `.env.local`.
2. Set the base URL of the inference service:

```env
VITE_API_URL=http://localhost:8000
```

3. Restart Vite after changing environment variables. When `VITE_API_URL` is present, `predict(imageFile)` sends a multipart `POST` request to `${VITE_API_URL}/predict` with the image in a field named `file`. Without it, the app uses deterministic local demonstration predictions.

### Expected JSON response

```json
{
  "label": "Abnormal",
  "probability": 0.8912,
  "calibratedProbability": 0.8641,
  "uncertainty": 0.0715,
  "heatmapBase64": "<base64 PNG, JPEG, or SVG>",
  "threshold": 0.5
}
```

- `label` must be `"Normal"` or `"Abnormal"`.
- `probability` is the raw positive-class (abnormal) probability from 0 to 1.
- `calibratedProbability` is the calibrated positive-class probability from 0 to 1. For a Normal result, the UI converts it to confidence as `1 - calibratedProbability`.
- `uncertainty` is a 0–1 estimate shown as supporting context, not a clinical measurement.
- `heatmapBase64` can be raw base64 image data or a complete `data:image/...;base64,...` URL. It should have the same aspect ratio as the displayed input.
- `threshold` is the abnormal-class decision threshold.

### Minimal FastAPI shape

```python
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Validate MIME type and size, decode safely, run preprocessing,
    # inference, calibration, and Grad-CAM. Do not log the image body.
    return {
        "label": "Normal",
        "probability": 0.12,
        "calibratedProbability": 0.14,
        "uncertainty": 0.06,
        "heatmapBase64": "REPLACE_WITH_BASE64_IMAGE",
        "threshold": 0.5,
    }
```

For any non-local deployment, use HTTPS, restrict CORS to the actual frontend origin, validate image content server-side, limit request size, avoid request-body logging, and delete temporary files immediately. Image retention should remain disabled unless the user explicitly opts in through a separately implemented consent flow.

## Replace demonstration metrics

Edit `src/data/metrics.json`. The landing performance strip, model cards, comparison table, ROC/PR charts, confusion matrix, and split visualisation all read from this file. Current values are deliberately labelled **illustrative demonstration metrics** and must be replaced with verified held-out results before research claims or any clinical use.

Keep confusion-matrix counts, sensitivity/specificity, dataset totals, and accompanying explanatory copy consistent when updating the evaluation.

## Demo imagery and privacy

The hero micrograph is synthetic artwork created for this prototype. `src/data/samples.js` derives six different square crops from it at runtime; no source-dataset images are bundled. In mock mode, selected images remain browser-local object URLs and are revoked on reset or page exit. Only the light/dark preference is stored in `localStorage`.

## Production routing

The app uses React Router's `BrowserRouter`. Configure the hosting platform to serve `index.html` for unknown paths (SPA fallback) so direct visits to `/analyse`, `/model`, `/learn`, and `/about` work. Vite's development and preview servers handle this automatically.

## Accessibility and content notes

- Interactive controls are keyboard accessible and use visible focus indicators.
- Result states always include icons/text, not colour alone.
- Motion is disabled effectively under `prefers-reduced-motion: reduce`.
- Results never claim that a user has cancer and always recommend professional review.
- Health education links to WHO, CDC, and NHS resources. Screening guidance should be localised before a wider release.
