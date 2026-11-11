# backend/routes/__init__.py
from routes.admin import admin_bp
from routes.applications import applications_bp
from routes.auth import auth_bp
from routes.donations import donations_bp
from routes.mentorship import mentorship_bp
from routes.notifications import notifications_bp
from routes.profile import profile_bp
from routes.programs import programs_bp
from routes.resources import resources_bp
from routes.uploads import uploads_bp

BLUEPRINTS = [
    auth_bp,
    profile_bp,
    programs_bp,
    applications_bp,
    mentorship_bp,
    resources_bp,
    uploads_bp,
    donations_bp,
    notifications_bp,
    admin_bp,
]
