# backend/models/profiles.py
from extensions import db


class StudentProfile(db.Model):
    __tablename__ = "student_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False, unique=True, index=True,
    )
    education = db.Column(db.String(200))
    skills = db.Column(db.Text)
    interests = db.Column(db.Text)
    location = db.Column(db.String(120))
    date_of_birth = db.Column(db.Date)
    address = db.Column(db.Text)

    user = db.relationship("User", back_populates="student_profile")

    def to_dict(self):
        return {
            "education": self.education,
            "skills": self.skills,
            "interests": self.interests,
            "location": self.location,
            "date_of_birth": self.date_of_birth.isoformat() if self.date_of_birth else None,
            "address": self.address,
        }


class NgoProfile(db.Model):
    __tablename__ = "ngo_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False, unique=True, index=True,
    )
    org_type = db.Column(db.String(80))
    mission = db.Column(db.Text)
    contact_number = db.Column(db.String(30))
    address = db.Column(db.Text)
    description = db.Column(db.Text)

    user = db.relationship("User", back_populates="ngo_profile")

    def to_dict(self):
        return {
            "org_type": self.org_type,
            "mission": self.mission,
            "contact_number": self.contact_number,
            "address": self.address,
            "description": self.description,
        }


class DonorProfile(db.Model):
    __tablename__ = "donor_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False, unique=True, index=True,
    )
    donation_type = db.Column(db.String(20), default="monetary")

    user = db.relationship("User", back_populates="donor_profile")

    def to_dict(self):
        return {"donation_type": self.donation_type}


class MentorProfile(db.Model):
    __tablename__ = "mentor_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False, unique=True, index=True,
    )
    expertise = db.Column(db.String(255))
    availability = db.Column(db.String(255))

    user = db.relationship("User", back_populates="mentor_profile")

    def to_dict(self):
        return {"expertise": self.expertise, "availability": self.availability}
