from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models
import database
import schemas
import crud

app = FastAPI()

# Create tables in the database
models.Base.metadata.create_all(bind=database.engine)

# Dependency to get the database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -- USERS --
@app.post("/api/users/", response_model=schemas.UserRead)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Body: 
    {
        "username": "string",
        "email": "string",
        "password": "string"
    }
    """
    return crud.create_user(db, user)

# -- PAGES --
@app.post("/api/pages/", response_model=schemas.PageRead)
def create_page(page: schemas.PageCreate, db: Session = Depends(get_db)):
    """
    Body: 
    {
        "title": "string",
        "content": "string",
        "user_id": 1
    }
    """
    return crud.create_page(db, page)

# -- SECTIONS --
@app.post("/api/pages/{page_id}/sections/", response_model=schemas.SectionRead)
def create_section(page_id: int, section: schemas.SectionCreate, db: Session = Depends(get_db)):
    """
    Body: 
    {
        "title": "string",
        "content": "string",
        "position": 1
    }
    """
    return crud.create_section(db, section, page_id)

# -- DOMAINS --
@app.post("/api/domains/", response_model=schemas.DomainRead)
def create_domain(domain: schemas.DomainCreate, db: Session = Depends(get_db)):
    """
    Body:
    {
        "domain_name": "string",
        "description": "string"
    }
    """
    return crud.create_domain(db, domain)

# -- SEO --
@app.post("/api/seo/", response_model=schemas.SEORead)
def create_seo(seo: schemas.SEOCreate, db: Session = Depends(get_db)):
    """
    Body:
    {
        "domain_id": 1,
        "title": "string",
        "meta_description": "string",
        "meta_keywords": "string"
    }
    """
    return crud.create_seo(db, seo)

# -- MEDIA --
@app.post("/api/media/", response_model=schemas.MediaRead)
def create_media(media: schemas.MediaCreate, db: Session = Depends(get_db)):
    """
    Body:
    {
        "url": "string",
        "media_type": "image/video",
        "description": "string"
    }
    """
    return crud.create_media(db, media)
