from typing import List
from fastapi import FastAPI, Depends, HTTPException, Response, Request, File, UploadFile
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import models
import database
import schemas
import crud
from auth import create_access_token, decode_access_token, delete_access_token
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from fastapi.staticfiles import StaticFiles

app = FastAPI()
UPLOAD_DIR = "./uploads"


# Create tables in the database
models.Base.metadata.create_all(bind=database.engine)

origins = [
    "http://localhost:3000",  # Replace with the URL of your Next.js frontend
    "https://www.nebula-cms.nl",
    "https://nebula-cms.nl",
    "https://api.nebula-cms.nl",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the static files directory
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Dependency to get the database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -- USERS --
def get_current_user(request: Request, db: Session = Depends(get_db)) -> models.User:
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
        secure=True,  # Set True in production (HTTPS)
        samesite="none"
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
        secure=True,  # Set True in production (HTTPS)
        samesite="none"
    )
    return res
@app.get("/api/users/", response_model=List[schemas.UserRead])
def get_users(db: Session = Depends(get_db)):
    """
    Get all users
    """
    users = crud.get_users(db)
    if not users:
        raise HTTPException(status_code=404, detail="No users found.")
    return users

@app.put("/api/users/update")
def update_user(
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user_update.name:
        current_user.name = user_update.name
    if user_update.email:
        current_user.email = user_update.email
    db.commit()
    db.refresh(current_user)
    return current_user

@app.put("/api/users/change-password")
def change_password_endpoint(
    password_data: schemas.ChangePassword,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    updated_user = crud.change_password(
        db, current_user, password_data.old_password, password_data.new_password
    )
    return {"message": "Password changed successfully"}


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

@app.get("/api/pages/", response_model=List[schemas.PageWithSectionCount])
def get_my_pages(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.get_pages_by_user_id(db, current_user.id)


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

@app.get("/api/sections/{page_id}", response_model=List[schemas.SectionRead])
def get_sections_by_page_id(
    page_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Get all sections for a specific page, only if the page belongs to the current user.
    """
    return crud.get_sections_by_page_and_user(db, page_id, current_user.id)

# -- DOMAINS --

@app.get("/api/domains/{user_id}", response_model=schemas.DomainRead)
def get_domains_by_user_id(user_id: int, db: Session = Depends(get_db)):
    domains = crud.get_domains_by_user_id(db, user_id)
    if not domains:
        raise HTTPException(status_code=404, detail="No domains found for this user.")
    return domains


@app.get("/api/domains", response_model=List[schemas.DomainRead])
def get_all_domains(db: Session = Depends(get_db)):
    domains = crud.get_domains(db)
    if not domains:
        raise HTTPException(status_code=404, detail="No domains found.")
    return domains



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
@app.get("/api/media/domain", response_model=List[schemas.MediaRead])
def get_media_by_domain(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Get all media items for the current user's domains.
    """
    # Fetch all domains for the current user
    domain = crud.get_domains_by_user_id(db, current_user.id)
    if not domain:
        raise HTTPException(status_code=404, detail="No domains found for the current user")

    media_items =crud.get_media_by_domain(db, domain.id)

    if not media_items:
        raise HTTPException(status_code=404, detail="No media found for the current user's domains")

    return media_items

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

@app.get("/api/media/{section_id}", response_model=List[schemas.MediaRead])
def get_media_by_section_id(
    section_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Get all media items for a specific section, only if the section belongs to the current user's domain.
    """
    return crud.get_media_by_section_and_user(db, section_id, current_user.id)


@app.post("/api/upload", response_model=schemas.MediaRead)
async def upload_file(
    file: UploadFile = File(...),
    domain_id: int = None,  # Added domain_id parameter
    section_id: int = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    MAX_FILE_SIZE_MB = 200  # Maximum file size in MB

    # Read file contents
    contents = await file.read()

    # Check file size
    if len(contents) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large")
    # Get the domain for the current user
    domain = crud.get_domains_by_user_id(db, current_user.id)
    if not domain:
        raise HTTPException(status_code=404, detail="Domain not found for the current user")

    UPLOAD_DIR = "./uploads/" + str(current_user.id) + str(domain.name)
    # Ensure the upload directory exists
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)

    # Save the file to the server
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        buffer.write(contents)


    # Prepare metadata for the database
    media_data = schemas.MediaCreate(
        title=file.filename,
        file_url=f"/uploads/{current_user.id}{domain.name}/{file.filename}",
        type="image" if file.content_type.startswith("image/") else "text",
        domain_id=domain.id,  # Extract the ID from the Domain object
        uploaded_by=current_user.id,
        section_id=section_id,
        text=""
    )
    
    # Save metadata to the database
    db_media = crud.create_media(db, media_data)

    return db_media

@app.delete("/api/media/{media_id}", response_model=dict)
def delete_media(
    media_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Delete a media item by its ID.

    Args:
        media_id (int): The ID of the media item to delete.

    Returns:
        dict: A success message.
    """
    # Fetch the media item from the database
    media_item = crud.delete_media(db, media_id)

    # Delete the file from the uploads directory
    file_path = os.path.join(UPLOAD_DIR, os.path.basename(media_item.file_url))
    if os.path.exists(file_path):
        os.remove(file_path)

    return {"message": f"Media item with ID {media_id} has been deleted successfully"}

@app.put("/api/media/{media_id}", response_model=schemas.MediaRead)
def update_media(
    media_id: int,
    update_data: schemas.MediaUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Update the title and alt text of a media item.

    Args:
        media_id (int): The ID of the media item to update.
        update_data (schemas.MediaUpdate): The new title and alt text.

    Returns:
        schemas.MediaRead: The updated media item.
    """
    updated_media = crud.update_media(
        db, media_id, update_data.title, update_data.text, update_data.section_id
    )

    return updated_media

@app.get("/api/fill-gallery/{domain_id}", response_model=List[schemas.MediaNoUploadedBy])
def fill_gallery(domain_id: str, db: Session = Depends(get_db)):
    """
    Get all images for a domain using an encrypted domain ID.
    Args:
        encrypted_id (str): The encrypted domain ID.

    Returns:
        List[schemas.MediaRead]: List of media items for the domain.
    """

    # Fetch media items for the domain
    media_items = crud.get_all_media_by_domain(db, domain_id)
    if not media_items:
        raise HTTPException(status_code=404, detail="No media found for the domain")

    # Filter only images
    images = [item for item in media_items if item.type == "image"]
    return images