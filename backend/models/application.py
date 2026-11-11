# backend/models/application.py
from datetime import datetime

from extensions import db

APPLICATION_STATUSES = ("pending", "approved", "rejected")


class Application(db.Model):
    __tablename__ = "applications"

    id = db.Column(db.Integer, primary_key=True)
    program_id = db.Column(
        db.Integer, db.ForeignKey("programs.id", ondelete="CASCADE"),
        nullable=False, index=True,
    )
    student_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False, index=True,
    )
    status = db.Column(db.String(20), nullable=False, default="pending", index=True)
    message = db.Column(db.Text)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    decided_at = db.Column(db.DateTime)

    program = db.relationship("Program", back_populates="applications")
    student = db.relationship("User", backref=db.backref("applications", lazy=True))

    __table_args__ = (
        db.UniqueConstraint("program_id", "student_id", name="uq_application_once"),
        db.CheckConstraint(
            "status IN ('pending','approved','rejected')", name="ck_application_status"
        ),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "program_id": self.program_id,
            "program_title": self.program.title if self.program else None,
            "program_type": self.program.type if self.program else None,
            "student_id": self.student_id,
            "student_name": self.student.name if self.student else None,
            "status": self.status,
            "message": self.message,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "decided_at": self.decided_at.isoformat() if self.decided_at else None,
        }
