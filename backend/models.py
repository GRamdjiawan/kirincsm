from sqlalchemy import (
    Column, Integer, String, Text, ForeignKey, CheckConstraint,
    UniqueConstraint, TIMESTAMP, Enum
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    name = Column(Text)
    email = Column(Text, unique=True)
    password = Column(Text)
    role = Column(Text, CheckConstraint("role IN ('admin', 'editor', 'client')"))

    pages = relationship("Page", back_populates="author", cascade="all, delete-orphan")
    media_items = relationship("Media", back_populates="uploader", cascade="all, delete-orphan")
    domains = relationship("Domain", back_populates="owner", cascade="all, delete-orphan")


class Domain(Base):
    __tablename__ = 'domains'

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    owner = relationship("User", back_populates="domains")
    pages = relationship("Page", back_populates="domain", cascade="all, delete-orphan")
    seo = relationship("SEO", back_populates="domain", uselist=False, cascade="all, delete-orphan")


class Page(Base):
    __tablename__ = 'pages'
    
    id = Column(Integer, primary_key=True)
    title = Column(Text)
    slug = Column(Text, unique=True)
    content = Column(Text)
    cover_image_url = Column(Text)
    user_id = Column(Integer, ForeignKey('users.id'))
    domain_id = Column(Integer, ForeignKey('domains.id'))
    updated_at = Column(TIMESTAMP, server_default=func.now())

    author = relationship("User", back_populates="pages")
    domain = relationship("Domain", back_populates="pages")
    sections = relationship("Section", back_populates="page", cascade="all, delete-orphan")


class Section(Base):
    __tablename__ = 'sections'

    id = Column(Integer, primary_key=True)
    page_id = Column(Integer, ForeignKey('pages.id', ondelete="CASCADE"))
    title = Column(String(255))
    content = Column(Text)
    position = Column(Integer, default=0)

    page = relationship("Page", back_populates="sections")
    media_items = relationship("Media", back_populates="section", cascade="all, delete-orphan")


class Media(Base):
    __tablename__ = 'media'

    id = Column(Integer, primary_key=True)
    file_url = Column(Text)
    alt_text = Column(Text)
    uploaded_by = Column(Integer, ForeignKey('users.id'))
    section_id = Column(Integer, ForeignKey('sections.id', ondelete="CASCADE"))
    type = Column(Enum('image', 'text', name="media_type"), default='image')

    uploader = relationship("User", back_populates="media_items")
    section = relationship("Section", back_populates="media_items")


class SEO(Base):
    __tablename__ = 'seo'

    id = Column(Integer, primary_key=True)
    domain_id = Column(Integer, ForeignKey('domains.id', ondelete="CASCADE"), unique=True)
    meta_title = Column(Text)
    meta_description = Column(Text)
    keywords = Column(Text)
    og_image_url = Column(Text)

    domain = relationship("Domain", back_populates="seo")
