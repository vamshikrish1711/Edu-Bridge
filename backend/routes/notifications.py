# backend/routes/notifications.py
from flask import Blueprint, jsonify

from extensions import db
from models import Notification
from utils.security import api_error, current_user, roles_required

notifications_bp = Blueprint("notifications", __name__)


@notifications_bp.get("/notifications")
@roles_required("student", "ngo", "donor", "mentor", "admin")
def list_notifications():
    user = current_user()
    rows = (
        Notification.query.filter_by(user_id=user.id)
        .order_by(Notification.created_at.desc())
        .all()
    )
    unread = Notification.query.filter_by(user_id=user.id, is_read=False).count()
    return jsonify(
        {"notifications": [n.to_dict() for n in rows], "unread_count": unread}
    )


@notifications_bp.patch("/notifications/<int:notification_id>/read")
@roles_required("student", "ngo", "donor", "mentor", "admin")
def mark_read(notification_id):
    user = current_user()
    item = db.session.get(Notification, notification_id)
    if item is None or item.user_id != user.id:
        return api_error("Notification not found.", 404)
    item.is_read = True
    db.session.commit()
    return jsonify({"notification": item.to_dict()})


@notifications_bp.post("/notifications/read-all")
@roles_required("student", "ngo", "donor", "mentor", "admin")
def mark_all_read():
    user = current_user()
    Notification.query.filter_by(user_id=user.id, is_read=False).update(
        {"is_read": True}
    )
    db.session.commit()
    return jsonify({"message": "All notifications marked read."})
