from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models
import database
import schemas
import crud


app = FastAPI()

models.Base.metadata.create_all(bind=database.engine)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -- USERS --
@app.post("/api/users/", response_model=schemas.UserRead)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user)

@app.get("/api/users/", response_model=list[schemas.UserRead])
def list_users(db: Session = Depends(get_db)):
    return crud.get_users(db)

# -- PAGES --
@app.post("/api/pages/", response_model=schemas.PageRead)
def create_page(page: schemas.PageCreate, db: Session = Depends(get_db)):
    return crud.create_page(db, page)

@app.get("/api/pages/", response_model=list[schemas.PageRead])
def list_pages(db: Session = Depends(get_db)):
    return crud.get_pages(db)

# -- SEO --
@app.post("/api/seo/", response_model=schemas.SEORead)
def create_seo(seo: schemas.SEOCreate, db: Session = Depends(get_db)):
    return crud.create_seo(db, seo)

@app.get("/api/seo/", response_model=list[schemas.SEORead])
def list_seo(db: Session = Depends(get_db)):
    return crud.get_seo(db)

# -- MEDIA --
@app.post("/api/media/", response_model=schemas.MediaRead)
def create_media(media: schemas.MediaCreate, db: Session = Depends(get_db)):
    return crud.create_media(db, media)

@app.get("/api/media/", response_model=list[schemas.MediaRead])
def list_media(db: Session = Depends(get_db)):
    return crud.get_media(db)
