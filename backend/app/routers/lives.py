from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, date

from app.database import get_db
from app.models import User, UserLives
from app.schemas import UserLivesResponse, LivesUpdate
from app.auth import get_current_active_user

router = APIRouter()

@router.get("/my-lives", response_model=UserLivesResponse)
def get_my_lives(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Получение информации о жизнях пользователя"""
    user_lives = db.query(UserLives).filter(UserLives.user_id == current_user.id).first()
    
    if not user_lives:
        # Создаем записи жизней, если их нет
        user_lives = UserLives(
            user_id=current_user.id,
            current_lives=3,
            max_lives=3
        )
        db.add(user_lives)
        db.commit()
        db.refresh(user_lives)
    
    # Проверяем, нужно ли сбросить жизни (новый день)
    today = date.today()
    last_reset = user_lives.last_reset_date.date()
    
    if today > last_reset:
        user_lives.current_lives = user_lives.max_lives
        user_lives.last_reset_date = datetime.now()
        db.commit()
        db.refresh(user_lives)
    
    return user_lives

@router.put("/my-lives", response_model=UserLivesResponse)
def update_my_lives(
    lives_update: LivesUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Обновление жизней пользователя (для админов или внутренней логики)"""
    user_lives = db.query(UserLives).filter(UserLives.user_id == current_user.id).first()
    
    if not user_lives:
        raise HTTPException(
            status_code=404,
            detail="Записи жизней не найдены"
        )
    
    # Обновляем поля
    update_data = lives_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user_lives, field, value)
    
    db.commit()
    db.refresh(user_lives)
    
    return user_lives

@router.post("/use-life")
def use_life(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Использование одной жизни"""
    user_lives = db.query(UserLives).filter(UserLives.user_id == current_user.id).first()
    
    if not user_lives:
        raise HTTPException(
            status_code=404,
            detail="Записи жизней не найдены"
        )
    
    if user_lives.current_lives <= 0:
        raise HTTPException(
            status_code=400,
            detail="У вас закончились жизни"
        )
    
    user_lives.current_lives -= 1
    db.commit()
    
    return {
        "message": "Жизнь использована",
        "remaining_lives": user_lives.current_lives,
        "max_lives": user_lives.max_lives
    }
