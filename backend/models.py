from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
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
    page = relationship("Page", back_populates="sections")
    type = Column(String(255))
    media_items = relationship("Media", back_populates="section")

class Media(Base):
    __tablename__ = 'media'
    id = Column(Integer, primary_key=True)
    file_url = Column(Text)
    text = Column(Text)
    uploaded_by = Column(Integer, ForeignKey('users.id'))
    section_id = Column(Integer, ForeignKey('sections.id'))
    type = Column(Enum('image', 'text'), default='image')
    title = Column(String(255))
    section = relationship("Section", back_populates="media_items")

class SEO(Base):
    __tablename__ = 'seo'
    id = Column(Integer, primary_key=True)
    domain_id = Column(Integer, ForeignKey('domains.id'), unique=True)
    meta_title = Column(String(255))
    meta_description = Column(Text)
    keywords = Column(Text)
    icon = Column(Text)