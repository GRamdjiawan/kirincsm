from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import joinedload
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
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    return user

    

def change_password(db: Session, user: models.User, old_password: str, new_password: str):
    if not verify_password(old_password, user.password):
        raise HTTPException(status_code=403, detail="Old password is incorrect")

    user.password = hash_password(new_password)
    db.commit()
    db.refresh(user)
    return user



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

def get_all_domains_by_user_id(db: Session, user_id: int):
    return db.query(models.Domain).filter(models.Domain.user_id == user_id).all()



# PAGES
def create_page(db: Session, page: schemas.PageCreate):
    db_page = models.Page(**page.dict())
    db.add(db_page)
    db.commit()
    db.refresh(db_page)

    return db_page

def get_pages(db: Session):
    return db.query(models.Page).all()

def get_page(db: Session, page_id: int):
    return db.query(models.Page).filter(models.Page.id == page_id).first()

def get_pages_by_user_id(db: Session, user_id: int):
    domains = db.query(models.Domain).filter(models.Domain.user_id == user_id).all()
    domain_ids = [domain.id for domain in domains]
    # Join pages and sections, count sections per page
    results = (
        db.query(
            models.Page.id,
            models.Page.title,
            models.Page.hierarchy,
            func.count(models.Section.id).label("sections")
        )
        .outerjoin(models.Section, models.Page.id == models.Section.page_id)
        .filter(models.Page.domain_id.in_(domain_ids))
        .group_by(models.Page.id)
        .order_by(models.Page.hierarchy.asc())
        .all()
    )
    # Convert to list of dicts
    return [
        {
            "id": str(row.id),
            "title": row.title,
            "hierarchy": row.hierarchy,
            "sections": row.sections
        }
        for row in results
    ]



# SECTIONS
def create_section(db: Session, section: schemas.SectionCreate, page_id: int = None):
    data = section.dict()
    if page_id:
        data["page_id"] = page_id
    
    # Ensure type is provided
    if not data.get("type"):
        raise HTTPException(status_code=400, detail="Section type is required")
        
    db_section = models.Section(**data)
    db.add(db_section)
    db.commit()
    db.refresh(db_section)
    return db_section

def get_sections_by_page_and_user(db: Session, page_id: int, user_id: int):
    # Get all domains for the user
    domains = db.query(models.Domain).filter(models.Domain.user_id == user_id).all()
    domain_ids = [domain.id for domain in domains]
    # Get the page and check if it belongs to one of the user's domains
    page = db.query(models.Page).filter(models.Page.id == page_id, models.Page.domain_id.in_(domain_ids)).first()
    if not page:
        return []
    # Return all sections for this page
    return db.query(models.Section).filter(
        (models.Section.page_id == page_id) & (models.Section.title != "is")
    ).all()
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


# PROJECTS
def create_project(db: Session, project: schemas.ProjectCreate):
    db_project = models.Project(**project.dict())
    db.add(db_project)
    db.commit()
    return get_project(db, db_project.id)


def get_projects(db: Session):
    return db.query(models.Project).all()


def get_project(db: Session, project_id: int):
    return (
        db.query(models.Project)
        .options(joinedload(models.Project.fields))
        .filter(models.Project.id == project_id)
        .first()
    )


def get_projects_by_domain(db: Session, domain_id: int):
    return (
        db.query(models.Project)
        .options(joinedload(models.Project.fields))
        .filter(models.Project.domain_id == domain_id)
        .all()
    )


def update_project(db: Session, project_id: int, project_update: schemas.ProjectUpdate):
    db_project = get_project(db, project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")

    update_data = project_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_project, key, value)

    db.commit()
    return get_project(db, project_id)


def delete_project(db: Session, project_id: int):
    db_project = get_project(db, project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(db_project)
    db.commit()
    return db_project


def get_project_field_definitions(db: Session, domain_id: int):
    return (
        db.query(models.ProjectFieldDefinition)
        .filter(
            (models.ProjectFieldDefinition.domain_id.is_(None)) |
            (models.ProjectFieldDefinition.domain_id == domain_id)
        )
        .order_by(models.ProjectFieldDefinition.name.asc())
        .all()
    )


def get_project_field(db: Session, field_id: int):
    return db.query(models.ProjectField).filter(models.ProjectField.id == field_id).first()


def create_project_field(db: Session, project_field: schemas.ProjectFieldCreate):
    db_field = models.ProjectField(**project_field.dict())
    db.add(db_field)
    db.commit()
    db.refresh(db_field)
    return db_field


def update_project_field(db: Session, field_id: int, field_update: schemas.ProjectFieldUpdate):
    db_field = get_project_field(db, field_id)
    if not db_field:
        raise HTTPException(status_code=404, detail="Project field not found")

    update_data = field_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_field, key, value)

    db.commit()
    db.refresh(db_field)
    return db_field


def delete_project_field(db: Session, field_id: int):
    db_field = get_project_field(db, field_id)
    if not db_field:
        raise HTTPException(status_code=404, detail="Project field not found")

    db.delete(db_field)
    db.commit()
    return db_field


# MEDIA
def create_media(db: Session, media: schemas.MediaCreate):
    # Ensure title is provided since it's required in the database
    if not media.title:
        raise HTTPException(status_code=400, detail="Media title is required")
        
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

def get_media_by_section_and_user(db, section_id, user_id):
    return db.query(models.Media).filter(
        models.Media.section_id == section_id,
        models.Media.uploaded_by == user_id
    ).all()

def get_media_by_domain(db: Session, domain_id: int):
    return db.query(models.Media).filter(models.Media.domain_id == domain_id).all()

def get_media_by_project(db: Session, project_id: int):
    return db.query(models.Media).filter(models.Media.project_id == project_id).all()

def get_all_media_by_domain(db: Session, domain_id: int):
    return db.query(
        models.Media.id,
        models.Media.title,
        models.Media.file_url,
        models.Media.type,
        models.Media.domain_id,
        models.Media.section_id,
        models.Media.project_id,
        models.Media.text
    ).filter(models.Media.domain_id == domain_id).all()
def delete_media(db: Session, media_id: int):
    """
    Delete a media item from the database by its ID.

    Args:
        db (Session): The database session.
        media_id (int): The ID of the media item to delete.

    Returns:
        models.Media: The deleted media item.
    """
    media_item = db.query(models.Media).filter(models.Media.id == media_id).first()
    if not media_item:
        raise HTTPException(status_code=404, detail="Media item not found")
    
    db.delete(media_item)
    db.commit()
    return media_item

def update_media(db: Session, media_id: int, title: str, text: str, section_id: int, project_id: int | None):
    """
    Update the title and text (alt text) of a media item.
    Args:
        db (Session): The database session.
        media_id (int): The ID of the media item to update.
        title (str): The new title for the media item.
        text (str): The new alt text for the media item.

    Returns:
        models.Media: The updated media item.
    """
    media_item = db.query(models.Media).filter(models.Media.id == media_id).first()
    if not media_item:
        raise HTTPException(status_code=404, detail="Media item not found")

    media_item.title = title
    media_item.text = text
    media_item.section_id = section_id
    media_item.project_id = project_id
    db.commit()
    db.refresh(media_item)
    return media_item