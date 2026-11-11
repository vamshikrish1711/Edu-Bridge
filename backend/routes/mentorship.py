# backend/routes/mentorship.py
from datetime import datetime

from flask import Blueprint, jsonify, request

from extensions import db
from models import MentorshipRequest, MentorshipSession, User
from utils.notify import notify
from utils.security import api_error, current_user, roles_required

mentorship_bp = Blueprint("mentorship", __name__)


def parse_when(value):
    if not value:
        return None
    try:
        parsed = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError:
        return None
    return parsed.replace(tzinfo=None)


@mentorship_bp.get("/mentors")
def list_mentors():
    mentors = (
        User.query.filter_by(role="mentor", status="active")
        .order_by(User.name.asc())
        .all()
    )
    rows = []
    for mentor in mentors:
        profile = mentor.mentor_profile
        rows.append(
            {
                "id": mentor.id,
                "name": mentor.name,
                "email": mentor.email,
                "expertise": profile.expertise if profile else None,
                "availability": profile.availability if profile else None,
            }
        )
    return jsonify({"mentors": rows})


@mentorship_bp.post("/mentorship/requests")
@roles_required("student")
def create_request():
    user = current_user()
    data = request.get_json(silent=True) or {}
    mentor = db.session.get(User, data.get("mentor_id") or 0)
    if mentor is None or mentor.role != "mentor" or mentor.status != "active":
        return api_error("Mentor not found.", 404, {"mentor_id": ["Choose a mentor."]})

    existing = MentorshipRequest.query.filter(
        MentorshipRequest.student_id == user.id,
        MentorshipRequest.mentor_id == mentor.id,
        MentorshipRequest.status.in_(["pending", "accepted"]),
    ).first()
    if existing:
        return api_error("You already have a request with this mentor.", 409)

    message = str(data.get("message") or "").strip()
    req = MentorshipRequest(
        student_id=user.id, mentor_id=mentor.id, message=message, status="pending"
    )
    db.session.add(req)
    notify(
        mentor.id,
        "New mentorship request",
        f"{user.name} asked for mentorship.",
    )
    db.session.commit()
    return jsonify({"request": req.to_dict()}), 201


@mentorship_bp.get("/mentorship/requests")
@roles_required("student", "mentor", "admin")
def list_requests():
    user = current_user()
    query = MentorshipRequest.query
    if user.role == "student":
        query = query.filter(MentorshipRequest.student_id == user.id)
    elif user.role == "mentor":
        query = query.filter(MentorshipRequest.mentor_id == user.id)
    reqs = query.order_by(MentorshipRequest.created_at.desc()).all()
    return jsonify({"requests": [r.to_dict() for r in reqs]})


@mentorship_bp.patch("/mentorship/requests/<int:request_id>")
@roles_required("mentor", "admin")
def decide_request(request_id):
    user = current_user()
    req = db.session.get(MentorshipRequest, request_id)
    if req is None:
        return api_error("Mentorship request not found.", 404)
    if user.role != "admin" and req.mentor_id != user.id:
        return api_error("This request is not yours to review.", 403)
    if req.status != "pending":
        return api_error("This request is already decided.", 409)

    status = (request.get_json(silent=True) or {}).get("status")
    if status not in ("accepted", "rejected"):
        return api_error("Status must be accepted or rejected.", 400)

    req.status = status
    req.decided_at = datetime.utcnow()
    notify(
        req.student_id,
        f"Mentorship request {status}",
        f"{req.mentor.name} {status} your mentorship request.",
    )
    db.session.commit()
    return jsonify({"request": req.to_dict()})


@mentorship_bp.post("/mentorship/sessions")
@roles_required("student", "mentor")
def create_session():
    user = current_user()
    data = request.get_json(silent=True) or {}
    req = db.session.get(MentorshipRequest, data.get("request_id") or 0)
    if req is None:
        return api_error("Mentorship request not found.", 404)
    if user.id not in (req.student_id, req.mentor_id):
        return api_error("You are not part of this mentorship.", 403)
    if req.status != "accepted":
        return api_error("Accept the mentorship request before scheduling.", 400)

    scheduled_at = parse_when(data.get("scheduled_at"))
    if scheduled_at is None:
        return api_error("Use a valid date and time.", 400, {
            "scheduled_at": ["Use a valid date and time."]
        })
    mode = data.get("mode", "online")
    if mode not in ("online", "in_person"):
        return api_error("Mode must be online or in_person.", 400)

    session = MentorshipSession(
        request_id=req.id,
        mentor_id=req.mentor_id,
        student_id=req.student_id,
        scheduled_at=scheduled_at,
        mode=mode,
        location=data.get("location"),
        link=data.get("link"),
        notes=data.get("notes"),
        status="scheduled",
    )
    db.session.add(session)
    other = req.student_id if user.id == req.mentor_id else req.mentor_id
    notify(
        other,
        "Session scheduled",
        f"{user.name} scheduled a session for {scheduled_at.strftime('%d %b %Y, %H:%M')}.",
    )
    db.session.commit()
    return jsonify({"session": session.to_dict()}), 201


@mentorship_bp.get("/mentorship/sessions")
@roles_required("student", "mentor", "admin")
def list_sessions():
    user = current_user()
    query = MentorshipSession.query
    if user.role == "student":
        query = query.filter(MentorshipSession.student_id == user.id)
    elif user.role == "mentor":
        query = query.filter(MentorshipSession.mentor_id == user.id)
    sessions = query.order_by(MentorshipSession.scheduled_at.desc()).all()
    return jsonify({"sessions": [s.to_dict() for s in sessions]})


@mentorship_bp.patch("/mentorship/sessions/<int:session_id>")
@roles_required("student", "mentor", "admin")
def update_session(session_id):
    user = current_user()
    session = db.session.get(MentorshipSession, session_id)
    if session is None:
        return api_error("Session not found.", 404)
    if user.role != "admin" and user.id not in (session.student_id, session.mentor_id):
        return api_error("You are not part of this session.", 403)

    data = request.get_json(silent=True) or {}
    if "status" in data:
        if data["status"] not in ("scheduled", "done", "cancelled"):
            return api_error("Status must be scheduled, done or cancelled.", 400)
        session.status = data["status"]
    if "notes" in data:
        session.notes = data["notes"]
    if "scheduled_at" in data:
        when = parse_when(data["scheduled_at"])
        if when is None:
            return api_error("Use a valid date and time.", 400)
        session.scheduled_at = when

    other = session.student_id if user.id == session.mentor_id else session.mentor_id
    notify(other, "Session updated", f"Session {session.id} is now {session.status}.")
    db.session.commit()
    return jsonify({"session": session.to_dict()})
