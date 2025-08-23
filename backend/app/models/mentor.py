from datetime import datetime
from mongoengine import Document, StringField, IntField, FloatField, BooleanField, DateTimeField, ReferenceField

class Mentor(Document):
    user = ReferenceField('User', required=True)
    company = StringField(max_length=200)
    position = StringField(max_length=200)
    expertise = StringField()  # JSON string of skills
    experience_years = IntField()
    bio = StringField()
    linkedin_url = StringField(max_length=200)
    github_url = StringField(max_length=200)
    is_available = BooleanField(default=True)
    max_students = IntField(default=5)
    current_students = IntField(default=0)
    rating = FloatField(default=0.0)
    total_reviews = IntField(default=0)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'mentors',
        'indexes': [
            'user',
            'is_available',
            'expertise',
            'rating'
        ]
    }
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'user_id': str(self.user.id),
            'user': self.user.to_dict() if self.user else None,
            'company': self.company,
            'position': self.position,
            'expertise': self.expertise,
            'experience_years': self.experience_years,
            'bio': self.bio,
            'linkedin_url': self.linkedin_url,
            'github_url': self.github_url,
            'is_available': self.is_available,
            'max_students': self.max_students,
            'current_students': self.current_students,
            'rating': self.rating,
            'total_reviews': self.total_reviews,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def can_accept_student(self):
        return self.is_available and self.current_students < self.max_students
    
    def __repr__(self):
        return f'<Mentor {self.user.first_name if self.user else "Unknown"}>'

class Mentorship(Document):
    mentor = ReferenceField('Mentor', required=True)
    student = ReferenceField('Student', required=True)
    status = StringField(default='pending', max_length=20)  # pending, active, completed, cancelled
    start_date = DateTimeField()
    end_date = DateTimeField()
    goals = StringField()
    notes = StringField()
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'mentorships',
        'indexes': [
            'mentor',
            'student',
            'status',
            'start_date'
        ]
    }
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'mentor_id': str(self.mentor.id),
            'student_id': str(self.student.id),
            'status': self.status,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'goals': self.goals,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
