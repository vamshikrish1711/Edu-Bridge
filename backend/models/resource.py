# backend/models/resource.py
from datetime import datetime

from extensions import db

RESOURCE_TYPES = ("pdf", "video", "link", "ebook")
SKILL_LEVELS = ("beginner", "intermediate", "advanced")


class Resource(db.Model):
    __tablename__ = "resources"

    id = db.Column(db.Integer, primary_key=True)
    uploader_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False, index=True,
    )
    title = db.Column(db.String(180), nullable=False)
    type = db.Column(db.String(20), nullable=False)
    topic = db.Column(db.String(120), nullable=False, index=True)
    skill_level = db.Column(db.String(20), nullable=False, index=True)
    description = db.Column(db.Text)
    file_path = db.Column(db.String(500))
    url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    uploader = db.relationship("User", backref=db.backref("resources", lazy=True))

    __table_args__ = (
        db.CheckConstraint(
            "type IN ('pdf','video','link','ebook')", name="ck_resource_type"
        ),
        db.CheckConstraint(
            "skill_level IN ('beginner','intermediate','advanced')",
            name="ck_resource_level",
        ),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "uploader_id": self.uploader_id,
            "uploader_name": self.uploader.name if self.uploader else None,
            "title": self.title,
            "type": self.type,
            "topic": self.topic,
            "skill_level": self.skill_level,
            "description": self.description,
            "file_path": self.file_path,
            "url": self.url,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
