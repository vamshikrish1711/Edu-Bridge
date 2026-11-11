# backend/routes/applications.py
from datetime import datetime

from flask import Blueprint, jsonify, request

from extensions import db
from models import Application, Program
from utils.notify import notify
from utils.security import api_error, current_user, roles_required

applications_bp = Blueprint("applications", __name__)


@applications_bp.post("/programs/<int:program_id>/apply")
@roles_required("student")
def apply_to_program(program_id):
    user = current_user()
    program = db.session.get(Program, program_id)
    if program is None:
        return api_error("Program not found.", 404)
    if program.status == "completed":
        return api_error("This program is closed.", 400)

    existing = Application.query.filter_by(
        program_id=program.id, student_id=user.id
    ).first()
    if existing:
        return api_error("You already applied to this program.", 409)

    message = (request.get_json(silent=True) or {}).get("message")
    application = Application(
        program_id=program.id, student_id=user.id, message=message, status="pending"
    )
    db.session.add(application)
    notify(
        program.ngo_id,
        "New application",
        f"{user.name} applied to {program.title}.",
    )
    db.session.commit()
    return jsonify({"application": application.to_dict()}), 201


@applications_bp.get("/applications")
@roles_required("student", "ngo", "mentor", "admin")
def list_applications():
    user = current_user()
    query = Application.query

    if user.role == "student":
        query = query.filter(Application.student_id == user.id)
    elif user.role == "ngo":
        query = query.join(Program).filter(Program.ngo_id == user.id)
    elif user.role == "mentor":
        query = query.join(Program).filter(Program.type == "mentorship")

    status = request.args.get("status")
    if status:
        query = query.filter(Application.status == status)

    applications = query.order_by(Application.created_at.desc()).all()
    return jsonify({"applications": [a.to_dict() for a in applications]})


@applications_bp.patch("/applications/<int:application_id>")
@roles_required("ngo", "mentor", "admin")
def review_application(application_id):
    user = current_user()
    application = db.session.get(Application, application_id)
    if application is None:
        return api_error("Application not found.", 404)

    program = application.program
    allowed = user.role == "admin"
    if user.role == "ngo" and program.ngo_id == user.id:
        allowed = True
    if user.role == "mentor" and program.type == "mentorship":
        allowed = True
    if not allowed:
        return api_error("You cannot review this application.", 403)
    if application.status != "pending":
        return api_error("This application is already decided.", 409)

    status = (request.get_json(silent=True) or {}).get("status")
    if status not in ("approved", "rejected"):
        return api_error("Status must be approved or rejected.", 400, {
            "status": ["Choose approved or rejected."]
        })

    application.status = status
    application.decided_at = datetime.utcnow()
    notify(
        application.student_id,
        f"Application {status}",
        f"Your application to {program.title} was {status}.",
    )
    db.session.commit()
    return jsonify({"application": application.to_dict()})
