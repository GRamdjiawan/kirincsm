from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str

class UserCreate(UserBase):
    password_hash: str

class UserRead(UserBase):
    id: int
    class Config:
        orm_mode = True

class PageBase(BaseModel):
    title: str
    slug: str
    content: Optional[str]
    cover_image_url: Optional[str]

class PageCreate(PageBase):
    user_id: int

class PageRead(PageBase):
    id: int
    updated_at: Optional[datetime]
    class Config:
        orm_mode = True

class SEOBase(BaseModel):
    meta_title: str
    meta_description: str
    keywords: Optional[str]
    og_image_url: Optional[str]

class SEOCreate(SEOBase):
    page_id: int

class SEORead(SEOBase):
    id: int
    class Config:
        orm_mode = True

class MediaBase(BaseModel):
    file_url: str
    alt_text: Optional[str]

class MediaCreate(MediaBase):
    uploaded_by: int

class MediaRead(MediaBase):
    id: int
    class Config:
        orm_mode = True
