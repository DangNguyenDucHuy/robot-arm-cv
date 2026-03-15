from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import stream, health

app = FastAPI()

# Routes
app.include_router(stream.router)
app.include_router(health.router)

# CORS
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)