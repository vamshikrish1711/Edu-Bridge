# backend/routes/profile.py
from datetime import datetime

from flask import Blueprint, jsonify, request

from extensions import db
from models import User
from utils.security import api_error, current_user, roles_required

profile_bp = Blueprint("profile", __name__)

EDITABLE = {
    "student": ["education", "skills", "interests", "location", "date_of_birth", "address"],
    "ngo": ["org_type", "mission", "contact_number", "address", "description"],
    "donor": ["donation_type"],
    "mentor": ["expertise", "availability"],
}


@profile_bp.get("/profile")
@roles_required("student", "ngo", "donor", "mentor", "admin")
def get_profile():
    user = current_user()
    return jsonify(
        {
            "user": user.to_dict(),
            "profile": user.profile.to_dict() if user.profile else {},
        }
    )


@profile_bp.put("/profile")
@roles_required("student", "ngo", "donor", "mentor", "admin")
def update_profile():
    user = current_user()
    data = request.get_json(silent=True) or {}
    fields = {}

    if "name" in data:
        name = str(data["name"]).strip()
        if len(name) < 2:
            fields["name"] = ["Name must be at least 2 characters."]
        else:
            user.name = name
    if "phone" in data:
        user.phone = str(data["phone"]).strip()[:30]

    if user.role in EDITABLE and user.profile:
        for key in EDITABLE[user.role]:
            if key not in data:
                continue
            value = data[key]
            if key == "date_of_birth":
                if not value:
                    setattr(user.profile, key, None)
                    continue
                try:
                    value = datetime.strptime(str(value), "%Y-%m-%d").date()
                except ValueError:
                    fields["date_of_birth"] = ["Use YYYY-MM-DD."]
                    continue
            if key == "donation_type" and value not in ("monetary", "material"):
                fields["donation_type"] = ["Choose monetary or material."]
                continue
            setattr(user.profile, key, value)

    if fields:
        return api_error("Check the form fields.", 400, fields)

    db.session.commit()
    return jsonify(
        {
            "user": user.to_dict(),
            "profile": user.profile.to_dict() if user.profile else {},
        }
    )


@profile_bp.get("/students")
@roles_required("donor", "admin")
def list_students():
    students = (
        User.query.filter_by(role="student", status="active")
        .order_by(User.name.asc())
        .all()
    )
    rows = []
    for student in students:
        profile = student.student_profile
        rows.append(
            {
                "id": student.id,
                "name": student.name,
                "email": student.email,
                "education": profile.education if profile else None,
                "location": profile.location if profile else None,
                "interests": profile.interests if profile else None,
                "skills": profile.skills if profile else None,
            }
        )
    return jsonify({"students": rows})
