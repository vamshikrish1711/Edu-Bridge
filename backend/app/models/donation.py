from datetime import datetime
from mongoengine import Document, FloatField, StringField, BooleanField, DateTimeField, ReferenceField

class Donation(Document):
    amount = FloatField(required=True)
    donor = ReferenceField('User', required=True)
    campaign = ReferenceField('Campaign', required=True)
    payment_method = StringField(default='online', max_length=50)  # online, bank_transfer, etc.
    transaction_id = StringField(unique=True, max_length=100)
    status = StringField(default='pending', max_length=20)  # pending, completed, failed, refunded
    is_anonymous = BooleanField(default=False)
    message = StringField()
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'donations',
        'indexes': [
            'donor',
            'campaign',
            'status',
            'transaction_id',
            'created_at'
        ]
    }
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'amount': self.amount,
            'donor_id': str(self.donor.id),
            'donor_name': self.get_donor_name(),
            'campaign_id': str(self.campaign.id),
            'campaign_title': self.campaign.title if self.campaign else None,
            'payment_method': self.payment_method,
            'transaction_id': self.transaction_id,
            'status': self.status,
            'is_anonymous': self.is_anonymous,
            'message': self.message,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def get_donor_name(self):
        if self.is_anonymous:
            return 'Anonymous'
        return f"{self.donor.first_name} {self.donor.last_name}" if self.donor else 'Unknown'
    
    def __repr__(self):
        return f'<Donation {self.id}: {self.amount}>'
