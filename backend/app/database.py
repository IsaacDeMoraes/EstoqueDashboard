from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = "sqlite:///./estoque.db"

# check_same_thread=False é necessário só pro SQLite (não afeta outros bancos)
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency do FastAPI: abre uma sessão por request e garante que fecha depois."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
