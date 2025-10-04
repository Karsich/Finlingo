from pydantic import BaseModel, EmailStr, validator
from datetime import datetime
from typing import Optional

# Схемы для пользователя
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Пароль должен содержать минимум 6 символов')
        if len(v) > 72:
            raise ValueError('Пароль не должен превышать 72 символа')
        return v

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
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) > 72:
            raise ValueError('Пароль не должен превышать 72 символа')
        return v

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
