from datetime import datetime
from mongoengine import Document, StringField, FloatField, DateTimeField, ReferenceField, IntField

class Campaign(Document):
    title = StringField(required=True, max_length=200)
    description = StringField(required=True)
    long_description = StringField()
    category = StringField(required=True, max_length=50)  # scholarship, infrastructure, mentorship, education
    goal_amount = FloatField(required=True)
    raised_amount = FloatField(default=0.0)
    image_url = StringField(max_length=500)
    location = StringField(max_length=100)
    ngo = ReferenceField('NGO', required=True)
    status = StringField(default='active', max_length=20)  # active, completed, cancelled
    start_date = DateTimeField(default=datetime.utcnow)
    end_date = DateTimeField()
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'campaigns',
        'indexes': [
            'category',
            'status',
            'ngo',
            'start_date'
        ]
    }
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'title': self.title,
            'description': self.description,
            'long_description': self.long_description,
            'category': self.category,
            'goal_amount': self.goal_amount,
            'raised_amount': self.raised_amount,
            'image_url': self.image_url,
            'location': self.location,
            'ngo_id': str(self.ngo.id),
            'ngo_name': self.ngo.name if self.ngo else None,
            'status': self.status,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'progress_percentage': self.get_progress_percentage(),
            'days_left': self.get_days_left()
        }
    
    def get_progress_percentage(self):
        if self.goal_amount == 0:
            return 0
        return min((self.raised_amount / self.goal_amount) * 100, 100)
    
    def get_days_left(self):
        if not self.end_date:
            return None
        delta = self.end_date - datetime.utcnow()
        return max(0, delta.days)
    
    def update_raised_amount(self, amount):
        self.raised_amount += amount
        self.save()
    
    def __repr__(self):
        return f'<Campaign {self.title}>'

class CampaignUpdate(Document):
    campaign = ReferenceField('Campaign', required=True)
    title = StringField(required=True, max_length=200)
    content = StringField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'campaign_updates',
        'indexes': [
            'campaign',
            'created_at'
        ]
    }
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'campaign_id': str(self.campaign.id),
            'title': self.title,
            'content': self.content,
            'created_at': self.created_at.isoformat()
        }
