# backend/models/program.py
from datetime import datetime

from extensions import db

PROGRAM_TYPES = ("donation", "volunteering", "mentorship", "scholarship")
PROGRAM_STATUSES = ("upcoming", "active", "completed")


class Program(db.Model):
    __tablename__ = "programs"

    id = db.Column(db.Integer, primary_key=True)
    ngo_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False, index=True,
    )
    title = db.Column(db.String(180), nullable=False)
    type = db.Column(db.String(20), nullable=False)
    description = db.Column(db.Text, nullable=False)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    target_amount = db.Column(db.Numeric(12, 2), default=0)
    volunteer_slots = db.Column(db.Integer, default=0)
    status = db.Column(db.String(20), nullable=False, default="upcoming", index=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    ngo = db.relationship("User", backref=db.backref("programs", lazy=True))
    applications = db.relationship(
        "Application", back_populates="program",
        cascade="all, delete-orphan", passive_deletes=True,
    )

    __table_args__ = (
        db.CheckConstraint(
            "type IN ('donation','volunteering','mentorship','scholarship')",
            name="ck_program_type",
        ),
        db.CheckConstraint(
            "status IN ('upcoming','active','completed')", name="ck_program_status"
        ),
    )

    @property
    def raised_amount(self):
        from models.donation import Donation

        total = (
            db.session.query(db.func.coalesce(db.func.sum(Donation.amount), 0))
            .filter(Donation.program_id == self.id, Donation.status == "success")
            .scalar()
        )
        return float(total or 0)

    def to_dict(self):
        return {
            "id": self.id,
            "ngo_id": self.ngo_id,
            "ngo_name": self.ngo.name if self.ngo else None,
            "title": self.title,
            "type": self.type,
            "description": self.description,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "target_amount": float(self.target_amount or 0),
            "raised_amount": self.raised_amount,
            "volunteer_slots": self.volunteer_slots or 0,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
