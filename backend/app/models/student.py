from datetime import datetime
from mongoengine import Document, StringField, IntField, BooleanField, DateTimeField, ReferenceField

class Student(Document):
    user = ReferenceField('User', required=True)
    school = StringField(max_length=200)
    grade = StringField(max_length=20)
    age = IntField()
    interests = StringField()  # JSON string of interests
    goals = StringField()
    background = StringField()
    family_income = StringField(max_length=50)  # low, medium, high
    location = StringField(max_length=200)
    is_verified = BooleanField(default=False)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'students',
        'indexes': [
            'user',
            'is_verified',
            'family_income'
        ]
    }
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'user_id': str(self.user.id),
            'user': self.user.to_dict() if self.user else None,
            'school': self.school,
            'grade': self.grade,
            'age': self.age,
            'interests': self.interests,
            'goals': self.goals,
            'background': self.background,
            'family_income': self.family_income,
            'location': self.location,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Student {self.user.first_name if self.user else "Unknown"}>'

class ScholarshipApplication(Document):
    student = ReferenceField('Student', required=True)
    campaign = ReferenceField('Campaign', required=True)
    status = StringField(default='pending', max_length=20)  # pending, approved, rejected, under_review
    essay = StringField()
    academic_performance = StringField()
    financial_need = StringField()
    recommendation_letter = StringField(max_length=500)  # URL to uploaded file
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'scholarship_applications',
        'indexes': [
            'student',
            'campaign',
            'status',
            'created_at'
        ]
    }
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'student_id': str(self.student.id),
            'campaign_id': str(self.campaign.id),
            'status': self.status,
            'essay': self.essay,
            'academic_performance': self.academic_performance,
            'financial_need': self.financial_need,
            'recommendation_letter': self.recommendation_letter,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
