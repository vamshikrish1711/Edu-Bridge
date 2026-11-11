# backend/models/mentorship.py
from datetime import datetime

from extensions import db

REQUEST_STATUSES = ("pending", "accepted", "rejected")
SESSION_STATUSES = ("scheduled", "done", "cancelled")


class MentorshipRequest(db.Model):
    __tablename__ = "mentorship_requests"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False, index=True,
    )
    mentor_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False, index=True,
    )
    status = db.Column(db.String(20), nullable=False, default="pending", index=True)
    message = db.Column(db.Text)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    decided_at = db.Column(db.DateTime)

    student = db.relationship("User", foreign_keys=[student_id])
    mentor = db.relationship("User", foreign_keys=[mentor_id])
    sessions = db.relationship(
        "MentorshipSession", back_populates="request",
        cascade="all, delete-orphan", passive_deletes=True,
    )

    __table_args__ = (
        db.CheckConstraint(
            "status IN ('pending','accepted','rejected')",
            name="ck_mentorship_request_status",
        ),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "student_name": self.student.name if self.student else None,
            "mentor_id": self.mentor_id,
            "mentor_name": self.mentor.name if self.mentor else None,
            "status": self.status,
            "message": self.message,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "decided_at": self.decided_at.isoformat() if self.decided_at else None,
        }


class MentorshipSession(db.Model):
    __tablename__ = "mentorship_sessions"

    id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(
        db.Integer, db.ForeignKey("mentorship_requests.id", ondelete="CASCADE"),
        nullable=False, index=True,
    )
    mentor_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False, index=True,
    )
    student_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False, index=True,
    )
    scheduled_at = db.Column(db.DateTime, nullable=False)
    mode = db.Column(db.String(20), default="online")
    location = db.Column(db.String(255))
    link = db.Column(db.String(500))
    notes = db.Column(db.Text)
    status = db.Column(db.String(20), nullable=False, default="scheduled")
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    request = db.relationship("MentorshipRequest", back_populates="sessions")
    mentor = db.relationship("User", foreign_keys=[mentor_id])
    student = db.relationship("User", foreign_keys=[student_id])

    __table_args__ = (
        db.CheckConstraint(
            "status IN ('scheduled','done','cancelled')", name="ck_session_status"
        ),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "request_id": self.request_id,
            "mentor_id": self.mentor_id,
            "mentor_name": self.mentor.name if self.mentor else None,
            "student_id": self.student_id,
            "student_name": self.student.name if self.student else None,
            "scheduled_at": self.scheduled_at.isoformat() if self.scheduled_at else None,
            "mode": self.mode,
            "location": self.location,
            "link": self.link,
            "notes": self.notes,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
