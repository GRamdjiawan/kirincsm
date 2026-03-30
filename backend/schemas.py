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
    type: str  # Made required to match database

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


# PROJECT SCHEMAS
class ProjectBase(BaseModel):
    domain_id: int
    title: str
    description: Optional[str] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


class ProjectFieldDefinitionBase(BaseModel):
    name: str
    key_name: str
    field_type: str = "text"
    domain_id: Optional[int] = None


class ProjectFieldDefinitionRead(ProjectFieldDefinitionBase):
    id: int

    class Config:
        from_attributes = True


class ProjectFieldBase(BaseModel):
    project_id: int
    field_definition_id: Optional[int] = None
    field_key: str
    field_value: Optional[str] = None
    field_type: str = "text"


class ProjectFieldCreate(ProjectFieldBase):
    pass


class ProjectFieldUpdate(BaseModel):
    field_value: Optional[str] = None
    field_key: Optional[str] = None
    field_type: Optional[str] = None
    field_definition_id: Optional[int] = None


class ProjectFieldRead(ProjectFieldBase):
    id: int


class ProjectRead(ProjectBase):
    id: int
    fields: List[ProjectFieldRead] = []

    class Config:
        from_attributes = True

# SEO SCHEMAS
class SEOBase(BaseModel):
    meta_title: Optional[str]  # Updated field name
    meta_description: Optional[str]
    keywords: Optional[str]  # Updated field name
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
    title: str  # Made required to match database
    file_url: Optional[str]
    text: Optional[str]
    type: Literal['image', 'text']
    aspect_ratio: float | None = None  # h/w ratio, None for non-images
    
class MediaCreate(BaseModel):
    title: str
    file_url: Optional[str] = None
    type: str
    domain_id: Optional[int] = None  # Added domain_id field
    uploaded_by: int
    section_id: Optional[int] = None
    project_id: Optional[int] = None
    text: Optional[str] = None
    aspect_ratio: Optional[float] = None  # Added aspect_ratio field

class MediaRead(MediaBase):
    id: int
    domain_id: Optional[int]  # Added domain_id field
    uploaded_by: Optional[int]
    section_id: Optional[int]
    project_id: Optional[int]

    class Config:
        from_attributes = True

class MediaUpdate(BaseModel):
    title: Optional[str] = None
    text: Optional[str] = None
    section_id: Optional[int] = None
    project_id: Optional[int] = None

class MediaNoUploadedBy(BaseModel):
    id: int
    title: str
    file_url: str
    type: str
    domain_id: int
    section_id: Optional[int]
    text: Optional[str]

    class Config:
        orm_mode = True