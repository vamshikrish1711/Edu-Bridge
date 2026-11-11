# backend/config.py
import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")


def _database_uri():
    uri = os.getenv("DATABASE_URL", "sqlite:///edubridge.db")
    if uri.startswith("sqlite:///") and not uri.startswith("sqlite:////"):
        name = uri.replace("sqlite:///", "", 1)
        uri = f"sqlite:///{(BASE_DIR / name).as_posix()}"
    return uri


class Config:
    SECRET_KEY = os.getenv(
        "SECRET_KEY", "dev-only-secret-key-change-before-deploying-32"
    )
    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY", "dev-only-jwt-key-change-before-deploying-32"
    )
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        hours=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES_HOURS", "12"))
    )
    SQLALCHEMY_DATABASE_URI = _database_uri()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
    BACKEND_PORT = int(os.getenv("BACKEND_PORT", "5000"))
    UPLOAD_FOLDER = str(BASE_DIR / os.getenv("UPLOAD_FOLDER", "uploads"))
    MAX_CONTENT_LENGTH = int(os.getenv("MAX_UPLOAD_MB", "20")) * 1024 * 1024
    JSON_SORT_KEYS = False
    AUTO_CREATE_DB = os.getenv("AUTO_CREATE_DB", "1") == "1"
