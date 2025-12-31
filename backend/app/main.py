from __future__ import annotations

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="ImageToPrompt API", version="0.1.0")


@app.get("/health")
def health():
    return {"status": "ok"}


class AnalyzeRequest(BaseModel):
    image_url: str | None = None


@app.post("/analyze")
def analyze(_: AnalyzeRequest):
    return {
        "generatedAt": "2025-01-01T00:00:00.000Z",
        "analysis": {
            "summary": "Example response. In Phase 2 this will call a real vision model.",
            "attributes": {
                "subject": "unknown",
                "style": "unknown",
                "lighting": "unknown"
            },
        },
        "prompts": {
            "sdxl": "Example prompt for SDXL",
            "midjourney": "Example prompt for Midjourney",
            "dalle": "Example prompt for DALL·E",
        },
        "scores": {"sdxl": 0.8, "midjourney": 0.8, "dalle": 0.8},
    }
