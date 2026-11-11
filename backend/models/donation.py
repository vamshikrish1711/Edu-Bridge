# backend/models/donation.py
from datetime import datetime

from extensions import db


class Donation(db.Model):
    __tablename__ = "donations"

    id = db.Column(db.Integer, primary_key=True)
    donor_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False, index=True,
    )
    program_id = db.Column(
        db.Integer, db.ForeignKey("programs.id", ondelete="RESTRICT"),
        nullable=True, index=True,
    )
    student_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=True, index=True,
    )
    amount = db.Column(db.Numeric(12, 2), nullable=False)
    donation_type = db.Column(db.String(20), nullable=False, default="monetary")
    payment_ref = db.Column(db.String(80))
    receipt_no = db.Column(db.String(40), unique=True)
    status = db.Column(db.String(20), nullable=False, default="success", index=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    donor = db.relationship("User", foreign_keys=[donor_id])
    student = db.relationship("User", foreign_keys=[student_id])
    program = db.relationship("Program", backref=db.backref("donations", lazy=True))

    __table_args__ = (
        db.CheckConstraint(
            "program_id IS NOT NULL OR student_id IS NOT NULL",
            name="ck_donation_target",
        ),
        db.CheckConstraint(
            "status IN ('success','failed')", name="ck_donation_status"
        ),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "donor_id": self.donor_id,
            "donor_name": self.donor.name if self.donor else None,
            "program_id": self.program_id,
            "program_title": self.program.title if self.program else None,
            "student_id": self.student_id,
            "student_name": self.student.name if self.student else None,
            "amount": float(self.amount or 0),
            "donation_type": self.donation_type,
            "payment_ref": self.payment_ref,
            "receipt_no": self.receipt_no,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
