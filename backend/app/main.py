from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

from app.database import get_db
from app.routers import auth, users, lives
from app.models import Base
from app.database import engine

load_dotenv()

# Создаем таблицы
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Fingram API",
    description="API для обучения бытовым темам",
    version="1.0.0"
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутеров
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(lives.router, prefix="/api/lives", tags=["lives"])

@app.get("/")
async def root():
    return {"message": "Fingram API работает!"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
