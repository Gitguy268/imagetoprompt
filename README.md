# ImageToPrompt

Monorepo for **ImageToPrompt** — a small app that turns an image into a structured prompt pack (analysis + generator prompts + scores), with export to **.txt** and **.json**.

## Folder structure

- `backend/` — FastAPI service (API + `/docs`)
- `frontend/` — Next.js App Router UI

## Quick start (local)

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Open API docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open UI: http://localhost:3000

> The frontend is currently wired to a sample prompt pack for demonstration. Phase 2 will connect it to the backend `/analyze` endpoint.

## Development workflow

1. Start the backend
2. Start the frontend
3. Use `/docs` to inspect / iterate on API shapes

## Docker Compose

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000 (docs at `/docs`)

## Roadmap

### Phase 2

- Real image analysis (vision model integration)
- Persist prompt history
- Connect frontend generation flow to backend `/analyze`

### Phase 3

- User accounts
- Team sharing / export presets
- Advanced accessibility + i18n
