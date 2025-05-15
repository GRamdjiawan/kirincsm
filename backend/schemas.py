from pydantic import BaseModel, EmailStr
from typing import Optional, List, Literal
from datetime import datetime

# USER SCHEMAS
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: Literal['admin', 'editor', 'client']

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: str
    password: str

    class Config:
        schema_extra = {
            "example": {
                "email": "string",
                "password": "string"
                
            }
        }
        
class UserUpdate(BaseModel):
    name: Optional[str]
    email: Optional[EmailStr]

class ChangePassword(BaseModel):
    old_password: str
    new_password: str



# DOMAIN SCHEMAS
class DomainBase(BaseModel):
    name: str
    user_id: int

class DomainCreate(DomainBase):
    pass

class DomainRead(DomainBase):
    id: int
    class Config:
        orm_mode = True


# SECTION SCHEMAS
class SectionBase(BaseModel):
    title: Optional[str]
    content: Optional[str]

class SectionCreate(SectionBase):
    page_id: Optional[int]

class SectionRead(SectionBase):
    id: int
    page_id: int
    class Config:
        orm_mode = True


# PAGE SCHEMAS
class PageBase(BaseModel):
    title: str
    slug: str
    content: Optional[str]
    cover_image_url: Optional[str]

class PageCreate(PageBase):
    user_id: int
    domain_id: Optional[int]
    sections: Optional[List[SectionCreate]] = []

class PageRead(PageBase):
    id: int
    updated_at: Optional[datetime]
    sections: Optional[List[SectionRead]] = []
    class Config:
        orm_mode = True


# SEO SCHEMAS
class SEOBase(BaseModel):
    meta_title: str
    meta_description: str
    keywords: Optional[str]
    og_image_url: Optional[str]

class SEOCreate(SEOBase):
    domain_id: int

class SEORead(SEOBase):
    id: int
    domain_id: int
    class Config:
        orm_mode = True


# MEDIA SCHEMAS
class MediaBase(BaseModel):
    file_url: str
    alt_text: Optional[str]
    type: Literal['image', 'text']

class MediaCreate(MediaBase):
    uploaded_by: int
    section_id: Optional[int]

class MediaRead(MediaBase):
    id: int
    section_id: Optional[int]
    uploaded_by: int
    class Config:
        orm_mode = True
