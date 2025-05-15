from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import models
import schemas
import bcrypt


#password hashing
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# USERS
def create_user(db: Session, user: schemas.UserCreate):
    # Check of het e-mailadres al bestaat
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Als het e-mailadres nog niet bestaat, maak een nieuwe gebruiker aan
    db_user = models.User(**user.dict())
    db_user.password = hash_password(user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_users(db: Session):
    return db.query(models.User).all()

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()



def authenticate_user(db: Session, email: str, password: str):
    user = db.query(models.User).filter(models.User.email == email).first()

    if user and password:
        if verify_password(password, user.password):
            return user
        else:
            return {"error": "Invalid password"}
    else:
        return {"error": "User not found"} 


# DOMAINS
def create_domain(db: Session, domain: schemas.DomainCreate):
    db_domain = models.Domain(**domain.dict())
    db.add(db_domain)
    db.commit()
    db.refresh(db_domain)
    return db_domain

def get_domains(db: Session):
    return db.query(models.Domain).all()

def get_domain(db: Session, domain_id: int):
    return db.query(models.Domain).filter(models.Domain.id == domain_id).first()

def get_domains_by_user_id(db: Session, user_id: int):
    return db.query(models.Domain).filter(models.Domain.user_id == user_id).first()



# PAGES
def create_page(db: Session, page: schemas.PageCreate):
    db_page = models.Page(**page.dict(exclude={"sections"}))
    db.add(db_page)
    db.commit()
    db.refresh(db_page)

    # Optional: create sections if provided
    if page.sections:
        for section in page.sections:
            create_section(db, section, page_id=db_page.id)

    return db_page

def get_pages(db: Session):
    return db.query(models.Page).all()

def get_page(db: Session, page_id: int):
    return db.query(models.Page).filter(models.Page.id == page_id).first()


# SECTIONS
def create_section(db: Session, section: schemas.SectionCreate, page_id: int = None):
    data = section.dict()
    if page_id:
        data["page_id"] = page_id
    db_section = models.Section(**data)
    db.add(db_section)
    db.commit()
    db.refresh(db_section)
    return db_section

def get_sections_by_page(db: Session, page_id: int):
    return db.query(models.Section).filter(models.Section.page_id == page_id).all()

def get_section(db: Session, section_id: int):
    return db.query(models.Section).filter(models.Section.id == section_id).first()


# SEO
def create_seo(db: Session, seo: schemas.SEOCreate):
    db_seo = models.SEO(**seo.dict())
    db.add(db_seo)
    db.commit()
    db.refresh(db_seo)
    return db_seo

def get_seo(db: Session):
    return db.query(models.SEO).all()

def get_seo_by_domain(db: Session, domain_id: int):
    return db.query(models.SEO).filter(models.SEO.domain_id == domain_id).first()


# MEDIA
def create_media(db: Session, media: schemas.MediaCreate):
    db_media = models.Media(**media.dict())
    db.add(db_media)
    db.commit()
    db.refresh(db_media)
    return db_media

def get_media(db: Session):
    return db.query(models.Media).all()

def get_media_by_section(db: Session, section_id: int):
    return db.query(models.Media).filter(models.Media.section_id == section_id).all()

def get_media_by_user(db: Session, user_id: int):
    return db.query(models.Media).filter(models.Media.uploaded_by == user_id).all()
