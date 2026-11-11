# backend/routes/uploads.py
from pathlib import Path

from flask import Blueprint, current_app, jsonify, request, send_from_directory

from utils.security import api_error, roles_required
from utils.uploads import save_upload

uploads_bp = Blueprint("uploads", __name__)


@uploads_bp.post("/uploads")
@roles_required("mentor", "ngo")
def upload_file():
    if "file" not in request.files:
        return api_error("No file selected.", 400, {"file": ["No file selected."]})
    path, error = save_upload(request.files["file"])
    if error:
        return api_error(error, 400, {"file": [error]})
    return jsonify({"file_path": path, "url": f"/{path}"}), 201


@uploads_bp.get("/uploads/<path:filename>")
def serve_upload(filename):
    folder = Path(current_app.config["UPLOAD_FOLDER"])
    return send_from_directory(folder, filename, as_attachment=False)
