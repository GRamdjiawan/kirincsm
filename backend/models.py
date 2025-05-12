from sqlalchemy import Column, Integer, String, Text, ForeignKey, CheckConstraint, UniqueConstraint, TIMESTAMP
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy.sql import func

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    name = Column(Text)
    email = Column(Text, unique=True)
    password_hash = Column(Text)
    role = Column(Text, CheckConstraint("role IN ('admin', 'editor', 'client')"))

    pages = relationship("Page", back_populates="author")
    media_items = relationship("Media", back_populates="uploader")


class Page(Base):
    __tablename__ = 'pages'
    
    id = Column(Integer, primary_key=True)
    title = Column(Text)
    slug = Column(Text, unique=True)
    content = Column(Text)
    cover_image_url = Column(Text)
    user_id = Column(Integer, ForeignKey('users.id'))
    updated_at = Column(TIMESTAMP, server_default=func.now())

    author = relationship("User", back_populates="pages")
    seo = relationship("SEO", uselist=False, back_populates="page")


class SEO(Base):
    __tablename__ = 'seo'
    
    id = Column(Integer, primary_key=True)
    page_id = Column(Integer, ForeignKey('pages.id', ondelete="CASCADE"), unique=True)
    meta_title = Column(Text)
    meta_description = Column(Text)
    keywords = Column(Text)
    og_image_url = Column(Text)

    page = relationship("Page", back_populates="seo")


class Media(Base):
    __tablename__ = 'media'
    
    id = Column(Integer, primary_key=True)
    file_url = Column(Text)
    alt_text = Column(Text)
    uploaded_by = Column(Integer, ForeignKey('users.id'))

    uploader = relationship("User", back_populates="media_items")
