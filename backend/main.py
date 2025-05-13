from fastapi import FastAPI, Depends, HTTPException, Response, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import models
import database
import schemas
import crud
from auth import create_access_token, decode_access_token, delete_access_token
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Create tables in the database
models.Base.metadata.create_all(bind=database.engine)

# origins = [
#     "http://localhost:3000",  # Replace with the URL of your Next.js frontend
#     "https://your-frontend-url.com",  # For production environment
# ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # EXACT origin of your frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get the database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -- USERS --
@app.get("/api/me", response_model=schemas.UserRead)
def get_logged_in_user(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload.get("user_id")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/api/logout")
def logout(request: Request, response: Response):
    """
    Logout the user by deleting the access token cookie and blacklisting the token.
    """
    token = request.cookies.get("access_token")  # Corrected line
    if token:
        delete_access_token(token)
    
    response = JSONResponse(content={"message": "Logged out"})
    response.delete_cookie(key="access_token")
    return response


@app.post("/api/register/", response_model=schemas.UserRead)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Body: 
    {   "full name": "string"
        "email": "string",
        "password": "string"
    }
    """
    
    new_user = crud.create_user(db, user)
    if not new_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    token = create_access_token({"user_id": new_user.id})
    res = JSONResponse(content={"message": "Logged in", "user": new_user.email})
    res.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,  # Set True in production (HTTPS)
        samesite="Lax"
    )
    return res


@app.post("/api/auth", response_model=schemas.UserRead)
def authenticate_user(user: schemas.UserLogin, response: Response, db: Session = Depends(get_db)):      
    db_user = crud.authenticate_user(db, user.email, user.password)
    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")
    

    token = create_access_token({"user_id": db_user.id})
    res = JSONResponse(content={"message": "Logged in", "user": db_user.email})
    res.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,  # Set True in production (HTTPS)
        samesite="Lax"
    )
    return res

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
