# backend/utils/notify.py
from extensions import db
from models import Notification, User


def notify(user_id, title, message):
    db.session.add(
        Notification(user_id=user_id, title=title, message=message, is_read=False)
    )


def notify_admins(title, message):
    admins = User.query.filter_by(role="admin", status="active").all()
    for admin in admins:
        notify(admin.id, title, message)
