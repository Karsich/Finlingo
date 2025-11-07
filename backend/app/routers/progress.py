from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from app.database import get_db
from app.models import LessonProgress, Topic, User
from app.schemas import LessonProgressResponse, LessonProgressItem
from app.auth import get_current_active_user

router = APIRouter()


class UpdateProgressRequest(BaseModel):
    status: str  # active | completed


@router.get("/{topic_slug}", response_model=LessonProgressResponse)
def get_topic_progress(
    topic_slug: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Убедимся, что тема существует
    topic = db.query(Topic).filter(Topic.slug == topic_slug).first()
    if not topic:
        # Автосоздавать тему не будем — вернём пустую структуру
        return {"topic_slug": topic_slug, "items": []}

    items: List[LessonProgress] = (
        db.query(LessonProgress)
        .filter(LessonProgress.user_id == current_user.id, LessonProgress.topic_slug == topic_slug)
        .all()
    )

    mapped = [LessonProgressItem(lesson_number=i.lesson_number, status=i.status) for i in items]
    return {"topic_slug": topic_slug, "items": mapped}


@router.post("/{topic_slug}/lesson/{lesson_number}")
def update_lesson_progress(
    topic_slug: str,
    lesson_number: int,
    request: UpdateProgressRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Убедимся, что тема существует, если нет - создаём её
    topic = db.query(Topic).filter(Topic.slug == topic_slug).first()
    if not topic:
        # Автоматически создаём тему, если её нет
        topic_titles = {
            "rent": "Съем квартиры",
            "job": "Работа"
        }
        topic = Topic(
            slug=topic_slug,
            title=topic_titles.get(topic_slug, topic_slug.capitalize()),
            description=None,
            display_order=0
        )
        db.add(topic)
        db.commit()
        db.refresh(topic)

    if request.status not in ["active", "completed"]:
        raise HTTPException(status_code=400, detail="Invalid status. Must be 'active' or 'completed'")

    # Ищем существующий прогресс
    progress = (
        db.query(LessonProgress)
        .filter(
            LessonProgress.user_id == current_user.id,
            LessonProgress.topic_slug == topic_slug,
            LessonProgress.lesson_number == lesson_number
        )
        .first()
    )

    if progress:
        # Обновляем существующий
        progress.status = request.status
    else:
        # Создаём новый
        progress = LessonProgress(
            user_id=current_user.id,
            topic_slug=topic_slug,
            lesson_number=lesson_number,
            status=request.status
        )
        db.add(progress)

    db.commit()
    db.refresh(progress)

    # Если урок отмечен как completed, делаем следующий урок active
    if request.status == "completed":
        next_lesson = (
            db.query(LessonProgress)
            .filter(
                LessonProgress.user_id == current_user.id,
                LessonProgress.topic_slug == topic_slug,
                LessonProgress.lesson_number == lesson_number + 1
            )
            .first()
        )

        if not next_lesson:
            # Создаём следующий урок как активный
            next_progress = LessonProgress(
                user_id=current_user.id,
                topic_slug=topic_slug,
                lesson_number=lesson_number + 1,
                status="active"
            )
            db.add(next_progress)
            db.commit()
            db.refresh(next_progress)
        elif next_lesson.status == "locked":
            # Если следующий урок был заблокирован, активируем его
            next_lesson.status = "active"
            db.commit()
            db.refresh(next_lesson)

    return {
        "message": "Progress updated",
        "lesson_number": lesson_number,
        "status": request.status,
        "next_lesson_activated": request.status == "completed"
    }


