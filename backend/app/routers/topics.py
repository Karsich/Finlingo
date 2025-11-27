from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Topic
from app.schemas import TopicResponse

router = APIRouter()


@router.get("/", response_model=List[TopicResponse])
def list_topics(db: Session = Depends(get_db)):
    return db.query(Topic).order_by(Topic.display_order.asc(), Topic.id.asc()).all()









