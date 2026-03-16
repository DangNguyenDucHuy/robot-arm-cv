import os
from pathlib import Path
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    pose_model_name: str
    hand_model_name: str
    both_model_name: str
    
    class Config:
        env_file = ".env"

settings = Settings()


BASE_DIR = Path(__file__).resolve().parents[2]

POSE_MODEL_PATH = os.path.join(BASE_DIR, "models", f"{settings.pose_model_name}.pt")
HAND_MODEL_PATH = os.path.join(BASE_DIR, "models", f"{settings.hand_model_name}.pt")
BOTH_MODEL_PATH = os.path.join(BASE_DIR, "models", f"{settings.both_model_name}.pt")

