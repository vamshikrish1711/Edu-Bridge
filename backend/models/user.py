# backend/models/user.py
from datetime import datetime

from extensions import db

ROLES = ("student", "ngo", "donor", "mentor", "admin")
USER_STATUSES = ("active", "pending", "suspended")


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(20), nullable=False, index=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(190), nullable=False, unique=True, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(30))
    status = db.Column(db.String(20), nullable=False, default="active", index=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    student_profile = db.relationship(
        "StudentProfile", back_populates="user", uselist=False,
        cascade="all, delete-orphan", passive_deletes=True,
    )
    ngo_profile = db.relationship(
        "NgoProfile", back_populates="user", uselist=False,
        cascade="all, delete-orphan", passive_deletes=True,
    )
    donor_profile = db.relationship(
        "DonorProfile", back_populates="user", uselist=False,
        cascade="all, delete-orphan", passive_deletes=True,
    )
    mentor_profile = db.relationship(
        "MentorProfile", back_populates="user", uselist=False,
        cascade="all, delete-orphan", passive_deletes=True,
    )

    __table_args__ = (
        db.CheckConstraint(
            "role IN ('student','ngo','donor','mentor','admin')", name="ck_user_role"
        ),
        db.CheckConstraint(
            "status IN ('active','pending','suspended')", name="ck_user_status"
        ),
    )

    @property
    def profile(self):
        return {
            "student": self.student_profile,
            "ngo": self.ngo_profile,
            "donor": self.donor_profile,
            "mentor": self.mentor_profile,
        }.get(self.role)

    def to_dict(self):
        return {
            "id": self.id,
            "role": self.role,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
