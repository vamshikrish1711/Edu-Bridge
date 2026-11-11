# backend/utils/uploads.py
import uuid
from pathlib import Path

from flask import current_app

ALLOWED_EXTENSIONS = {"pdf", "mp4", "epub", "docx"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def save_upload(file_storage):
    if not file_storage or not file_storage.filename:
        return None, "No file selected."
    if not allowed_file(file_storage.filename):
        return None, "Only pdf, mp4, epub and docx files are allowed."
    ext = file_storage.filename.rsplit(".", 1)[1].lower()
    folder = Path(current_app.config["UPLOAD_FOLDER"])
    folder.mkdir(parents=True, exist_ok=True)
    name = f"{uuid.uuid4().hex}.{ext}"
    file_storage.save(folder / name)
    return f"uploads/{name}", None
