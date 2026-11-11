# backend/utils/security.py
from functools import wraps

from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

from extensions import db
from models import User


def api_error(message, code=400, fields=None):
    payload = {"error": message}
    if fields:
        payload["fields"] = fields
    return jsonify(payload), code


def current_user():
    try:
        identity = get_jwt_identity()
    except Exception:
        return None
    if identity is None:
        return None
    try:
        return db.session.get(User, int(identity))
    except (TypeError, ValueError):
        return None


def roles_required(*roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            user = current_user()
            if user is None:
                return api_error("User not found.", 401)
            if user.status != "active":
                return api_error("This account is not active.", 403)
            if roles and user.role not in roles:
                return api_error("You do not have access to this action.", 403)
            return fn(*args, **kwargs)

        return wrapper

    return decorator


def owned_or_admin(user, owner_id):
    return user.role == "admin" or user.id == owner_id
