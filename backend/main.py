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
import io
from PIL import Image
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_HOST = os.getenv("SMTP_HOST", "localhost")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")
SMTP_FROM = os.getenv("SMTP_FROM", "noreply@kirin-cms.nl")
SMTP_USE_TLS = os.getenv("SMTP_USE_TLS", "true").lower() == "true"


def _send_smtp(to_email: str, subject: str, body: str):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = SMTP_FROM
    msg["To"] = to_email
    msg.attach(MIMEText(body, "html" if "<" in body else "plain"))

    if SMTP_PORT == 465:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
            if SMTP_USER and SMTP_PASS:
                server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(SMTP_FROM, to_email, msg.as_string())
    else:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            if SMTP_USE_TLS:
                server.ehlo()
                server.starttls()
            if SMTP_USER and SMTP_PASS:
                server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(SMTP_FROM, to_email, msg.as_string())

app = FastAPI()
UPLOAD_DIR = "./uploads"


# Create tables in the database
models.Base.metadata.create_all(bind=database.engine)

origins = [
    "http://localhost:3000",  # Replace with the URL of your Next.js frontend
    "https://www.kirin-cms.nl",
    "https://kirin-cms.nl",
    "https://api.kirin-cms.nl",
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


# -- PROJECTS --
@app.post("/api/projects/", response_model=schemas.ProjectRead)
def create_project(
    project: schemas.ProjectCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    domain = crud.get_domain(db, project.domain_id)
    if not domain or domain.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not allowed to create projects for this domain")
    return crud.create_project(db, project)


@app.get("/api/projects/", response_model=List[schemas.ProjectRead])
def get_my_projects(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    domain = crud.get_domains_by_user_id(db, current_user.id)
    if not domain:
        return []
    return crud.get_projects_by_domain(db, domain.id)


@app.get("/api/projects/domain/{domain_id}", response_model=List[schemas.ProjectRead])
def get_projects_by_domain(
    domain_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    domain = crud.get_domain(db, domain_id)
    if not domain or domain.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not allowed to view projects for this domain")
    return crud.get_projects_by_domain(db, domain_id)


@app.get("/api/domains/{domain_id}/projects", response_model=List[schemas.ProjectRead])
def get_domain_projects(
    domain_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    domain = crud.get_domain(db, domain_id)
    if not domain or domain.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not allowed to view projects for this domain")
    return crud.get_projects_by_domain(db, domain_id)


@app.get("/api/projects/{project_id}", response_model=schemas.ProjectRead)
def get_project_by_id(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    domain = crud.get_domain(db, project.domain_id)
    if not domain or domain.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not allowed to view this project")

    return project


@app.put("/api/projects/{project_id}", response_model=schemas.ProjectRead)
def update_project(
    project_id: int,
    project_update: schemas.ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    domain = crud.get_domain(db, project.domain_id)
    if not domain or domain.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not allowed to update this project")

    return crud.update_project(db, project_id, project_update)


@app.delete("/api/projects/{project_id}", response_model=dict)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    domain = crud.get_domain(db, project.domain_id)
    if not domain or domain.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not allowed to delete this project")

    crud.delete_project(db, project_id)
    return {"message": f"Project with ID {project_id} has been deleted successfully"}


@app.get("/api/public/projects", response_model=List[schemas.ProjectWithAllData])
def get_all_projects_public(db: Session = Depends(get_db)):
    """
    PUBLIC ENDPOINT: Get all projects with complete data.
    
    Returns all projects across all domains with:
    - Project title and description
    - All project fields (custom field data)
    - All associated media (images and other files)
    
    This endpoint is public and does not require authentication.
    Perfect for embedding project data in other websites or applications.
    
    Example response:
    [
        {
            "id": 1,
            "domain_id": 1,
            "title": "Project Name",
            "description": "Project Description",
            "fields": [...],
            "media_items": [...]
        }
    ]
    """
    projects = crud.get_all_projects_with_data(db)
    if not projects:
        return []
    return projects


@app.get("/api/public/projects/{domain_name}", response_model=List[schemas.ProjectWithAllData])
def get_projects_by_domain_name(
    domain_name: str,
    db: Session = Depends(get_db)
):
    """
    PUBLIC ENDPOINT: Get all projects for a specific domain by domain name.
    
    Path Parameter:
    - domain_name: The domain name (e.g., "kirin-cms.nl", "example.com")
    
    Returns all projects for the specified domain with:
    - Project title and description
    - All project fields (custom field data)
    - All associated media (images and other files)
    
    This endpoint is public and does not require authentication.
    Perfect for embedding domain-specific project data in other websites or applications.
    
    Example:
    GET /api/public/projects/kirin-cms.nl
    
    Example response:
    [
        {
            "id": 1,
            "domain_id": 1,
            "title": "Project Name",
            "description": "Project Description",
            "fields": [
                {
                    "id": 1,
                    "project_id": 1,
                    "field_definition_id": 1,
                    "field_key": "custom_field",
                    "field_value": "value",
                    "field_type": "text"
                }
            ],
            "media_items": [
                {
                    "id": 1,
                    "title": "Project Image",
                    "file_url": "/uploads/image.jpg",
                    "type": "image",
                    "aspect_ratio": 1.5,
                    "domain_id": 1,
                    "uploaded_by": 1,
                    "section_id": null,
                    "project_id": 1,
                    "text": null
                }
            ]
        }
    ]
    """
    projects = crud.get_projects_by_domain_name(db, domain_name)
    if not projects:
        return []
    return projects


@app.get("/api/project-field-definitions", response_model=List[schemas.ProjectFieldDefinitionRead])
def get_project_field_definitions(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    domain = crud.get_domains_by_user_id(db, current_user.id)
    if not domain:
        return []
    return crud.get_project_field_definitions(db, domain.id)


@app.post("/api/project-fields", response_model=schemas.ProjectFieldRead)
def create_project_field(
    project_field: schemas.ProjectFieldCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    project = crud.get_project(db, project_field.project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    domain = crud.get_domain(db, project.domain_id)
    if not domain or domain.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not allowed to add fields to this project")

    return crud.create_project_field(db, project_field)


@app.put("/api/project-fields/{field_id}", response_model=schemas.ProjectFieldRead)
def update_project_field(
    field_id: int,
    field_update: schemas.ProjectFieldUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_field = crud.get_project_field(db, field_id)
    if not db_field:
        raise HTTPException(status_code=404, detail="Project field not found")

    project = crud.get_project(db, db_field.project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    domain = crud.get_domain(db, project.domain_id)
    if not domain or domain.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not allowed to update fields for this project")

    return crud.update_project_field(db, field_id, field_update)


@app.delete("/api/project-fields/{field_id}", response_model=dict)
def delete_project_field(
    field_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_field = crud.get_project_field(db, field_id)
    if not db_field:
        raise HTTPException(status_code=404, detail="Project field not found")

    project = crud.get_project(db, db_field.project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    domain = crud.get_domain(db, project.domain_id)
    if not domain or domain.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not allowed to delete fields for this project")

    crud.delete_project_field(db, field_id)
    return {"message": f"Project field with ID {field_id} deleted successfully"}


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


@app.get("/api/users/{user_id}/domains", response_model=List[schemas.DomainRead])
def get_all_domains_by_user_id(user_id: int, db: Session = Depends(get_db)):
    domains = crud.get_all_domains_by_user_id(db, user_id)
    if not domains:
        return []
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
    domain_id: int | None = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Get media items for a selected domain owned by the current user.

    Query param:
    - domain_id: required when the user has multiple domains.
    """
    user_domains = crud.get_all_domains_by_user_id(db, current_user.id)
    if not user_domains:
        raise HTTPException(status_code=404, detail="No domains found for the current user")

    selected_domain = None
    if domain_id is None:
        if len(user_domains) == 1:
            selected_domain = user_domains[0]
        else:
            raise HTTPException(status_code=400, detail="domain_id is required when user has multiple domains")
    else:
        selected_domain = crud.get_domain(db, domain_id)
        if not selected_domain:
            raise HTTPException(status_code=404, detail="Selected domain not found")
        if selected_domain.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="You are not allowed to view media for this domain")

    media_items = crud.get_media_by_domain(db, selected_domain.id)
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


@app.get("/api/media/project/{project_id}", response_model=List[schemas.MediaRead])
def get_media_by_project_id(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    domain = crud.get_domain(db, project.domain_id)
    if not domain or domain.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not allowed to view media for this project")

    return crud.get_media_by_project(db, project_id)


@app.post("/api/upload", response_model=schemas.MediaRead)
async def upload_file(
    file: UploadFile = File(...),
    domain_id: int = None,
    section_id: int = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    MAX_FILE_SIZE_MB = 20
    contents = await file.read()

    if len(contents) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large")

    user_domains = crud.get_all_domains_by_user_id(db, current_user.id)
    if not user_domains:
        raise HTTPException(status_code=404, detail="Domain not found for the current user")

    domain = None
    if domain_id is None:
        if len(user_domains) == 1:
            domain = user_domains[0]
        else:
            raise HTTPException(status_code=400, detail="domain_id is required when user has multiple domains")
    else:
        domain = crud.get_domain(db, domain_id)
        if not domain:
            raise HTTPException(status_code=404, detail="Selected domain not found")
        if domain.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="You are not allowed to upload to this domain")

    upload_dir = f"./uploads/{current_user.id}{domain.name}"
    os.makedirs(upload_dir, exist_ok=True)

    is_image = file.content_type.startswith("image/")
    is_video = file.content_type.startswith("video/")
    stem = os.path.splitext(file.filename)[0]
    aspect_ratio = None

    if is_image:
        try:
            img = Image.open(io.BytesIO(contents))
            width, height = img.size
            aspect_ratio = round(height / width, 4)

            # Normalise mode for WebP (handles palette, transparency, etc.)
            if img.mode not in ("RGB", "RGBA"):
                img = img.convert("RGBA" if img.mode in ("P", "LA") else "RGB")

            webp_buf = io.BytesIO()
            img.save(webp_buf, format="WEBP", quality=85, method=6)

            save_filename = f"{stem}.webp"
            with open(os.path.join(upload_dir, save_filename), "wb") as f:
                f.write(webp_buf.getvalue())
        except Exception:
            # Fallback: store original if conversion fails
            save_filename = file.filename
            with open(os.path.join(upload_dir, save_filename), "wb") as f:
                f.write(contents)
    else:
        save_filename = file.filename
        with open(os.path.join(upload_dir, save_filename), "wb") as f:
            f.write(contents)

    media_type = "image" if is_image else ("video" if is_video else "text")

    media_data = schemas.MediaCreate(
        title=stem,
        file_url=f"/uploads/{current_user.id}{domain.name}/{save_filename}",
        type=media_type,
        domain_id=domain.id,
        uploaded_by=current_user.id,
        section_id=section_id,
        text="",
        aspect_ratio=aspect_ratio,
    )

    return crud.create_media(db, media_data)

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

    # file_url is "/uploads/..." — prepend "." to get a relative path
    file_path = "." + media_item.file_url
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
        db,
        media_id,
        update_data.title,
        update_data.text,
        update_data.section_id,
        update_data.project_id,
    )

    return updated_media

# -- ADMIN --
def require_admin(current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


@app.get("/api/admin/users", response_model=List[schemas.UserRead])
def admin_list_users(
    email: str | None = None,
    _: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return crud.get_users_filtered(db, email)


@app.put("/api/admin/users/{user_id}", response_model=schemas.UserRead)
def admin_update_user(
    user_id: int,
    data: schemas.AdminUserUpdate,
    current_user: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot modify your own account here")
    return crud.update_user_admin(db, user_id, data)


@app.delete("/api/admin/users/{user_id}")
def admin_delete_user(
    user_id: int,
    current_user: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    crud.delete_user(db, user_id)
    return {"message": f"User {user_id} deleted"}


@app.get("/api/admin/domains", response_model=List[schemas.DomainWithOwner])
def admin_list_domains(
    _: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return crud.get_domains_with_owners(db)


@app.post("/api/admin/domains", response_model=schemas.DomainRead)
def admin_create_domain(
    data: schemas.DomainCreate,
    _: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return crud.create_domain(db, data)


@app.put("/api/admin/domains/{domain_id}", response_model=schemas.DomainRead)
def admin_update_domain(
    domain_id: int,
    data: schemas.DomainUpdate,
    _: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return crud.update_domain(db, domain_id, data)


@app.delete("/api/admin/domains/{domain_id}")
def admin_delete_domain(
    domain_id: int,
    _: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    crud.delete_domain(db, domain_id)
    return {"message": f"Domain {domain_id} deleted"}


@app.post("/api/admin/email/send", response_model=schemas.EmailLogRead)
def admin_send_email(
    payload: schemas.EmailSend,
    current_user: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    try:
        _send_smtp(payload.to_email, payload.subject, payload.body)
        return crud.create_email_log(db, payload.to_email, payload.subject, payload.body, current_user.id, "sent")
    except Exception as e:
        log = crud.create_email_log(db, payload.to_email, payload.subject, payload.body, current_user.id, "failed", str(e))
        raise HTTPException(status_code=502, detail=f"SMTP error: {e}")


@app.get("/api/admin/email/logs", response_model=List[schemas.EmailLogRead])
def admin_email_logs(
    _: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return crud.get_email_logs(db)


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

    image_extensions = (".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg", ".avif")
    video_extensions = (".mp4", ".webm", ".mov", ".avi", ".mkv", ".m4v")

    # Keep only media not linked to projects and include photos/videos.
    gallery_items = []
    for item in media_items:
        if item.project_id is not None:
            continue

        file_url = (item.file_url or "").lower()
        is_image = item.type == "image" or file_url.endswith(image_extensions)
        is_video = file_url.endswith(video_extensions)

        if is_image or is_video:
            gallery_items.append(item)

    if not gallery_items:
        raise HTTPException(status_code=404, detail="No gallery media found for this domain")

    return gallery_items