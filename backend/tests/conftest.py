# backend/tests/conftest.py
import bcrypt
import pytest

from app import create_app
from extensions import db
from models import (
    DonorProfile,
    MentorProfile,
    NgoProfile,
    Program,
    StudentProfile,
    User,
)

PASSWORD = "Demo@12345"
JWT_SECRET = "test-jwt-secret-key-that-is-long-enough-32"


def hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def add_user(role, name, email, status="active", profile_cls=None, profile=None):
    user = User(
        role=role,
        name=name,
        email=email,
        phone="9876500000",
        status=status,
        password_hash=hash_password(PASSWORD),
    )
    db.session.add(user)
    db.session.flush()
    if profile_cls is not None:
        db.session.add(profile_cls(user_id=user.id, **(profile or {})))
    return user


def seed_fixtures():
    admin = add_user("admin", "Admin User", "admin@test.local")
    admin.password_hash = hash_password("Admin@12345")
    ngo = add_user(
        "ngo", "Test NGO", "ngo@test.local", profile_cls=NgoProfile,
        profile={"org_type": "Education", "mission": "Test mission"},
    )
    pending = add_user(
        "ngo", "Pending NGO", "pending@test.local", status="pending",
        profile_cls=NgoProfile, profile={"org_type": "Skills"},
    )
    mentor = add_user(
        "mentor", "Test Mentor", "mentor@test.local", profile_cls=MentorProfile,
        profile={"expertise": "Python", "availability": "Weekends"},
    )
    student = add_user(
        "student", "Test Student", "student@test.local", profile_cls=StudentProfile,
        profile={"education": "Class 12", "interests": "Python, design"},
    )
    donor = add_user(
        "donor", "Test Donor", "donor@test.local", profile_cls=DonorProfile,
        profile={"donation_type": "monetary"},
    )
    program = Program(
        ngo_id=ngo.id,
        title="Test Scholarship",
        type="scholarship",
        description="A test program for the suite.",
        target_amount=10000,
        status="active",
    )
    db.session.add(program)
    db.session.commit()
    return {
        "admin": admin.id,
        "ngo": ngo.id,
        "pending": pending.id,
        "mentor": mentor.id,
        "student": student.id,
        "donor": donor.id,
        "program": program.id,
    }


@pytest.fixture
def app():
    test_app = create_app(
        {
            "TESTING": True,
            "SQLALCHEMY_DATABASE_URI": "sqlite://",
            "JWT_SECRET_KEY": JWT_SECRET,
            "AUTO_CREATE_DB": False,
        }
    )
    with test_app.app_context():
        db.create_all()
        test_app.config["IDS"] = seed_fixtures()
        yield test_app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


def login(client, email, password=PASSWORD):
    response = client.post(
        "/api/auth/login", json={"email": email, "password": password}
    )
    assert response.status_code == 200, response.get_json()
    return {"Authorization": f"Bearer {response.get_json()['access_token']}"}
