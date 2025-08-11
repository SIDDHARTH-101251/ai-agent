from pydantic import BaseModel
import os

class Settings(BaseModel):
    app_name: str = "gemini-chat-backend"
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    google_api_key: str = os.getenv("GOOGLE_API_KEY", "")
    cors_origins: str = os.getenv("CORS_ORIGINS", "*")

settings = Settings()