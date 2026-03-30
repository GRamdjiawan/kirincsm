from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import DateTime, Column
from datetime import datetime

DATABASE_URL = "mysql+pymysql://root:root@localhost:3306/nebula-cms"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()
updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
