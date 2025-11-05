from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import LessonProgress, Topic, User
from app.schemas import LessonProgressResponse, LessonProgressItem
from app.auth import get_current_active_user

router = APIRouter()


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


