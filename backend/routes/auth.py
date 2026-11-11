# backend/routes/auth.py
from datetime import datetime

import bcrypt
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required
from marshmallow import ValidationError

from extensions import db
from models import DonorProfile, MentorProfile, NgoProfile, StudentProfile, User
from schemas import LoginSchema, RegisterSchema
from utils.mail import send_mail
from utils.notify import notify_admins
from utils.security import api_error, current_user

auth_bp = Blueprint("auth", __name__)
register_schema = RegisterSchema()
login_schema = LoginSchema()

PROFILE_KEYS = {
    "student": ["education", "skills", "interests", "location", "date_of_birth", "address"],
    "ngo": ["org_type", "mission", "contact_number", "address", "description"],
    "donor": ["donation_type"],
    "mentor": ["expertise", "availability"],
}


def make_profile(user, role, data):
    clean = {k: data.get(k) for k in PROFILE_KEYS[role] if data.get(k) not in (None, "")}
    if role == "student":
        if clean.get("date_of_birth"):
            try:
                clean["date_of_birth"] = datetime.strptime(
                    clean["date_of_birth"], "%Y-%m-%d"
                ).date()
            except (TypeError, ValueError):
                clean.pop("date_of_birth", None)
        profile = StudentProfile(user_id=user.id, **clean)
    elif role == "ngo":
        profile = NgoProfile(user_id=user.id, **clean)
    elif role == "donor":
        profile = DonorProfile(user_id=user.id, **clean)
    else:
        profile = MentorProfile(user_id=user.id, **clean)
    db.session.add(profile)


@auth_bp.post("/auth/register")
def register():
    payload = request.get_json(silent=True) or {}
    try:
        data = register_schema.load(payload)
    except ValidationError as err:
        return api_error("Check the form fields.", 400, err.messages)

    email = data["email"].strip().lower()
    if User.query.filter_by(email=email).first():
        return api_error("An account with this email already exists.", 409)

    status = "pending" if data["role"] in ("ngo", "mentor") else "active"
    user = User(
        role=data["role"],
        name=data["name"].strip(),
        email=email,
        phone=data.get("phone"),
        status=status,
        password_hash=bcrypt.hashpw(
            data["password"].encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8"),
    )
    db.session.add(user)
    db.session.flush()
    make_profile(user, data["role"], data.get("profile") or {})
    notify_admins(
        "New registration pending",
        f"{user.name} registered as {user.role}. Review the account.",
    )
    db.session.commit()
    send_mail(
        user.email,
        "Edu-Bridge registration received",
        f"Hello {user.name}, your {user.role} account is {status}.",
    )

    body = {"user": user.to_dict(), "status": status}
    if status == "pending":
        body["message"] = f"Your {user.role.upper()} account is awaiting admin approval."
    return jsonify(body), 201


@auth_bp.post("/auth/login")
def login():
    payload = request.get_json(silent=True) or {}
    try:
        data = login_schema.load(payload)
    except ValidationError as err:
        return api_error("Enter a valid email and password.", 400, err.messages)

    user = User.query.filter_by(email=data["email"].strip().lower()).first()
    if user is None or not bcrypt.checkpw(
        data["password"].encode("utf-8"), user.password_hash.encode("utf-8")
    ):
        return api_error("Email or password is incorrect.", 401)

    if user.status == "pending":
        label = "NGO" if user.role == "ngo" else user.role.capitalize()
        return api_error(f"Your {label} account is awaiting admin approval.", 403)
    if user.status == "suspended":
        return api_error("This account is suspended. Contact the admin.", 403)

    token = create_access_token(
        identity=str(user.id), additional_claims={"role": user.role}
    )
    return jsonify({"access_token": token, "user": user.to_dict()})


@auth_bp.get("/auth/me")
@jwt_required()
def me():
    user = current_user()
    if user is None:
        return api_error("Authentication required.", 401)
    profile = user.profile.to_dict() if user.profile else {}
    return jsonify({"user": user.to_dict(), "profile": profile})
