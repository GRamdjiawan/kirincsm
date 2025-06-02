from pydantic import BaseModel, EmailStr
from typing import Optional, List, Literal

# USER SCHEMAS
class UserBase(BaseModel):
    name: Optional[str]
    email: EmailStr
    role: Literal['admin', 'editor', 'client']

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
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
        from_attributes = True

# SECTION SCHEMAS
class SectionBase(BaseModel):
    title: Optional[str]
    position: Optional[int]
    type: Optional[str] 

class SectionCreate(SectionBase):
    page_id: int

class SectionRead(SectionBase):
    id: int
    page_id: int
    class Config:
        from_attributes = True

# PAGE SCHEMAS
class PageBase(BaseModel):
    title: Optional[str]
    hierarchy: int
    domain_id: Optional[int]

class PageCreate(PageBase):
    pass

class PageRead(PageBase):
    id: int
    class Config:
        from_attributes = True

class PageWithSectionCount(BaseModel):
    id: str
    title: Optional[str]
    hierarchy: int
    sections: int

# SEO SCHEMAS
class SEOBase(BaseModel):
    meta_title: Optional[str]
    meta_description: Optional[str]
    keywords: Optional[str]
    icon: Optional[str]

class SEOCreate(SEOBase):
    domain_id: int

class SEORead(SEOBase):
    id: int
    domain_id: int
    class Config:
        from_attributes = True

# MEDIA SCHEMAS
class MediaBase(BaseModel):
    title: Optional[str]
    file_url: Optional[str]
    text: Optional[str]
    type: Literal['image', 'text']

class MediaCreate(MediaBase):
    uploaded_by: Optional[int]
    section_id: Optional[int]

class MediaRead(MediaBase):
    id: int
    uploaded_by: Optional[int]
    section_id: Optional[int]

    class Config:
        from_attributes = True
