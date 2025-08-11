import os
import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import ChatRequest, ChatResponse
from app.settings import settings
import google.generativeai as genai

# Configure Gemini
if not settings.google_api_key:
    raise RuntimeError("GOOGLE_API_KEY is not set")

genai.configure(api_key=settings.google_api_key)
model = genai.GenerativeModel(settings.gemini_model)

app = FastAPI(title=settings.app_name)

# CORS (for local dev and simple deployments)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/healthz")
def healthz():
    return {"status": "ok", "model": settings.gemini_model}

@app.post("/api/ask", response_model=ChatResponse)
async def ask(req: ChatRequest):
    try:
        # keep stateless: session_id can be echoed back; no server memory by default
        sid = req.session_id or str(int(time.time() * 1000))
        prompt = req.message.strip()
        if not prompt:
            raise HTTPException(status_code=400, detail="Empty prompt")

        # Basic safety: truncate very large prompts
        if len(prompt) > 8000:
            prompt = prompt[-8000:]

        # Call Gemini (non-streaming for simplicity)
        resp = model.generate_content(prompt)
        text = resp.text or "(No response)"
        return ChatResponse(reply=text, session_id=sid)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))