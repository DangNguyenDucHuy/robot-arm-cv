import os
from pathlib import Path
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    pose_model_name: str
    hand_model_name: str
    both_model_name: str
    mcu: str
    serial_port: str
    baud_rate: str
    
    class Config:
        env_file = ".env"

settings = Settings()


# Env
BASE_DIR = Path(__file__).resolve().parents[2]

POSE_MODEL_PATH = os.path.join(BASE_DIR, "models", f"{settings.pose_model_name}.pt")
HAND_MODEL_PATH = os.path.join(BASE_DIR, "models", f"{settings.hand_model_name}.pt")
BOTH_MODEL_PATH = os.path.join(BASE_DIR, "models", f"{settings.both_model_name}.pt")
MCU = settings.mcu
SERIAL_PORT = settings.serial_port
BAUD_RATE = settings.baud_rate


# Others
SERVO_LIMIT = {
    'base': (15, 165),
    'shoulder': (0, 180),
    'elbow': (0, 180),
    'grip': (110, 150),
}
PREDICTION_LIMIT = {
    'base': (0, 180),
    'shoulder': (60, 145),
    'elbow': (10, 145),
    'grip': (0, 180),
}


