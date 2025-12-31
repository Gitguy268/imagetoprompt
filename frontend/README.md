# ImageToPrompt — Frontend

Next.js (App Router) frontend for generating a prompt pack and exporting it to **.txt** or **.json**.

## Requirements

- Node.js: **20.x LTS** recommended
- npm: comes with Node

## Setup

```bash
cd frontend
npm install
```

## Run locally

```bash
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build
npm run start
```

## Accessibility testing (audit checklist)

### Manual checks

- Keyboard-only navigation: Tab/Shift+Tab through all controls
- Verify visible focus rings on all interactive elements
- Screen reader: verify labels and status messages (aria-live) are announced

### Tooling

- **axe DevTools** browser extension (Chrome/Firefox)
- **WAVE** browser extension
- **Lighthouse** (Chrome DevTools → Lighthouse)

Suggested workflow:

1. Run axe + WAVE on the home page
2. Fix any violations (labels, landmarks, contrast, ARIA)
3. Re-run until clean
4. Run Lighthouse and ensure performance/accessibility goals are met

## Docker

From repo root:

```bash
docker compose up --build
```

Frontend will be available at http://localhost:3000

## Architecture overview

- `app/` — Next.js App Router
  - `page.tsx` — main UI state and orchestration
  - `components/` — UI building blocks
  - `lib/` — data types and export formatting

## Component documentation

### `ExportPanel`

- Exports current prompt pack as:
  - `.txt`: human-readable; generator sections separated by `---`
  - `.json`: full `analysis + prompts + scores` payload
- Generates a timestamp filename (e.g. `prompts_2024-01-15_143022.json`)
- Provides download buttons and clipboard copy fallback

### `ErrorBoundary`

- Wraps UI surfaces that may throw (Prompt / Analysis display)
- Shows a friendly fallback: “Something went wrong. Please try again.” and a Retry button
- Logs errors to `console.error` for debugging

### `PromptDisplay` / `AnalysisDisplay`

- Present structured results
- Include empty states and simple loading skeletons

### `ControlToggles`

- Accessible checkbox list for enabling/disabling generator outputs
