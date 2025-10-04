from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import shutil
import os
from typing import Optional

from app.database import get_db
from app.models import User
from app.schemas import UserUpdate, UserResponse
from app.auth import get_current_active_user

router = APIRouter()

@router.get("/profile", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_active_user)):
    """Получение профиля пользователя"""
    return current_user

@router.put("/profile", response_model=UserResponse)
def update_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Обновление профиля пользователя"""
    # Проверяем уникальность email, если он изменяется
    if user_update.email and user_update.email != current_user.email:
        existing_user = db.query(User).filter(User.email == user_update.email).first()
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Пользователь с таким email уже существует"
            )
    
    # Проверяем уникальность username, если он изменяется
    if user_update.username and user_update.username != current_user.username:
        existing_user = db.query(User).filter(User.username == user_update.username).first()
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Пользователь с таким именем пользователя уже существует"
            )
    
    # Обновляем поля
    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    
    return current_user

@router.post("/upload-avatar")
def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Загрузка аватара пользователя"""
    # Проверяем тип файла
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Файл должен быть изображением"
        )
    
    # Создаем директорию для аватаров, если её нет
    upload_dir = "uploads/avatars"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Генерируем уникальное имя файла
    file_extension = file.filename.split(".")[-1]
    filename = f"{current_user.id}_{current_user.username}.{file_extension}"
    file_path = os.path.join(upload_dir, filename)
    
    # Сохраняем файл
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Обновляем URL аватара в базе данных
    avatar_url = f"/uploads/avatars/{filename}"
    current_user.avatar_url = avatar_url
    db.commit()
    
    return {"message": "Аватар успешно загружен", "avatar_url": avatar_url}
