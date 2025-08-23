from datetime import datetime
from mongoengine import Document, StringField, BooleanField, DateTimeField, ReferenceField

class NGO(Document):
    name = StringField(required=True, max_length=200)
    description = StringField()
    website = StringField(max_length=200)
    phone = StringField(max_length=20)
    address = StringField()
    city = StringField(max_length=100)
    state = StringField(max_length=100)
    country = StringField(max_length=100)
    registration_number = StringField(max_length=100, unique=True)
    logo_url = StringField(max_length=500)
    is_verified = BooleanField(default=False)
    user = ReferenceField('User', required=True)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'ngos',
        'indexes': [
            'registration_number',
            'user',
            'is_verified'
        ]
    }
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'description': self.description,
            'website': self.website,
            'phone': self.phone,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'country': self.country,
            'registration_number': self.registration_number,
            'logo_url': self.logo_url,
            'is_verified': self.is_verified,
            'user_id': str(self.user.id),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<NGO {self.name}>'
