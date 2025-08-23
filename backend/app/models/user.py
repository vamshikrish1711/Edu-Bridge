from datetime import datetime
from mongoengine import Document, StringField, BooleanField, DateTimeField, ReferenceField, ListField
from flask_jwt_extended import create_access_token, create_refresh_token
from app import bcrypt

class User(Document):
    email = StringField(required=True, unique=True, max_length=120)
    password_hash = StringField(required=True, max_length=128)
    first_name = StringField(required=True, max_length=50)
    last_name = StringField(required=True, max_length=50)
    phone = StringField(max_length=20)
    role = StringField(required=True, max_length=20)  # student, mentor, donor, ngo, admin
    is_active = BooleanField(default=True)
    is_verified = BooleanField(default=False)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'users',
        'indexes': [
            'email',
            'role',
            'is_active'
        ]
    }
    
    def __init__(self, email=None, password=None, first_name=None, last_name=None, role=None, phone=None, **kwargs):
        super().__init__(**kwargs)
        if email is not None:
            self.email = email
        if password is not None:
            self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        if first_name is not None:
            self.first_name = first_name
        if last_name is not None:
            self.last_name = last_name
        if role is not None:
            self.role = role
        if phone is not None:
            self.phone = phone

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def generate_tokens(self):
        access_token = create_access_token(identity=self)
        refresh_token = create_refresh_token(identity=self)
        return access_token, refresh_token

    def to_dict(self):
        return {
            'id': str(self.id),
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone': self.phone,
            'role': self.role,
            'is_active': self.is_active,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

    def __repr__(self):
        return f'<User {self.email}>'
