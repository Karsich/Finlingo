from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# Схемы для пользователя
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None

class UserResponse(UserBase):
    id: int
    avatar_url: Optional[str] = None
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Схемы для аутентификации
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Схемы для жизней
class UserLivesResponse(BaseModel):
    id: int
    user_id: int
    current_lives: int
    max_lives: int
    last_reset_date: datetime
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class LivesUpdate(BaseModel):
    current_lives: Optional[int] = None
    max_lives: Optional[int] = None

# Схемы для тем и прогресса

class TopicBase(BaseModel):
    slug: str
    title: str
    description: Optional[str] = None
    display_order: int = 0

class TopicResponse(TopicBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class LessonProgressItem(BaseModel):
    lesson_number: int
    status: str  # locked | active | completed

class LessonProgressResponse(BaseModel):
    topic_slug: str
    items: List[LessonProgressItem]
