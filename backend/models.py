from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum, Float, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    email = Column(String(255), unique=True, nullable=False)
    password = Column(Text, nullable=False)
    role = Column(Enum('admin', 'editor', 'client'), default='client', nullable=False)
    domains = relationship("Domain", back_populates="owner")

class Domain(Base):
    __tablename__ = 'domains'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    owner = relationship("User", back_populates="domains")
    pages = relationship("Page", back_populates="domain")
    media_items = relationship("Media", back_populates="domain")
    projects = relationship("Project", back_populates="domain")
    project_field_definitions = relationship("ProjectFieldDefinition", back_populates="domain")

class Page(Base):
    __tablename__ = 'pages'
    id = Column(Integer, primary_key=True)
    title = Column(String(255))
    hierarchy = Column(Integer, nullable=False)
    domain_id = Column(Integer, ForeignKey('domains.id'))
    domain = relationship("Domain", back_populates="pages")
    sections = relationship("Section", back_populates="page")

class Section(Base):
    __tablename__ = 'sections'
    id = Column(Integer, primary_key=True)
    page_id = Column(Integer, ForeignKey('pages.id'), nullable=False)
    title = Column(String(255))
    position = Column(Integer, default=0)
    type = Column(String(255), nullable=False)  # Added required type field
    page = relationship("Page", back_populates="sections")
    media_items = relationship("Media", back_populates="section")

class Media(Base):
    __tablename__ = 'media'
    id = Column(Integer, primary_key=True)
    file_url = Column(Text)
    text = Column(Text)
    domain_id = Column(Integer, ForeignKey('domains.id'))  # Added domain_id field
    uploaded_by = Column(Integer, ForeignKey('users.id'))
    section_id = Column(Integer, ForeignKey('sections.id'))
    project_id = Column(Integer, ForeignKey('projects.id'), nullable=True)
    type = Column(Enum('image', 'text'), default='image')
    aspect_ratio = Column(Float, nullable=True)  # Added aspect_ratio field
    title = Column(String(255), nullable=False)  # Made title required
    section = relationship("Section", back_populates="media_items")
    domain = relationship("Domain", back_populates="media_items")
    project = relationship("Project", back_populates="media_items")


class Project(Base):
    __tablename__ = 'projects'
    id = Column(Integer, primary_key=True)
    domain_id = Column(Integer, ForeignKey('domains.id'), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)

    domain = relationship("Domain", back_populates="projects")
    media_items = relationship("Media", back_populates="project")
    fields = relationship("ProjectField", back_populates="project", cascade="all, delete-orphan")


class ProjectFieldDefinition(Base):
    __tablename__ = 'project_field_definitions'
    id = Column(Integer, primary_key=True)
    domain_id = Column(Integer, ForeignKey('domains.id'), nullable=True)
    name = Column(String(255), nullable=False)
    key_name = Column(String(255), nullable=False)
    field_type = Column(String(50), default='text')

    domain = relationship("Domain", back_populates="project_field_definitions")
    project_fields = relationship("ProjectField", back_populates="field_definition")


class ProjectField(Base):
    __tablename__ = 'project_fields'
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey('projects.id'), nullable=False)
    field_definition_id = Column(Integer, ForeignKey('project_field_definitions.id'), nullable=True)
    field_key = Column(String(255), nullable=False)
    field_value = Column(Text, nullable=True)
    field_type = Column(String(50), default='text')

    project = relationship("Project", back_populates="fields")
    field_definition = relationship("ProjectFieldDefinition", back_populates="project_fields")

class SEO(Base):
    __tablename__ = 'seo'
    id = Column(Integer, primary_key=True)
    domain_id = Column(Integer, ForeignKey('domains.id'), unique=True)
    meta_title = Column(String(255))
    meta_description = Column(Text)
    keywords = Column(Text)
    icon = Column(Text)


class EmailLog(Base):
    __tablename__ = 'email_logs'
    id = Column(Integer, primary_key=True)
    to_email = Column(String(255), nullable=False)
    subject = Column(String(500), nullable=False)
    body = Column(Text, nullable=False)
    sent_by = Column(Integer, ForeignKey('users.id'), nullable=True)
    status = Column(Enum('sent', 'failed'), default='sent', nullable=False)
    error = Column(Text, nullable=True)
    sent_at = Column(DateTime, server_default=func.now(), nullable=False)