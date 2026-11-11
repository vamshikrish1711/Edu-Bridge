# backend/routes/admin.py
from datetime import datetime

from flask import Blueprint, jsonify, request
from sqlalchemy import func

from extensions import db
from models import Application, Donation, MentorshipRequest, Program, User
from utils.notify import notify
from utils.security import api_error, current_user, roles_required

admin_bp = Blueprint("admin", __name__)


@admin_bp.get("/stats")
def public_stats():
    active_programs = Program.query.filter_by(status="active").count()
    total_donations = (
        db.session.query(func.coalesce(func.sum(Donation.amount), 0))
        .filter(Donation.status == "success")
        .scalar()
    )
    return jsonify(
        {
            "students": User.query.filter_by(role="student", status="active").count(),
            "ngos": User.query.filter_by(role="ngo", status="active").count(),
            "mentors": User.query.filter_by(role="mentor", status="active").count(),
            "active_programs": active_programs,
            "total_donations": float(total_donations or 0),
        }
    )


@admin_bp.get("/admin/users")
@roles_required("admin")
def list_users():
    query = User.query
    role = request.args.get("role")
    status = request.args.get("status")
    search = request.args.get("q", "").strip()
    if role:
        query = query.filter(User.role == role)
    if status:
        query = query.filter(User.status == status)
    if search:
        like = f"%{search}%"
        query = query.filter(
            db.or_(User.name.ilike(like), User.email.ilike(like))
        )
    users = query.order_by(User.created_at.desc()).all()
    return jsonify({"users": [u.to_dict() for u in users]})


@admin_bp.patch("/admin/users/<int:user_id>/status")
@roles_required("admin")
def set_user_status(user_id):
    admin = current_user()
    user = db.session.get(User, user_id)
    if user is None:
        return api_error("User not found.", 404)
    if user.id == admin.id:
        return api_error("You cannot change your own status.", 400)
    status = (request.get_json(silent=True) or {}).get("status")
    if status not in ("active", "suspended"):
        return api_error("Status must be active or suspended.", 400)
    user.status = status
    notify(
        user.id,
        f"Account {status}",
        f"An admin set your account status to {status}.",
    )
    db.session.commit()
    return jsonify({"user": user.to_dict()})


@admin_bp.get("/admin/pending")
@roles_required("admin")
def pending_accounts():
    users = (
        User.query.filter(
            User.role.in_(["ngo", "mentor"]), User.status == "pending"
        )
        .order_by(User.created_at.asc())
        .all()
    )
    return jsonify({"pending": [u.to_dict() for u in users]})


@admin_bp.patch("/admin/pending/<int:user_id>")
@roles_required("admin")
def decide_pending(user_id):
    user = db.session.get(User, user_id)
    if user is None or user.role not in ("ngo", "mentor"):
        return api_error("Pending account not found.", 404)
    action = (request.get_json(silent=True) or {}).get("action")
    if action not in ("approve", "reject"):
        return api_error("Action must be approve or reject.", 400)
    if user.status != "pending":
        return api_error("This account is not pending.", 409)

    user.status = "active" if action == "approve" else "suspended"
    notify(
        user.id,
        f"Account {action}d",
        f"Your {user.role.upper()} account was {action}d by an admin.",
    )
    db.session.commit()
    return jsonify({"user": user.to_dict()})


@admin_bp.get("/admin/analytics")
@roles_required("admin")
def analytics():
    total_donations = (
        db.session.query(func.coalesce(func.sum(Donation.amount), 0))
        .filter(Donation.status == "success")
        .scalar()
    )
    active_programs = Program.query.filter_by(status="active").count()
    student_participation = (
        db.session.query(func.count(func.distinct(Application.student_id)))
        .filter(Application.status == "approved")
        .scalar()
    )
    accepted = MentorshipRequest.query.filter_by(status="accepted").count()
    decided = MentorshipRequest.query.filter(
        MentorshipRequest.status.in_(["accepted", "rejected"])
    ).count()
    acceptance_rate = round((accepted / decided) * 100, 1) if decided else 0

    monthly = {}
    now = datetime.utcnow()
    for i in range(11, -1, -1):
        month = now.month - i
        year = now.year
        while month <= 0:
            month += 12
            year -= 1
        monthly[f"{year}-{month:02d}"] = 0.0
    for donation in Donation.query.filter_by(status="success").all():
        key = donation.created_at.strftime("%Y-%m")
        if key in monthly:
            monthly[key] += float(donation.amount)

    top_rows = (
        db.session.query(
            User.id, User.name, func.coalesce(func.sum(Donation.amount), 0)
        )
        .join(Program, Program.ngo_id == User.id)
        .join(Donation, Donation.program_id == Program.id)
        .filter(Donation.status == "success")
        .group_by(User.id, User.name)
        .order_by(func.sum(Donation.amount).desc())
        .limit(5)
        .all()
    )

    return jsonify(
        {
            "total_donations": float(total_donations or 0),
            "donations_per_month": [
                {"month": key, "amount": round(value, 2)}
                for key, value in monthly.items()
            ],
            "active_programs": active_programs,
            "student_participation": student_participation or 0,
            "mentorship_acceptance_rate": acceptance_rate,
            "top_ngos": [
                {"ngo_id": row[0], "name": row[1], "total": float(row[2] or 0)}
                for row in top_rows
            ],
            "counts": {
                "users": User.query.count(),
                "programs": Program.query.count(),
                "donations": Donation.query.filter_by(status="success").count(),
            },
        }
    )
