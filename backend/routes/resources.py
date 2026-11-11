# backend/routes/resources.py
from flask import Blueprint, jsonify, request

from extensions import db
from models import Resource
from utils.security import api_error, current_user, roles_required
from utils.uploads import save_upload

resources_bp = Blueprint("resources", __name__)

RESOURCE_TYPES = ("pdf", "video", "link", "ebook")
LEVELS = ("beginner", "intermediate", "advanced")


@resources_bp.get("/resources")
def list_resources():
    query = Resource.query
    topic = request.args.get("topic")
    level = request.args.get("level")
    resource_type = request.args.get("type")
    search = request.args.get("q", "").strip()
    if topic:
        query = query.filter(Resource.topic == topic)
    if level:
        query = query.filter(Resource.skill_level == level)
    if resource_type:
        query = query.filter(Resource.type == resource_type)
    if search:
        query = query.filter(Resource.title.ilike(f"%{search}%"))
    resources = query.order_by(Resource.created_at.desc()).all()
    return jsonify({"resources": [r.to_dict() for r in resources]})


@resources_bp.post("/resources")
@roles_required("mentor", "ngo")
def create_resource():
    user = current_user()
    data = request.get_json(silent=True) or {}
    file_path = data.get("file_path")

    if request.files.get("file"):
        file_path, error = save_upload(request.files["file"])
        if error:
            return api_error(error, 400, {"file": [error]})
        data = request.form.to_dict()

    title = str(data.get("title") or "").strip()
    topic = str(data.get("topic") or "").strip()
    resource_type = data.get("type")
    skill_level = data.get("skill_level")
    url = str(data.get("url") or "").strip() or None

    fields = {}
    if len(title) < 3:
        fields["title"] = ["Title must be at least 3 characters."]
    if not topic:
        fields["topic"] = ["Topic is required."]
    if resource_type not in RESOURCE_TYPES:
        fields["type"] = ["Choose pdf, video, link or ebook."]
    if skill_level not in LEVELS:
        fields["skill_level"] = ["Choose beginner, intermediate or advanced."]
    if not file_path and not url:
        fields["url"] = ["Add a URL or upload a file."]
    if fields:
        return api_error("Check the resource fields.", 400, fields)

    resource = Resource(
        uploader_id=user.id,
        title=title,
        type=resource_type,
        topic=topic,
        skill_level=skill_level,
        description=data.get("description"),
        file_path=file_path,
        url=url,
    )
    db.session.add(resource)
    db.session.commit()
    return jsonify({"resource": resource.to_dict()}), 201


@resources_bp.delete("/resources/<int:resource_id>")
@roles_required("mentor", "ngo", "admin")
def delete_resource(resource_id):
    user = current_user()
    resource = db.session.get(Resource, resource_id)
    if resource is None:
        return api_error("Resource not found.", 404)
    if user.role != "admin" and resource.uploader_id != user.id:
        return api_error("You can only delete your own resources.", 403)
    db.session.delete(resource)
    db.session.commit()
    return jsonify({"message": "Resource deleted."})
